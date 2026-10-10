// scripts/diagnose-sync-cms.cjs
// Script de diagnostic de la chaîne de synchronisation CMS -> Site Public

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getJson(urlPath, headers = {}) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + urlPath, { headers }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, headers: res.headers, data: null, raw: data });
        }
      });
    }).on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

function postJson(urlPath, payload, headers = {}) {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:3000' + urlPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, headers: res.headers, data: null, raw: data });
        }
      });
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
    req.write(JSON.stringify(payload));
    req.end();
  });
}

function putJson(urlPath, payload, headers = {}) {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:3000' + urlPath, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...headers }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, headers: res.headers, data: null, raw: data });
        }
      });
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function runDiagnosis() {
  console.log('================================================================');
  console.log('=== DIAGNOSTIC SYNCHRONISATION CMS -> SITE PUBLIC ===');
  console.log('================================================================\n');

  // 1. Initial State
  const initialGet = await getJson('/api/data');
  console.log('1. GET /api/data initial status:', initialGet.status);
  console.log('   Cache-Control header reçu:', initialGet.headers['cache-control'] || 'ABSENT (DANGER CACHE)');
  console.log('   Nombre initial de projets:', initialGet.data.projects.length);
  console.log('   Nombre initial de technologies:', initialGet.data.technologies.length);
  console.log('   Email public actuel:', initialGet.data.personalInfo.email);

  // 2. Auth token setup
  const JWT_SECRET = process.env.JWT_SECRET || 'salam_portfolio_secure_jwt_secret_2026_x9k2m';
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ userId: 'usr-salam', email: 'salam@portfolios.com', expiresAt })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url');
  const validAdminToken = `${payload}.${signature}`;

  // 3. TEST SANS TOKEN (Simulant token effacé par handleLocation)
  console.log('\n--- TEST A: SAUVEGARDE QUAND LE TOKEN A ÉTÉ EFFACÉ ---');
  const noTokenSave = await postJson('/api/data', { test: true }, {});
  console.log('   POST /api/data sans token:', noTokenSave.status, noTokenSave.data?.error);

  // 4. TEST AVEC TOKEN VALIDE
  console.log('\n--- TEST B: OPÉRATION 1 — AJOUTER UN PROJET ---');
  const testProjId = `proj-test-sync-${Date.now()}`;
  const newProject = {
    id: testProjId,
    title: `Projet Test Sync ${Date.now()}`,
    slug: `projet-test-sync-${Date.now()}`,
    shortDescription: "Description courte du projet test",
    fullDescription: "Description complète du projet test",
    mainImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    gallery: [],
    technologyIds: ["tech-csharp", "tech-aspnet"],
    categoryId: "cat-dotnet",
    categoryName: "ASP.NET Core & C#",
    status: "published",
    isFeatured: true,
    showSourceCode: true,
    order: initialGet.data.projects.length + 1
  };

  const nextProjects = [...initialGet.data.projects, newProject];
  const saveProjRes = await postJson('/api/data', { projects: nextProjects }, { 'Authorization': `Bearer ${validAdminToken}` });
  console.log('   1. Réponse HTTP sauvegarde:', saveProjRes.status);
  
  const readAfterProj = await getJson('/api/data');
  console.log('   2. Réponse API lecture après sauvegarde:', readAfterProj.status);
  const foundInApi = readAfterProj.data.projects.find(p => p.id === testProjId);
  console.log('   3. Trouvé dans API /api/data:', Boolean(foundInApi));

  const diskData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'portfolio-cms-data.json'), 'utf8'));
  const foundOnDisk = diskData.projects.find(p => p.id === testProjId);
  console.log('   4. Persisté sur disque (portfolio-cms-data.json):', Boolean(foundOnDisk));

  console.log('\n--- TEST C: OPÉRATION 2 — MODIFIER LE TITRE DU PROJET ---');
  const updatedTitle = `Projet Test Titre Modifié ${Date.now()}`;
  const modifiedProjects = nextProjects.map(p => p.id === testProjId ? { ...p, title: updatedTitle } : p);
  const saveModProjRes = await postJson('/api/data', { projects: modifiedProjects }, { 'Authorization': `Bearer ${validAdminToken}` });
  console.log('   1. Réponse HTTP sauvegarde:', saveModProjRes.status);
  const readAfterMod = await getJson('/api/data');
  const foundModInApi = readAfterMod.data.projects.find(p => p.id === testProjId);
  console.log('   2. Titre dans API /api/data:', foundModInApi?.title);

  console.log('\n--- TEST D: OPÉRATION 3 — MODIFIER UNE TECHNOLOGIE & LOGO ---');
  const techToMod = initialGet.data.technologies[0];
  const testLogoUrl = "https://cdn.worldvectorlogo.com/logos/c-1.svg";
  const updatedTechs = initialGet.data.technologies.map(t => t.id === techToMod.id ? { ...t, logoUrl: testLogoUrl } : t);
  const saveTechRes = await putJson('/api/module/technologies', updatedTechs, { 'Authorization': `Bearer ${validAdminToken}` });
  console.log('   1. Réponse HTTP sauvegarde:', saveTechRes.status);
  const readAfterTech = await getJson('/api/data');
  const foundTech = readAfterTech.data.technologies.find(t => t.id === techToMod.id);
  console.log('   2. logoUrl dans API /api/data:', foundTech?.logoUrl);

  console.log('\n--- TEST E: OPÉRATION 4 — MODIFIER L\'EMAIL PUBLIC ---');
  const testEmail = `contact.sync.${Date.now()}@salam-architect.net`;
  const updatedInfo = { ...initialGet.data.personalInfo, email: testEmail };
  const saveEmailRes = await putJson('/api/module/personalInfo', updatedInfo, { 'Authorization': `Bearer ${validAdminToken}` });
  console.log('   1. Réponse HTTP sauvegarde:', saveEmailRes.status);
  const readAfterEmail = await getJson('/api/data');
  console.log('   2. Email dans API /api/data:', readAfterEmail.data.personalInfo.email);

  console.log('\n--- TEST F: OPÉRATION 5 — AJOUTER UNE CATÉGORIE ---');
  const testCatId = `cat-test-${Date.now()}`;
  const newCat = { id: testCatId, name: `Catégorie Test ${Date.now()}`, slug: `cat-test-${Date.now()}`, order: 99 };
  const updatedCats = [...initialGet.data.projectCategories, newCat];
  const saveCatRes = await putJson('/api/module/projectCategories', updatedCats, { 'Authorization': `Bearer ${validAdminToken}` });
  console.log('   1. Réponse HTTP sauvegarde:', saveCatRes.status);
  const readAfterCat = await getJson('/api/data');
  const foundCat = readAfterCat.data.projectCategories.find(c => c.id === testCatId);
  console.log('   2. Catégorie dans API /api/data:', foundCat?.name);

  // Clean test project and category, restore original email
  console.log('\n--- NETTOYAGE DES DONNÉES DE TEST ---');
  await postJson('/api/data', { 
    projects: initialGet.data.projects,
    technologies: initialGet.data.technologies,
    personalInfo: initialGet.data.personalInfo,
    projectCategories: initialGet.data.projectCategories
  }, { 'Authorization': `Bearer ${validAdminToken}` });
  console.log('   Données initiales restaurées.');
}

runDiagnosis().catch(err => {
  console.error('Diagnostic error:', err);
});
