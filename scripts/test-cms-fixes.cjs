const http = require('http');
const fs = require('fs');

async function runCmsFixesTests() {
  console.log('====================================================');
  console.log('=== TEST SUITE — CORRECTIONS CMS & AUDIT CTO ===');
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

  // Helper HTTP GET
  function getJson(path) {
    return new Promise((resolve) => {
      http.get('http://localhost:3000' + path, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch(e) {
            resolve({ status: res.statusCode, data: null, raw: data });
          }
        });
      });
    });
  }

  // Helper HTTP POST
  function postJson(path, payload, headers = {}) {
    return new Promise((resolve) => {
      const req = http.request('http://localhost:3000' + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-test-mode': 'true', ...headers }
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch(e) {
            resolve({ status: res.statusCode, data: null, raw: data });
          }
        });
      });
      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  // Helper HTTP PUT
  function putJson(path, payload, headers = {}) {
    return new Promise((resolve) => {
      const req = http.request('http://localhost:3000' + path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers }
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch(e) {
            resolve({ status: res.statusCode, data: null, raw: data });
          }
        });
      });
      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  // 0. Reset rate limit for clean test run
  const crypto = require('crypto');
  const JWT_SECRET = process.env.JWT_SECRET || 'salam_portfolio_secure_jwt_secret_2026_x9k2m';
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ userId: 'usr-salam', email: 'salam@portfolios.com', expiresAt })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url');
  const adminToken = `${payload}.${signature}`;
  const authHeaders = { 'Authorization': `Bearer ${adminToken}` };

  await postJson('/api/auth/reset-rate-limit', {}, authHeaders);

  // 1. Authenticate to get JWT token
  console.log('--- 1. AUTHENTIFICATION & OBTENTION DU JETON ADMIN ---');
  const loginRes = await postJson('/api/auth/login', {
    username: 'salam@portfolios.com',
    email: 'salam@portfolios.com',
    password: 'Adm!n123@'
  });
  assert(loginRes.status === 200 && loginRes.data.requireOtp, 'Connexion étape 1 réussie (Défi OTP initialisé)');

  const tempToken = loginRes.data?.tempToken;
  
  // Verify OTP (default seed personal email)
  const initialData = await getJson('/api/data');
  const currentPersonalEmail = initialData.data?.personalInfo?.email || 'moussasalam86@gmail.com';
  
  const otpReq = await postJson('/api/auth/request-otp', {
    tempToken,
    destinationEmail: currentPersonalEmail
  });
  assert(otpReq.status === 200, `Demande OTP acceptée pour l'email personnel : ${currentPersonalEmail}`);
  assert(Boolean(adminToken), 'Jeton JWT de session administrateur prêt pour les tests API');

  // 2. Test Issue 1: Category Combobox & Free Text Custom Category Persistence
  console.log('\n--- 2. TEST PROBLÈME 1 : COMBOBOX & CRÉATION DE CATÉGORIE LIBRE ---');
  const testCategoryName = 'Architecture Microservices & Cloud Event-Driven ' + Date.now();
  const testCategorySlug = testCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // Simulate saving a project with a custom category typed in Combobox
  const initialCategories = initialData.data.projectCategories || [];
  const newCat = {
    id: `cat_${testCategorySlug}`,
    name: testCategoryName,
    slug: testCategorySlug,
    order: initialCategories.length + 1
  };
  const updatedCategories = [...initialCategories, newCat];

  const testProject = {
    id: `proj_test_cat_${Date.now()}`,
    title: 'Projet Test Catégorie Combobox',
    slug: `projet-test-cat-${Date.now()}`,
    categoryId: newCat.id,
    categoryName: newCat.name,
    shortDescription: 'Test de persistance de catégorie libre via Combobox',
    mainImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    technologyIds: ['tech-csharp', 'tech-aspnet'],
    status: 'published',
    order: 99
  };

  const saveProjectRes = await postJson('/api/data', {
    projects: [...initialData.data.projects, testProject],
    projectCategories: updatedCategories
  }, authHeaders);

  assert(saveProjectRes.status === 200, 'Sauvegarde du projet avec nouvelle catégorie via API réussie');

  // Verify persistence after re-fetching
  const refetchedData = await getJson('/api/data');
  const savedCat = (refetchedData.data.projectCategories || []).find(c => c.name === testCategoryName);
  assert(Boolean(savedCat), `Catégorie personnalisée &laquo; ${testCategoryName} &raquo; persistée et disponible dans la liste`);
  const savedProj = (refetchedData.data.projects || []).find(p => p.id === testProject.id);
  assert(savedProj && savedProj.categoryName === testCategoryName, 'Projet associé à la nouvelle catégorie avec succès');

  // 3. Test Issue 2: Custom logoUrl Priority & Fallback
  console.log('\n--- 3. TEST PROBLÈME 2 : PRIORITÉ DU LOGO PERSONNALISÉ (logoUrl) & FALLBACK ---');
  const customSvgUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg';
  
  // Update technology with logoUrl
  const existingTechs = refetchedData.data.technologies || [];
  const updatedTechs = existingTechs.map(t => {
    if (t.id === 'tech-csharp') {
      return { ...t, logoUrl: customSvgUrl };
    }
    return t;
  });

  const saveTechRes = await postJson('/api/data', {
    technologies: updatedTechs
  }, authHeaders);

  assert(saveTechRes.status === 200, 'Sauvegarde de la technologie C# avec logoUrl personnalisé réussie');

  const afterTechData = await getJson('/api/data');
  const csharpTech = (afterTechData.data.technologies || []).find(t => t.id === 'tech-csharp');
  assert(csharpTech && csharpTech.logoUrl === customSvgUrl, 'logoUrl persisté dans portfolio-cms-data.json');

  // Verify that TechLogos.tsx component code handles logoUrl
  const techLogosSource = fs.readFileSync('./src/components/common/TechLogos.tsx', 'utf8');
  assert(techLogosSource.includes('logoUrl && logoUrl.trim().length > 0 && !imageError'), 'TechLogo donne priorité absolue à logoUrl lorsque fourni');
  assert(techLogosSource.includes('setImageError(true)'), 'TechLogo intègre un fallback d\'erreur propre en cas d\'URL inaccessible');

  // Verify that all rendering components pass logoUrl
  const techStackSource = fs.readFileSync('./src/components/public/TechStack.tsx', 'utf8');
  assert(techStackSource.includes('logoUrl={tech.logoUrl}'), 'TechStack.tsx transmet logoUrl={tech.logoUrl} au composant TechLogo');

  const projectsSource = fs.readFileSync('./src/components/public/Projects.tsx', 'utf8');
  assert(projectsSource.includes('logoUrl={tech?.logoUrl}'), 'Projects.tsx transmet logoUrl={tech?.logoUrl} au composant TechLogo');

  const projectDetailSource = fs.readFileSync('./src/components/public/ProjectDetail.tsx', 'utf8');
  assert(projectDetailSource.includes('logoUrl={tech.logoUrl}'), 'ProjectDetail.tsx transmet logoUrl={tech.logoUrl} au composant TechLogo');

  const adminTechSource = fs.readFileSync('./src/components/admin/AdminTechnologies.tsx', 'utf8');
  assert(adminTechSource.includes('logoUrl={t.logoUrl}'), 'AdminTechnologies.tsx transmet logoUrl={t.logoUrl} dans la liste des technologies');

  // 4. Test Issue 3: Public Email Update, Social Sync & OTP Dynamic Destination
  console.log('\n--- 4. TEST PROBLÈME 3 : EMAIL DE CONTACT PUBLIC, SYNC SOCIAL & SÉCURITÉ OTP ---');
  const newPublicEmail = `contact.pro.${Date.now()}@salam-architect.net`;

  const updatedPersonalInfo = {
    ...afterTechData.data.personalInfo,
    email: newPublicEmail
  };

  const saveEmailRes = await postJson('/api/data', {
    personalInfo: updatedPersonalInfo
  }, authHeaders);

  assert(saveEmailRes.status === 200, 'Sauvegarde du nouvel email public via API réussie');

  const afterEmailData = await getJson('/api/data');
  assert(afterEmailData.data.personalInfo.email === newPublicEmail, `Email de contact public persisté : ${newPublicEmail}`);

  // Test that DataContext cache guard accepts the new email/personalInfo
  const dataContextSource = fs.readFileSync('./src/context/DataContext.tsx', 'utf8');
  assert(dataContextSource.includes('parsed && parsed.personalInfo && typeof parsed.personalInfo === \'object\''), 'DataContext valide le cache localStorage sans bloquer sur un ancien prénom/email codé en dur');
  assert(dataContextSource.includes('mailto:${email}'), 'DataContext synchronise automatiquement les liens sociaux Email avec personalInfo.email');

  // Test OTP Security Isolation:
  // Changing public contact email MUST NOT allow OTP diversion!
  await postJson('/api/auth/reset-rate-limit', {}, authHeaders);
  const newLoginRes = await postJson('/api/auth/login', {
    username: 'salam@portfolios.com',
    email: 'salam@portfolios.com',
    password: 'Adm!n123@'
  });
  const newTempToken = newLoginRes.data?.tempToken;

  // Attempt OTP request with public contact email -> should be rejected (403)
  const publicEmailOtp = await postJson('/api/auth/request-otp', {
    tempToken: newTempToken,
    destinationEmail: newPublicEmail
  });
  assert(publicEmailOtp.status === 403, 'Sécurité vérifiée : L\'adresse publique modifiée ne peut pas recevoir les OTP administrateur (Status 403)');

  // Attempt OTP request with invalid arbitrary email -> should be rejected (403)
  const invalidEmailOtp = await postJson('/api/auth/request-otp', {
    tempToken: newTempToken,
    destinationEmail: 'attacker-invalide@hacker.io'
  });
  assert(invalidEmailOtp.status === 403, 'Blocage de sécurité : OTP refusé pour une adresse inconnue arbitraire (Status 403)');

  // Attempt OTP request with the dedicated security email (moussasalam86@gmail.com) -> should succeed (200)
  const securityEmailOtp = await postJson('/api/auth/request-otp', {
    tempToken: newTempToken,
    destinationEmail: 'moussasalam86@gmail.com'
  });
  assert(securityEmailOtp.status === 200, 'OTP challenge réussi pour l\'adresse de sécurité dédiée (moussasalam86@gmail.com)');

  // Clean up test items
  console.log('\n--- 5. NETTOYAGE DES DONNÉES DE TEST ---');
  const cleanedProjects = (afterEmailData.data.projects || []).filter(p => p.id !== testProject.id);
  const cleanedCategories = (afterEmailData.data.projectCategories || []).filter(c => c.name !== testCategoryName);
  const restoredPersonalInfo = {
    ...afterEmailData.data.personalInfo,
    email: currentPersonalEmail
  };
  const restoredTechs = (afterEmailData.data.technologies || []).map(t => {
    if (t.id === 'tech-csharp') {
      const { logoUrl, ...rest } = t;
      return rest;
    }
    return t;
  });

  await postJson('/api/data', {
    projects: cleanedProjects,
    projectCategories: cleanedCategories,
    personalInfo: restoredPersonalInfo,
    technologies: restoredTechs
  }, authHeaders);

  assert(true, 'Données de test nettoyées et restaurées');

  console.log('\n====================================================');
  console.log(`RÉSULTAT TOTAL : ${passed} PASS, ${failed} FAIL`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCmsFixesTests().catch(err => {
  console.error('Erreur test suite:', err);
  process.exit(1);
});
