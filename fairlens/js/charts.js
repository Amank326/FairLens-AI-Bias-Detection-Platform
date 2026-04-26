// ===== CHARTS MODULE =====
// FairLens — Chart.js Visualizations

let gaugeChart = null;
let outcomeChart = null;
let attributeChart = null;

const CHART_COLORS = [
  'rgba(99, 102, 241, 0.9)',
  'rgba(236, 72, 153, 0.9)',
  'rgba(6, 182, 212, 0.9)',
  'rgba(16, 185, 129, 0.9)',
  'rgba(245, 158, 11, 0.9)',
  'rgba(239, 68, 68, 0.9)',
  'rgba(168, 85, 247, 0.9)',
];

const CHART_DEFAULTS = {
  color: '#cbd5e1',
  font: { family: "'Plus Jakarta Sans', system-ui, sans-serif", size: 13, weight: '500' },
};

Chart.defaults.color = CHART_DEFAULTS.color;
Chart.defaults.font = CHART_DEFAULTS.font;

function renderGaugeChart(score) {
  const ctx = document.getElementById('gauge-chart').getContext('2d');
  if (gaugeChart) gaugeChart.destroy();

  const color = score >= 70 ? '#ef4444' : score >= 45 ? '#f59e0b' : score >= 20 ? '#eab308' : '#10b981';

  gaugeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: [color, 'rgba(255,255,255,0.05)'],
        borderWidth: 0,
        circumference: 180,
        rotation: -90,
        borderRadius: 4,
      }]
    },
    options: {
      cutout: '72%',
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      animation: { duration: 1200, easing: 'easeOutQuart' },
    }
  });

  const gaugeEl = document.getElementById('gauge-score');
  gaugeEl.textContent = score;
  gaugeEl.style.color = color;
}

function renderOutcomeChart(metrics, selectedAttr) {
  const ctx = document.getElementById('outcome-chart').getContext('2d');
  if (outcomeChart) outcomeChart.destroy();

  const m = metrics[selectedAttr];
  const labels = m.groupNames;
  const rates = labels.map(g => parseFloat((m.groupRates[g].rate * 100).toFixed(1)));
  const counts = labels.map(g => m.groupRates[g].total);

  outcomeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Positive Outcome Rate (%)',
          data: rates,
          backgroundColor: CHART_COLORS.slice(0, labels.length),
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'Total Count',
          data: counts,
          backgroundColor: CHART_COLORS.slice(0, labels.length).map(c => c.replace('0.8', '0.3')),
          borderRadius: 8,
          borderSkipped: false,
          yAxisID: 'y2',
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
        tooltip: {
          callbacks: {
            label: ctx => ctx.datasetIndex === 0
              ? `Selection Rate: ${ctx.raw}%`
              : `Total Records: ${ctx.raw}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { callback: v => v + '%' }
        },
        y2: {
          position: 'right',
          beginAtZero: true,
          grid: { display: false },
          ticks: { color: '#64748b' }
        },
        x: { grid: { display: false } }
      },
      animation: { duration: 1000, easing: 'easeOutQuart' }
    }
  });
}

function renderAttributeChart(metrics) {
  const ctx = document.getElementById('attribute-chart').getContext('2d');
  if (attributeChart) attributeChart.destroy();

  const attrs = Object.keys(metrics);
  const scores = attrs.map(a => metrics[a].biasScore);
  const diRatios = attrs.map(a => parseFloat((metrics[a].disparateImpact * 100).toFixed(1)));

  attributeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: attrs,
      datasets: [
        {
          label: 'Bias Score (higher = more bias)',
          data: scores,
          backgroundColor: scores.map(s =>
            s >= 70 ? 'rgba(239,68,68,0.8)' :
            s >= 45 ? 'rgba(245,158,11,0.8)' :
            s >= 20 ? 'rgba(234,179,8,0.8)' : 'rgba(16,185,129,0.8)'
          ),
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'Disparate Impact Ratio (%)',
          data: diRatios,
          backgroundColor: 'rgba(79,70,229,0.4)',
          borderRadius: 8,
          borderSkipped: false,
          type: 'line',
          yAxisID: 'y2',
          borderColor: 'rgba(79,70,229,0.8)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(79,70,229,1)',
          pointRadius: 5,
          fill: false,
          tension: 0.4,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
        annotation: {
          annotations: {
            rule80: {
              type: 'line',
              yScaleID: 'y2',
              yMin: 80, yMax: 80,
              borderColor: 'rgba(239,68,68,0.6)',
              borderWidth: 1.5,
              borderDash: [6, 4],
              label: { display: true, content: '80% Rule', position: 'end', color: '#ef4444', font: { size: 11 } }
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: 'Bias Score' },
          grid: { color: 'rgba(255,255,255,0.05)' }
        },
        y2: {
          position: 'right',
          beginAtZero: true,
          max: 120,
          title: { display: true, text: 'Disparate Impact %' },
          grid: { display: false },
          ticks: { callback: v => v + '%' }
        },
        x: { grid: { display: false } }
      },
      animation: { duration: 1000 }
    }
  });
}

function renderMetricsList(metrics, selectedAttr) {
  const m = metrics[selectedAttr];
  const container = document.getElementById('metrics-list');

  const metricItems = [
    {
      name: 'Disparate Impact Ratio',
      value: m.disparateImpact.toFixed(3),
      rawVal: m.disparateImpact,
      threshold: 0.8,
      good: m.disparateImpact >= 0.8,
      info: '≥0.8 is fair (80% rule)',
      barVal: m.disparateImpact * 100,
      barColor: m.disparateImpact >= 0.8 ? '#10b981' : '#ef4444'
    },
    {
      name: 'Statistical Parity Diff.',
      value: (m.statisticalParity * 100).toFixed(1) + '%',
      rawVal: m.statisticalParity,
      good: m.statisticalParity < 0.1,
      info: '<10% difference is fair',
      barVal: m.statisticalParity * 100,
      barColor: m.statisticalParity < 0.1 ? '#10b981' : m.statisticalParity < 0.2 ? '#f59e0b' : '#ef4444'
    },
    {
      name: 'Max Selection Rate',
      value: (m.maxRate * 100).toFixed(1) + '%',
      rawVal: m.maxRate,
      good: true,
      info: `Group: ${m.referenceGroup}`,
      barVal: m.maxRate * 100,
      barColor: '#6366f1'
    },
    {
      name: 'Min Selection Rate',
      value: (m.minRate * 100).toFixed(1) + '%',
      rawVal: m.minRate,
      good: m.minRate > 0,
      info: 'Lowest among groups',
      barVal: m.minRate * 100,
      barColor: m.minRate < 0.2 ? '#ef4444' : '#06b6d4'
    },
    {
      name: 'Overall Selection Rate',
      value: (m.overallRate * 100).toFixed(1) + '%',
      rawVal: m.overallRate,
      good: true,
      info: 'Across entire dataset',
      barVal: m.overallRate * 100,
      barColor: '#8b5cf6'
    }
  ];

  container.innerHTML = metricItems.map(item => `
    <div class="metric-row">
      <div>
        <div class="metric-name">${item.name}</div>
        <div class="metric-bar">
          <div class="metric-bar-fill" style="width:${Math.min(100, item.barVal)}%; background:${item.barColor}"></div>
        </div>
        <div style="font-size:11px; color:var(--text3); margin-top:3px">${item.info}</div>
      </div>
      <div class="metric-val" style="color:${item.good ? '#10b981' : '#ef4444'}">
        ${item.value}
      </div>
    </div>
  `).join('');
}
