# ⚖️ FairLens — AI Bias Detection Platform
### Solution Challenge 2026 · Build with AI · Google Gemini Powered

---

## 🚀 Quick Start

1. **Download / clone this project**
2. **Open `index.html` in your browser** (no server needed!)
3. **Get a free Gemini API key** at https://aistudio.google.com
4. **Enter your API key** in the app
5. **Upload a CSV dataset** or click **"Try Demo Data"**
6. **Run Analysis** and see the magic!

---

## 📁 Project Structure

```
fairlens/
├── index.html          # Main app
├── css/
│   └── style.css       # Full styling
├── js/
│   ├── app.js          # Main logic
│   ├── gemini.js       # Gemini AI integration
│   ├── bias-metrics.js # Statistical calculations
│   └── charts.js       # Chart.js visualizations
└── README.md
```

---

## 🎯 Features

- **CSV Upload** — Drag & drop any dataset
- **Auto-Detection** — Automatically finds sensitive columns (gender, race, age etc.)
- **5+ Bias Metrics** — Disparate Impact, Statistical Parity, Selection Rate, etc.
- **Google Gemini AI** — Deep analysis, plain-English explanations, root cause detection
- **Interactive Dashboard** — Gauge charts, bar charts, comparison visuals
- **Actionable Recommendations** — Specific steps to fix the bias
- **PDF Report** — Download a full analysis report
- **Responsive Design** — Works on mobile and desktop

---

## 📊 Supported Dataset Types

| Domain | Example Columns |
|--------|----------------|
| Hiring | gender, race, age, hired |
| Loans | gender, ethnicity, approved |
| Medical | age, sex, diagnosis |
| Education | gender, race, passed |
| Criminal Justice | race, age, verdict |

---

## 🧮 Bias Metrics Explained

| Metric | What It Means | Fair Range |
|--------|--------------|------------|
| Disparate Impact Ratio | Ratio of outcome rates between groups | ≥ 0.8 (80% Rule) |
| Statistical Parity Difference | Difference in outcome rates | < 10% |
| Selection Rate | % of positive outcomes per group | Should be equal |
| Bias Score | Composite score (0=fair, 100=extremely biased) | < 20 |

---

## 🔑 Getting Your Gemini API Key

1. Go to https://aistudio.google.com
2. Sign in with Google
3. Click "Get API Key" → "Create API Key"
4. Copy and paste into FairLens

**Free tier:** 15 requests/minute, 1 million tokens/day — more than enough!

---

## 🛠️ Tech Stack

| Technology | Use |
|-----------|-----|
| HTML5, CSS3, JS, Three.js, Vanta.js | Frontend |
| Node.js / Express | Backend API Proxy |
| Google Gemini 1.5 Pro | AI Analysis |
| Chart.js | Data Visualization |
| Papa Parse | CSV Parsing |
| jsPDF | PDF Report Generation |

---

## 📝 Problem Statement

**[Unbiased AI Decision] Ensuring Fairness and Detecting Bias in Automated Decisions**

Computer programs make life-changing decisions about jobs, loans, and medical care. If trained on biased data, they amplify discrimination. FairLens provides organizations a clear, accessible way to detect and fix bias before these systems harm real people.

---

## 👥 Team

Built for **Solution Challenge 2026 — Build with AI**  
GDG on Campus · Google for Developers

---

## 📄 License

MIT License — Free to use, modify, and submit!
