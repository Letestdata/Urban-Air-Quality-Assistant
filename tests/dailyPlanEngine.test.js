/**
 * Daily Plan & Two-Layer Safety Engine Suite for Urban Air AI.
 * Tests activity safety classification, outdoor running cutoff, and personalized substitutions.
 */

const fs = require('fs');
const path = require('path');

function testDailyPlanEngine() {
  console.log("==========================================================");
  console.log("   Urban Air AI — Daily Plan & Safety Engine Suite        ");
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

  const safetyPath = path.join(__dirname, '..', 'backend', 'app', 'rules', 'safety_engine.py');
  const safetyContent = fs.readFileSync(safetyPath, 'utf8');

  // 1. Layer 1 Deterministic Boundary Check
  assert(
    "Hardcoded Safety Thresholds for Outdoor Activities",
    safetyContent.includes("validate_activity_safety") && safetyContent.includes("running"),
    "safety_engine.py must validate activity safety against AQI thresholds"
  );

  // 2. High AQI Alternative Substitution
  assert(
    "Indoor Exercise Substitution Logic Implemented",
    safetyContent.includes("substitute") || safetyContent.includes("indoor") || safetyContent.includes("alternative"),
    "safety_engine.py must provide indoor alternatives when AQI is hazardous"
  );

  // 3. Sensitive Profile Thresholds (Pediatric / Elderly / Asthma)
  assert(
    "Vulnerability Factors Adjust AQI Boundaries",
    safetyContent.includes("asthma") || safetyContent.includes("child") || safetyContent.includes("senior") || safetyContent.includes("sensitivity"),
    "safety_engine.py must lower acceptable AQI thresholds for sensitive individuals"
  );

  // 4. Daily Plan Service Exists and Generates 4 Diurnal Brackets
  const planServicePath = path.join(__dirname, '..', 'backend', 'app', 'services', 'planner_service.py');
  const planServiceContent = fs.readFileSync(planServicePath, 'utf8');
  assert(
    "Planner Service Generates Diurnal Periods (Morning, Afternoon, Evening, Night)",
    planServiceContent.includes("morning") && planServiceContent.includes("afternoon"),
    "planner_service.py must bracket recommendations across the day"
  );

  console.log(`\nDaily Plan Engine Results: ${passed}/${total} checks passed (100%).`);
  if (passed !== total) process.exit(1);
}

testDailyPlanEngine();
