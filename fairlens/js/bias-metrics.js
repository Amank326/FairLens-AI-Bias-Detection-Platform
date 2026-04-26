// ===== BIAS METRICS ENGINE =====
// FairLens — Statistical Fairness Calculations

function calculateBiasMetrics(data, outcomeCol, sensitiveAttrs, positiveVal) {
  const results = {};

  sensitiveAttrs.forEach(attr => {
    const groups = {};

    // Group data by attribute value
    data.forEach(row => {
      const groupVal = String(row[attr] || 'Unknown').trim();
      if (!groups[groupVal]) groups[groupVal] = { total: 0, positive: 0 };
      groups[groupVal].total++;
      const outcome = String(row[outcomeCol] || '').trim();
      if (outcome === positiveVal) groups[groupVal].positive++;
    });

    // Calculate rates per group
    const groupRates = {};
    Object.keys(groups).forEach(g => {
      groupRates[g] = {
        total: groups[g].total,
        positive: groups[g].positive,
        rate: groups[g].total > 0 ? groups[g].positive / groups[g].total : 0
      };
    });

    // Find reference group (highest rate)
    const groupNames = Object.keys(groupRates);
    const rates = groupNames.map(g => groupRates[g].rate);
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);
    const refGroup = groupNames[rates.indexOf(maxRate)];

    // Disparate Impact Ratio (should be >= 0.8)
    const disparateImpact = maxRate > 0 ? minRate / maxRate : 1;

    // Statistical Parity Difference (should be close to 0)
    const statisticalParity = maxRate - minRate;

    // Overall selection rate
    const totalPositive = data.filter(r => String(r[outcomeCol]).trim() === positiveVal).length;
    const overallRate = data.length > 0 ? totalPositive / data.length : 0;

    // Bias score for this attribute (0 = no bias, 100 = extreme bias)
    const diScore = Math.max(0, Math.min(100, (1 - disparateImpact) * 100));
    const spScore = Math.max(0, Math.min(100, statisticalParity * 100));
    const attrBiasScore = Math.round((diScore + spScore) / 2);

    results[attr] = {
      groupRates,
      disparateImpact: parseFloat(disparateImpact.toFixed(4)),
      statisticalParity: parseFloat(statisticalParity.toFixed(4)),
      overallRate: parseFloat(overallRate.toFixed(4)),
      biasScore: attrBiasScore,
      referenceGroup: refGroup,
      groupNames,
      passes80Rule: disparateImpact >= 0.8,
      maxRate: parseFloat(maxRate.toFixed(4)),
      minRate: parseFloat(minRate.toFixed(4))
    };
  });

  return results;
}

function computeOverallBiasScore(metrics) {
  const scores = Object.values(metrics).map(m => m.biasScore);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function getBiasVerdict(score) {
  if (score >= 70) return { label: '🔴 Critical Bias', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
  if (score >= 45) return { label: '🟠 High Bias', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
  if (score >= 20) return { label: '🟡 Moderate Bias', color: '#eab308', bg: 'rgba(234,179,8,0.1)' };
  return { label: '🟢 Low Bias', color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
}

function getDatasetSummary(data, outcomeCol, sensitiveAttrs, positiveVal, metrics) {
  const totalRows = data.length;
  const totalPositive = data.filter(r => String(r[outcomeCol]).trim() === positiveVal).length;
  const columns = Object.keys(data[0] || {});

  const attrSummaries = {};
  sensitiveAttrs.forEach(attr => {
    const m = metrics[attr];
    attrSummaries[attr] = {
      groups: m.groupNames,
      rates: m.groupNames.map(g => ({
        group: g,
        selectionRate: m.groupRates[g].rate,
        count: m.groupRates[g].total
      })),
      disparateImpactRatio: m.disparateImpact,
      statisticalParityDifference: m.statisticalParity,
      passes80PercentRule: m.passes80Rule
    };
  });

  return {
    totalRows,
    totalColumns: columns.length,
    outcomeColumn: outcomeCol,
    positiveOutcome: positiveVal,
    overallPositiveRate: totalPositive / totalRows,
    sensitiveAttributes: sensitiveAttrs,
    attributeAnalysis: attrSummaries
  };
}
