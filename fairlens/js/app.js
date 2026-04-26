// ===== MAIN APP LOGIC =====
// FairLens — AI Bias Detection Platform

let parsedData = [];
let currentMetrics = {};
let currentAnalysis = null;
let fileName = '';

// ===== FILE HANDLING =====

function handleDrop(event) {
  event.preventDefault();
  document.getElementById('drop-zone').classList.remove('drag-over');
  const file = event.dataTransfer.files[0];
  if (file && file.name.endsWith('.csv')) processFile(file);
  else alert('Please upload a valid .csv file.');
}

function handleFile(event) {
  const file = event.target.files[0];
  if (file) processFile(file);
}

function processFile(file) {
  fileName = file.name;
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    complete: function(results) {
      if (results.errors.length > 0 && results.data.length === 0) {
        alert('Error parsing CSV. Please check the file format.');
        return;
      }
      parsedData = results.data;
      setupColumnConfig(results.meta.fields);
    },
    error: function() {
      alert('Failed to read file. Please try again.');
    }
  });
}

function setupColumnConfig(columns) {
  const outcomeSelect = document.getElementById('outcome-col');
  const sensitiveSelect = document.getElementById('sensitive-cols');
  const positiveSelect = document.getElementById('positive-val');

  outcomeSelect.innerHTML = columns.map(c =>
    `<option value="${c}">${c}</option>`
  ).join('');

  sensitiveSelect.innerHTML = columns.map(c =>
    `<option value="${c}">${c}</option>`
  ).join('');

  // Auto-detect common sensitive attribute names
  const sensitiveKeywords = ['gender', 'sex', 'race', 'ethnicity', 'age', 'religion', 'nationality', 'disability', 'marital'];
  Array.from(sensitiveSelect.options).forEach(opt => {
    if (sensitiveKeywords.some(kw => opt.value.toLowerCase().includes(kw))) {
      opt.selected = true;
    }
  });

  // Auto-detect outcome column
  const outcomeKeywords = ['hired', 'approved', 'accepted', 'outcome', 'result', 'label', 'target', 'decision', 'status', 'pass'];
  const outcomeMatch = columns.find(c => outcomeKeywords.some(kw => c.toLowerCase().includes(kw)));
  if (outcomeMatch) outcomeSelect.value = outcomeMatch;

  // Listen for outcome change to update positive values
  outcomeSelect.removeEventListener('change', updatePositiveValues);
  outcomeSelect.addEventListener('change', updatePositiveValues);
  updatePositiveValues();

  document.getElementById('file-info').innerHTML =
    `✅ <strong>${fileName}</strong> loaded — ${parsedData.length.toLocaleString()} rows, ${columns.length} columns detected.`;

  document.getElementById('column-config').style.display = 'block';
  document.getElementById('column-config').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updatePositiveValues() {
  const outcomeCol = document.getElementById('outcome-col').value;
  const positiveSelect = document.getElementById('positive-val');
  
  // Use a Set and an EARLY EXIT to gather unique values.
  // This completely removes lag because it stops checking once it finds the main categories (max 25).
  // Outcome columns usually only have 2 or 3 values (0/1, yes/no, approved/rejected).
  const uniqueValsSet = new Set();
  const maxDistinctOptions = 25; // Hard limit so browser doesn't freeze scanning millions of rows
  
  for (let i = 0; i < parsedData.length; i++) {
    const val = parsedData[i][outcomeCol];
    if (val !== undefined && val !== null) {
      const trimmed = String(val).trim();
      if (trimmed) {
        uniqueValsSet.add(trimmed);
        if (uniqueValsSet.size >= maxDistinctOptions) {
          uniqueValsSet.add("..."); // Indicator that there are more values
          break; // Stop immediately! Freezes avoided forever.
        }
      }
    }
  }
  
  const uniqueVals = Array.from(uniqueValsSet);
  
  // Create an HTML string fragment and assign once instead of mapping and joining over and over
  let optionsHtml = '';
  for (let i = 0; i < uniqueVals.length; i++) {
    optionsHtml += `<option value="${uniqueVals[i]}">${uniqueVals[i]}</option>`;
  }
  positiveSelect.innerHTML = optionsHtml;

  // Auto-select positive outcome
  const positiveKeywords = ['1', 'yes', 'true', 'hired', 'approved', 'accepted', 'pass', 'positive'];
  const match = uniqueVals.find(v => positiveKeywords.includes(v.toLowerCase()));
  if (match) positiveSelect.value = match;
}

// ===== SCROLL =====
function scrollToUpload() {
  document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' });
}

// ===== DEMO DATA =====
function loadDemo() {
  const demoCSV = `age,gender,race,education,experience_years,hired
28,Male,White,Bachelor,3,1
34,Female,Black,Master,5,0
42,Male,Asian,Bachelor,8,1
29,Female,White,Master,2,1
38,Male,Hispanic,High School,7,0
25,Female,Asian,Bachelor,1,0
31,Male,White,Master,4,1
45,Female,Black,Bachelor,12,0
27,Male,Asian,Master,2,1
33,Female,White,Bachelor,6,1
41,Male,Black,High School,10,0
26,Female,Hispanic,Master,1,0
35,Male,White,Bachelor,7,1
30,Female,Asian,Master,3,1
39,Male,Hispanic,Bachelor,8,0
28,Female,White,Bachelor,4,1
44,Male,Black,Master,11,0
32,Female,White,Bachelor,5,1
37,Male,Asian,High School,9,1
23,Female,Black,Master,0,0
29,Male,White,Bachelor,3,1
36,Female,Hispanic,Bachelor,7,0
31,Male,Asian,Master,4,1
40,Female,White,Bachelor,9,1
27,Male,Black,High School,2,0
34,Female,Asian,Master,6,1
43,Male,White,Bachelor,10,1
26,Female,Black,Bachelor,1,0
38,Male,Hispanic,Master,8,0
30,Female,White,Bachelor,4,1`;

  Papa.parse(demoCSV, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      parsedData = results.data;
      fileName = 'demo_hiring_dataset.csv';
      setupColumnConfig(results.meta.fields);
      document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ===== LOADING STATE =====
function setLoading(show, step = '', progress = 0) {
  const overlay = document.getElementById('loading');
  overlay.style.display = show ? 'flex' : 'none';
  if (show) {
    document.getElementById('loading-step').textContent = step;
    document.getElementById('loading-progress').style.width = progress + '%';
  }
}

// ===== RUN ANALYSIS =====
async function runAnalysis() {
  const outcomeCol = document.getElementById('outcome-col').value;
  const positiveVal = document.getElementById('positive-val').value;
  const sensitiveOptions = document.getElementById('sensitive-cols').options;
  const sensitiveAttrs = Array.from(sensitiveOptions)
    .filter(o => o.selected)
    .map(o => o.value);

  // Validations
  if (!parsedData.length) { alert('Please upload a dataset first.'); return; }
  if (!sensitiveAttrs.length) { alert('Please select at least one sensitive attribute.'); return; }
  if (sensitiveAttrs.includes(outcomeCol)) { alert('Outcome column cannot also be a sensitive attribute.'); return; }

  try {
    // Step 1
    setLoading(true, 'Parsing and validating dataset...', 10);
    await delay(400);

    // Step 2
    setLoading(true, 'Calculating fairness metrics...', 30);
    await delay(300);
    const metrics = calculateBiasMetrics(parsedData, outcomeCol, sensitiveAttrs, positiveVal);
    const overallScore = computeOverallBiasScore(metrics);
    currentMetrics = metrics;

    // Step 3
    setLoading(true, 'Building dataset summary...', 50);
    await delay(300);
    const summary = getDatasetSummary(parsedData, outcomeCol, sensitiveAttrs, positiveVal, metrics);

    // Step 4
    setLoading(true, 'Sending data to our locally hosted backend for Gemini AI...', 65);
    const aiResult = await getGeminiBiasAnalysis(summary, metrics);
    currentAnalysis = aiResult;

    // Step 5
    setLoading(true, 'Rendering results dashboard...', 90);
    await delay(400);

    renderResults(metrics, overallScore, aiResult, outcomeCol, sensitiveAttrs, positiveVal, summary);

    setLoading(false);
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    setLoading(false);
    console.error(err);
    if (err.message.includes('API_KEY') || err.message.includes('key')) {
      alert('Invalid Gemini API key. Please check your key at aistudio.google.com');
    } else {
      alert('Analysis failed: ' + err.message);
    }
  }
}

// ===== RENDER RESULTS =====
function renderResults(metrics, overallScore, aiResult, outcomeCol, sensitiveAttrs, positiveVal, summary) {
  const firstAttr = sensitiveAttrs[0];
  const verdict = getBiasVerdict(overallScore);

  // Subtitle
  document.getElementById('results-subtitle').textContent =
    `${fileName} · ${parsedData.length.toLocaleString()} records · ${sensitiveAttrs.join(', ')} analyzed`;

  // Score Cards
  const totalPositive = parsedData.filter(r => String(r[outcomeCol]).trim() === positiveVal).length;
  document.getElementById('score-cards').innerHTML = `
    <div class="score-card">
      <div class="sc-label">Overall Bias Score</div>
      <div class="sc-value" style="color:${verdict.color}">${overallScore}</div>
      <div class="sc-sub">${verdict.label}</div>
    </div>
    <div class="score-card">
      <div class="sc-label">Total Records</div>
      <div class="sc-value">${parsedData.length.toLocaleString()}</div>
      <div class="sc-sub">${totalPositive} positive outcomes</div>
    </div>
    <div class="score-card">
      <div class="sc-label">Attributes Analyzed</div>
      <div class="sc-value">${sensitiveAttrs.length}</div>
      <div class="sc-sub">${sensitiveAttrs.join(', ')}</div>
    </div>
    <div class="score-card">
      <div class="sc-label">Overall Selection Rate</div>
      <div class="sc-value">${(summary.overallPositiveRate * 100).toFixed(1)}%</div>
      <div class="sc-sub">Positive outcome rate</div>
    </div>
  `;

  // Gauge Chart
  renderGaugeChart(overallScore);
  const biasVerdictEl = document.getElementById('bias-verdict');
  biasVerdictEl.textContent = verdict.label;
  biasVerdictEl.style.color = verdict.color;
  biasVerdictEl.style.background = verdict.bg;

  // Outcome Chart
  renderOutcomeChart(metrics, firstAttr);

  // Metrics List
  renderMetricsList(metrics, firstAttr);

  // Attribute Chart
  renderAttributeChart(metrics);

  // AI Analysis
  const aiBox = document.getElementById('ai-analysis');
  if (aiResult) {
    let findingsHtml = (aiResult.key_findings || []).map(f => `
      <div style="margin:8px 0; padding:8px 12px; background:rgba(79,70,229,0.08); border-radius:8px; border-left: 3px solid rgba(79,70,229,0.4)">
        <span style="font-size:11px; font-weight:700; color:${f.impact === 'High' ? '#ef4444' : f.impact === 'Medium' ? '#f59e0b' : '#10b981'}; text-transform:uppercase; letter-spacing:.5px">${f.impact} IMPACT</span>
        <div style="font-size:13px; color:#e2e8f0; margin-top:4px">${f.finding}</div>
      </div>
    `).join('');

    aiBox.innerHTML = `
      <div style="font-size:15px; color:#e2e8f0; margin-bottom:16px; line-height:1.7">${aiResult.overall_assessment || ''}</div>
      ${findingsHtml}
      ${aiResult.ethical_risks ? `<div style="margin-top:12px; padding:10px 14px; background:rgba(239,68,68,0.08); border-radius:8px; font-size:13px; color:#fca5a5">⚠️ <strong>Ethical Risk:</strong> ${aiResult.ethical_risks}</div>` : ''}
    `;
  }

  // Recommendations
  const recs = aiResult?.recommendations || [];
  document.getElementById('recommendations').innerHTML = recs.map(r => `
    <div class="rec-item">
      <span class="rec-icon">${r.icon || '💡'}</span>
      <div>
        <div class="rec-title">
          ${r.title}
          <span class="rec-priority ${r.priority}">${r.priority?.toUpperCase()}</span>
        </div>
        <div class="rec-desc">${r.description}</div>
      </div>
    </div>
  `).join('') || '<div style="color:var(--text3); font-size:14px;">No recommendations available.</div>';
}

// ===== DOWNLOAD PDF REPORT =====
function downloadReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const score = computeOverallBiasScore(currentMetrics);
  const verdict = getBiasVerdict(score);
  const attrs = Object.keys(currentMetrics);

  // Title
  doc.setFillColor(15, 15, 26);
  doc.rect(0, 0, 210, 297, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('FairLens', 20, 30);
  doc.setFontSize(14);
  doc.setTextColor(148, 163, 184);
  doc.text('AI Bias Detection Report', 20, 40);

  // Date
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50);
  doc.text(`Dataset: ${fileName}`, 20, 58);
  doc.text(`Total Records: ${parsedData.length}`, 20, 66);

  // Score
  doc.setFontSize(18);
  doc.setTextColor(239, 68, 68);
  doc.setFont('helvetica', 'bold');
  doc.text(`Overall Bias Score: ${score}/100`, 20, 82);
  doc.setFontSize(13);
  doc.text(`Verdict: ${verdict.label}`, 20, 92);

  // Metrics per attribute
  let y = 108;
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Fairness Metrics', 20, y);
  y += 8;

  attrs.forEach(attr => {
    const m = currentMetrics[attr];
    doc.setFontSize(12);
    doc.setTextColor(129, 140, 248);
    doc.text(`Attribute: ${attr}`, 20, y + 8);
    y += 14;
    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    doc.text(`  Bias Score: ${m.biasScore}/100`, 20, y);
    doc.text(`  Disparate Impact Ratio: ${m.disparateImpact.toFixed(3)} (${m.passes80Rule ? '✓ Passes' : '✗ Fails'} 80% Rule)`, 20, y + 7);
    doc.text(`  Statistical Parity Difference: ${(m.statisticalParity * 100).toFixed(1)}%`, 20, y + 14);
    doc.text(`  Max Group Rate: ${(m.maxRate * 100).toFixed(1)}% (${m.referenceGroup})`, 20, y + 21);
    doc.text(`  Min Group Rate: ${(m.minRate * 100).toFixed(1)}%`, 20, y + 28);
    y += 38;
  });

  // AI Analysis
  if (currentAnalysis) {
    y += 4;
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('AI Analysis', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    const lines = doc.splitTextToSize(currentAnalysis.overall_assessment || '', 170);
    doc.text(lines, 20, y);
    y += lines.length * 6 + 6;

    // Recommendations
    if (currentAnalysis.recommendations) {
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('Recommendations', 20, y);
      y += 8;
      currentAnalysis.recommendations.forEach((r, i) => {
        doc.setFontSize(11);
        doc.setTextColor(129, 140, 248);
        doc.text(`${i + 1}. ${r.title}`, 20, y);
        y += 6;
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184);
        const rLines = doc.splitTextToSize(r.description, 170);
        doc.text(rLines, 25, y);
        y += rLines.length * 5 + 4;
      });
    }
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('FairLens · AI Bias Detection', 20, 285);

  doc.save(`FairLens_Report_${Date.now()}.pdf`);
}

// ===== RESET =====
function resetApp() {
  parsedData = [];
  currentMetrics = {};
  currentAnalysis = null;
  fileName = '';
  document.getElementById('column-config').style.display = 'none';
  document.getElementById('results').style.display = 'none';
  document.getElementById('file-info').innerHTML = '';
  document.getElementById('file-input').value = '';
  document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' });
  if (gaugeChart) gaugeChart.destroy();
  if (outcomeChart) outcomeChart.destroy();
  if (attributeChart) attributeChart.destroy();
}

// ===== UTILS =====
function delay(ms) { return new Promise(res => setTimeout(res, ms)); }


// ===== 3D UI & UX INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D Net Vanta.js Background
  if (window.VANTA && window.VANTA.NET) {
    window.VANTA.NET({
      el: "#home",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x4f46e5,
      backgroundColor: 0x05070a,
      points: 15.00,
      maxDistance: 22.00,
      spacing: 16.00
    });
  }

  // Initialize Vanilla Tilt 3D glass cards
  VanillaTilt.init(document.querySelectorAll('.metrics-grid .metric-card, .ai-card, .chart-card, .step-card'), {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
    scale: 1.02
  });

  // Advanced Entry & Scroll Animations with GSAP
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entry Animation
    gsap.from(".hero-content .hero-tag", { opacity: 0, y: -20, duration: 0.8, ease: "power3.out" });
    gsap.from(".hero-content .hero-title", { opacity: 0, y: 30, duration: 1, delay: 0.2, ease: "power3.out" });
    gsap.from(".hero-content .hero-sub", { opacity: 0, y: 20, duration: 1, delay: 0.4, ease: "power3.out" });
    gsap.from(".hero-actions button", { opacity: 0, y: 20, duration: 0.6, delay: 0.6, stagger: 0.1, ease: "back.out(1.7)" });
    gsap.from(".hero-stats .stat", { opacity: 0, scale: 0.8, duration: 0.6, delay: 0.8, stagger: 0.1, ease: "back.out(1.7)" });

    // Section Scroll Animations (Fade Up)
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.from(title, {
        scrollTrigger: { trigger: title, start: "top 85%" },
        opacity: 0, y: 30, duration: 0.8, ease: "power3.out"
      });
    });

gsap.utils.toArray('.step-card, .upload-container').forEach(card => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 85%" },
        opacity: 0, y: 40, duration: 0.8, ease: "power3.out"
      });
    });
  }

  // --- Abstract Custom 3D Shape for Hero right-side ---
  const container = document.getElementById('hero-canvas');
  if (container && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create a glowing, wireframe Icosahedron
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    
    // Core material
    const material = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      emissive: 0xec4899,
      emissiveIntensity: 0.4,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // Inner glowing core
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Lights
    const light1 = new THREE.PointLight(0x4f46e5, 3, 100);
    light1.position.set(10, 10, 10);
    scene.add(light1);
    const light2 = new THREE.PointLight(0xec4899, 2, 100);
    light2.position.set(-10, -10, 10);
    scene.add(light2);

    camera.position.z = 6;

    // Make shape follow mouse slightly
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      mouseX = (e.clientX - halfX) * 0.0005;
      mouseY = (e.clientY - halfY) * 0.0005;
    });

    const animate = () => {
      requestAnimationFrame(animate);
      
      targetX = mouseX * 2.5;
      targetY = mouseY * 2.5;
      
      shape.rotation.x += 0.002;
      shape.rotation.y += 0.003;
      core.rotation.x -= 0.001;
      core.rotation.y -= 0.004;

      // Smooth dampening to target
      shape.rotation.x += 0.05 * (targetY - shape.rotation.x);
      shape.rotation.y += 0.05 * (targetX - shape.rotation.y);
      
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      if(container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    });
  }
});
