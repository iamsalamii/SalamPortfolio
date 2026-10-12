import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { initialSeedData } from "./src/data/seedData.ts";
import { AppData } from "./src/types.ts";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.disable("x-powered-by");

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const NODE_ENV = (process.env.NODE_ENV || "production").toLowerCase().trim();
const IS_PROD = NODE_ENV !== "development" && NODE_ENV !== "test";
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

  // Block direct HTTP access to source code and sensitive secret files (.env, *.sql, *.log, *.git)
  const cleanPath = req.path.toLowerCase();
  
  if (!cleanPath.startsWith("/api/")) {
    const isSensitiveExt = cleanPath.includes(".env") || cleanPath.endsWith(".sql") || cleanPath.endsWith(".log") || cleanPath.includes(".git") || cleanPath.endsWith(".lock");
    
    // In production, block .ts/.tsx. In dev, allow them for Vite. Block .json except manifest.json (if any)
    const isSourceExt = IS_PROD && (cleanPath.endsWith(".ts") || cleanPath.endsWith(".tsx"));
    const isBlockedJson = cleanPath.endsWith(".json") && !cleanPath.endsWith("manifest.json");

    if (isSensitiveExt || isSourceExt || isBlockedJson || cleanPath.endsWith(".md")) {
      return res.status(403).json({ error: "Accès interdit aux ressources protégées." });
    }
  }

  next();
});

// JSON Body Parser with strict 5MB limit
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(process.cwd(), "public"), { maxAge: IS_PROD ? "1d" : 0 }));

// ---------------- 2. RATE LIMITING & OTP SESSION STORE ----------------
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitInfo {
  allowed: boolean;
  attemptsUsed: number;
  attemptsLeft: number;
  retryAfterSeconds: number;
}

interface OtpSession {
  userId: string;
  email?: string;
  adminEmail?: string;
  personalEmailExpected?: string;
  otpSentTo?: string;
  name: string;
  otpCode?: string;
  expiresAt: number;
  attempts: number;
}

const loginRateLimits = new Map<string, RateLimitEntry>();
const messageRateLimits = new Map<string, RateLimitEntry>();
const otpSessions = new Map<string, OtpSession>();

function evaluateRateLimit(map: Map<string, RateLimitEntry>, key: string, maxAttempts: number, windowMs: number): RateLimitInfo {
  const now = Date.now();
  const record = map.get(key);

  if (!record || now > record.resetTime) {
    map.set(key, { count: 1, resetTime: now + windowMs });
    return {
      allowed: true,
      attemptsUsed: 1,
      attemptsLeft: maxAttempts - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000)
    };
  }

  if (record.count >= maxAttempts) {
    return {
      allowed: false,
      attemptsUsed: record.count,
      attemptsLeft: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((record.resetTime - now) / 1000))
    };
  }

  record.count += 1;
  return {
    allowed: true,
    attemptsUsed: record.count,
    attemptsLeft: Math.max(0, maxAttempts - record.count),
    retryAfterSeconds: Math.max(1, Math.ceil((record.resetTime - now) / 1000))
  };
}

function checkRateLimit(map: Map<string, RateLimitEntry>, key: string, maxAttempts: number, windowMs: number): boolean {
  const result = evaluateRateLimit(map, key, maxAttempts, windowMs);
  return result.allowed;
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

// Health Check Endpoint (Docker & Coolify Healthcheck)
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// GET Full App Data (Public Read)
app.get("/api/data", (req: Request, res: Response) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.json(currentData);
});

// ---------------- 3. AUTHENTICATION & SESSIONS ----------------

