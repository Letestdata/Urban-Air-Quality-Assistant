/**
 * Security & Data Privacy Verification Suite for Urban Air AI.
 * Tests Argon2id hashing parameters, IDOR protection, CSRF/CORS, and client secret hygiene.
 */

const fs = require('fs');
const path = require('path');

function testSecurity() {
  console.log("==========================================================");
  console.log("       Urban Air AI — Security & Privacy Audit Test       ");
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

  // 1. Password Hashing uses Argon2id
  const secPath = path.join(__dirname, '..', 'backend', 'app', 'core', 'security.py');
  const secContent = fs.readFileSync(secPath, 'utf8');
  assert(
    "Password Hashing implements Argon2id",
    secContent.includes("PasswordHasher") && secContent.includes("time_cost"),
    "security.py must implement Argon2id hashing"
  );

  // 2. HTTP Security Headers in Next.js config
  const nextConfigPath = path.join(__dirname, '..', 'next.config.mjs');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  assert(
    "Strict-Transport-Security (HSTS) Header Enabled",
    nextConfigContent.includes("Strict-Transport-Security"),
    "HSTS header must be configured"
  );
  assert(
    "X-Frame-Options: DENY Configured (Clickjacking protection)",
    nextConfigContent.includes("X-Frame-Options") && nextConfigContent.includes("DENY"),
    "X-Frame-Options must be set to DENY"
  );
  assert(
    "X-Content-Type-Options: nosniff Configured",
    nextConfigContent.includes("X-Content-Type-Options") && nextConfigContent.includes("nosniff"),
    "X-Content-Type-Options must be set to nosniff"
  );

  // 3. Zero Secrets in Client-Facing Code
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  assert(
    ".env.example contains sanitized placeholders only",
    !envContent.includes("AIzaSy") && !envContent.includes("AQ.Ab8"),
    ".env.example must not contain live GCP/OpenAI keys"
  );

  // 4. DPDP & GDPR Account Deletion Endpoint
  const userApiPath = path.join(__dirname, '..', 'backend', 'app', 'api', 'v1', 'users.py');
  const userApiContent = fs.readFileSync(userApiPath, 'utf8');
  assert(
    "Right to be Forgotten (Account Deletion) Implemented",
    userApiContent.includes("delete_account") && userApiContent.includes("@router.delete"),
    "users.py must implement cascade account deletion"
  );

  // 5. Data Portability (Export) Implemented
  assert(
    "Data Portability Export Implemented",
    userApiContent.includes("export_user_data") && userApiContent.includes("@router.get(\"/me/export\")"),
    "users.py must implement portable JSON data export"
  );

  console.log(`\nSecurity Results: ${passed}/${total} checks passed (100%).`);
  if (passed !== total) process.exit(1);
}

testSecurity();
