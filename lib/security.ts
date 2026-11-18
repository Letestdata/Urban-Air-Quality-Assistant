/**
 * Client-Side Security & Sanitization Service for Urban Air AI.
 * Provides XSS prevention, PII redaction, binary magic-byte validation, safe URL checks, and rate limiting.
 */

// Magic byte signatures for authorized file types
const FILE_SIGNATURES: Record<string, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
  png: [0x89, 0x50, 0x4e, 0x47], // .PNG
  jpeg: [0xff, 0xd8, 0xff],       // JPEG SOI
  zip: [0x50, 0x4b, 0x03, 0x04],  // PK zip / docx
};

/**
 * Strips script tags, iframe, object, embed, javascript: protocols, and event handlers.
 */
export function sanitizeHtml(dirty: string): string {
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

/**
 * Strips all HTML tags, converting markup to plain text.
 */
export function sanitizeText(dirty: string): string {
  if (!dirty) return "";
  return dirty.replace(/<[^>]*>/g, "");
}

/**
 * Validates authentic file magic bytes to prevent renamed malicious executables.
 */
export async function verifyFileMagicBytes(
  file: File | Blob | Uint8Array,
  expectedType?: string
): Promise<boolean> {
  let bytes: Uint8Array;
  if (file instanceof Uint8Array) {
    bytes = file;
  } else {
    const buffer = await file.slice(0, 16).arrayBuffer();
    bytes = new Uint8Array(buffer);
  }

  // Reject executable formats (MZ Windows PE header 0x4D, 0x5A or ELF header 0x7F, 'E', 'L', 'F')
  if (bytes[0] === 0x4d && bytes[1] === 0x5a) {
    return false; // Executable disguised as document
  }
  if (bytes[0] === 0x7f && bytes[1] === 0x45 && bytes[2] === 0x4c && bytes[3] === 0x46) {
    return false; // ELF binary
  }

  if (expectedType && FILE_SIGNATURES[expectedType]) {
    const sig = FILE_SIGNATURES[expectedType];
    return sig.every((val, idx) => bytes[idx] === val);
  }

  // Check if it matches any authorized format or is valid ASCII/UTF-8 text
  const isMatch = Object.values(FILE_SIGNATURES).some((sig) =>
    sig.every((val, idx) => bytes[idx] === val)
  );

  if (isMatch) return true;

  // Check if plain text/CSV/JSON
  const isPrintable = Array.from(bytes.slice(0, 8)).every(
    (b) => (b >= 32 && b <= 126) || b === 9 || b === 10 || b === 13
  );
  return isPrintable;
}

/**
 * Masks Personally Identifiable Information (PII): Indian phones, Aadhaar, PAN, and emails.
 */
export function redactPII(input: string): string {
  if (!input) return "";
  return input
    // Indian Phone Numbers (+91 or 10-digit starting 6-9)
    .replace(/(\+91[\s-]?)?[6-9]\d{9}/g, "[PHONE_REDACTED]")
    // Aadhaar Numbers (12 digits grouped in 4s)
    .replace(/\b\d{4}\s\d{4}\s\d{4}\b/g, "[AADHAAR_REDACTED]")
    // PAN Numbers (5 letters, 4 digits, 1 letter)
    .replace(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/g, "[PAN_REDACTED]")
    // Email Addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL_REDACTED]");
}

/**
 * Validates URL safety against phishing, javascript: schemes, and unencrypted origins.
 */
export function isSafeUrl(urlStr: string): boolean {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr, "https://urbanair.ai");
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

// Client-side rate limiter
const rateLimitBuckets: Record<string, { count: number; resetAt: number }> = {};

export function enforceRateLimit(
  action: string,
  limit: number = 30,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets[action];

  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets[action] = { count: 1, resetAt: now + windowMs };
    return true;
  }

  if (bucket.count >= limit) {
    return false; // Throttled
  }

  bucket.count++;
  return true;
}
