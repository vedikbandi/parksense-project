\# 🚦 ParkSense - AI-Powered Parking Enforcement Intelligence



\*\*Gridlock Hackathon 2.0 Submission\*\*



\[!\[Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://parksense-api.onrender.com)

\[!\[Frontend](https://img.shields.io/badge/Frontend-Next.js-000000?logo=next.js)](https://parksense-frontend.vercel.app)

\[!\[License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)



AI-driven parking intelligence system that analyzes 258,340 violations to enable proactive, data-driven enforcement and congestion mitigation in Bangalore.



\---



\## 📁 Repository Structure

parksense-project/ ├── backend/ # FastAPI backend with Databricks integration │ ├── main.py # API endpoints │ ├── requirements.txt # Python dependencies │ └── render.yaml # Render deployment config ├── frontend/ # Next.js dashboard │ ├── app/ # Next.js app directory │ ├── components/ # React components │ └── package.json # Node dependencies ├── docs/ # Documentation and Databricks notebooks │ └── notebook.py # Data analysis notebook └── README.md # This file

\---



\## 🚀 Live Demo



\* \*\*Frontend Dashboard\*\*: https://parksense-frontend.vercel.app

\* \*\*Backend API\*\*: https://parksense-api.onrender.com

\* \*\*API Docs\*\*: https://parksense-api.onrender.com/docs



\---



\## 🎯 Key Features



\### 🧠 \*\*AI-Powered Intelligence\*\*

\* Multi-factor priority scoring (frequency, junction proximity, peak hours, recency)

\* ML-optimized weight learning (R² = 0.783)

\* GBT forecasting model for next-week predictions (R² = 0.631)



\### 📊 \*\*Analytics Dashboard\*\*

\* Real-time violation statistics

\* Interactive heatmaps with priority zones

\* Temporal pattern analysis (hourly, daily trends)

\* Police station performance metrics



\### 🗺️ \*\*Geographic Intelligence\*\*

\* Grid-based hotspot clustering (500m resolution)

\* Junction impact quantification (53.7% violations at junctions)

\* Critical zone identification (1 Critical, 2 High, 9 Medium zones)



\---



\## 💡 Key Findings



\* \*\*Critical Zone\*\*: Grid 12.975\_77.575 (Upparpet) - 20,052 violations (132/day)

\* \*\*Junction Impact\*\*: 53.7% of violations occur at named junctions

\* \*\*Peak Hours\*\*: 5:00-6:00 AM accounts for highest violations

\* \*\*Dataset\*\*: 258,340 validated violations across 152 days



\---



\## 🛠️ Tech Stack



\### Backend

\* \*\*Framework\*\*: FastAPI (Python 3.11)

\* \*\*Database\*\*: Databricks SQL (Unity Catalog)

\* \*\*ML\*\*: Spark MLlib (GBT, Linear Regression)

\* \*\*Deployment\*\*: Render.com



\### Frontend

\* \*\*Framework\*\*: Next.js 16 (React 19)

\* \*\*Charts\*\*: Recharts

\* \*\*Maps\*\*: Leaflet + OpenStreetMap

\* \*\*Styling\*\*: Tailwind CSS

\* \*\*Deployment\*\*: Vercel



\### Data Processing

\* \*\*Platform\*\*: Databricks (Serverless Compute)

\* \*\*Processing\*\*: PySpark

\* \*\*Analysis\*\*: Pandas, NumPy



\---



\## 📦 Installation \& Setup



\### Prerequisites

\* Python 3.11+

\* Node.js 18+

\* Databricks workspace with Unity Catalog



\### Backend Setup



```bash

cd backend



\# Install dependencies

pip install -r requirements.txt



\# Create .env file

echo DATABRICKS\_HOST=your\_workspace\_url > .env

echo DATABRICKS\_HTTP\_PATH=your\_http\_path >> .env

echo DATABRICKS\_TOKEN=your\_token >> .env



\# Run server

python main.py



Backend will be available at http://localhost:8000



Frontend Setup



cd frontend



\# Install dependencies

npm install



\# Create .env.local

echo NEXT\_PUBLIC\_API\_URL=http://localhost:8000 > .env.local



\# Run development server

npm run dev



Frontend will be available at http://localhost:3000



🚀 Deployment

Backend (Render.com)

Push to GitHub

Connect repository to Render

Set root directory: backend

Add environment variables

Deploy

Frontend (Vercel)

Push to GitHub

Connect repository to Vercel

Set root directory: frontend

Add environment variable: NEXT\_PUBLIC\_API\_URL

Deploy

📊 API Endpoints

Core Statistics

GET /api/stats - Dashboard statistics

GET /api/priority-zones - Priority enforcement zones

GET /api/hotspots - Geographic hotspots

Analytics

GET /api/analytics/daily-trend - Daily violation trends

GET /api/analytics/hourly-pattern - 24-hour patterns

GET /api/analytics/station-performance - Police station metrics

ML Models

GET /api/ml/forecasting - Next-week predictions

GET /api/ml/priority-weights - ML-learned scoring weights

🎓 Methodology

Priority Scoring Algorithm

Priority Tiers

Critical (≥75): Immediate deployment required

High (≥30): Deploy within 48 hours

Medium (≥15): Regular monitoring

Low (<15): Standard patrol coverage

👥 Team

Developed for Bangalore Traffic Police - Gridlock Hackathon 2.0



📄 License

MIT License - See LICENSE file for details



🙏 Acknowledgments

Bangalore Traffic Police for providing violation data

Databricks for cloud platform support

Gridlock Hackathon organizers





\---



\### \*\*4. Update Backend CORS\*\* (Already provided earlier, but here's the final version)



Update `backend/main.py` - just the CORS section:



```python

\# ==================== CORS CONFIGURATION ====================



app.add\_middleware(

&#x20;   CORSMiddleware,

&#x20;   allow\_origin\_regex=r"^https://parksense-frontend.\*\\.vercel\\.app$",  # Matches all Vercel URLs

&#x20;   allow\_credentials=True,

&#x20;   allow\_methods=\["\*"],

&#x20;   allow\_headers=\["\*"],

)







