<div align="center">

<img src="https://img.shields.io/badge/⚖️%20FairLens-AI%20Bias%20Detection-6366f1?style=for-the-badge&labelColor=0f172a" alt="FairLens Banner" />

# ⚖️ FairLens — AI Bias Detection Platform

### *Detect. Explain. Fix. Make AI Fair for Everyone.*

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Azure-0078d4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://fairlens-ai-bufhfhasancsgue6.eastus-01.azurewebsites.net)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Google Gemini](https://img.shields.io/badge/Gemini-1.5%20Pro-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com)
[![Azure](https://img.shields.io/badge/Deployed%20on-Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

> **Built for Google Solution Challenge 2026 · Build with AI · GDG on Campus**

---

**[🚀 Try the Live Demo](https://fairlens-ai-bufhfhasancsgue6.eastus-01.azurewebsites.net)** · **[📖 Read the Docs](#-table-of-contents)** · **[🐛 Report a Bug](https://github.com/Amank326/FairLens-AI-Bias-Detection-Platform/issues)** · **[💡 Request a Feature](https://github.com/Amank326/FairLens-AI-Bias-Detection-Platform/issues)**

</div>

---

## 📋 Table of Contents

- [🌍 The Problem We're Solving](#-the-problem-were-solving)
- [💡 Our Solution — FairLens](#-our-solution--fairlens)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#%EF%B8%8F-architecture)
- [📐 How It Works — Step by Step](#-how-it-works--step-by-step)
- [📊 Bias Metrics Explained](#-bias-metrics-explained)
- [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start (Local)](#-quick-start-local)
- [🐳 Docker Setup](#-docker-setup)
- [☁️ Azure Deployment Guide](#%EF%B8%8F-azure-deployment-guide)
- [🔌 API Reference](#-api-reference)
- [🗺️ Roadmap](#%EF%B8%8F-roadmap)
- [🤝 Contributing](#-contributing)
- [👥 Team](#-team)
- [📄 License](#-license)

---

## 🌍 The Problem We're Solving

> *AI systems are making life-changing decisions — and they're not always fair.*

Every day, **algorithms decide**:

| Domain | Decision | Potential Bias |
|--------|----------|---------------|
| 🏢 **Hiring** | Who gets the job interview | Gender, race, age discrimination |
| 🏦 **Finance** | Who gets the loan | Racial or socioeconomic profiling |
| 🏥 **Healthcare** | Who gets prioritized treatment | Age or demographic bias |
| ⚖️ **Justice** | Risk assessment scores | Racial disparity in predictions |

When AI models are trained on **historically biased data**, they don't just learn from it — they **amplify** it, baking discrimination into automated systems at scale.

**The result?** Millions of people get unfairly denied jobs, loans, and care — not by a prejudiced human, but by a line of code.

---

## 💡 Our Solution — FairLens

**FairLens** is an AI-powered bias detection and auditing platform that:

1. **Scans** any CSV dataset using proven statistical fairness metrics
2. **Quantifies** bias mathematically — no guesswork, just numbers
3. **Explains** the findings in plain English via Google Gemini 1.5 Pro
4. **Recommends** concrete, actionable steps to make the data fairer

Whether you're a data scientist preparing a training dataset, an ML engineer auditing a model, or a compliance officer reviewing automated decisions — FairLens gives you the tools to **prove fairness or flag bias** with evidence.

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 📤 Smart CSV Upload
Drag-and-drop or click-to-upload your dataset. **PapaParse** handles files with millions of rows in milliseconds — parsed entirely in your browser for maximum privacy.

</td>
<td width="50%">

### 🤖 Auto Column Detection
FairLens automatically identifies sensitive attributes like **Gender, Age, Race, and Ethnicity** and maps your outcome columns — no manual configuration needed.

</td>
</tr>
<tr>
<td width="50%">

### 📊 Real-Time Bias Metrics
Instantly see **Disparate Impact Ratio**, **Statistical Parity Difference**, and **Selection Rates** per group — rendered as beautiful interactive charts and bias gauges.

</td>
<td width="50%">

### 🧠 Gemini AI Deep Analysis
Google Gemini 1.5 Pro reads the statistical summary and returns a comprehensive audit: bias types detected, root causes, key findings, and severity level.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Actionable Recommendations
Don't just detect bias — **fix it**. FairLens provides specific, prioritized technical steps (re-weighting, resampling, threshold adjustment) tailored to your data.

</td>
<td width="50%">

### 📄 PDF Audit Report
Download a professional, shareable **PDF audit report** with all metrics, AI findings, and recommendations — ready for stakeholders and compliance teams.

</td>
</tr>
<tr>
<td width="50%">

### 🔒 Privacy by Design
**No raw data ever leaves your browser.** Only aggregated statistical summaries (numbers and column names) are sent to the backend — never individual rows.

</td>
<td width="50%">

### ⚡ Performance Optimized
Handles **1M+ row datasets** without freezing. Uses `Set` objects and early-exit algorithms, a job queue for large files, and response caching for repeated queries.

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        FAIRLENS ARCHITECTURE                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    CLIENT TIER (Browser)                    │    │
│  │                                                             │    │
│  │  ┌───────────┐  ┌────────────┐  ┌──────────┐  ┌────────┐  │    │
│  │  │ CSV Upload│→ │  PapaParse │→ │  Bias    │→ │Chart.js│  │    │
│  │  │ Drag/Drop │  │  (Parser)  │  │  Metrics │  │ Graphs │  │    │
│  │  └───────────┘  └────────────┘  └──────────┘  └────────┘  │    │
│  │                       ↓ Stats Summary Only                  │    │
│  └───────────────────────┼─────────────────────────────────────┘    │
│                          │ HTTPS POST /api/analyze                   │
│  ┌───────────────────────┼─────────────────────────────────────┐    │
│  │               API TIER │ (Node.js / Express)                 │    │
│  │                        ↓                                     │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │             TEE Middleware (Security Layer)          │    │    │
│  │  └─────────────────────┬───────────────────────────────┘    │    │
│  │                        ↓                                     │    │
│  │  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐ │    │
│  │  │  Job Queue   │  │  Cache Layer  │  │ Secure Processor │ │    │
│  │  │  (Large Files│  │  (Fast Repeat │  │ (Data Masking)   │ │    │
│  │  │   Queued)    │  │   Queries)    │  │                  │ │    │
│  │  └──────┬───────┘  └───────┬───────┘  └────────┬─────────┘ │    │
│  └─────────┼──────────────────┼────────────────────┼───────────┘    │
│            └──────────────────┼────────────────────┘                │
│                               ↓ Secure API Call                      │
│  ┌────────────────────────────┼──────────────────────────────────┐  │
│  │           AI ENGINE        ↓  (Google Gemini 1.5 Pro)         │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │  Receives stats → Audits bias → Returns JSON report  │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                               ↓ JSON Response                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │         RESPONSE: Dynamic UI Update + PDF Download             │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📐 How It Works — Step by Step

```
 Step 1          Step 2          Step 3          Step 4          Step 5
 ──────          ──────          ──────          ──────          ──────
  📤 Upload  →  🔍 Auto-map  →  📊 Calculate →  🤖 AI Audit  →  📄 Export
  CSV File       Columns         Metrics         with Gemini      PDF Report

  User drops     FairLens        Disparate       Gemini reads     Download
  a dataset      detects         Impact,         the stats and    professional
  (.csv) into    sensitive       Parity          explains the     audit report
  the browser    attributes      Difference &    bias findings    ready for
                 automatically   Bias Score      + fixes          compliance
```

**Detailed Flow:**

1. **Upload**: User drags in a `.csv` dataset (hiring decisions, loan approvals, medical outcomes, etc.)
2. **Parse**: PapaParse reads the CSV entirely in the browser — raw data never hits the network
3. **Detect**: FairLens auto-detects sensitive attributes (Gender, Race, Age) and the outcome column
4. **Calculate**: The bias metrics engine computes Disparate Impact Ratio, Statistical Parity Difference, and per-group Selection Rates
5. **Summarize**: Only the statistical summary (numbers + column names) is sent to the backend via HTTPS
6. **Audit**: The Node.js backend passes the summary through security middleware, then calls Google Gemini 1.5 Pro
7. **Analyze**: Gemini returns a structured JSON report with severity, root causes, key findings, and prioritized recommendations
8. **Visualize**: The frontend renders interactive charts, a bias score gauge, and the full AI report
9. **Export**: User downloads a formatted PDF audit report

---

## 📊 Bias Metrics Explained

FairLens uses **industry-standard fairness metrics** derived from the EEOC's Uniform Guidelines and academic AI fairness literature.

| Metric | Formula | Fair Threshold | What Failure Means |
|--------|---------|----------------|-------------------|
| **Disparate Impact Ratio** | Min Group Rate ÷ Max Group Rate | ≥ 0.8 (80% Rule) | The system systematically favors one group over another |
| **Statistical Parity Difference** | Max Rate − Min Rate | < 0.1 (10%) | The gap in positive outcomes between groups is too large |
| **Selection Rate** | Positive Outcomes ÷ Total Count | Equal across groups | One group is disproportionately selected/rejected |
| **Bias Score** | `(DI Score + SP Score) / 2` | < 20 | Composite severity score (0 = fair, 100 = extremely biased) |

### Bias Severity Scale

```
  0          20          45          70         100
  ├──────────┼───────────┼───────────┼───────────┤
  🟢 Low    🟡 Moderate  🟠 High    🔴 Critical
  (Fair)    (Monitor)   (Act Now)   (Do Not Deploy)
```

---

## 🛠️ Tech Stack

<table>
<tr>
<th>Layer</th>
<th>Technology</th>
<th>Purpose</th>
</tr>
<tr>
<td><b>Frontend UI</b></td>
<td>HTML5, CSS3, Vanilla JavaScript</td>
<td>Core application interface</td>
</tr>
<tr>
<td><b>3D Visuals</b></td>
<td>Vanta.js, Vanilla-tilt.js</td>
<td>Animated 3D background & floating card effects</td>
</tr>
<tr>
<td><b>Data Parsing</b></td>
<td>PapaParse</td>
<td>Fast client-side CSV parsing (millions of rows)</td>
</tr>
<tr>
<td><b>Charts</b></td>
<td>Chart.js</td>
<td>Interactive bar charts, gauges, and visualizations</td>
</tr>
<tr>
<td><b>PDF Export</b></td>
<td>jsPDF</td>
<td>Professional audit report generation</td>
</tr>
<tr>
<td><b>Backend</b></td>
<td>Node.js 18+, Express.js 5</td>
<td>API proxy, security layer, service orchestration</td>
</tr>
<tr>
<td><b>AI Engine</b></td>
<td>Google Gemini 1.5 Pro</td>
<td>Deep contextual bias analysis & recommendations</td>
</tr>
<tr>
<td><b>Security</b></td>
<td>TEE Middleware, Secure Processing Service</td>
<td>Trusted execution environment, data masking</td>
</tr>
<tr>
<td><b>Performance</b></td>
<td>Job Queue, Cache Service</td>
<td>Async processing for large files, response caching</td>
</tr>
<tr>
<td><b>Containerization</b></td>
<td>Docker</td>
<td>Portable, reproducible deployments</td>
</tr>
<tr>
<td><b>Cloud</b></td>
<td>Microsoft Azure (App Service)</td>
<td>Production deployment & hosting</td>
</tr>
</table>

---

## 📁 Project Structure

```
FairLens-AI-Bias-Detection-Platform/
│
└── fairlens/                           # Main application directory
    ├── 📄 server.js                    # Node.js / Express entry point
    ├── 📄 index.html                   # Main application UI (SPA)
    ├── 📄 package.json                 # Dependencies & scripts
    ├── 🐳 Dockerfile                   # Container configuration
    │
    ├── css/
    │   └── 🎨 style.css               # All application styles
    │
    ├── js/                             # Frontend JavaScript modules
    │   ├── 🧩 app.js                  # Main app logic & event handling
    │   ├── 📐 bias-metrics.js         # Statistical fairness calculations
    │   ├── 📊 charts.js               # Chart.js visualization helpers
    │   └── 🤖 gemini.js               # Frontend ↔ Backend AI bridge
    │
    ├── middlewares/
    │   └── 🔒 teeMiddleware.js        # Trusted Execution Environment layer
    │
    ├── routes/
    │   ├── 📡 analyzeData.js          # POST /api/analyze (synchronous)
    │   └── 📡 asyncAnalyze.js         # POST /api/async-analyze (queued)
    │
    └── services/
        ├── 🧠 geminiService.js        # Google Gemini API integration
        ├── 💾 cacheService.js         # Response caching for speed
        ├── 🔄 jobQueueService.js      # Queue for large dataset jobs
        └── 🛡️ secureProcessingService.js  # Data masking & secure handling
```

---

## 🚀 Quick Start (Local)

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- A free [Google Gemini API Key](https://aistudio.google.com/)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Amank326/FairLens-AI-Bias-Detection-Platform.git
cd FairLens-AI-Bias-Detection-Platform/fairlens
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `fairlens/` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3000
```

> 🔑 Get your free API key at [Google AI Studio](https://aistudio.google.com/) — no credit card required.

### 4. Start the Server

```bash
npm start
```

### 5. Open the App

Navigate to **[http://localhost:3000](http://localhost:3000)** in your browser.

### 6. Try It Out

Upload any `.csv` dataset with a clear outcome column (e.g., hired/not hired, approved/denied) and watch FairLens analyze it in seconds.

> 💡 **Don't have a dataset?** Try a hiring or loan dataset from [Kaggle](https://www.kaggle.com/) or the [UCI ML Repository](https://archive.ics.uci.edu/).

---

## 🐳 Docker Setup

Run FairLens in a fully isolated container — no Node.js installation required.

### Build the Image

```bash
cd fairlens
docker build -t fairlens-app .
```

### Run the Container

```bash
docker run -p 8080:3000 -e GEMINI_API_KEY=your_api_key_here fairlens-app
```

Open **[http://localhost:8080](http://localhost:8080)** in your browser.

### Docker Compose (Optional)

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  fairlens:
    build: ./fairlens
    ports:
      - "8080:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

```bash
docker-compose up
```

---

## ☁️ Azure Deployment Guide

FairLens is production-deployed on **Microsoft Azure App Service** using Docker containers.

### Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Docker](https://docs.docker.com/get-docker/)
- An [Azure Account](https://azure.microsoft.com/)

### Step 1 — Login & Setup

```bash
# Login to your Azure account
az login

# Create a resource group
az group create --name FairLens_RG --location eastus
```

### Step 2 — Create an Azure Container Registry

```bash
# Create the container registry
az acr create --resource-group FairLens_RG --name fairlensacr --sku Basic

# Enable admin access
az acr update -n fairlensacr --admin-enabled true
```

### Step 3 — Build & Push the Docker Image

```bash
cd fairlens

# Build the image and push directly to ACR
az acr build --registry fairlensacr --image fairlens-app:v1 .
```

### Step 4 — Deploy to Azure App Service

```bash
# Create an App Service Plan (Linux, B1 tier)
az appservice plan create \
  --name FairLensPlan \
  --resource-group FairLens_RG \
  --sku B1 \
  --is-linux

# Create the Web App using the Docker image
az webapp create \
  --resource-group FairLens_RG \
  --plan FairLensPlan \
  --name fairlens-app \
  --deployment-container-image-name fairlensacr.azurecr.io/fairlens-app:v1

# Set the Gemini API Key
az webapp config appsettings set \
  --resource-group FairLens_RG \
  --name fairlens-app \
  --settings GEMINI_API_KEY="your_api_key_here"
```

✅ Your app will be live at: **`https://fairlens-app.azurewebsites.net`**

---

## 🔌 API Reference

FairLens exposes two REST endpoints:

### `POST /api/analyze`

Synchronous analysis — best for small to medium datasets.

**Request Body:**

```json
{
  "datasetSummary": {
    "totalRows": 10000,
    "totalColumns": 8,
    "outcomeColumn": "hired",
    "positiveOutcome": "Yes",
    "overallPositiveRate": 0.42,
    "sensitiveAttributes": ["gender", "race"]
  },
  "metrics": {
    "gender": {
      "disparateImpact": 0.61,
      "statisticalParity": 0.24,
      "biasScore": 31,
      "passes80Rule": false
    }
  }
}
```

**Response:**

```json
{
  "overall_assessment": "The dataset shows significant gender bias...",
  "severity": "High",
  "bias_types_detected": ["Statistical Parity Bias", "Disparate Impact"],
  "key_findings": [
    { "finding": "Female candidates selected at 61% the rate of males", "impact": "High" }
  ],
  "root_causes": ["Historical underrepresentation in training data"],
  "recommendations": [
    {
      "title": "Apply Re-weighting",
      "description": "Increase sample weights for underrepresented groups...",
      "priority": "high",
      "icon": "🛡️"
    }
  ],
  "ethical_risks": "If deployed, this model would systematically disadvantage female applicants...",
  "fair_score_justification": "Disparate impact of 0.61 violates the 80% rule..."
}
```

### `POST /api/async-analyze`

Asynchronous analysis via job queue — recommended for large datasets (100K+ rows).

This endpoint is planned for a future release. For now, use the synchronous endpoint above.

---

## 🗺️ Roadmap

### ✅ Phase 1 — Foundation (Completed)
- [x] Responsive, animated UI with Vanta.js 3D backgrounds
- [x] Client-side CSV parsing with PapaParse
- [x] Interactive data visualization with Chart.js

### ✅ Phase 2 — AI & Bias Engine (Completed)
- [x] Disparate Impact Ratio, Statistical Parity Difference, Selection Rate calculations
- [x] Google Gemini 1.5 Pro integration for contextual AI analysis
- [x] PDF audit report generation with jsPDF

### ✅ Phase 3 — Backend & Security (Completed)
- [x] Node.js / Express.js API server
- [x] TEE Middleware security layer
- [x] Job Queue for async processing of large datasets
- [x] Response caching for performance
- [x] Secure data processing service (data masking)

### ✅ Phase 4 — Containerization & Deployment (Completed)
- [x] Dockerfile for containerized deployment
- [x] Production deployment on Microsoft Azure App Service
- [ ] CI/CD pipeline via GitHub Actions → Azure

### 🔮 Phase 5 — Future Enhancements
- [ ] SQL / database connector (analyze live production data)
- [ ] User authentication and saved workspaces
- [ ] Support for unstructured data (text, images)
- [ ] Model-level bias detection (not just data)
- [ ] Fairness monitoring dashboard with historical tracking
- [ ] Support for additional fairness metrics (Equalized Odds, Calibration)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-amazing-feature`
3. **Commit** your changes: `git commit -m 'Add some amazing feature'`
4. **Push** to the branch: `git push origin feature/your-amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Keep raw data processing in the browser (never send individual rows to backend)
- Maintain the privacy-first architecture — only statistical summaries leave the client
- Add comments for any new bias metrics or statistical calculations
- Test with a variety of CSV structures and dataset sizes

---

## 👥 Team

Built with ❤️ for **Google Solution Challenge 2026 — Build with AI**

| Role | Contact |
|------|---------|
| 🧑‍💻 Developer & Designer | [@Amank326](https://github.com/Amank326) |

**Program:** GDG on Campus · Google for Developers

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
```

---

<div align="center">

**If FairLens helped you build fairer AI, please consider giving it a ⭐**

[![GitHub Stars](https://img.shields.io/github/stars/Amank326/FairLens-AI-Bias-Detection-Platform?style=social)](https://github.com/Amank326/FairLens-AI-Bias-Detection-Platform)
[![GitHub Forks](https://img.shields.io/github/forks/Amank326/FairLens-AI-Bias-Detection-Platform?style=social)](https://github.com/Amank326/FairLens-AI-Bias-Detection-Platform/fork)

<br/>

*Made with ⚖️ to make AI fair for everyone.*

</div>
