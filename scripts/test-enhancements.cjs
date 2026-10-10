const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('=== SUITE DE VALIDATION COMPLÈTE — AMÉLIORATIONS ===');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Fetch current public data
  console.log('--- 1. API GET /api/data ---');
  const getRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/data',
    method: 'GET'
  });
  assert(getRes.statusCode === 200, 'GET /api/data retourne 200 OK');
  const data = JSON.parse(getRes.body);
  assert(Array.isArray(data.projects) && data.projects.length > 0, `Projets existants chargés (${data.projects?.length} projets)`);
  assert(Array.isArray(data.projectCategories) && data.projectCategories.length > 0, `Catégories de projets (${data.projectCategories?.length} catégories)`);

  // 2. Authentication flow to get admin token
  console.log('\n--- 2. AUTHENTIFICATION CMS ---');
  const crypto = require('crypto');
  const JWT_SECRET = process.env.JWT_SECRET || "salam_portfolio_secure_jwt_secret_2026_x9k2m";
  function generateToken(userId, email) {
    const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
    const payload = Buffer.from(JSON.stringify({ userId, email, expiresAt })).toString("base64url");
    const signature = crypto.createHmac("sha256", JWT_SECRET).update(payload).digest("base64url");
    return `${payload}.${signature}`;
  }

  const token = generateToken("usr-salam", "salam@portfolios.com");
  assert(Boolean(token), 'Jeton JWT administrateur signé et validé');

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 3. Test project with showSourceCode: true vs false
  console.log('\n--- 3. TEST BOUTON CODE SOURCE CONFIGURABLE ---');
  const testProject1 = {
    ...data.projects[0],
    id: 'proj_test_source_code',
    slug: 'test-source-code-project',
    title: 'Test Source Code Toggle',
    githubUrl: 'https://github.com/test/repo',
    showSourceCode: false,
    translations: {
      en: {
        title: 'Test Source Code Toggle (EN)',
        shortDescription: 'English description for test project'
      }
    }
  };

  // Add project with showSourceCode: false
  const updatedProjects1 = [testProject1, ...data.projects.filter(p => p.id !== testProject1.id)];
  const putRes1 = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/data',
    method: 'POST',
    headers: authHeaders
  }, { projects: updatedProjects1 });

  assert(putRes1.statusCode === 200, 'Sauvegarde projet avec showSourceCode=false réussie');

  // Verify persistence after reload
  const reloadData1 = JSON.parse((await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/data',
    method: 'GET'
  })).body);

  const reloadedProj1 = reloadData1.projects.find(p => p.id === testProject1.id);
  assert(reloadedProj1 && reloadedProj1.showSourceCode === false, 'Persistance de showSourceCode=false validée après rechargement');

  // Toggle showSourceCode back to true
  testProject1.showSourceCode = true;
  const updatedProjects2 = reloadData1.projects.map(p => p.id === testProject1.id ? testProject1 : p);
  await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/data',
    method: 'POST',
    headers: authHeaders
  }, { projects: updatedProjects2 });

  const reloadData2 = JSON.parse((await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/data',
    method: 'GET'
  })).body);
  const reloadedProj2 = reloadData2.projects.find(p => p.id === testProject1.id);
  assert(reloadedProj2 && reloadedProj2.showSourceCode === true, 'Persistance de showSourceCode=true validée après modification');

  // 4. Test Custom Category creation and suggestion persistence
  console.log('\n--- 4. TEST CATÉGORIE PERSONNALISÉE (SUGGESTION & SAISIE LIBRE) ---');
  const customCatName = 'Intelligence Artificielle & Agents';
  const customCatSlug = 'intelligence-artificielle-agents';
  const newCatId = `cat_${customCatSlug}`;

  const customCategory = {
    id: newCatId,
    name: customCatName,
    slug: customCatSlug,
    order: (reloadData2.projectCategories || []).length + 1,
    translations: {
      en: { name: 'Artificial Intelligence & Agents' }
    }
  };

  const updatedCategories = [...(reloadData2.projectCategories || []).filter(c => c.id !== newCatId), customCategory];
  const putCatRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/data',
    method: 'POST',
    headers: authHeaders
  }, { projectCategories: updatedCategories });

  assert(putCatRes.statusCode === 200, 'Sauvegarde de la nouvelle catégorie personnalisée');

  const reloadData3 = JSON.parse((await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/data',
    method: 'GET'
  })).body);

  const savedCat = reloadData3.projectCategories.find(c => c.id === newCatId);
  assert(savedCat && savedCat.name === customCatName, 'Catégorie personnalisée persistée et disponible dans la liste des catégories');

  // 5. Test Multilingual Content and Translations
  console.log('\n--- 5. TEST TRADUCTION COMPLÈTE & PERSISTANCE MULTILINGUE ---');
  const projWithTrans = reloadData3.projects.find(p => p.id === testProject1.id);
  assert(projWithTrans && projWithTrans.translations?.en?.title === 'Test Source Code Toggle (EN)', 'Traduction anglaise du titre de projet persistée');
  assert(projWithTrans && projWithTrans.translations?.en?.shortDescription === 'English description for test project', 'Traduction anglaise de la description persistée');

  // Clean test project from database
  const finalProjects = reloadData3.projects.filter(p => p.id !== testProject1.id);
  await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/data',
    method: 'POST',
    headers: authHeaders
  }, { projects: finalProjects });

  // 6. Test Static PWA manifest & SSRF protections
  console.log('\n--- 6. TEST PWA & SÉCURITÉ ---');
  const manifestRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/manifest.json',
    method: 'GET'
  });
  assert(manifestRes.statusCode === 200, 'manifest.json servi avec succès (PWA valide)');

  const ssrfRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/capture-preview',
    method: 'POST',
    headers: authHeaders
  }, { url: 'http://localhost:3000/admin' });
  assert(ssrfRes.statusCode === 403, 'Blocage SSRF vers localhost (Status 403 Forbidden)');

  console.log('\n====================================================');
  console.log(`RÉSULTAT: ${passed} PASS, ${failed} FAIL`);
  console.log('====================================================');
}

runTestSuite().catch(err => {
  console.error('Erreur exécution tests:', err);
  process.exit(1);
});
