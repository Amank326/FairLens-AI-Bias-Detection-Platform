// ===== GEMINI API INTEGRATION (Proxied through backend) =====
// FairLens — AI Bias Detection Platform

async function getGeminiBiasAnalysis(datasetSummary, metrics) {
  try {
    // Calling the production Node.js backend POST /analyze
    const response = await fetch('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datasetSummary, metrics })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Server error or invalid key. Ensure backend connection is running.');
    }

    return await response.json();
  } catch (error) {
    console.error("Live Analysis Error:", error);
    // Explicit throw to trigger the error handling in app.js
    throw new Error(error.message);
  }
}
