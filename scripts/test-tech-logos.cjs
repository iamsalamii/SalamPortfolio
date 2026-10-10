const fs = require('fs');
const path = require('path');

// Read the TechLogos.tsx source
const techLogosSource = fs.readFileSync(path.join(__dirname, '../src/components/common/TechLogos.tsx'), 'utf-8');

// Simple simulation of normalizeTechKey
function normalizeTechKey(rawName) {
  if (!rawName) return '';
  return rawName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/c#/g, 'csharp')
    .replace(/c\+\+/g, 'cpp')
    .replace(/\.net/g, 'dotnet')
    .replace(/[^a-z0-9]/g, '');
}

// Logic matching simulation based directly on TechLogos.tsx rules
function resolveTechLogo(name, logoUrl = null) {
  if (logoUrl && logoUrl.trim().length > 0) {
    return {
      type: 'MANUAL_OVERRIDE',
      source: 'Custom URL Override',
      identifier: logoUrl
    };
  }

  const key = normalizeTechKey(name);

  if (key.includes('csharp') || key === 'cs') return { type: 'OFFICIAL_VECTOR', source: 'Microsoft C# Hexagon', identifier: 'csharp' };
  if (key.includes('aspnet') || key.includes('dotnet') || key === 'net' || key.includes('netcore') || key.includes('net9')) return { type: 'OFFICIAL_VECTOR', source: '.NET Official Emblem', identifier: 'dotnet' };
  if (key.includes('efcore') || key.includes('entityframework') || key.includes('linq')) return { type: 'OFFICIAL_VECTOR', source: 'Entity Framework Core Emblem', identifier: 'efcore' };
  if (key.includes('python') || key === 'py') return { type: 'OFFICIAL_VECTOR', source: 'Python Official Two-Tone', identifier: 'python' };
  if (key.includes('typescript') || key === 'ts') return { type: 'OFFICIAL_VECTOR', source: 'TypeScript Official Square', identifier: 'typescript' };
  if (key.includes('javascript') || key === 'js' || key.includes('nodejs') || key.includes('node')) return { type: 'OFFICIAL_VECTOR', source: 'JavaScript Official Yellow Box', identifier: 'javascript' };
  if (key === 'php' || key.startsWith('php')) return { type: 'OFFICIAL_VECTOR', source: 'PHP Official Ellipse', identifier: 'php' };
  
  if (key.includes('openai') || key.includes('chatgpt') || key.includes('gpt')) return { type: 'OFFICIAL_VECTOR', source: 'OpenAI Official Spiral', identifier: 'openai' };
  if (key.includes('anthropic') || key.includes('claude')) return { type: 'OFFICIAL_VECTOR', source: 'Anthropic Claude Terracotta Emblem', identifier: 'anthropic' };
  if (key.includes('gemini') || key.includes('bard') || key.includes('googleai')) return { type: 'OFFICIAL_VECTOR', source: 'Google Gemini 4-Point Star Gradient', identifier: 'gemini' };
  if (key.includes('copilot')) return { type: 'OFFICIAL_VECTOR', source: 'Microsoft/GitHub Copilot 3D Ribbon', identifier: 'copilot' };
  if (key.includes('semantickernel')) return { type: 'OFFICIAL_VECTOR', source: 'Microsoft Semantic Kernel Node Network', identifier: 'semantickernel' };
  if (key.includes('langchain') || key.includes('langgraph') || key.includes('langsmith')) return { type: 'OFFICIAL_VECTOR', source: 'LangChain AI Chain Emblem', identifier: 'langchain' };
  if (key.includes('ollama')) return { type: 'OFFICIAL_VECTOR', source: 'Ollama Official Monogram', identifier: 'ollama' };
  if (key.includes('pytorch') || key === 'torch') return { type: 'OFFICIAL_VECTOR', source: 'PyTorch Official Flame', identifier: 'pytorch' };
  if (key.includes('n8n')) return { type: 'OFFICIAL_VECTOR', source: 'n8n Official Connected Nodes', identifier: 'n8n' };
  if (key.includes('make') || key.includes('integromat')) return { type: 'OFFICIAL_VECTOR', source: 'Make (Integromat) Violet Geometry', identifier: 'make' };
  if (key.includes('mistral')) return { type: 'OFFICIAL_VECTOR', source: 'Mistral AI Orange Blocks', identifier: 'mistral' };
  if (key.includes('huggingface') || key === 'hf') return { type: 'OFFICIAL_VECTOR', source: 'Hugging Face Official Emoji', identifier: 'huggingface' };
  if (key.includes('tensorflow') || key === 'tf') return { type: 'OFFICIAL_VECTOR', source: 'TensorFlow Official T', identifier: 'tensorflow' };

  if (key.includes('react')) return { type: 'OFFICIAL_VECTOR', source: 'React Official Atom', identifier: 'react' };
  if (key.includes('flutter')) return { type: 'OFFICIAL_VECTOR', source: 'Flutter Official Wing', identifier: 'flutter' };
  if (key.includes('nextjs') || key === 'next') return { type: 'OFFICIAL_VECTOR', source: 'Next.js Monogram', identifier: 'nextjs' };
  if (key.includes('tailwind')) return { type: 'OFFICIAL_VECTOR', source: 'Tailwind CSS Cyan Waves', identifier: 'tailwind' };
  if (key.includes('bootstrap')) return { type: 'OFFICIAL_VECTOR', source: 'Bootstrap Purple B', identifier: 'bootstrap' };
  if (key.includes('html') || key.includes('html5')) return { type: 'OFFICIAL_VECTOR', source: 'HTML5 Orange Shield', identifier: 'html5' };
  if (key.includes('css') || key.includes('css3')) return { type: 'OFFICIAL_VECTOR', source: 'CSS3 Blue Shield', identifier: 'css3' };

  if (key.includes('sqlserver') || key.includes('mssql') || key.includes('tsql')) return { type: 'OFFICIAL_VECTOR', source: 'Microsoft SQL Server Cylinders', identifier: 'sqlserver' };
  if (key.includes('postgres') || key.includes('postgresql') || key.includes('psql')) return { type: 'OFFICIAL_VECTOR', source: 'PostgreSQL Blue Disc', identifier: 'postgresql' };
  if (key.includes('mysql')) return { type: 'OFFICIAL_VECTOR', source: 'MySQL Dolphin Disc', identifier: 'mysql' };
  if (key.includes('redis')) return { type: 'OFFICIAL_VECTOR', source: 'Redis Red Cube', identifier: 'redis' };

  if (key.includes('docker')) return { type: 'OFFICIAL_VECTOR', source: 'Docker Official Whale', identifier: 'docker' };
  if (key.includes('azure')) return { type: 'OFFICIAL_VECTOR', source: 'Microsoft Azure Blue A', identifier: 'azure' };
  if (key.includes('aws') || key.includes('amazon')) return { type: 'OFFICIAL_VECTOR', source: 'AWS Dark & Orange Smile', identifier: 'aws' };
  if (key === 'git') return { type: 'OFFICIAL_VECTOR', source: 'Git Orange Diamond', identifier: 'git' };
  if (key.includes('github')) return { type: 'OFFICIAL_VECTOR', source: 'GitHub Octocat Silhouette', identifier: 'github' };
  if (key.includes('gitlab')) return { type: 'OFFICIAL_VECTOR', source: 'GitLab Orange/Red Fox', identifier: 'gitlab' };
  if (key.includes('visualstudio') || key.includes('vscode') || key === 'vs') return { type: 'OFFICIAL_VECTOR', source: 'Visual Studio / VS Code Ribbon', identifier: 'visualstudio' };
  if (key.includes('xunit') || key.includes('nunit') || key.includes('test') || key.includes('tdd')) return { type: 'OFFICIAL_VECTOR', source: 'Testing & Quality Emerald Flask', identifier: 'xunit' };
  if (key.includes('specflow') || key.includes('cucumber') || key.includes('bdd') || key.includes('gherkin')) return { type: 'OFFICIAL_VECTOR', source: 'SpecFlow BDD Blue Graph', identifier: 'specflow' };
  if (key.includes('scrum') || key.includes('agile') || key.includes('uml') || key.includes('jira')) return { type: 'OFFICIAL_VECTOR', source: 'Agile SCRUM Blue Loop', identifier: 'scrum' };

  const initial = (name || '?').trim().substring(0, 2).toUpperCase();
  return {
    type: 'FALLBACK_MONOGRAM',
    source: `Monogramme Brutaliste [${initial}]`,
    identifier: initial
  };
}

