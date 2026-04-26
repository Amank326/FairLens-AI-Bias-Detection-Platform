const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const jobQueueService = require('../services/jobQueueService');
const cacheService = require('../services/cacheService');

/**
 * 1. Rate Limiting Middleware (Prevent Abuse/DDoS)
 * Allows ~20 requests per IP per 15 minutes.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: { error: 'Too many analysis requests from this IP. Please try again later.' },
  standardHeaders: true, 
});

/**
 * 2. File Handling Middleware (Not Memory, streams to disk)
 * To process pure CSVs securely.
 */
const upload = multer({ 
  dest: 'uploads/', 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * @route POST /v2/analyze
 * @description Advanced ASYNC analysis triggering Enclave & Gemini
 */
router.post('/analyze', apiLimiter, async (req, res) => {
  try {
    const { datasetSummary, metrics } = req.body;

    if (!datasetSummary || !metrics) {
      return res.status(400).json({ error: "Missing dataset structure." });
    }

    // Generate Hash for Dataset Signature (Caching Layer)
    const dataHash = cacheService.generateHash(datasetSummary, metrics);

    // Check Cache before running AI
    const cachedResult = cacheService.get(dataHash);
    if (cachedResult) {
      console.log(`⚡ Delivering Cached Result for hash: ${dataHash.slice(0,8)}`);
      return res.status(200).json({
        jobId: null,
        status: 'completed',
        cached: true,
        data: cachedResult
      });
    }

    // Submit Job to Asynchronous Background Processing
    const jobId = jobQueueService.createJob(datasetSummary, metrics, dataHash, cacheService);

    // Return the tracking ID immediately (Highly Scalable)
    return res.status(202).json({
      jobId,
      status: 'pending',
      message: 'Job submitted to processing queue. Poll /v2/status/:jobId for updates.'
    });

  } catch (error) {
    console.error("Queue Dispatch Error:", error.message);
    return res.status(500).json({ error: "Failed to queue analysis job." });
  }
});

/**
 * @route GET /v2/status/:jobId
 * @description Polling endpoint for the Frontend to retrieve results
 */
router.get('/status/:jobId', (req, res) => {
  const job = jobQueueService.getJob(req.params.jobId);

  if (!job) {
    return res.status(404).json({ error: "Job ID not found or expired." });
  }

  return res.status(200).json(job);
});

module.exports = router;