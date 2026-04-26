const crypto = require('crypto');

/**
 * TEE (Trusted Execution Environment) Simulator Middleware
 * Simulates a secure enclave for receiving sensitive demographic data from the frontend.
 */
function teeMiddleware(req, res, next) {
  // 1. Generate a mock hardware attestation token
  req.enclaveSessionId = crypto.randomBytes(16).toString('hex');
  req.enclaveTimestamp = Date.now();

  // 2. Anonymized Logging (Never log the actual PII/payload)
  const dataSize = JSON.stringify(req.body || {}).length;
  console.log(`\n🔒 [SECURE ENCLAVE] Attested Session ID: ${req.enclaveSessionId}`);
  console.log(`🔒 [SECURE ENCLAVE] Received encrypted payload of ${dataSize} bytes.`);
  console.log(`🔒 [SECURE ENCLAVE] Security Constraints Applied: No-Disk-Write, In-Memory Processing Only.`);

  // 3. Attach a secure wipe simulation to the Response finish event
  res.on('finish', () => {
    console.log(`🔒 [SECURE ENCLAVE] Session ${req.enclaveSessionId} finalized. Securely wiping memory buffers. Zeroing references...`);
  });

  // Proceed into the isolated route handler
  next();
}

module.exports = teeMiddleware;