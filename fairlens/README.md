# ⚖️ FairLens — AI Bias Detection Platform
### Solution Challenge 2026 · Build with AI · Google Gemini Powered

---

## 🌐 Live Deployment
**Live Demo:** [Click here to view the deployed FairLens Platform on Azure](#) *(Replace this with your actual Azure Deployment Link, e.g., https://fairlens.azurewebsites.net)*

---

## 📖 Table of Contents
1. [Overview & Problem Statement](#-overview--problem-statement)
2. [Project Roadmap](#-full-project-roadmap)
3. [Architecture & Process Structure](#-architecture--process-structure)
4. [Deployment Guide (Azure)](#-deployment-guide)
5. [Folder Structure](#-comprehensive-folder-structure)
6. [Tech Stack](#-tech-stack)
7. [Features & Bias Metrics](#-features--bias-metrics)
8. [Quick Start (Local)](#-quick-start)

---

## 🎯 Overview & Problem Statement
**[Unbiased AI Decision] Ensuring Fairness and Detecting Bias in Automated Decisions**

Computer programs make life-changing decisions about jobs, loans, and medical care. If trained on biased data, they amplify discrimination. FairLens provides organizations a clear, accessible way to detect and fix bias before these systems harm real people.

---

## 🗺️ Full Project Roadmap

### Phase 1: Foundation & UI (Completed)
- [x] Design responsive, interactive UI (HTML5, CSS3, Vanta.js).
- [x] Setup client-side CSV parsing (Papa Parse) and data visualization (Chart.js).

### Phase 2: AI & Bias Logic Integration (Completed)
- [x] Implement core statistical bias metrics (Disparate Impact, Statistical Parity, Selection Rate).
- [x] Integrate Google Gemini 1.5 Pro AI for deep contextual analysis and recommendations.
- [x] Implement PDF report generation (jsPDF).

### Phase 3: Backend & Security Middleware (Completed)
- [x] Setup Node.js/Express server.
- [x] Implement TEE (Trusted Execution Environment) Middleware.
- [x] Setup secure processing, caching (cacheService), and job queues (jobQueueService).

### Phase 4: Containerization & Deployment (Current)
- [x] Create Dockerfile for easy containerization.
- [x] Deploy to cloud provider (Azure App Service / Azure Container Apps).
- [ ] Configure CI/CD pipeline (GitHub Actions -> Azure).

### Phase 5: Future Enhancements
- [ ] Add support for SQL database connections.
- [ ] Implement user authentication and workspace saving.
- [ ] Expand AI analysis for unstructured data (text/images).

---

## 🏗️ Architecture & Process Structure
FairLens operates on a streamlined, secure architecture:

1. **Client Tier (Frontend):** 
   - User uploads a .csv dataset via the browser.
   - Initial parsing and basic chart rendering happen locally to ensure speed.
2. **API/Proxy Tier (Backend):**
   - The Node.js server (server.js) receives analysis requests.
   - Requests pass through security protocols (	eeMiddleware.js).
3. **Processing Tier:**
   - **Job Queue:** Large files are queued (jobQueueService.js).
   - **Caching:** Repeated queries are fetched from cache (cacheService.js).
   - **AI Engine:** The geminiService.js securely calls the Google Gemini API to analyze bias patterns.
4. **Response Delivery:**
   - The backend sends compiled statistical data and AI recommendations back to the client.
   - Frontend dynamically updates gauges, charts, and provides a downloadable PDF.

---

## ⚙️ Deployment Guide

### Deploying to Microsoft Azure
Since this project includes a Dockerfile and a server.js, Azure App Service (Web App for Containers) or Azure Container Apps is the best approach.

**Step 1: Prerequisites**
- Create an [Azure Account](https://azure.microsoft.com/).
- Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) & [Docker](https://docs.docker.com/get-docker/).

**Step 2: Build & Push Docker Image**
\\\ash
# Login to Azure
az login

# Create an Azure Container Registry (ACR)
az acr create --resource-group FairLens_RG --name fairlensacr --sku Basic

# Build and Push the image to ACR
az acr build --registry fairlensacr --image fairlens-app:v1 .
\\\

**Step 3: Deploy to Azure App Service**
\\\ash
# Create an App Service Plan
az appservice plan create --name FairLensPlan --resource-group FairLens_RG --sku B1 --is-linux

# Create the Web App using the Docker container
az webapp create --resource-group FairLens_RG --plan FairLensPlan --name fairlens-app --deployment-container-image-name fairlensacr.azurecr.io/fairlens-app:v1

# Set the Gemini API Key Environment Variable
az webapp config appsettings set --resource-group FairLens_RG --name fairlens-app --settings GEMINI_API_KEY="your_api_key_here" PORT=8080
\\\
*Your app will now be live at: https://fairlens-app.azurewebsites.net*

---

## 📁 Comprehensive Folder Structure
\\\	ext
fairlens_project/
├── Dockerfile                  # Containerization setup
├── server.js                   # Node.js Express backend entry point
├── package.json                # Node modules and dependencies
├── index.html                  # Main Application UI
├── JUDGES_PITCH_GUIDE.md       # Presentation script & judge guide
├── README.md                   # Complete Documentation
├── css/
│   └── style.css               # Application styling
├── js/
│   ├── app.js                  # Frontend logic & event handling
│   ├── bias-metrics.js         # Core statistical calculations
│   ├── charts.js               # Visualizations (Chart.js)
│   └── gemini.js               # Frontend AI integration hub
├── middlewares/
│   └── teeMiddleware.js        # Trusted Execution Environment security layer
├── routes/
│   ├── analyzeData.js          # Synchronous data analysis route
│   └── asyncAnalyze.js         # Asynchronous data analysis route
└── services/
    ├── cacheService.js         # Caching mechanism for faster responses
    ├── geminiService.js        # Backend Google Gemini API integration
    ├── jobQueueService.js      # Queue management for large datasets
    └── secureProcessingService.js # Secure data masking & handling
\\\

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript, Chart.js, Papa Parse, jsPDF, Vanta.js (3D Backgrounds)
- **Backend:** Node.js, Express.js
- **AI/ML:** Google Gemini 1.5 Pro API
- **Deployment:** Docker, Microsoft Azure

---

## ✨ Features & Bias Metrics
### Features
- **Smart CSV Upload:** Drag-and-drop your dataset.
- **Auto-Detection:** Automatically maps sensitive columns (Age, Gender, Race) and target outcomes.
- **AI Explanations:** Deep analysis converting complex math into plain English.
- **Actionable Steps:** Specific recommendations on how to mitigate detected biases.

### Bias Metrics Explained
| Metric | What It Means | Fair Range |
|--------|--------------|------------|
| Disparate Impact Ratio | Ratio of outcome rates between groups | ≥ 0.8 (80% Rule) |
| Statistical Parity Difference | Difference in outcome rates | < 10% |
| Selection Rate | % of positive outcomes per group | Should be equal |
| Bias Score | Composite score | < 20 |

---

## 🚀 Quick Start
To run this project locally on your machine:

1. **Clone the repository:**
   \\\ash
   git clone https://github.com/Amank326/FairLens-AI-Bias-Detection-Platform.git
   cd FairLens-AI-Bias-Detection-Platform/fairlens
   \\\
2. **Install dependencies:**
   \\\ash
   npm install
   \\\
3. **Set your API Key:**
   Create a .env file in the root directory and add:
   \\\nv
   GEMINI_API_KEY=your_google_gemini_api_key
   PORT=8080
   \\\
   *(Get your free key at [Google AI Studio](https://aistudio.google.com))*
4. **Start the server:**
   \\\ash
   npm start
   \\\
5. Open your browser and go to: **http://localhost:8080**

---

## 👥 Team
Built for **Solution Challenge 2026 — Build with AI**  
GDG on Campus · Google for Developers

## 📄 License
MIT License — Free to use, modify, and submit!
