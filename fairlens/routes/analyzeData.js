const express = require('express');
const router = express.Router();
const { analyzeDatasetWithGemini } = require('../services/geminiService');
const { processInSecureEnclave } = require('../services/secureProcessingService');
const teeMiddleware = require('../middlewares/teeMiddleware');

/**
 * @route POST /analyze
 * @description Securely analyzes dataset summary inside a simulated TEE Enclave
 */
router.post('/analyze', teeMiddleware, async (req, res) => {
  try {
    const payload = req.body;

    // 1. Validation Error Handling inside enclave
    if (!payload.datasetSummary || !payload.metrics) {
      return res.status(400).json({ error: "Missing datasetData inside secure payload." });
    }

    // 2. Call the TEE Secure Processing Service
    const aiResult = await processInSecureEnclave(payload, async (secureData) => {
      // Sensitive variables (`secureData`) are only accessible inside this isolated callback
      return await analyzeDatasetWithGemini(secureData.datasetSummary, secureData.metrics);
    });

    // 3. Return JSON response
    return res.status(200).json(aiResult);

  } catch (error) {
    console.error("Gemini API / Security Error:", error.message);
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({ error: "Ensure backend connection is running with the GEMINI_API_KEY set." });
    }
    
    return res.status(500).json({ error: error.message || "Secure enclave analysis failed." });
  }
});

module.exports = router;