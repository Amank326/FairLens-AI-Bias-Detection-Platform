const crypto = require('crypto');
const { analyzeDatasetWithGemini } = require('./geminiService');

/**
 * Async Job Queue System
 * Simulating BullMQ or AWS SQS with an in-memory queue.
 * Allows POST /analyze to return immediately and process tasks offline.
 */
class JobQueueService {
  constructor() {
    this.jobs = new Map(); // Store status locally
  }

  createJob(datasetSummary, metrics, cacheHash, cacheService) {
    const jobId = crypto.randomUUID();
    
    // Add job to memory tracking loop
    this.jobs.set(jobId, {
      status: 'pending',
      createdAt: Date.now(),
      progress: 0,
      result: null,
      error: null
    });

    // Start background execution asynchronously (without blocking request)
    this.processJob(jobId, datasetSummary, metrics, cacheHash, cacheService).catch(err => {
      console.error(`[BACKGROUND JOB FAILED] Job: ${jobId} Engine Error:`, err);
    });

    return jobId;
  }

  async processJob(jobId, datasetSummary, metrics, cacheHash, cacheService) {
    const job = this.jobs.get(jobId);
    
    try {
      // 1. Mark as processing
      job.status = 'processing';
      job.progress = 25;
      
      console.log(`⏳ Processing Job ${jobId}...`);

      // 2. Execute heavy AI evaluation (The Enclave logic can plug in here)
      const aiResult = await analyzeDatasetWithGemini(datasetSummary, metrics);
      
      job.progress = 85;

      // 3. Save into cache mapped by dataset hash
      if (cacheService && cacheHash) {
        console.log(`💾 Caching successful response under hash [${cacheHash.slice(0,8)}]`);
        cacheService.set(cacheHash, aiResult);
      }

      // 4. Mark job as complete and store output data
      job.status = 'completed';
      job.progress = 100;
      job.result = aiResult;
      
      console.log(`✅ Job ${jobId} Completed Successfully.`);

    } catch (error) {
       // Graceful Degradation / Failure Handler
       job.status = 'failed';
       job.error = error.message;
       job.progress = 0;
    }
  }

  getJob(jobId) {
    return this.jobs.get(jobId);
  }
}

module.exports = new JobQueueService();