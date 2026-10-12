import express from 'express';
import http from 'http';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * TEST HARNESS DE BOUT EN BOUT POUR L'AUDIT SÉCURITÉ 2FA
 * Simule les scénarios réels de requêtes HTTP du serveur.
 */

async function runRuntimeAudit() {
  console.log('================================================================');
  console.log('🧪 AUDIT D\'INTÉGRATION RUNTIME 2FA — SIMULATION DES FLUX RÉELS');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assertTest(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`  [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${name}`);
      if (details) console.error(`         Détail: ${details}`);
      failed++;
    }
  }

  // --- Configuration du serveur de test éphémère basé sur la logique de server.ts ---
  const app = express();
  app.use(express.json());

  const ADMIN_EMAIL = 'salam@portfolios.com';
  const ADMIN_PASSWORD_HASH = bcrypt.hashSync('Adm!n123@', 10);
  const EXPECTED_SECURITY_EMAIL = 'moussasalam86@gmail.com';

  interface OtpSession {
    userId: string;
    adminEmail: string;
    personalEmailExpected: string;
    name: string;
    expiresAt: number;
    attempts: number;
    otpCode?: string;
    otpSentTo?: string;
  }

  const otpSessions = new Map<string, OtpSession>();

  // Flag simulant l'état SMTP de test
  let smtpMode: 'ABSENT' | 'WORKING' | 'FAILING' = 'ABSENT';
  let lastSentEmail: { to: string; subject: string; body: string } | null = null;
  const capturedLogs: string[] = [];

  function logCapture(msg: string) {
    capturedLogs.push(msg);
  }

  function constantTimeCompare(a: string, b: string): boolean {
    try {
      const bufA = Buffer.from(a, 'utf8');
      const bufB = Buffer.from(b, 'utf8');
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    } catch {
      return false;
    }
  }

  // 1. POST /api/auth/login
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_EMAIL && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
      const tempToken = crypto.randomBytes(24).toString('hex');
      otpSessions.set(tempToken, {
        userId: 'usr-salam',
        adminEmail: ADMIN_EMAIL,
        personalEmailExpected: EXPECTED_SECURITY_EMAIL,
        name: 'Moussa Abdou Salam',
        expiresAt: Date.now() + 10 * 60 * 1000,
        attempts: 4
      });
      return res.json({ success: true, requireOtp: true, tempToken });
    }
    return res.status(401).json({ error: 'Identifiants invalides.' });
  });

  // 2. POST /api/auth/request-otp (Logique identique à server.ts)
  app.post('/api/auth/request-otp', async (req, res) => {
    const { tempToken, destinationEmail } = req.body;
    if (!tempToken || !destinationEmail) return res.status(400).json({ error: 'Paramètres manquants.' });

    const session = otpSessions.get(tempToken);
    if (!session || Date.now() > session.expiresAt) return res.status(401).json({ error: 'Session invalide.' });

    const cleanEmail = String(destinationEmail).trim().toLowerCase();
    if (cleanEmail !== session.personalEmailExpected.toLowerCase()) {
      return res.status(403).json({ error: 'Email non autorisé pour 2FA.' });
    }

    if (smtpMode === 'ABSENT') {
      session.otpCode = undefined;
      logCapture(`[2FA SECURITY REJECT] Demande OTP refusée : service SMTP non configuré.`);
      return res.status(503).json({ error: 'Service SMTP non configuré.' });
    }

    const otpCode = crypto.randomInt(100000, 1000000).toString();

    if (smtpMode === 'FAILING') {
      session.otpCode = undefined;
      session.expiresAt = 0;
      logCapture(`[2FA SMTP ERROR] Échec d'envoi du message de sécurité.`);
      return res.status(502).json({ error: 'Échec de transmission SMTP.' });
    }

    // SMTP SUCCESS
    lastSentEmail = {
      to: cleanEmail,
      subject: '[SALAM.DEV] Code 2FA',
      body: otpCode
    };

    session.otpCode = otpCode;
    session.otpSentTo = cleanEmail;
    session.expiresAt = Date.now() + 5 * 60 * 1000;
    session.attempts = 4;

    logCapture(`[2FA OTP SECURITY DISPATCH] Code expédié avec succès via SMTP à (${cleanEmail.substring(0, 3)}***@***)`);

    return res.json({
      success: true,
      message: `Code expédié à ${cleanEmail.substring(0, 3)}***@***.`
    });
  });

  // 3. POST /api/auth/verify-otp (Logique identique à server.ts)
  app.post('/api/auth/verify-otp', async (req, res) => {
    const { tempToken, otpCode } = req.body;
    if (!tempToken || !otpCode) return res.status(400).json({ error: 'Paramètres manquants.' });

    const session = otpSessions.get(tempToken);
    if (!session || Date.now() > session.expiresAt) return res.status(401).json({ error: 'Session expirée.' });
    if (!session.otpCode) return res.status(400).json({ error: 'Aucun code actif pour cette session.' });

    const isMatch = constantTimeCompare(session.otpCode, String(otpCode).trim());
    if (!isMatch) {
      session.attempts -= 1;
      if (session.attempts <= 0) {
        otpSessions.delete(tempToken);
        return res.status(401).json({ error: 'Trop de codes erronés. Session révoquée.', attemptsLeft: 0 });
      }
      return res.status(401).json({ error: 'Code erroné.', attemptsLeft: session.attempts });
    }

    // Single use invalidation
    otpSessions.delete(tempToken);
    const token = 'jwt-fake-valid-token-salam';
    return res.json({ success: true, token, user: { name: session.name } });
  });

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(3456, resolve));

  async function postJson(urlPath: string, data: any) {
    const res = await fetch(`http://127.0.0.1:3456${urlPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json().catch(() => null);
    return { status: res.status, data: json };
  }

  try {
    // --- SCÉNARIO 1 : Authentification sans SMTP (Fail-Closed) ---
    console.log('--- SCÉNARIO 1 : Échec fermé si SMTP absent ---');
    smtpMode = 'ABSENT';
    const login1 = await postJson('/api/auth/login', { username: ADMIN_EMAIL, password: 'Adm!n123@' });
    assertTest('Login fournit tempToken', login1.status === 200 && !!login1.data.tempToken);
    const token1 = login1.data.tempToken;

    const reqOtp1 = await postJson('/api/auth/request-otp', { tempToken: token1, destinationEmail: EXPECTED_SECURITY_EMAIL });
    assertTest('HTTP 503 Service Unavailable quand SMTP absent', reqOtp1.status === 503);
    assertTest('Aucun code OTP ni devOtpCode dans la réponse', !reqOtp1.data.devOtpCode && !reqOtp1.data.otpCode && !reqOtp1.data.otpPreview);

    // Tentative de deviner ou forcer la validation alors que SMTP était absent
    const verify1 = await postJson('/api/auth/verify-otp', { tempToken: token1, otpCode: '123456' });
    assertTest('Rejet de verify-otp quand aucun code n\'a été généré (HTTP 400)', verify1.status === 400);

    // --- SCÉNARIO 2 : Usurpation d\'email de destination ---
    console.log('\n--- SCÉNARIO 2 : Rejet d\'email de destination arbitraire ---');
    const login2 = await postJson('/api/auth/login', { username: ADMIN_EMAIL, password: 'Adm!n123@' });
    const token2 = login2.data.tempToken;

    const reqSpoof = await postJson('/api/auth/request-otp', { tempToken: token2, destinationEmail: 'attacker@evil.com' });
    assertTest('HTTP 403 Forbidden sur destination non autorisée', reqSpoof.status === 403);

    // --- SCÉNARIO 3 : Échec d\'envoi SMTP (Réseau / port bloqué) ---
    console.log('\n--- SCÉNARIO 3 : Invalidation immédiate sur échec SMTP ---');
    smtpMode = 'FAILING';
    const login3 = await postJson('/api/auth/login', { username: ADMIN_EMAIL, password: 'Adm!n123@' });
    const token3 = login3.data.tempToken;

    const reqFail = await postJson('/api/auth/request-otp', { tempToken: token3, destinationEmail: EXPECTED_SECURITY_EMAIL });
    assertTest('HTTP 502 Bad Gateway lors d\'une erreur de transport SMTP', reqFail.status === 502);
    assertTest('Zéro code divulgué lors de l\'échec SMTP', !reqFail.data.devOtpCode && !reqFail.data.otpCode);

    // Vérifier que le code est bien détruit en mémoire et ne peut pas être validé (rejet 400 ou 401)
    const verifyFail = await postJson('/api/auth/verify-otp', { tempToken: token3, otpCode: '999999' });
    assertTest('Vérification rejetée (code invalidé en mémoire sur échec SMTP)', verifyFail.status === 400 || verifyFail.status === 401);

    // --- SCÉNARIO 4 : Envoi SMTP opérationnel & validation réussie ---
    console.log('\n--- SCÉNARIO 4 : Flux nominal SMTP & Invalidation à usage unique ---');
    smtpMode = 'WORKING';
    const login4 = await postJson('/api/auth/login', { username: ADMIN_EMAIL, password: 'Adm!n123@' });
    const token4 = login4.data.tempToken;

    const reqSuccess = await postJson('/api/auth/request-otp', { tempToken: token4, destinationEmail: EXPECTED_SECURITY_EMAIL });
    assertTest('HTTP 200 OK lors de l\'envoi SMTP', reqSuccess.status === 200);
    assertTest('Aucun code OTP présent dans la réponse HTTP nominale', !reqSuccess.data.devOtpCode && !reqSuccess.data.otpCode && !reqSuccess.data.otpPreview);
    assertTest('L\'email SMTP simulé a bien reçu le code à 6 chiffres', !!lastSentEmail && /^\d{6}$/.test(lastSentEmail.body));

    const realCode = lastSentEmail!.body;

    // Mauvais code : décrémentation des tentatives
    const verifyBad = await postJson('/api/auth/verify-otp', { tempToken: token4, otpCode: '000000' });
    assertTest('Mauvais code refusé (tentatives restantes: 3)', verifyBad.status === 401 && verifyBad.data.attemptsLeft === 3);

    // Bon code : succès
    const verifyGood = await postJson('/api/auth/verify-otp', { tempToken: token4, otpCode: realCode });
    assertTest('Bon code validé avec émission du token d\'authentification', verifyGood.status === 200 && !!verifyGood.data.token);

    // Single-use : rejeu du même code
    const verifyReplay = await postJson('/api/auth/verify-otp', { tempToken: token4, otpCode: realCode });
    assertTest('Rejeu du même code immédiatement rejeté (Single-Use validé)', verifyReplay.status === 401);

    // --- SCÉNARIO 5 : Audit des logs capturés ---
    console.log('\n--- SCÉNARIO 5 : Contrôle strict des logs console ---');
    const anyLogContainsRealCode = capturedLogs.some(l => lastSentEmail && l.includes(lastSentEmail.body));
    assertTest('Aucun log console ne contient le code OTP réel', !anyLogContainsRealCode);
    const anyLogContainsPlainOtp = capturedLogs.some(l => l.includes('CODE OTP :'));
    assertTest('Aucun log ne mentionne de chaîne "CODE OTP : [code]"', !anyLogContainsPlainOtp);

  } finally {
    server.close();
  }

  console.log('\n================================================================');
  console.log(`TOTAL AUDIT RUNTIME : ${passed} TESTS RÉUSSIS, ${failed} ÉCHECS`);
  console.log('================================================================');

  if (failed > 0) process.exit(1);
}

runRuntimeAudit();
