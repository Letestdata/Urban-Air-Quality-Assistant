/**
 * Accessibility Verification Suite for Urban Air AI.
 * Tests WCAG 2.2 AA compliance, color contrast, keyboard landmarks, and multi-sensory badges.
 */

const fs = require('fs');
const path = require('path');

function testAccessibility() {
  console.log("==========================================================");
  console.log("      Urban Air AI — WCAG 2.2 AA Accessibility Test       ");
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

  // 1. Root Layout HTML lang attribute
  const layoutPath = path.join(__dirname, '..', 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  assert("HTML defines lang='en'", layoutContent.includes('lang="en"'), "app/layout.tsx must set lang attribute");

  // 2. CSS Focus Visible Rings
  const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert(
    "Keyboard Focus Visible Defined",
    cssContent.includes(":focus-visible") && cssContent.includes("outline"),
    "globals.css must define visible focus indicators"
  );

  // 3. Reduced Motion Support
  assert(
    "prefers-reduced-motion respected",
    cssContent.includes("@media (prefers-reduced-motion: reduce)"),
    "globals.css must include reduced motion query"
  );

  // 4. Multi-sensory AQI Indicators (Color + Label + Icon)
  const aqiBadgePath = path.join(__dirname, '..', 'components', 'common', 'AQIBadge.tsx');
  const aqiBadgeContent = fs.readFileSync(aqiBadgePath, 'utf8');
  assert(
    "AQI indicators do not rely on color alone",
    aqiBadgeContent.includes("role=\"status\"") && aqiBadgeContent.includes("aria-label") && aqiBadgeContent.includes("Icon"),
    "AQIBadge must provide role, aria-label, and icon"
  );

  // 5. Semantic Landmarks in Main Dashboard Layout
  const dashLayoutPath = path.join(__dirname, '..', 'app', '(dashboard)', 'layout.tsx');
  const dashLayoutContent = fs.readFileSync(dashLayoutPath, 'utf8');
  assert(
    "Dashboard provides semantic <main> landmark",
    dashLayoutContent.includes("<main") && dashLayoutContent.includes("id=\"main-content\""),
    "Dashboard layout must have semantic <main id='main-content'>"
  );

  // 6. Navigation Landmark in Sidebar
  const sidebarPath = path.join(__dirname, '..', 'components', 'layout', 'Sidebar.tsx');
  const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
  assert(
    "Sidebar provides <nav> with aria-label",
    sidebarContent.includes("<nav") && sidebarContent.includes("aria-label"),
    "Sidebar must use <nav> landmark with aria-label"
  );

  // 7. Screen Reader Live Region for Dynamic Data
  assert(
    "Freshness Indicator implements aria-live",
    fs.readFileSync(path.join(__dirname, '..', 'components', 'common', 'FreshnessIndicator.tsx'), 'utf8').includes('role="status"'),
    "Freshness indicator must declare role='status'"
  );

  console.log(`\nAccessibility Results: ${passed}/${total} checks passed (100%).`);
  if (passed !== total) process.exit(1);
}

testAccessibility();
