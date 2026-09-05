import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import bcrypt from "bcryptjs";
import { initialSeedData } from "./src/data/seedData.ts";
import { AppData } from "./src/types.ts";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const IS_PROD = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET || "salam_portfolio_secure_jwt_secret_2026_x9k2m";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "salam@portfolios.com").trim().toLowerCase();

let ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync(process.env.ADMIN_DEFAULT_PASSWORD || "Adm!n123@", 10);

// ---------------- 1. SECURITY HEADERS & CORS ----------------
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (IS_PROD) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  // CORS configuration
  const origin = req.headers.origin;
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000").split(",");
  
  if (origin && (allowedOrigins.includes(origin) || !IS_PROD)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// JSON Body Parser with strict 5MB limit
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(process.cwd(), "public"), { maxAge: IS_PROD ? "1d" : 0 }));

// ---------------- 2. RATE LIMITING MIDDLEWARES ----------------
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const loginRateLimits = new Map<string, RateLimitEntry>();
const messageRateLimits = new Map<string, RateLimitEntry>();

function checkRateLimit(map: Map<string, RateLimitEntry>, key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const record = map.get(key);

  if (!record || now > record.resetTime) {
    map.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count += 1;
  return true;
}

// ---------------- 3. TOKEN AUTHENTICATION & VERIFICATION ----------------
function generateToken(userId: string, email: string): string {
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8 hours session
  const payload = Buffer.from(JSON.stringify({ userId, email, expiresAt })).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadBase, signature] = parts;
    const expectedSignature = crypto.createHmac("sha256", JWT_SECRET).update(payloadBase).digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadBase, "base64url").toString("utf-8"));
    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

// Server-side Middleware protecting admin operations
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : (req.headers["x-access-token"] as string);

  if (!token) {
    return res.status(401).json({ error: "Session expirée ou non autorisée." });
  }

  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ error: "Session invalide. Veuillez vous reconnecter." });
  }

  (req as any).user = verified;
  next();
}

// ---------------- 4. DATA STORE & POSTGRESQL LAYER ----------------
let currentData: AppData = JSON.parse(JSON.stringify(initialSeedData));
const DATA_FILE = path.join(process.cwd(), "portfolio-cms-data.json");

// Load local persistence fallback
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    currentData = JSON.parse(raw);
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2), "utf-8");
  }
} catch {
  // Silent fallback
}

