const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service to call Gemini AI to detect fairness and bias issues.
 * Uses only statistical summaries to avoid uploading entire large datasets,
 * saving tokens and preserving privacy.
 */
async function analyzeDatasetWithGemini(datasetSummary, metrics) {
  // Ensure API key is configured
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Server missing GEMINI_API_KEY environment variable.');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Use a supported model (gemini-pro is deprecated/unsupported in this API version)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const prompt = `
You are FairLens, an advanced AI system specialized in AI ethics, fairness, and detecting bias in datasets.
Below is an aggregated statistical summary of a dataset and its calculated fairness metrics.

DATASET STATISTICS:
${JSON.stringify(datasetSummary, null, 2)}

CALCULATED FAIRNESS METRICS:
${JSON.stringify(metrics, null, 2)}

Your task is to analyze these statistics and perform a comprehensive bias audit.

Return a STRICT JSON object in EXACTLY this format (do not include markdown \`\`\`json wrappers):
{
  "overall_assessment": "2-3 sentence clear summary of the bias reality in this data",
  "bias_types_detected": ["list", "of", "potential", "bias types (e.g. Statistical Parity Bias)"],
  "severity": "Critical | High | Moderate | Low",
  "key_findings": [
    {
      "finding": "Specific finding from the data distributions",
      "impact": "High | Medium | Low"
    }
  ],
  "root_causes": ["Possible real-world root causes reflecting these numbers"],
  "recommendations": [
    {
      "title": "Actionable technical or procedural fix",
      "description": "Detailed explanation of what developers/data scientists should do",
      "priority": "high | medium | low",
      "icon": "🛡️"
    }
  ],
  "ethical_risks": "Brief description of real-world harms if this biased data is used to train AI models",
  "fair_score_justification": "Why the dataset received this level of disparate impact/statistical parity parity"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // Strip markdown JSON notation if the AI included it
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

  return JSON.parse(text);
}

module.exports = { analyzeDatasetWithGemini };