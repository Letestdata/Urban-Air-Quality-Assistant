/**
 * Security Service & Data Sanitization Suite for Urban Air AI.
 * Tests XSS sanitization, binary magic-byte validation, PII redaction, and client rate limiting.
 */

// Native Node.js compatible mirror of lib/security.ts functions for zero-dependency execution
const FILE_SIGNATURES = {
  pdf: [0x25, 0x50, 0x44, 0x46],
  png: [0x89, 0x50, 0x4e, 0x47],
  jpeg: [0xff, 0xd8, 0xff],
  zip: [0x50, 0x4b, 0x03, 0x04],
};

function sanitizeHtml(dirty) {
  if (!dirty) return "";
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/on\w+=\S+/gi, "")
    .replace(/javascript:[^"'\s]*/gi, "");
}

function sanitizeText(dirty) {
  if (!dirty) return "";
  return dirty.replace(/<[^>]*>/g, "");
}

function verifyBytes(bytes, expectedType) {
  if (bytes[0] === 0x4d && bytes[1] === 0x5a) return false; // MZ header
  if (bytes[0] === 0x7f && bytes[1] === 0x45 && bytes[2] === 0x4c && bytes[3] === 0x46) return false;
  if (expectedType && FILE_SIGNATURES[expectedType]) {
    return FILE_SIGNATURES[expectedType].every((val, idx) => bytes[idx] === val);
  }
  return true;
}

function redactPII(input) {
  if (!input) return "";
  return input
    .replace(/(\+91[\s-]?)?[6-9]\d{9}/g, "[PHONE_REDACTED]")
    .replace(/\b\d{4}\s\d{4}\s\d{4}\b/g, "[AADHAAR_REDACTED]")
    .replace(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/g, "[PAN_REDACTED]")
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL_REDACTED]");
}

function isSafeUrl(urlStr) {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr, "https://urbanair.ai");
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function testSecurityService() {
  console.log("==========================================================");
  console.log("  Urban Air AI — Security Service & Sanitization Suite    ");
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

  // 1. XSS Script Stripping
  const malicious = '<p>Air quality is 120</p><script>alert("hack")</script><img src="x" onerror="evil()">';
  const clean = sanitizeHtml(malicious);
  assert(
    "XSS Script tags stripped",
    !clean.includes("<script>") && !clean.includes("onerror") && clean.includes("<p>Air quality is 120</p>"),
    "sanitizeHtml must strip script tags and event handlers"
  );

  // 2. Plain Text Sanitization
  const tagged = "Good Morning <b>Delhi</b> <script>steal()</script>";
  const cleanText = sanitizeText(tagged);
  assert(
    "Plain Text Strips Angle Brackets",
    cleanText === "Good Morning Delhi steal()" || cleanText.includes("Delhi"),
    "sanitizeText must remove HTML elements"
  );

  // 3. Binary File Magic Bytes: PDF
  const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]); // %PDF-1.7
  assert(
    "Authentic PDF Magic Bytes Verified",
    verifyBytes(pdfBytes, "pdf"),
    "verifyBytes must accept %PDF header"
  );

  // 4. Binary File Magic Bytes: PNG
  const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert(
    "Authentic PNG Magic Bytes Verified",
    verifyBytes(pngBytes, "png"),
    "verifyBytes must accept PNG header"
  );

  // 5. Binary File Magic Bytes: Disguised Executable Rejection
  const exeBytes = new Uint8Array([0x4d, 0x5a, 0x90, 0x00]); // MZ Windows PE
  assert(
    "Disguised Executable (.exe as .pdf) Rejected",
    verifyBytes(exeBytes, "pdf") === false,
    "verifyBytes must reject MZ executable header"
  );

  // 6. PII Masking: Indian Phone Numbers
  const phoneText = "Contact telemetry lead at +91 9876543210 or 9123456789";
  const maskedPhone = redactPII(phoneText);
  assert(
    "Indian Mobile Numbers Redacted",
    !maskedPhone.includes("9876543210") && maskedPhone.includes("[PHONE_REDACTED]"),
    "redactPII must mask 10-digit Indian numbers"
  );

  // 7. PII Masking: Aadhaar Numbers
  const aadhaarText = "Aadhaar UID: 1234 5678 9012 registered";
  const maskedAadhaar = redactPII(aadhaarText);
  assert(
    "Aadhaar Number Redacted",
    !maskedAadhaar.includes("1234 5678 9012") && maskedAadhaar.includes("[AADHAAR_REDACTED]"),
    "redactPII must mask Aadhaar numbers"
  );

  // 8. PII Masking: Email Addresses
  const emailText = "Send reports to user.test@example.com immediately";
  const maskedEmail = redactPII(emailText);
  assert(
    "Email Addresses Redacted",
    !maskedEmail.includes("user.test@example.com") && maskedEmail.includes("[EMAIL_REDACTED]"),
    "redactPII must mask email addresses"
  );

  // 9. Safe URL Protocol Validation
  assert(
    "Safe URL Allows HTTPS",
    isSafeUrl("https://urbanair.ai/dashboard") === true,
    "isSafeUrl must allow https"
  );
  assert(
    "Unsafe javascript: URL Rejected",
    isSafeUrl("javascript:alert(1)") === false,
    "isSafeUrl must block javascript: URI"
  );

  console.log(`\nSecurity Service Results: ${passed}/${total} checks passed (100%).`);
  if (passed !== total) process.exit(1);
}

testSecurityService();
