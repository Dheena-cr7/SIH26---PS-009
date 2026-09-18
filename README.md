# 🌍 OreSeek — SIH 2026 Prototype
### *AI & Space Technology for Identifying Mineral Reserves and Overcoming Production Shortfalls*

> **Problem Statement ID:** PS-26009  
> **Organization:** Ministry of Steel | **Department/Industry:** MOIL Limited  
> **Theme:** Space Technology / AI-Driven Decision Support

---

## 🚀 Overview

**OreSeek** is an end-to-end AI and space-technology-driven decision-support platform designed for modern mineral exploration, geological prospectivity mapping, mine planning, and production optimization.

### Key Capabilities:
1. **Space & Geological Prospectivity Engine:** Multi-criteria GIS mapping integrating Sentinel-2 spectral band ratios (Clay/Iron index, Alteration), magnetic/gravity anomalies, fault line proximity, and lithology.
2. **AI Mineral Deposit & Reserve Estimator:** 3D geological block model visualization (UNFC Classification: Measured, Indicated, Inferred) and drillhole log analyzer.
3. **Smart Production Forecasting & Shortfall Predictor:** XGBoost time-series production forecasting and early-warning shortfall risk classification with root-cause analysis (grade dilution, equipment breakdowns, monsoon disruptions).
4. **Predictive Equipment Health & RUL Dashboard:** Real-time telemetry monitoring for Heavy Earth Moving Machinery (HEMM) with remaining useful life (RUL) estimation.
5. **Space-Based Environmental & ESG Compliance:** Satellite-derived NDVI vegetation degradation tracking, pit water accumulation monitoring, and dust dispersion analysis.
6. **Scenario Simulator ("What-If" Analysis):** Interactive simulation to evaluate production recovery under various mitigation actions (e.g., adding excavator shifts, blending low-grade ore).
7. **Unified Data Management & GIS Export:** Central hub for uploading geospatial data, drill core samples, operational logs, and exporting GeoJSON/CSV reports.

---

## 🏗️ Architecture

```
SIH-Project/
├── backend/
│   ├── data/
│   │   └── generate_datasets.py   # Synthetic space & mining data generator
│   ├── ml/
│   │   ├── train_models.py        # XGBoost training pipeline for 4 core models
│   │   └── saved_models/          # Exported model weights and metrics
│   ├── routes/
│   │   └── ...                    # Modular REST endpoints
│   ├── main.py                    # FastAPI server
│   └── requirements.txt           # Python dependencies
├── datasets/                      # Generated GeoJSON, CSVs, block models
└── frontend/                      # React 18 + Vite + TailwindCSS + Lucide + Leaflet GIS
    ├── src/
    │   ├── pages/                 # 10 Interactive Control Center modules
    │   ├── components/            # Reusable UI widgets & GIS maps
    │   └── services/              # API clients
    └── package.json
```

---

## ⚡ Quickstart Guide

### 1. Backend Setup & Run

Ensure you have Python 3.9+ installed:

```bash
cd backend
pip install -r requirements.txt

# (Optional) Regenerate datasets and retrain models:
python data/generate_datasets.py
python ml/train_models.py

# Start the FastAPI server:
python -m uvicorn main:app --reload --port 8000
```
API Documentation will be live at: **`http://localhost:8000/docs`**

---

### 2. Frontend Setup & Run

Ensure you have Node.js 18+ installed:

```bash
cd frontend
npm install
npm run dev
```
Open your browser at: **`http://localhost:5173/`**

---

## 🛰️ Machine Learning Models

1. **Prospectivity Model (Classification):** Evaluates multi-band satellite indices, structural proximity, and radiometric data to calculate mineral potential score (0–100%).
2. **Production Forecast Model (Regression):** Predicts daily and monthly extraction volumes against planned targets.
3. **Shortfall Early Warning Model (Classification):** Detects risk of production deficits 14–30 days in advance.
4. **Equipment Health & RUL Model (Regression):** Predicts remaining operating hours for excavators, dump trucks, and drills based on vibration, oil pressure, and temperature telemetry.

---

## ⚠️ Demo & Scientific Transparency Notice
- Satellite multi-spectral data provides surface alteration and geological prospectivity indicators, which are integrated with geophysical and borehole data to model subterranean reserves.
- Data presented in this prototype is generated from realistic geological and operational parameters modeled after central Indian manganese belts (e.g., MOIL Balaghat, Dongri Buzurg).
