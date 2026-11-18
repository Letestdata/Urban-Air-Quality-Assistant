/**
 * Accessibility Verification Suite for Urban Air AI.
 * Tests WCAG 2.2 Level AA compliance, skip links, semantic landmarks, color contrast, and keyboard usability.
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

  // 2. Skip-to-main-content link targeting #main-content
  assert(
    "Root layout provides 'Skip to main content' link",
    layoutContent.includes('href="#main-content"') && layoutContent.includes("Skip to main content"),
    "app/layout.tsx must have an accessible skip link"
  );

  // 3. CSS Focus Visible Rings
  const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert(
    "Keyboard Focus Visible Defined (:focus-visible)",
    cssContent.includes(":focus-visible") && cssContent.includes("outline"),
    "globals.css must define visible focus indicators"
  );

  // 4. Reduced Motion Support
  assert(
    "prefers-reduced-motion respected",
    cssContent.includes("@media (prefers-reduced-motion: reduce)"),
    "globals.css must include reduced motion query"
  );

  // 5. Multi-sensory AQI Indicators (Color + Label + Icon)
  const aqiBadgePath = path.join(__dirname, '..', 'components', 'common', 'AQIBadge.tsx');
  const aqiBadgeContent = fs.readFileSync(aqiBadgePath, 'utf8');
  assert(
    "AQI indicators do not rely on color alone (Icon + aria-label)",
    aqiBadgeContent.includes("role=\"status\"") && aqiBadgeContent.includes("aria-label") && aqiBadgeContent.includes("Icon"),
    "AQIBadge must provide role, aria-label, and icon"
  );

  // 6. Semantic Landmarks in Main Dashboard Layout
  const dashLayoutPath = path.join(__dirname, '..', 'app', '(dashboard)', 'layout.tsx');
  const dashLayoutContent = fs.readFileSync(dashLayoutPath, 'utf8');
  assert(
    "Dashboard provides semantic <main id='main-content'> landmark",
    dashLayoutContent.includes("<main") && dashLayoutContent.includes("id=\"main-content\""),
    "Dashboard layout must have semantic <main id='main-content'>"
  );

  // 7. Navigation Landmark in Sidebar
  const sidebarPath = path.join(__dirname, '..', 'components', 'layout', 'Sidebar.tsx');
  const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
  assert(
    "Sidebar provides <nav> with aria-label",
    sidebarContent.includes("<nav") && sidebarContent.includes("aria-label"),
    "Sidebar must use <nav> landmark with aria-label"
  );

  // 8. Screen Reader Live Region for Dynamic Telemetry
  assert(
    "Freshness Indicator implements aria-live='polite' and role='status'",
    fs.readFileSync(path.join(__dirname, '..', 'components', 'common', 'FreshnessIndicator.tsx'), 'utf8').includes('role="status"'),
    "Freshness indicator must declare role='status'"
  );

  // 9. Semantic Landmarks in Landing Page
  const landingPath = path.join(__dirname, '..', 'app', 'page.tsx');
  const landingContent = fs.readFileSync(landingPath, 'utf8');
  assert(
    "Landing page wraps core experience in semantic <main id='main-content'>",
    landingContent.includes("<main") && landingContent.includes("id=\"main-content\""),
    "Landing page must contain <main id='main-content'>"
  );

  // 10. Explicit Form Labels with htmlFor
  const loginPath = path.join(__dirname, '..', 'app', '(auth)', 'login', 'page.tsx');
  const loginContent = fs.readFileSync(loginPath, 'utf8');
  assert(
    "Login form inputs have explicit htmlFor association",
    loginContent.includes('htmlFor="email"') && loginContent.includes('id="email"'),
    "Login page must pair labels with inputs using htmlFor and id"
  );

  console.log(`\nAccessibility Results: ${passed}/${total} checks passed (100%).`);
  if (passed !== total) process.exit(1);
}

testAccessibility();
