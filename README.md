# 🚦 ParkSense - AI-Powered Parking Enforcement Intelligence

**Gridlock Hackathon 2.0 Submission**

[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://parksense-api.onrender.com)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js-000000?logo=next.js)](https://parksense-frontend-parksense2.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

AI-driven parking intelligence system that analyzes **258,340 parking violations** to enable proactive, data-driven enforcement and congestion mitigation across Bengaluru.

---

## 🚀 Live Demo

### Frontend Dashboard

- https://parksense-frontend-ten.vercel.app

### Backend API

- https://parksense-api.onrender.com

### API Documentation

- https://parksense-api.onrender.com/docs

---

## 📁 Repository Structure

```text
parksense-project/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── render.yaml
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── next.config.ts
│
├── docs/
│   └── notebook.py
│
└── README.md
```

---

## 🎯 Problem Statement

### Poor Visibility on Parking-Induced Congestion

Illegal parking and spillover parking near:

- Commercial Areas
- Metro Stations
- Event Venues
- Major Junctions

create bottlenecks that reduce carriageway capacity and worsen traffic congestion.

### Challenges

- Enforcement is patrol-based and reactive
- No heatmap of parking violations
- No congestion impact quantification
- Difficult to prioritize enforcement zones
- Limited visibility into hotspot evolution

### Solution

ParkSense uses AI and data analytics to:

- Detect illegal parking hotspots
- Quantify congestion impact
- Rank enforcement priorities
- Forecast future violations
- Recommend officer deployment strategies

---

## 🎯 Key Features

### 🧠 AI-Powered Intelligence

- Multi-factor priority scoring
- ML-optimized weight learning
- GBT forecasting model
- Congestion impact estimation
- Enforcement prioritization

### 📊 Analytics Dashboard

- Real-time violation statistics
- Priority zone rankings
- Violation trend analysis
- Police station performance metrics
- Interactive visualizations

### 🗺️ Geographic Intelligence

- Grid-based hotspot clustering
- Junction impact analysis
- Critical zone identification
- Enforcement heatmaps

---

## 💡 Key Findings

| Metric | Value |
|----------|----------|
| Total Violations | 258,340 |
| Analysis Period | 152 Days |
| Grid Zones Analyzed | 1,328 |
| Critical Zones | 1 |
| High Priority Zones | 2 |
| Medium Priority Zones | 9 |
| Junction Violations | 53.7% |

### Critical Zone

**Grid:** 12.975_77.575 (Upparpet)

- 20,052 violations
- 132 violations/day
- Priority Score: 85/100
- Immediate enforcement required

### Peak Violation Window

**5:00 AM – 6:00 AM**

Highest concentration of parking violations citywide.

---

## 🛠️ Technology Stack

### Backend

- FastAPI
- Python 3.11
- Databricks SQL
- Unity Catalog
- Spark MLlib
- Render

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Recharts
- Leaflet
- OpenStreetMap

### Data Processing

- Databricks Serverless Compute
- PySpark
- Pandas
- NumPy

---

## 🤖 Machine Learning Models

### Priority Weight Optimization

**Model:** Linear Regression

**Performance:** R² = 0.783

| Feature | Weight |
|----------|----------|
| Frequency | 76.4% |
| Junction Impact | 20.9% |
| Peak Hour Impact | 2.7% |
| Recency | 0.0% |

### Violation Forecasting

**Model:** Gradient Boosted Trees Regressor

**Performance:** R² = 0.631

Used to forecast next-week parking violations and optimize enforcement planning.

---

## 📦 Local Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Databricks Workspace
- Unity Catalog Access

---

### Backend Setup

```bash
cd backend

pip install -r requirements.txt
```

Create `.env`

```env
DATABRICKS_HOST=your_workspace_url
DATABRICKS_HTTP_PATH=your_http_path
DATABRICKS_TOKEN=your_token
```

Run backend:

```bash
python main.py
```

Backend URL:

```text
http://localhost:8000
```

---

### Frontend Setup

```bash
cd frontend

npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

## 🚀 Deployment

### Backend (Render)

1. Push code to GitHub
2. Create Render Web Service
3. Set Root Directory:

```text
backend
```

4. Build Command

```bash
pip install -r requirements.txt
```

5. Start Command

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

6. Add Databricks environment variables

7. Deploy

---

### Frontend (Vercel)

1. Push code to GitHub
2. Import repository into Vercel
3. Set Root Directory:

```text
frontend
```

4. Add environment variable

```env
NEXT_PUBLIC_API_URL=https://parksense-api.onrender.com
```

5. Deploy

---

## 📊 API Endpoints

### Core Statistics

```http
GET /api/stats
GET /api/priority-zones
GET /api/hotspots
GET /api/tier-distribution
```

### Analytics

```http
GET /api/analytics/daily-trend
GET /api/analytics/hourly-pattern
GET /api/analytics/station-performance
GET /api/analytics/growth-metrics
```

### Machine Learning

```http
GET /api/ml/forecasting
GET /api/ml/priority-weights
```

### Recommendations

```http
GET /api/recommendations
GET /api/critical-zone
```

---

## 🎓 Methodology

### Priority Scoring Framework

Priority scores are computed using:

- Violation Frequency
- Junction Impact
- Peak Hour Violations
- Historical Trends

### Priority Tiers

| Tier | Score | Action |
|--------|--------|--------|
| Critical | ≥75 | Immediate Deployment |
| High | ≥30 | Deploy Within 48 Hours |
| Medium | ≥15 | Weekly Monitoring |
| Low | <15 | Standard Coverage |

---

## 📈 Expected Impact

ParkSense enables Bangalore Traffic Police to:

- Identify parking hotspots proactively
- Quantify congestion impact
- Optimize officer deployment
- Forecast future violations
- Prioritize enforcement resources
- Improve traffic flow through targeted interventions

---

## 👥 Team : VBROCKERZ

Vaibhavi Bandi- vaibhavibandi@gmail.com

Vedik Bandi- vedikbandi@gmail.com

Developed for **Gridlock Hackathon 2.0**

Bangalore Traffic Police Challenge

---

## 🙏 Acknowledgments

- Bangalore Traffic Police
- Databricks
- Gridlock Hackathon Organizers
- Open Source Community

---

## 📄 License

MIT License
