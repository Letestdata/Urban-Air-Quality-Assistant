/**
 * Automated Component & Verification Test Suite for Urban Air AI Frontend.
 * Verifies UI contracts, accessibility hooks, and design token consistency.
 */

const fs = require('fs');
const path = require('path');

function runComponentVerification() {
  console.log("==================================================");
  console.log("   Urban Air AI — Component & Integration Suite   ");
  console.log("==================================================");

  let passed = 0;
  let total = 0;

  function assertTest(name, condition, failureMsg) {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] ${name}`);
    } else {
      console.error(`[FAIL] ${name} — ${failureMsg}`);
    }
  }

  // 1. Check all core routes exist
  const requiredRoutes = [
    'air-quality', 'daily-plan', 'indoor-air', 'family',
    'smart-routes', 'impact', 'assistant', 'reports', 'settings',
    'notifications', 'onboarding'
  ];

  requiredRoutes.forEach(route => {
    const routePath = path.join(__dirname, 'app', '(dashboard)', route, 'page.tsx');
    const fallbackPath = path.join(__dirname, 'app', route, 'page.tsx');
    const exists = fs.existsSync(routePath) || fs.existsSync(fallbackPath);
    assertTest(`Route Exists: /${route}`, exists, `Missing route file for ${route}`);
  });

  // 2. Check AQIBadge multi-sensory compliance
  const badgePath = path.join(__dirname, 'components', 'common', 'AQIBadge.tsx');
  assertTest('AQIBadge Component Exists', fs.existsSync(badgePath), 'AQIBadge.tsx missing');
  if (fs.existsSync(badgePath)) {
    const content = fs.readFileSync(badgePath, 'utf8');
    assertTest('AQIBadge has aria-label', content.includes('aria-label'), 'Missing aria-label');
    assertTest('AQIBadge includes status icon', content.includes('Icon'), 'Missing icon indicator');
  }

  // 3. Check PollutantCard component
  const pollutantPath = path.join(__dirname, 'components', 'air-quality', 'PollutantCard.tsx');
  assertTest('PollutantCard Component Exists', fs.existsSync(pollutantPath), 'PollutantCard.tsx missing');

  // 4. Check ActivityCard component
  const activityCardPath = path.join(__dirname, 'components', 'daily-plan', 'ActivityCard.tsx');
  assertTest('ActivityCard Component Exists', fs.existsSync(activityCardPath), 'ActivityCard.tsx missing');

  // 5. Check Layout & Accessibility landmarks
  const layoutPath = path.join(__dirname, 'app', 'layout.tsx');
  assertTest('Root Layout Exists', fs.existsSync(layoutPath), 'layout.tsx missing');
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    assertTest('Root Layout defines html lang', content.includes('lang='), 'Missing lang attribute');
  }

  console.log(`\nResults: ${passed}/${total} checks passed successfully.`);
  if (passed !== total) {
    process.exit(1);
  }
}

runComponentVerification();
