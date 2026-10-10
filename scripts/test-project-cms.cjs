const http = require('http');
const crypto = require('crypto');
const fs = require('fs');

let JWT_SECRET = "salam_portfolio_secure_jwt_secret_2026_x9k2m";
try {
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/JWT_SECRET=([^\r\n]+)/);
    if (match) JWT_SECRET = match[1].trim();
  }
} catch(e) {}

function generateToken(userId, email, expired = false) {
  const secret = JWT_SECRET;
  const expiresAt = expired ? Date.now() - 3600000 : Date.now() + 8 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ userId, email, expiresAt })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

async function requestJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = http.request({
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch(e) {}
        resolve({ status: res.statusCode, headers: res.headers, raw: data, json });
      });
    });
    req.on('error', reject);
    if (body) {
      if (typeof body === 'object') {
        req.write(JSON.stringify(body));
      } else {
        req.write(body);
      }
    }
    req.end();
  });
}

async function runAutomatedTests() {
  console.log('========================================================================');
  console.log('   SUITE DE TESTS AUTOMATISÉS — CMS PROJETS, CAPTURE URL & NAVIGATION   ');
  console.log('========================================================================\n');

  const validToken = generateToken("usr-salam", "salam@portfolios.com");
  const expiredToken = generateToken("usr-salam", "salam@portfolios.com", true);

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${validToken}`
  };

  const results = [];

  // ================= SCÉNARIO A : ADMINISTRATION & DONNÉES =================
  console.log('--- SCÉNARIO A : ADMINISTRATION & DONNÉES ---');

  // Test A1: Récupération des données actuelles
  const initialDataRes = await requestJson('http://localhost:3000/api/data');
  const initialData = initialDataRes.json;
  const rawFormProject = initialData?.projects?.find(p => p.slug === 'raw-form');

  const isRawFormClean = rawFormProject && 
    (!rawFormProject.duration || rawFormProject.duration === '') &&
    (!rawFormProject.publishedAt || rawFormProject.publishedAt === '') &&
    (!rawFormProject.features || rawFormProject.features.length === 0) &&
    (!rawFormProject.challenges || rawFormProject.challenges.length === 0) &&
    (!rawFormProject.solutions || rawFormProject.solutions.length === 0) &&
    (!rawFormProject.results || rawFormProject.results.length === 0) &&
    (!rawFormProject.gallery || rawFormProject.gallery.length === 0);

  results.push({
    section: 'A. Données Projets',
    test: 'Suppression des données préremplies/fictives sur le projet RAW/FORM',
    status: isRawFormClean ? 'PASS' : 'FAIL',
    proof: isRawFormClean 
      ? `Champs facultatifs vierges confirmés (duration: "${rawFormProject.duration || ''}", gallery: ${rawFormProject.gallery?.length || 0}, features: ${rawFormProject.features?.length || 0})`
      : `Données résiduelles détectées: ${JSON.stringify(rawFormProject)}`
  });

  // Test A2: Création d'un projet minimal (champs obligatoires uniquement)
  const minimalProject = {
    id: `proj_test_min_${Date.now()}`,
    title: 'Microservice Auth IdentityServer',
    slug: `auth-service-${Date.now().toString().slice(-4)}`,
    shortDescription: 'Service OAuth2 / OpenID Connect haute disponibilité sous .NET 9.',
    fullDescription: '',
    mainImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
    gallery: [],
    technologyIds: ['tech-csharp', 'tech-aspnet'],
    categoryId: 'cat_backend',
    role: '',
    client: '',
    duration: '',
    publishedAt: '',
    status: 'published',
    isFeatured: false,
    order: 99,
    features: [],
    challenges: [],
    solutions: [],
    results: [],
    architectureNotes: '',
    githubUrl: 'https://github.com/salam-dev/auth-service',
    liveDemoUrl: ''
  };

  const updatedProjects = [...(initialData.projects || []), minimalProject];
  const saveMinRes = await requestJson('http://localhost:3000/api/module/projects', {
    method: 'PUT',
    headers: authHeaders
  }, updatedProjects);

  const passedA2 = saveMinRes.status === 200 && saveMinRes.json?.success === true;
  results.push({
    section: 'A. Données Projets',
    test: 'Création projet avec champs obligatoires uniquement',
    status: passedA2 ? 'PASS' : 'FAIL',
    proof: passedA2 ? `Status HTTP 200 OK -> Projet créé: ID "${minimalProject.id}", Slug "${minimalProject.slug}"` : `Status ${saveMinRes.status}`
  });

  // Test A3: Modification du projet (ajout durée, date, fonctionnalités, défis, solutions, résultats et galerie)
  const fullProject = {
    ...minimalProject,
    role: 'Lead Architect Backend',
    client: 'Fintech Solutions',
    duration: '4 Mois',
    publishedAt: '2026-02-15',
    features: ['Token exchange RFC 8693', 'Validation JWT asymétrique RSA 4096-bit'],
    challenges: ['Latence sous les 5ms pour 10 000 req/sec'],
    solutions: ['Cache distribué Redis multi-région'],
    results: ['99.99% SLA respecté', 'Temps de réponse p99 < 4.2ms'],
    gallery: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&extra=1']
  };

  const updatedProjectsWithFull = updatedProjects.map(p => p.id === fullProject.id ? fullProject : p);
  const saveFullRes = await requestJson('http://localhost:3000/api/module/projects', {
    method: 'PUT',
    headers: authHeaders
  }, updatedProjectsWithFull);

  // Re-read data to verify persistence
  const reloadedDataRes = await requestJson('http://localhost:3000/api/data');
  const persistedProject = reloadedDataRes.json?.projects?.find(p => p.id === fullProject.id);

  const passedA3 = persistedProject &&
    persistedProject.role === 'Lead Architect Backend' &&
    persistedProject.duration === '4 Mois' &&
    persistedProject.publishedAt === '2026-02-15' &&
    persistedProject.features?.length === 2 &&
    persistedProject.challenges?.length === 1 &&
    persistedProject.solutions?.length === 1 &&
    persistedProject.results?.length === 2 &&
    persistedProject.gallery?.length === 1;

  results.push({
    section: 'A. Données Projets',
    test: 'Persistance et restitution exacte des métadonnées (durée, date, listes, galerie)',
    status: passedA3 ? 'PASS' : 'FAIL',
    proof: passedA3 ? `Rechargé depuis l'API avec succès: Features=${persistedProject.features.length}, Results=${persistedProject.results.length}, Gallery=${persistedProject.gallery.length}` : 'Données non persistées fidèlement'
  });

  // Cleanup test project
  const cleanedProjects = reloadedDataRes.json.projects.filter(p => p.id !== fullProject.id);
  await requestJson('http://localhost:3000/api/module/projects', {
    method: 'PUT',
    headers: authHeaders
  }, cleanedProjects);

  // ================= SCÉNARIO B : CAPTURE D'APERÇU URL =================
  console.log('\n--- SCÉNARIO B : CAPTURE D\'APERÇU URL ---');

  // Test B1: Session valide et capture URL de projet en cours d'édition
  const targetProjectUrl = 'https://rawform-weld.vercel.app';
  const captureValidRes = await requestJson('http://localhost:3000/api/admin/capture-preview', {
    method: 'POST',
    headers: authHeaders
  }, { url: targetProjectUrl });

  const passedB1 = captureValidRes.status === 200 && captureValidRes.json?.success === true && !!captureValidRes.json?.imageUrl;
  results.push({
    section: 'B. Capture d\'Aperçu',
    test: `Capture d'écran avec session valide sur l'URL du projet (${targetProjectUrl})`,
    status: passedB1 ? 'PASS' : 'FAIL',
    proof: passedB1 ? `Status HTTP 200 OK -> Image générée: ${captureValidRes.json.imageUrl}` : `Status ${captureValidRes.status}: ${captureValidRes.raw}`
  });

  // Test B2: Session expirée
  const captureExpiredRes = await requestJson('http://localhost:3000/api/admin/capture-preview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${expiredToken}`
    }
  }, { url: targetProjectUrl });

  const passedB2 = captureExpiredRes.status === 401;
  results.push({
    section: 'B. Capture d\'Aperçu',
    test: 'Rejet explicite en cas de session expirée (Status 401)',
    status: passedB2 ? 'PASS' : 'FAIL',
    proof: `Status HTTP ${captureExpiredRes.status} (${captureExpiredRes.json?.error})`
  });

  // Test B3: Appel sans authentification (token absent)
  const captureUnauthRes = await requestJson('http://localhost:3000/api/admin/capture-preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { url: targetProjectUrl });

  const passedB3 = captureUnauthRes.status === 401;
  results.push({
    section: 'B. Capture d\'Aperçu',
    test: 'Rejet appel non authentifié sans token (Status 401)',
    status: passedB3 ? 'PASS' : 'FAIL',
    proof: `Status HTTP ${captureUnauthRes.status} (${captureUnauthRes.json?.error})`
  });

  // Test B4: Erreurs de format d'URL & SSRF
  const captureSsrfRes = await requestJson('http://localhost:3000/api/admin/capture-preview', {
    method: 'POST',
    headers: authHeaders
  }, { url: 'http://127.0.0.1:3000/admin' });

  const passedB4 = captureSsrfRes.status === 403;
  results.push({
    section: 'B. Capture d\'Aperçu',
    test: 'Blocage SSRF vers adresse privée locale (http://127.0.0.1:3000)',
    status: passedB4 ? 'PASS' : 'FAIL',
    proof: `Status HTTP ${captureSsrfRes.status} (${captureSsrfRes.json?.error})`
  });

  // ================= SCÉNARIO C : NAVIGATION PUBLIQUE =================
  console.log('\n--- SCÉNARIO C : NAVIGATION PUBLIQUE ---');

  // Test C1: API Publique accessible sans auth pour les visiteurs
  const publicDataRes = await requestJson('http://localhost:3000/api/data');
  const passedC1 = publicDataRes.status === 200 && Array.isArray(publicDataRes.json?.projects) && publicDataRes.json.projects.length > 0;
  results.push({
    section: 'C. Navigation Publique',
    test: 'Accès visiteur déconnecté à la liste des projets sans redirection /login',
    status: passedC1 ? 'PASS' : 'FAIL',
    proof: `${publicDataRes.json?.projects?.length} projets accessibles publiquement.`
  });

  // Test C2: Distinction du lien de démo externe vs slug de détails
  const rawProject = publicDataRes.json?.projects?.find(p => p.slug === 'raw-form');
  const passedC2 = rawProject && rawProject.slug === 'raw-form' && rawProject.liveDemoUrl === 'https://rawform-weld.vercel.app';
  results.push({
    section: 'C. Navigation Publique',
    test: 'Distinction slug interne ("raw-form") vs lien démo externe ("https://rawform-weld.vercel.app")',
    status: passedC2 ? 'PASS' : 'FAIL',
    proof: passedC2 ? `Slug interne = #${rawProject.slug}, Démo = ${rawProject.liveDemoUrl}` : 'Non conforme'
  });

  // ================= SCÉNARIO D : NON-RÉGRESSION =================
  console.log('\n--- SCÉNARIO D : NON-RÉGRESSION ---');

  // Test D1: Manifest PWA
  const manifestRes = await requestJson('http://localhost:3000/manifest.json');
  const passedD1 = manifestRes.status === 200 && manifestRes.json?.name && manifestRes.json?.icons?.length > 0;
  results.push({
    section: 'D. Non-Régression',
    test: 'Distribution statique du Manifest PWA (manifest.json)',
    status: passedD1 ? 'PASS' : 'FAIL',
    proof: passedD1 ? `Status 200 OK -> Nom: "${manifestRes.json.name}"` : `Status ${manifestRes.status}`
  });

  // Test D2: Absence d'accès public à l'administration
  const publicHtmlRes = await requestJson('http://localhost:3000/');
  const hasPublicAdmin = /href=[\"']\/?admin[\"']/i.test(publicHtmlRes.raw) || />\s*(Administration|Admin|Dashboard)\s*</i.test(publicHtmlRes.raw);
  const passedD2 = !hasPublicAdmin;
  results.push({
    section: 'D. Non-Régression',
    test: 'Aucun point d\'entrée d\'administration sur le site public',
    status: passedD2 ? 'PASS' : 'FAIL',
    proof: passedD2 ? 'Aucun lien /admin dans le DOM public HTML' : 'Lien public détecté'
  });

  // Affichage du récapitulatif
  console.log('\n========================================================================');
  console.log('                  RÉSUMÉ EXÉCUTIF DES RÉSULTATS                         ');
  console.log('========================================================================');
  let passCount = 0;
  let failCount = 0;

  for (const r of results) {
    const isPass = r.status === 'PASS';
    if (isPass) passCount++; else failCount++;
    const tag = isPass ? '[RÉUSSI]' : '[ÉCHEC] ';
    console.log(`${tag} [${r.section.padEnd(22)}] ${r.test}`);
    console.log(`         Preuve: ${r.proof}\n`);
  }

  console.log(`TOTAL: ${passCount} / ${results.length} tests réussis avec preuve.`);
}

runAutomatedTests().catch(console.error);