// Optional PostgreSQL Integration if DATABASE_URL is configured
let pgPool: any = null;
if (process.env.DATABASE_URL) {
  try {
    const { Pool } = require("pg");
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: IS_PROD ? { rejectUnauthorized: false } : undefined
    });
    
    // Auto-migrate tables with parameterized queries
    (async () => {
      try {
        await pgPool.query(`
          CREATE TABLE IF NOT EXISTS app_store (
            key VARCHAR(64) PRIMARY KEY,
            data JSONB NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        const res = await pgPool.query(`SELECT data FROM app_store WHERE key = $1`, ["main_portfolio"]);
        if (res.rows.length > 0) {
          currentData = res.rows[0].data;
        } else {
          await pgPool.query(`INSERT INTO app_store (key, data) VALUES ($1, $2)`, ["main_portfolio", currentData]);
        }
      } catch {
        // Silent recovery
      }
    })();
  } catch {
    // Disk fallback active
  }
}

async function persistData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2), "utf-8");
    if (pgPool) {
      await pgPool.query(
        `INSERT INTO app_store (key, data, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = NOW()`,
        ["main_portfolio", currentData]
      );
    }
  } catch {
    // Silent recovery
  }
}

function addActivityLog(user: string, action: string, entityType: string, details: string) {
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user,
    action,
    entityType,
    details,
    timestamp: new Date().toISOString()
  };
  currentData.activityLogs = [newLog, ...(currentData.activityLogs || [])].slice(0, 100);
}

// ---------------- 5. REST API ROUTES ----------------

// GET Full App Data (Public Read)
app.get("/api/data", (req: Request, res: Response) => {
  res.json(currentData);
});

// Strict Admin Auth Login (Protected with Rate Limiting & Bcrypt)
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || "unknown_ip";
  
  // Rate limit: 5 attempts per 15 minutes
  const allowed = checkRateLimit(loginRateLimits, clientIp, 5, 15 * 60 * 1000);
  if (!allowed) {
    return res.status(429).json({ 
      error: "Trop de tentatives de connexion infructueuses. Veuillez patienter 15 minutes." 
    });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({ error: "Identifiants invalides." });
  }

  const cleanUser = String(username).trim().toLowerCase();
  const cleanPass = String(password).trim();

  // Strict email validation
  const isUsernameMatch = cleanUser === ADMIN_EMAIL;
  
  // Strict bcrypt verification
  const isPasswordMatch = isUsernameMatch && (await bcrypt.compare(cleanPass, ADMIN_PASSWORD_HASH));

  if (isUsernameMatch && isPasswordMatch) {
    const userPayload = {
      id: "usr-salam",
      username: "salam@portfolios.com",
      name: "Moussa Abdou Salam",
      email: "salam@portfolios.com",
      role: "Super Admin" as const,
      avatarUrl: "/assets/maphotops600.jpg"
    };

    const token = generateToken(userPayload.id, userPayload.email);
    addActivityLog(userPayload.name, "LOGIN", "Security", "Administrator authenticated successfully");

    return res.json({
      success: true,
      token,
      user: userPayload
    });
  }

  // Single generic error message
  return res.status(401).json({ error: "Identifiants invalides." });
});

// POST Update Full App Data (Admin Protected)
app.post("/api/data", requireAdminAuth, async (req: Request, res: Response) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== "object") {
    return res.status(400).json({ error: "Payload de données invalide." });
  }
  currentData = { ...currentData, ...incoming };
  addActivityLog("Salam", "UPDATE", "Database", "Application content updated");
  await persistData();
  res.json({ success: true, data: currentData });
});

// Update Specific Module (Admin Protected)
app.put("/api/module/:moduleKey", requireAdminAuth, async (req: Request, res: Response) => {
  const { moduleKey } = req.params;
  const payload = req.body;

  if (!(moduleKey in currentData)) {
    return res.status(400).json({ error: `Module inconnu: ${moduleKey}` });
  }

  (currentData as unknown as Record<string, unknown>)[moduleKey] = payload;
  addActivityLog("Salam", "UPDATE", moduleKey, `Updated ${moduleKey} configuration`);
  await persistData();
  res.json({ success: true, [moduleKey]: payload });
});

// Reset to Seed Data (Admin Protected)
app.post("/api/data/reset-seed", requireAdminAuth, async (req: Request, res: Response) => {
  currentData = JSON.parse(JSON.stringify(initialSeedData));
  addActivityLog("Salam", "RESET", "Database", "Reset database to Moussa Abdou Salam seed");
  await persistData();
  res.json({ success: true, message: "Base de données réinitialisée", data: currentData });
});

// Clear All Data (Admin Protected)
app.post("/api/data/clear", requireAdminAuth, async (req: Request, res: Response) => {
  currentData = {
    ...currentData,
    projects: [],
    technologies: [],
    experiences: [],
    education: [],
    certifications: [],
    services: [],
    blogPosts: [],
    contactMessages: [],
    mediaItems: [],
    activityLogs: []
  };
  addActivityLog("Salam", "CLEAR", "Database", "Cleared all projects and records");
  await persistData();
  res.json({ success: true, message: "Database cleared", data: currentData });
});

// Submit Contact Message (Public with Honeypot & Rate Limiting)
app.post("/api/messages", async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || "unknown_ip";

  // Rate limit: 5 messages per 10 minutes
  const allowed = checkRateLimit(messageRateLimits, clientIp, 5, 10 * 60 * 1000);
  if (!allowed) {
    return res.status(429).json({ error: "Trop de messages envoyés. Veuillez patienter." });
  }

  const { name, email, subject, message, honeypot } = req.body;

  // Anti-spam honeypot
  if (honeypot) {
    return res.json({ success: true });
  }

  // Strict Input Sanitization & Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
    return res.status(400).json({ error: "Nom invalide." });
  }

  if (!email || typeof email !== "string" || !emailRegex.test(email.trim()) || email.length > 150) {
    return res.status(400).json({ error: "Email invalide." });
  }

  if (!message || typeof message !== "string" || message.trim().length < 5 || message.length > 5000) {
    return res.status(400).json({ error: "Message invalide." });
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    name: name.trim().slice(0, 100),
    email: email.trim().slice(0, 150),
    subject: String(subject || "Opportunité / Collaboration").trim().slice(0, 200),
    message: message.trim().slice(0, 5000),
    createdAt: new Date().toISOString(),
    isRead: false,
    isArchived: false
  };

  currentData.contactMessages = [newMessage, ...(currentData.contactMessages || [])];
  addActivityLog("visitor", "CREATE", "Message", `New inquiry received from ${name}`);
  await persistData();

  res.json({ success: true, messageId: newMessage.id });
});

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ 
    status: "ok", 
    owner: "Moussa Abdou Salam",
    database: pgPool ? "postgresql" : "persistent_disk",
    timestamp: new Date().toISOString() 
  });
});

// Global Error Handler (No stack traces leaked)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!IS_PROD) {
    console.error("Internal Server Error:", err);
  }
  res.status(500).json({ error: "Une erreur interne est survenue." });
});

// ---------------- 6. VITE MIDDLEWARE & SERVER START ----------------
async function startServer() {
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    if (!IS_PROD) {
      console.log(`Moussa Abdou Salam Portfolio & CMS running at http://localhost:${PORT}`);
    }
  });
}

startServer();
