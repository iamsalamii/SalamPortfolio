import assert from 'assert';
import fs from 'fs';
import path from 'path';

/**
 * SUITE DE TESTS DE SÉCURITÉ 2FA PRODUCTION
 * Valide les 8 exigences de sécurité critique de l'audit CTO
 */

async function runSecurityTests() {
  console.log('================================================================');
  console.log('🔒 EXÉCUTION DE LA SUITE DE TESTS DE SÉCURITÉ 2FA EN PRODUCTION');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    try {
      fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  [FAIL] ${name}`);
      console.error(`         ${err.message}`);
      failed++;
    }
  }

  const serverTsPath = path.join(process.cwd(), 'server.ts');
  const serverCode = fs.readFileSync(serverTsPath, 'utf8');

  const adminLoginPath = path.join(process.cwd(), 'src', 'components', 'admin', 'AdminLogin.tsx');
  const adminLoginCode = fs.readFileSync(adminLoginPath, 'utf8');

  const dataContextPath = path.join(process.cwd(), 'src', 'context', 'DataContext.tsx');
  const dataContextCode = fs.readFileSync(dataContextPath, 'utf8');

  // TEST 1: Analyse statique - Aucune fuite de code dans les réponses JSON du serveur
  test('1. Aucune fuite de code (devOtpCode / otpPreview) dans les réponses JSON de server.ts', () => {
    assert(!serverCode.includes('devOtpCode:'), 'server.ts ne doit contenir aucune propriété devOtpCode');
    assert(!serverCode.includes('otpPreview:'), 'server.ts ne doit contenir aucune propriété otpPreview');
  });

  // TEST 2: Analyse statique - Aucune divulgation du code dans les logs serveur
  test('2. Aucun code OTP écrit dans les logs serveur (console.log / console.error)', () => {
    // Vérifie qu'il n'y a pas de log interpolant ${otpCode} ou ${newOtp}
    const otpLogInConsole = /console\.(log|info|warn|error)\([^)]*(\$\{otpCode\}|\$\{newOtp\}|CODE OTP)[^)]*\)/.test(serverCode);
    assert(!otpLogInConsole, 'server.ts ne doit jamais consigner le code OTP en clair dans les logs');
  });

  // TEST 3: Fail-Closed - Rejet immédiat si SMTP est absent
  test('3. Échec fermé (Fail-Closed) : rejet explicite sans génération si SMTP absent', () => {
    assert(serverCode.includes('const transporter = getSmtpTransporter();'), 'Vérification du transporter SMTP obligatoire');
    assert(serverCode.includes('return res.status(503)'), 'Rejet avec statut 503 en l\'absence de SMTP');
  });

  // TEST 4: Destination email stricte - Aucune possibilité de spoofing d'email de destination
  test('4. Contrôle strict de destination : rejet si email ne correspond pas à l\'adresse de sécurité', () => {
    assert(serverCode.includes('cleanEmail !== expectedSecurityEmail'), 'Comparaison stricte de l\'email exigée');
    assert(serverCode.includes('return res.status(403)'), 'Rejet avec HTTP 403 en cas d\'email non autorisé');
  });

  // TEST 5: Imperméabilité aux requêtes client - Aucun header x-test-mode ou bypass
  test('5. Imperméabilité client : aucun en-tête HTTP (x-test-mode) ne peut modifier le flux d\'envoi', () => {
    assert(!serverCode.includes('x-test-mode'), 'server.ts ne doit référencer aucun header x-test-mode');
  });

  // TEST 6: Invalidation immédiate si l\'envoi SMTP échoue
  test('6. Invalidation immédiate du code de session en cas d\'échec SMTP', () => {
    assert(serverCode.includes('session.otpCode = undefined;'), 'Le code session doit être invalidé à undefined en cas d\'échec');
    assert(serverCode.includes('session.expiresAt = 0;'), 'La durée d\'expiration doit être annulée en cas d\'échec');
  });

  // TEST 7: Single-Use et Timing-Safe dans la vérification OTP
  test('7. Vérification OTP : invalidation à usage unique et comparaison en temps constant', () => {
    assert(serverCode.includes('otpSessions.delete(tempToken);'), 'La session OTP doit être détruite immédiatement après validation');
    assert(serverCode.includes('constantTimeCompare'), 'La vérification doit utiliser timingSafeEqual pour contrer les attaques temporelles');
    assert(serverCode.includes('session.attempts -= 1'), 'Décrémentation des tentatives en cas de mauvais code');
  });

  // TEST 8: Frontend nettoyé - Aucun composant d\'affichage de code en clair
  test('8. Frontend : aucun composant n\'affiche de code de secours en clair', () => {
    assert(!adminLoginCode.includes('devOtpCode'), 'AdminLogin.tsx ne doit référencer aucune variable devOtpCode');
    assert(!adminLoginCode.includes('MODE LOCAL DEV'), 'AdminLogin.tsx ne doit contenir aucun bloc d\'affichage de code dev');
    assert(!dataContextCode.includes('devOtpCode'), 'DataContext.tsx ne doit exposer aucune variable devOtpCode');
    assert(!dataContextCode.includes('otpPreview'), 'DataContext.tsx ne doit exposer aucune variable otpPreview');
  });

  console.log('\n================================================================');
  console.log(`BILAN DES TESTS DE SÉCURITÉ : ${passed} RÉUSSIS, ${failed} ÉCHECS`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests();