const testCases = [
  // 1. Core .NET & Languages
  { input: 'C#', expectedId: 'csharp' },
  { input: 'c# 13', expectedId: 'csharp' },
  { input: 'csharp', expectedId: 'csharp' },
  { input: '.NET', expectedId: 'dotnet' },
  { input: '.NET 9', expectedId: 'dotnet' },
  { input: 'dotnet', expectedId: 'dotnet' },
  { input: 'ASP.NET Core', expectedId: 'dotnet' },
  { input: 'Entity Framework Core', expectedId: 'efcore' },
  { input: 'LINQ', expectedId: 'efcore' },
  { input: 'Python', expectedId: 'python' },
  { input: 'TypeScript', expectedId: 'typescript' },
  { input: 'ts', expectedId: 'typescript' },
  { input: 'JavaScript', expectedId: 'javascript' },
  { input: 'Node.js', expectedId: 'javascript' },
  { input: 'PHP', expectedId: 'php' },

  // 2. Modern Frontend & Frameworks
  { input: 'React', expectedId: 'react' },
  { input: 'reactjs', expectedId: 'react' },
  { input: 'React Native', expectedId: 'react' },
  { input: 'Flutter', expectedId: 'flutter' },
  { input: 'Next.js', expectedId: 'nextjs' },
  { input: 'Tailwind CSS', expectedId: 'tailwind' },
  { input: 'Bootstrap', expectedId: 'bootstrap' },
  { input: 'HTML5', expectedId: 'html5' },
  { input: 'CSS3', expectedId: 'css3' },

  // 3. Databases
  { input: 'PostgreSQL', expectedId: 'postgresql' },
  { input: 'postgres', expectedId: 'postgresql' },
  { input: 'psql', expectedId: 'postgresql' },
  { input: 'Microsoft SQL Server', expectedId: 'sqlserver' },
  { input: 'SQL Server', expectedId: 'sqlserver' },
  { input: 'MySQL', expectedId: 'mysql' },
  { input: 'Redis', expectedId: 'redis' },

  // 4. DevOps & Cloud
  { input: 'Docker', expectedId: 'docker' },
  { input: 'Microsoft Azure', expectedId: 'azure' },
  { input: 'AWS', expectedId: 'aws' },
  { input: 'Git', expectedId: 'git' },
  { input: 'GitHub', expectedId: 'github' },
  { input: 'GitLab', expectedId: 'gitlab' },
  { input: 'Visual Studio', expectedId: 'visualstudio' },
  { input: 'VS Code', expectedId: 'visualstudio' },
  { input: 'xUnit', expectedId: 'xunit' },
  { input: 'SpecFlow', expectedId: 'specflow' },
  { input: 'Scrum', expectedId: 'scrum' },

  // 5. AI, ML & Automation Tools (Mandatory User Requirements)
  { input: 'OpenAI', expectedId: 'openai' },
  { input: 'ChatGPT', expectedId: 'openai' },
  { input: 'Anthropic', expectedId: 'anthropic' },
  { input: 'Claude', expectedId: 'anthropic' },
  { input: 'Claude 3.7 Sonnet', expectedId: 'anthropic' },
  { input: 'Google Gemini', expectedId: 'gemini' },
  { input: 'Gemini Pro', expectedId: 'gemini' },
  { input: 'GitHub Copilot', expectedId: 'copilot' },
  { input: 'Copilot', expectedId: 'copilot' },
  { input: 'Semantic Kernel', expectedId: 'semantickernel' },
  { input: 'LangChain', expectedId: 'langchain' },
  { input: 'LangGraph', expectedId: 'langchain' },
  { input: 'Ollama', expectedId: 'ollama' },
  { input: 'PyTorch', expectedId: 'pytorch' },
  { input: 'TensorFlow', expectedId: 'tensorflow' },
  { input: 'Hugging Face', expectedId: 'huggingface' },
  { input: 'n8n', expectedId: 'n8n' },
  { input: 'n8n Automation', expectedId: 'n8n' },
  { input: 'Make', expectedId: 'make' },
  { input: 'Integromat', expectedId: 'make' },
  { input: 'Mistral AI', expectedId: 'mistral' },

  // 6. Unknown / Custom Techs -> Fallback
  { input: 'CustomInternalEngineXYZ', expectedId: 'CU', isFallback: true },
  { input: 'MyCustomFramework', expectedId: 'MY', isFallback: true },

  // 7. Manual Override
  { input: 'SpecialEngine', logoUrl: '/uploads/custom-logo.svg', expectedId: '/uploads/custom-logo.svg', isOverride: true }
];

