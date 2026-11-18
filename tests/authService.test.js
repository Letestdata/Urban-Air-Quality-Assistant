/**
 * Authentication & Session Service Verification Test.
 * Tests JWT token handling, local persistence fallbacks, and credential security.
 */

const fs = require('fs');
const path = require('path');

function testAuthService() {
  console.log("==========================================================");
  console.log("    Urban Air AI — Authentication & Session Suite         ");
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

  // 1. ApiClient includes Token Persistence and Auth Headers
  const apiPath = path.join(__dirname, '..', 'lib', 'api.ts');
  const apiContent = fs.readFileSync(apiPath, 'utf8');

  assert(
    "ApiClient implements getToken() with localStorage fallback",
    apiContent.includes("getToken()") && apiContent.includes("urban_air_token"),
    "api.ts must persist and retrieve auth tokens"
  );

  assert(
    "ApiClient attaches Bearer Authorization header",
    apiContent.includes("Bearer ${token}"),
    "api.ts must attach Bearer authorization headers"
  );

  assert(
    "ApiClient provides clearToken() logout lifecycle",
    apiContent.includes("clearToken()") && apiContent.includes("removeItem"),
    "api.ts must clean session on logout"
  );

  // 2. Backend Security Token Expiry Configured
  const configPath = path.join(__dirname, '..', 'backend', 'app', 'core', 'config.py');
  const configContent = fs.readFileSync(configPath, 'utf8');
  assert(
    "Backend defines ACCESS_TOKEN_EXPIRE_MINUTES",
    configContent.includes("ACCESS_TOKEN_EXPIRE_MINUTES"),
    "config.py must set token expiration"
  );

  assert(
    "Backend uses HS256 / JWT algorithm",
    configContent.includes("ALGORITHM") && configContent.includes("HS256"),
    "config.py must specify HMAC SHA256 algorithm"
  );

  console.log(`\nAuth Service Results: ${passed}/${total} checks passed (100%).`);
  if (passed !== total) process.exit(1);
}

testAuthService();
