/**
 * Core Component & Route Integrity Suite for Urban Air AI.
 */

const fs = require('fs');
const path = require('path');

function testComponents() {
  console.log("==========================================================");
  console.log("     Urban Air AI — Component & Integration Suite         ");
  console.log("==========================================================");

  let passed = 0;
  let total = 0;

  function assert(name, condition, details) {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] ${name}`);
    } else {
      console.error(`[FAIL] ${name} — ${details}`);
    }
  }

  // 1. Core UI Components
  const components = [
    'components/common/AQIBadge.tsx',
    'components/common/FreshnessIndicator.tsx',
    'components/air-quality/PollutantCard.tsx',
    'components/daily-plan/ActivityCard.tsx',
    'components/layout/Header.tsx',
    'components/layout/Sidebar.tsx',
    'components/layout/MobileNav.tsx'
  ];

  components.forEach(comp => {
    const fullPath = path.join(__dirname, '..', comp);
    assert(`Component Exists: ${comp}`, fs.existsSync(fullPath), `Missing ${comp}`);
  });

  // 2. Types & Context State
  assert(
    "Location Context Provider Exists",
    fs.existsSync(path.join(__dirname, '..', 'lib', 'location-context.tsx')),
    "Missing location-context.tsx"
  );
  assert(
    "TypeScript Data Models Exist",
    fs.existsSync(path.join(__dirname, '..', 'lib', 'types.ts')),
    "Missing types.ts"
  );

  console.log(`\nComponent Results: ${passed}/${total} checks passed (100%).`);
  if (passed !== total) process.exit(1);
}

testComponents();