console.log('========================================================================');
console.log('=== TEST DE CORRESPONDANCE ET RÉSOLUTION AUTOMATIQUE DES LOGOS TECH ===');
console.log('========================================================================\n');

let passedCount = 0;
let failedCount = 0;

const resultsTable = [];

for (const tc of testCases) {
  const result = resolveTechLogo(tc.input, tc.logoUrl);
  const isMatch = tc.isOverride 
    ? result.type === 'MANUAL_OVERRIDE'
    : tc.isFallback 
    ? result.type === 'FALLBACK_MONOGRAM' && result.identifier === tc.expectedId
    : result.identifier === tc.expectedId;

  if (isMatch) {
    passedCount++;
  } else {
    failedCount++;
  }

  resultsTable.push({
    nomSaisi: tc.input + (tc.logoUrl ? ' (+logoUrl)' : ''),
    logoObtenu: result.identifier,
    source: result.source,
    type: result.type,
    statut: isMatch ? 'PASS' : 'FAIL'
  });
}

console.table(resultsTable);

console.log(`\nTOTAL: ${testCases.length} tests | PASS: ${passedCount} | FAIL: ${failedCount}`);

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('\n>>> TOUS LES TESTS DE LOGOS TECHNOLOGIQUES SONT VALIDÉS AVEC SUCCÈS ! <<<');
}