// Strict Admin Auth Login (Protected with Rate Limiting, Bcrypt & 2FA OTP Challenge)
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || "unknown_ip";
  
  // Rate limit: 5 attempts per 15 minutes
  const rateInfo = evaluateRateLimit(loginRateLimits, clientIp, 5, 15 * 60 * 1000);
  if (!rateInfo.allowed) {
    return res.status(429).json({ 
      error: "Trop de tentatives de connexion infructueuses. Système temporairement verrouillé.",
      isRateLimited: true,
      retryAfterSeconds: rateInfo.retryAfterSeconds,
      attemptsLeft: 0
    });
  }

  const username = req.body.username || req.body.email;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(401).json({ 
      error: "Identifiants requis.",
      attemptsLeft: rateInfo.attemptsLeft 
    });
  }

  const cleanUser = String(username).trim();
  const cleanPass = String(password).trim();

  // Strict single email verification (no aliases)
  const isUsernameMatch = cleanUser.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  
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

    // Dedicated 2FA security email (isolated from public contact email, defaults to moussasalam86@gmail.com)
    const configuredSecurityEmail = (process.env.SECURITY_OTP_EMAIL || currentData.securitySettings?.otpEmail || "moussasalam86@gmail.com").trim().toLowerCase();

    const tempToken = crypto.randomBytes(24).toString("hex");

    otpSessions.set(tempToken, {
      userId: userPayload.id,
      adminEmail: userPayload.email,
      personalEmailExpected: configuredSecurityEmail,
      name: userPayload.name,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes session
      attempts: 4
    });

    addActivityLog(userPayload.name, "OTP_CHALLENGE", "Security", `OTP challenge initiated for admin session`);

    return res.json({
      success: true,
      requireOtp: true,
      tempToken,
      message: "Authentification principale validée. Renseignez votre adresse email personnelle de sécurité pour recevoir le code OTP."
    });
  }

  // Failed authentication: return remaining attempts count
  return res.status(401).json({ 
    error: `Identifiants invalides. ${rateInfo.attemptsLeft} tentative(s) restante(s) avant verrouillage.`,
    attemptsLeft: rateInfo.attemptsLeft
  });
});

// Helpers for Cryptographic 2FA Security
function generateSecureOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

function constantTimeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function createTransporterConfig(port: number, secure: boolean) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  const cleanPass = pass.replace(/\s+/g, "").replace(/['"]/g, "");
  const cleanUser = user.trim().replace(/['"]/g, "");
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim().replace(/['"]/g, "");

  return nodemailer.createTransport({
    host,
    port,
    secure,
    family: 4, // Force IPv4 pour contourner les latences de routage IPv6 sous Docker Alpine
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
    auth: { user: cleanUser, pass: cleanPass }
  } as any);
}

function getSmtpTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;

  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  return createTransporterConfig(port, secure);
}

async function sendOtpEmail(cleanEmail: string, otpCode: string): Promise<boolean> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return false;

  const senderEmail = (process.env.SMTP_FROM || user || ADMIN_EMAIL).trim().replace(/['"]/g, "");

  const mailOptions = {
    from: `"SALAM.DEV Security Console" <${senderEmail}>`,
    to: cleanEmail,
    subject: `[SALAM.DEV] Votre Code de Sécurité 2FA : ${otpCode}`,
    text: `Bonjour Moussa Abdou Salam,\n\nVotre code d'authentification 2FA à usage unique est : ${otpCode}\n\nCe code est valable pendant 5 minutes.\n\n— Console de Sécurité SALAM.DEV`,
    html: `<div style="font-family: monospace; background:#060709; color:#f4f4f5; padding:24px; border-radius:12px; border:2px solid #ef4444; max-width:500px;">
      <h2 style="color:#ef4444; margin-top:0;">// CODE DE SÉCURITÉ 2FA OTP //</h2>
      <p style="font-size:14px; color:#a1a1aa;">Bonjour <strong>Moussa Abdou Salam</strong>,</p>
      <p style="font-size:14px; color:#a1a1aa;">Voici votre code de vérification pour accéder à la Console d'Administration :</p>
      <div style="background:#18181b; border:1px solid #ef4444; padding:16px; text-align:center; font-size:28px; font-weight:bold; letter-spacing:8px; color:#ef4444; margin:18px 0;">
        ${otpCode}
      </div>
      <p style="font-size:12px; color:#71717a;">Ce code expire dans 5 minutes. Ne le partagez avec personne.</p>
    </div>`
  };

  const primaryPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465;
  const primarySecure = process.env.SMTP_SECURE === "true" || primaryPort === 465;

  // Tentative 1 : Port principal (par défaut 465 SSL direct ou selon SMTP_PORT)
  try {
    const transporter = createTransporterConfig(primaryPort, primarySecure);
    if (!transporter) return false;

    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Délai SMTP dépassé sur port ${primaryPort} (8s)`)), 8000)
    );

    await Promise.race([emailPromise, timeoutPromise]);
    console.log(`[2FA SMTP SUCCESS] Email délivré avec succès via le port ${primaryPort}.`);
    return true;
  } catch (err: any) {
    console.warn(`[2FA SMTP WARNING] Échec sur le port ${primaryPort} (${err?.message || err?.code}). Tentative sur le port alternatif...`);
  }

  // Tentative 2 : Port alternatif de secours (bascule automatique 465 <-> 587)
  try {
    const altPort = primaryPort === 465 ? 587 : 465;
    const altSecure = altPort === 465;
    const altTransporter = createTransporterConfig(altPort, altSecure);
    if (!altTransporter) return false;

    const emailPromise = altTransporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Délai SMTP alternatif dépassé sur port ${altPort} (8s)`)), 8000)
    );

    await Promise.race([emailPromise, timeoutPromise]);
    console.log(`[2FA SMTP SUCCESS] Email délivré avec succès via le port alternatif ${altPort}.`);
    return true;
  } catch (altErr: any) {
    console.error("[2FA SMTP ERROR] Échec de transmission SMTP sur tous les ports testés:", altErr?.message || altErr?.code);
    return false;
  }
}

// Request / Send OTP code to verified personal email (Strict: Fail-Closed, Zero-Leak)
app.post("/api/auth/request-otp", async (req: Request, res: Response) => {
  const { tempToken, destinationEmail } = req.body;
  if (!tempToken || !destinationEmail) {
    return res.status(400).json({ error: "Jeton de session et email personnel de destination requis." });
  }

  const session = otpSessions.get(tempToken);
  if (!session) {
    return res.status(401).json({ error: "Session expirée ou invalide. Veuillez recommencer la connexion." });
  }

  if (Date.now() > session.expiresAt) {
    otpSessions.delete(tempToken);
    return res.status(401).json({ error: "Session expirée. Veuillez recommencer la connexion." });
  }

  const cleanEmail = String(destinationEmail).trim().toLowerCase();
  const expectedSecurityEmail = (session.personalEmailExpected || process.env.SECURITY_OTP_EMAIL || currentData.securitySettings?.otpEmail || "moussasalam86@gmail.com").trim().toLowerCase();
  
  // Validation stricte : l'utilisateur ne peut pas choisir un destinataire arbitraire
  if (cleanEmail !== expectedSecurityEmail) {
    return res.status(403).json({
      error: "Cette adresse email personnelle ne correspond pas à celle configurée pour la sécurité 2FA."
    });
  }

  // Échec fermé (Fail-Closed) : si SMTP n'est pas configuré, refus immédiat sans générer de code
  const transporter = getSmtpTransporter();
  if (!transporter) {
    session.otpCode = undefined;
    console.warn("[2FA SECURITY REJECT] Demande OTP refusée : service SMTP non configuré sur ce serveur.");
    return res.status(503).json({
      error: "Le service d'authentification 2FA par email n'est pas opérationnel sur ce serveur. Contactez l'administrateur système pour paramétrer le service SMTP."
    });
  }

  // Génération cryptographique du code OTP (6 chiffres aléatoires non prévisibles)
  const otpCode = generateSecureOtp();

  // Tentative d'expédition par email via SMTP
  const emailSent = await sendOtpEmail(cleanEmail, otpCode);
  if (!emailSent) {
    // Si l'envoi échoue : invalidation immédiate du code, aucun code utilisable
    session.otpCode = undefined;
    session.expiresAt = 0;
    return res.status(502).json({
      error: "Impossible d'acheminer le code de vérification par email. Veuillez vérifier la connectivité SMTP ou réessayer plus tard."
    });
  }

  // Armement de la session OTP uniquement après succès effectif de l'envoi SMTP
  session.otpCode = otpCode;
  session.otpSentTo = cleanEmail;
  session.expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes de validité
  session.attempts = 4;

  // Journalisation sécurisée : JAMAIS de code OTP dans les logs
  console.log(`[2FA OTP SECURITY DISPATCH] Code expédié avec succès via SMTP à l'adresse de sécurité (${cleanEmail.substring(0, 3)}***@***)`);
  addActivityLog(session.name, "OTP_DISPATCHED", "Security", "OTP code dispatched to personal address (SMTP: OK)");

  // Réponse HTTP : Zéro fuite de code, pas de devOtpCode, pas d'otpPreview
  return res.json({
    success: true,
    message: `Code de sécurité expédié avec succès à votre adresse personnelle (${cleanEmail.substring(0, 3)}***@***). Consultez votre boîte de réception Gmail.`
  });
});

// Verify 2FA OTP Code (Strict: Single-Use, Timing-Safe, Attempts Limit)
app.post("/api/auth/verify-otp", async (req: Request, res: Response) => {
  const { tempToken, otpCode } = req.body;
  if (!tempToken || !otpCode) {
    return res.status(400).json({ error: "Code OTP et jeton de session requis." });
  }

  const session = otpSessions.get(tempToken);
  if (!session) {
    return res.status(401).json({ error: "Session OTP expirée ou invalide. Veuillez vous reconnecter." });
  }

  if (Date.now() > session.expiresAt) {
    otpSessions.delete(tempToken);
    return res.status(401).json({ error: "Le code OTP a expiré. Veuillez demander un nouveau code." });
  }

  if (!session.otpCode) {
    return res.status(400).json({ error: "Aucun code actif pour cette session. Veuillez demander un code." });
  }

  // Comparaison en temps constant (Timing-Safe)
  const isMatch = constantTimeCompare(session.otpCode, String(otpCode).trim());

  if (!isMatch) {
    session.attempts -= 1;
    if (session.attempts <= 0) {
      otpSessions.delete(tempToken);
      return res.status(401).json({ error: "Trop de codes erronés. Session OTP révoquée.", attemptsLeft: 0 });
    }
    return res.status(401).json({ 
      error: `Code OTP incorrect. ${session.attempts} tentative(s) restante(s).`,
      attemptsLeft: session.attempts
    });
  }

  // Code valide : invalidation immédiate à usage unique (Single-Use)
  otpSessions.delete(tempToken);
  const clientIp = req.ip || req.socket.remoteAddress || "unknown_ip";
  loginRateLimits.delete(clientIp);

  const userPayload = {
    id: session.userId,
    username: session.adminEmail,
    name: session.name,
    email: session.adminEmail,
    role: "Super Admin" as const,
    avatarUrl: "/assets/maphotops600.jpg"
  };

  const token = generateToken(userPayload.id, userPayload.email);
  addActivityLog(userPayload.name, "LOGIN_SUCCESS", "Security", "Administrator authenticated with 2FA OTP");

  return res.json({
    success: true,
    user: userPayload,
    token
  });
});

// Resend OTP Code (Strict: Fail-Closed, Zero-Leak)
app.post("/api/auth/resend-otp", async (req: Request, res: Response) => {
  const { tempToken } = req.body;
  const session = otpSessions.get(tempToken);
  if (!session) {
    return res.status(400).json({ error: "Session introuvable. Veuillez vous reconnecter." });
  }

  if (Date.now() > session.expiresAt + 5 * 60 * 1000) {
    otpSessions.delete(tempToken);
    return res.status(401).json({ error: "Session expirée. Veuillez vous reconnecter." });
  }

  const cleanEmail = session.otpSentTo || session.personalEmailExpected || "moussasalam86@gmail.com";
  const transporter = getSmtpTransporter();
  if (!transporter) {
    session.otpCode = undefined;
    return res.status(503).json({
      error: "Le service d'authentification 2FA par email n'est pas opérationnel sur ce serveur."
    });
  }

  const newOtp = generateSecureOtp();
  const emailSent = await sendOtpEmail(cleanEmail, newOtp);
  if (!emailSent) {
    session.otpCode = undefined;
    return res.status(502).json({
      error: "Impossible d'acheminer le nouveau code par email."
    });
  }

  session.otpCode = newOtp;
  session.expiresAt = Date.now() + 5 * 60 * 1000;
  session.attempts = 4;

  console.log(`[2FA OTP RESEND] Nouveau code expédié via SMTP à l'email de sécurité (${cleanEmail.substring(0, 3)}***@***)`);

  return res.json({
    success: true,
    expiresInSeconds: 300,
    message: "Nouveau code de sécurité expédié avec succès à votre adresse personnelle."
  });
});

// Admin Security Helper: Reset rate limit lock (Protected by Super Admin Auth)
app.post("/api/auth/reset-rate-limit", requireAdminAuth, (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || "unknown_ip";
  loginRateLimits.delete(clientIp);
  res.json({ success: true, message: "Verrouillage de sécurité réinitialisé avec succès." });
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

// ---------------- 6. PROJECT LIVE SCREENSHOT CAPTURE (Admin Protected) ----------------
function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  if (ip === "localhost" || ip === "127.0.0.1" || ip === "::1" || ip === "0.0.0.0") return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  if (ip.startsWith("169.254.")) return true;
  if (ip.startsWith("172.")) {
    const parts = ip.split(".");
    if (parts.length >= 2) {
      const second = parseInt(parts[1], 10);
      if (second >= 16 && second <= 31) return true;
    }
  }
  return false;
}

app.post("/api/admin/capture-preview", requireAdminAuth, async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL publique du site requise." });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url.trim());
  } catch {
    return res.status(400).json({ error: "Format d'URL invalide. Exemple: https://mon-site.com" });
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return res.status(400).json({ error: "Seuls les protocoles HTTP et HTTPS sont autorisés." });
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "0.0.0.0" ||
    isPrivateIp(hostname) ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    return res.status(403).json({ error: "Capture interdite sur les adresses locales ou privées (Protection SSRF)." });
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "projects");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const cleanTarget = parsedUrl.toString();
    let imageBuffer: Buffer | null = null;
    let fileExt = "png";

    // Tier 1: Microlink API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(cleanTarget)}&screenshot=true&embed=screenshot.url`;
      const mlRes = await fetch(microlinkUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (mlRes.ok) {
        const contentType = mlRes.headers.get("content-type") || "";
        if (contentType.includes("image/")) {
          const arrayBuf = await mlRes.arrayBuffer();
          if (arrayBuf.byteLength > 2000) {
            imageBuffer = Buffer.from(arrayBuf);
            fileExt = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : "png";
          }
        }
      }
    } catch {
      // Fallback
    }

    // Tier 2: WordPress mShots API
    if (!imageBuffer) {
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 12000);

        const mshotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanTarget)}?w=1280&h=800`;
        const msRes = await fetch(mshotsUrl, { signal: controller2.signal });
        clearTimeout(timeoutId2);

        if (msRes.ok) {
          const contentType = msRes.headers.get("content-type") || "";
          if (contentType.includes("image/")) {
            const arrayBuf = await msRes.arrayBuffer();
            if (arrayBuf.byteLength > 2000) {
              imageBuffer = Buffer.from(arrayBuf);
              fileExt = "jpg";
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    if (!imageBuffer || imageBuffer.byteLength < 1000) {
      return res.status(422).json({
        error: "Impossible de capturer le site web (site inaccessible ou délai dépassé). Vous pouvez importer une image manuellement."
      });
    }

    const fileName = `preview-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, imageBuffer);

    const publicUrl = `/uploads/projects/${fileName}`;
    addActivityLog("Salam", "CAPTURE", "Projects", `Captured live preview for ${hostname}`);

    return res.json({
      success: true,
      imageUrl: publicUrl,
      message: "Capture d'écran du site générée et enregistrée avec succès."
    });
  } catch (err: any) {
    console.error("Capture preview error:", err);
    return res.status(500).json({
      error: "Erreur lors de la capture de l'image. Vous pouvez importer une image manuellement."
    });
  }
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
      server: { 
        middlewareMode: true,
        watch: {
          ignored: ["**/portfolio-cms-data.json", "**/*.json", "**/dist/**"]
        }
      },
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
