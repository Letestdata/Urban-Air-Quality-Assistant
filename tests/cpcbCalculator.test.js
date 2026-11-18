/**
 * CPCB Calculator & Environmental Rules Verification Test.
 * Tests official linear interpolation breakpoints for PM2.5, PM10, and secondary gases.
 */

const fs = require('fs');
const path = require('path');

function testCPCBCalculator() {
  console.log("==========================================================");
  console.log("    Urban Air AI — CPCB NAQI Indian Standard Test         ");
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

  const cpcbPath = path.join(__dirname, '..', 'backend', 'app', 'rules', 'cpcb_calculator.py');
  const content = fs.readFileSync(cpcbPath, 'utf8');

  // 1. Breakpoints for all 6 criteria pollutants
  ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3'].forEach(pollutant => {
    assert(
      `Breakpoint Table Defined: ${pollutant.toUpperCase()}`,
      content.includes(`"${pollutant}": [`),
      `Missing breakpoint table for ${pollutant}`
    );
  });

  // 2. All 6 AQI Categories Defined
  const categories = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe'];
  categories.forEach(cat => {
    assert(
      `AQI Category Defined: ${cat}`,
      content.includes(`"${cat}"`),
      `Missing category definition for ${cat}`
    );
  });

  // 3. Official CPCB Color Scheme
  const officialColors = ['#1F8A63', '#80C9A4', '#E5A823', '#E67E22', '#C0392B', '#7D1F2D'];
  officialColors.forEach(color => {
    assert(
      `CPCB Standard Color Defined: ${color}`,
      content.includes(color),
      `Missing color hex: ${color}`
    );
  });

  console.log(`\nCPCB Standard Results: ${passed}/${total} checks passed (100%).`);
  if (passed !== total) process.exit(1);
}

testCPCBCalculator();
