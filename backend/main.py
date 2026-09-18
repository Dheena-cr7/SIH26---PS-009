"""
Manganese Intelligence — FastAPI Backend
Main application entry point.
"""
import os
import sys
import json
import pickle
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Path setup ──────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(BASE_DIR, 'datasets')
MODELS_DIR = os.path.join(BASE_DIR, 'data', 'models')
DATA_DIR = os.path.join(BASE_DIR, 'data')

sys.path.insert(0, BASE_DIR)

# ── Bootstrap data & models on first run ────────────────────────────────────
def bootstrap():
    zones_path = os.path.join(DATASETS_DIR, 'geology', 'prospectivity_zones.json')
    if not os.path.exists(zones_path):
        print("Generating synthetic datasets...")
        from data.generate_datasets import generate_all
        generate_all()

    metrics_path = os.path.join(MODELS_DIR, 'model_metrics.json')
    if not os.path.exists(metrics_path):
        print("Training ML models...")
        from ml.train_models import train_all
        train_all()

bootstrap()

# ── Load models ──────────────────────────────────────────────────────────────
def load_model(name):
    path = os.path.join(MODELS_DIR, name)
    if os.path.exists(path):
        with open(path, 'rb') as f:
            return pickle.load(f)
    return None

prospectivity_model = load_model('prospectivity_model.pkl')
prod_model_data = load_model('production_model.pkl')
shortfall_model_data = load_model('shortfall_model.pkl')
equipment_risk_model = load_model('equipment_risk_model.pkl')

prod_model, prod_features = prod_model_data if prod_model_data else (None, [])
shortfall_model, short_features = shortfall_model_data if shortfall_model_data else (None, [])

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="OreSeek API",
    description="OreSeek — AI-Powered Mineral Exploration & Mining Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Helper loaders ────────────────────────────────────────────────────────────
def load_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)

def load_csv(path):
    return pd.read_csv(path)

# ── Dashboard ─────────────────────────────────────────────────────────────────
@app.get("/api/dashboard")
def get_dashboard():
    prod_df = load_csv(os.path.join(DATASETS_DIR, 'production', 'production_history.csv'))
    equip = load_json(os.path.join(DATASETS_DIR, 'equipment', 'equipment.json'))
    zones = load_json(os.path.join(DATASETS_DIR, 'geology', 'prospectivity_zones.json'))

    recent = prod_df.tail(3)
    avg_prod = recent['production_tonnes'].mean()
    target = 166667
    forecast = avg_prod * 1.02
    shortfall_risk = 68  # computed by shortfall model on recent conditions

    high_zones = [z for z in zones if z['prospectivity_score'] >= 75]
    avg_avail = np.mean([e['availability_pct'] for e in equip])

    # Equipment health score
    critical = [e for e in equip if e['failure_risk'] == 'HIGH']

    return {
        "data_mode": "DEMO",
        "last_updated": datetime.utcnow().isoformat(),
        "kpis": {
            "monitored_area_km2": 24.6,
            "high_prospectivity_zones": len(high_zones),
            "estimated_resource_potential_mt": 12.8,
            "resource_confidence_range": {"low": 10.4, "high": 15.1},
            "current_production_tonnes": int(prod_df.tail(1)['production_tonnes'].values[0]),
            "forecast_production_mt": round(forecast * 12 / 1e6, 2),
            "production_target_mt": 2.00,
            "shortfall_risk_pct": shortfall_risk,
            "shortfall_risk_level": "HIGH",
            "equipment_availability_pct": round(avg_avail, 1),
            "critical_equipment_count": len(critical),
            "average_mn_grade_pct": 28.6,
            "total_drill_holes": 200,
        },
        "alerts": [
            {"id": "AL-01", "severity": "HIGH", "type": "production", "message": "Production shortfall probability increased to 68%. Immediate action recommended.", "timestamp": datetime.utcnow().isoformat()},
            {"id": "AL-02", "severity": "MEDIUM", "type": "weather", "message": "Heavy rainfall (210mm) forecast for next 14-day operational window. Haulage risk elevated.", "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat()},
            {"id": "AL-03", "severity": "MEDIUM", "type": "equipment", "message": "EXC-04 equipment availability at 71% — below 80% threshold. Schedule maintenance.", "timestamp": (datetime.utcnow() - timedelta(hours=5)).isoformat()},
            {"id": "AL-04", "severity": "LOW", "type": "opportunity", "message": "MN-TARGET-01 identified as highest-priority exploration zone (91% prospectivity, 84% confidence).", "timestamp": (datetime.utcnow() - timedelta(hours=8)).isoformat()},
            {"id": "AL-05", "severity": "MEDIUM", "type": "equipment", "message": "DRL-03 maintenance overdue by 12 days. Failure risk elevated.", "timestamp": (datetime.utcnow() - timedelta(hours=12)).isoformat()},
        ],
        "shortfall_breakdown": [
            {"factor": "Equipment Downtime", "contribution_pct": 31},
            {"factor": "Weather / Rainfall", "contribution_pct": 24},
            {"factor": "Blasting Delay", "contribution_pct": 18},
            {"factor": "Haulage Constraints", "contribution_pct": 15},
            {"factor": "Other", "contribution_pct": 12},
        ]
    }

# ── Exploration ────────────────────────────────────────────────────────────────
@app.get("/api/exploration/zones")
def get_exploration_zones():
    zones = load_json(os.path.join(DATASETS_DIR, 'geology', 'prospectivity_zones.json'))
    return {"zones": zones, "total": len(zones), "data_mode": "DEMO"}

@app.get("/api/exploration/{zone_id}")
def get_exploration_zone(zone_id: str):
    zones = load_json(os.path.join(DATASETS_DIR, 'geology', 'prospectivity_zones.json'))
    zone = next((z for z in zones if z['id'] == zone_id), None)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    return zone

# ── Resources ─────────────────────────────────────────────────────────────────
@app.get("/api/resources")
def get_resources():
    drill_df = load_csv(os.path.join(DATASETS_DIR, 'geology', 'drill_holes.csv'))
    zones = load_json(os.path.join(DATASETS_DIR, 'geology', 'prospectivity_zones.json'))

    avg_grade = drill_df['mn_grade_pct'].mean()
    high_grade = drill_df[drill_df['mn_grade_pct'] > 30]

    grade_dist = []
    bins = [(5, 15), (15, 20), (20, 25), (25, 30), (30, 35), (35, 48)]
    for lo, hi in bins:
        count = len(drill_df[(drill_df['mn_grade_pct'] >= lo) & (drill_df['mn_grade_pct'] < hi)])
        grade_dist.append({"range": f"{lo}-{hi}%", "count": count, "pct": round(count / len(drill_df) * 100, 1)})

    geo_units = load_json(os.path.join(DATASETS_DIR, 'geology', 'geology_units.json'))

    return {
        "data_mode": "DEMO",
        "estimated_resource_potential_mt": 12.8,
        "confidence_interval": {"low_mt": 10.4, "high_mt": 15.1},
        "confidence_pct": 78,
        "average_mn_grade_pct": round(avg_grade, 2),
        "high_grade_intercepts": len(high_grade),
        "total_drill_holes": len(drill_df),
        "drill_coverage_km2": 18.4,
        "data_quality_score": 78,
        "grade_distribution": grade_dist,
        "geological_units": geo_units,
        "drill_section": [
            {"x": 0, "depth": 0, "grade": 0},
            {"x": 100, "depth": 25, "grade": 28.5},
            {"x": 200, "depth": 45, "grade": 32.1},
            {"x": 300, "depth": 60, "grade": 31.6},
            {"x": 400, "depth": 55, "grade": 29.8},
            {"x": 500, "depth": 40, "grade": 27.2},
            {"x": 600, "depth": 30, "grade": 25.8},
        ],
        "disclaimer": "AI-Assisted Resource Potential Estimate. Requires validation by certified geological and assay data before operational or regulatory use."
    }

# ── Production ────────────────────────────────────────────────────────────────
@app.get("/api/production/history")
def get_production_history():
    df = load_csv(os.path.join(DATASETS_DIR, 'production', 'production_history.csv'))
    records = df.to_dict(orient='records')
    return {"history": records, "data_mode": "DEMO"}

@app.get("/api/production/forecast")
def get_production_forecast():
    df = load_csv(os.path.join(DATASETS_DIR, 'production', 'production_history.csv'))

    future_months = []
    last_month = pd.to_datetime(df['month'].iloc[-1])
    for i in range(1, 7):
        m = last_month + pd.DateOffset(months=i)
        month_num = m.month
        is_monsoon = 1 if month_num in [6, 7, 8, 9] else 0
        rainfall = 220 if is_monsoon else 25
        equip_avail = 82 if is_monsoon else 88
        blasting_delay = 3 if is_monsoon else 1
        haulage_delay = 28 if is_monsoon else 8
        working_days = 22 if is_monsoon else 26

        if prod_model:
            X = np.array([[equip_avail, rainfall, blasting_delay, haulage_delay, working_days, is_monsoon]])
            forecast = int(prod_model.predict(X)[0])
        else:
            forecast = int(166667 * (equip_avail / 100) * (1 - blasting_delay * 0.03))

        future_months.append({
            "month": m.strftime('%Y-%m'),
            "forecast_tonnes": forecast,
            "target_tonnes": 166667,
            "is_forecast": True,
            "equipment_availability_pct": equip_avail,
            "rainfall_mm": rainfall,
        })

    return {"forecast": future_months, "data_mode": "DEMO"}

@app.get("/api/production/shortfall")
def get_shortfall():
    df = load_csv(os.path.join(DATASETS_DIR, 'production', 'production_history.csv'))
    recent = df.tail(6)

    if shortfall_model:
        X = recent[short_features].values
        proba = shortfall_model.predict_proba(X)[:, 1]
        risk_pct = int(np.mean(proba) * 100)
    else:
        risk_pct = 68

    risk_level = "HIGH" if risk_pct >= 60 else ("MEDIUM" if risk_pct >= 35 else "LOW")
    expected_gap = max(0, int((166667 - recent['production_tonnes'].mean()) * 12 / 1e3))

    return {
        "shortfall_risk_pct": risk_pct,
        "risk_level": risk_level,
        "expected_annual_gap_kt": expected_gap,
        "contributing_factors": [
            {"factor": "Equipment Downtime", "contribution_pct": 31, "shap_value": 0.18},
            {"factor": "Rainfall / Weather", "contribution_pct": 24, "shap_value": 0.15},
            {"factor": "Blasting Delay", "contribution_pct": 18, "shap_value": 0.13},
            {"factor": "Haulage Constraints", "contribution_pct": 15, "shap_value": 0.09},
            {"factor": "Equipment Availability", "contribution_pct": -7, "shap_value": -0.07},
            {"factor": "Other", "contribution_pct": 12, "shap_value": 0.05},
        ],
        "data_mode": "DEMO"
    }

# ── Equipment ─────────────────────────────────────────────────────────────────
@app.get("/api/equipment")
def get_equipment():
    machines = load_json(os.path.join(DATASETS_DIR, 'equipment', 'equipment.json'))

    summary = {
        "total": len(machines),
        "high_risk": len([m for m in machines if m['failure_risk'] == 'HIGH']),
        "medium_risk": len([m for m in machines if m['failure_risk'] == 'MEDIUM']),
        "low_risk": len([m for m in machines if m['failure_risk'] == 'LOW']),
        "avg_availability_pct": round(np.mean([m['availability_pct'] for m in machines]), 1),
        "overdue_maintenance": len([m for m in machines if m['maintenance_status'] == 'OVERDUE']),
    }
    return {"machines": machines, "summary": summary, "data_mode": "DEMO"}

# ── Environment ───────────────────────────────────────────────────────────────
@app.get("/api/environment")
def get_environment():
    df = load_csv(os.path.join(DATASETS_DIR, 'environment', 'environment.csv'))
    records = df.to_dict(orient='records')

    latest = records[-1] if records else {}
    return {
        "history": records,
        "latest": latest,
        "satellite_datasets": [
            {"name": "Sentinel-2 MSI", "source": "ESA Copernicus", "resolution": "10m", "update_freq": "5 days", "status": "DEMO", "bands_used": ["B4", "B8", "B11", "B12"], "indices": ["NDVI", "BAI", "FeMnI"]},
            {"name": "Landsat 8/9 OLI", "source": "USGS", "resolution": "30m", "update_freq": "16 days", "status": "DEMO", "bands_used": ["B4", "B5", "B6", "B7"], "indices": ["NDVI", "LST", "Clay Minerals"]},
            {"name": "MOSDAC Rainfall", "source": "ISRO/SAC", "resolution": "25km", "update_freq": "Daily", "status": "DEMO"},
            {"name": "SMAP Soil Moisture", "source": "NASA", "resolution": "9km", "update_freq": "Daily", "status": "DEMO"},
        ],
        "data_mode": "DEMO"
    }

# ── Recommendations ───────────────────────────────────────────────────────────
@app.get("/api/recommendations")
def get_recommendations():
    return {
        "risk_level": "HIGH",
        "shortfall_risk_pct": 68,
        "expected_gap_kt": 160,
        "recommendations": [
            {
                "rank": 1, "id": "REC-01", "title": "Redeploy Dumper Capacity",
                "description": "Move 3 available dumpers (DMP-06, DMP-08, DMP-11) from Mine-C to Mine-A where bottleneck is detected.",
                "category": "Equipment Redeployment",
                "expected_impact_pct": 4.8, "confidence_pct": 82, "priority": "HIGH",
                "reason": "Mine-A operating below capacity due to haulage constraint. Mine-C has excess dumper availability.",
                "implementation_time": "24 hours"
            },
            {
                "rank": 2, "id": "REC-02", "title": "Reschedule Blasting Operations",
                "description": "Defer delayed blasting to next available weather window (3-day forecast clear period).",
                "category": "Blasting Schedule Optimization",
                "expected_impact_pct": 2.1, "confidence_pct": 78, "priority": "HIGH",
                "reason": "Current rainfall forecast makes blasting unsafe. Optimal window opens in 3 days.",
                "implementation_time": "72 hours"
            },
            {
                "rank": 3, "id": "REC-03", "title": "Preventive Maintenance — EXC-04",
                "description": "Schedule immediate preventive maintenance for EXC-04. Current availability at 71%, failure risk HIGH.",
                "category": "Preventive Maintenance",
                "expected_impact_pct": 3.5, "confidence_pct": 88, "priority": "CRITICAL",
                "reason": "EXC-04 is 23 days overdue for maintenance. Risk of critical failure would reduce capacity by 15%.",
                "implementation_time": "12 hours (planned downtime)"
            },
            {
                "rank": 4, "id": "REC-04", "title": "Optimize Working Hours During Clear Weather",
                "description": "Extend working hours to 12 hours/shift during upcoming 5-day clear weather window.",
                "category": "Operational Optimization",
                "expected_impact_pct": 2.8, "confidence_pct": 74, "priority": "MEDIUM",
                "reason": "Weather window of 5 clear days presents opportunity to recover lost production.",
                "implementation_time": "Immediate"
            },
        ],
        "total_potential_improvement_pct": 9.4,
        "data_mode": "DEMO"
    }

# ── Simulator ──────────────────────────────────────────────────────────────────
class SimulatorInput(BaseModel):
    equipment_availability_pct: float = 82.0
    rainfall_scenario: str = "MODERATE"  # LOW, MODERATE, HEAVY
    blasting_delay_days: int = 3
    equipment_redeployment: bool = False
    working_hours: float = 8.0

@app.post("/api/simulator/run")
def run_simulation(params: SimulatorInput):
    rainfall_map = {"LOW": 20, "MODERATE": 120, "HEAVY": 250}
    rainfall = rainfall_map.get(params.rainfall_scenario, 120)
    is_monsoon = 1 if rainfall > 100 else 0
    haulage_delay = max(0, rainfall * 0.08 + params.blasting_delay_days * 2)
    working_days = max(18, 26 - params.blasting_delay_days - (3 if is_monsoon else 0))

    equip_avail = params.equipment_availability_pct
    if params.equipment_redeployment:
        equip_avail = min(98, equip_avail + 5)

    # Scale for extended hours
    hours_factor = params.working_hours / 8.0

    if prod_model:
        X = np.array([[equip_avail, rainfall, params.blasting_delay_days, haulage_delay, working_days, is_monsoon]])
        monthly_prod = max(90000, int(prod_model.predict(X)[0] * hours_factor))
    else:
        monthly_prod = int(166667 * (equip_avail / 100) * hours_factor)

    annual_prod_mt = round(monthly_prod * 12 / 1e6, 2)

    if shortfall_model:
        X = np.array([[equip_avail, rainfall, params.blasting_delay_days, haulage_delay, working_days, is_monsoon]])
        shortfall_risk = int(shortfall_model.predict_proba(X)[0][1] * 100)
    else:
        shortfall_risk = max(5, int(68 * (1 - (equip_avail - 82) / 18) * (1 - (8 - params.blasting_delay_days) / 8 * 0.3)))

    # Clamp
    shortfall_risk = max(5, min(95, shortfall_risk))

    # Baseline
    baseline_prod = 1.84
    baseline_risk = 68
    improvement_pct = round((annual_prod_mt - baseline_prod) / baseline_prod * 100, 1)

    return {
        "inputs": params.dict(),
        "results": {
            "monthly_production_tonnes": monthly_prod,
            "annual_production_mt": annual_prod_mt,
            "production_target_mt": 2.00,
            "shortfall_risk_pct": shortfall_risk,
            "risk_level": "HIGH" if shortfall_risk >= 60 else ("MEDIUM" if shortfall_risk >= 35 else "LOW"),
            "production_gap_kt": max(0, round((2.00 - annual_prod_mt) * 1000, 1)),
            "equipment_utilization_pct": round(equip_avail * hours_factor / 8 * 0.95, 1),
            "improvement_vs_baseline_pct": improvement_pct,
        },
        "baseline": {
            "annual_production_mt": baseline_prod,
            "shortfall_risk_pct": baseline_risk,
        },
        "data_mode": "DEMO"
    }

# ── Models / AI ────────────────────────────────────────────────────────────────
@app.get("/api/models")
def get_models():
    metrics_path = os.path.join(MODELS_DIR, 'model_metrics.json')
    if os.path.exists(metrics_path):
        with open(metrics_path) as f:
            metrics = json.load(f)
    else:
        metrics = {}

    return {
        "models": [
            {
                "id": "prospectivity", "name": "Prospectivity AI Classifier",
                "algorithm": "XGBoost", "purpose": "Classify manganese prospectivity from geological and spectral features",
                "metric": "AUC", "metric_value": metrics.get('prospectivity', {}).get('auc', 0.89),
                "features": ["spectral_signature", "geology", "structural_proximity", "terrain", "historical_evidence", "ndvi", "elevation", "slope"],
                "disclaimer": "Trained on synthetic demonstration dataset"
            },
            {
                "id": "production", "name": "Production Forecast Model",
                "algorithm": "XGBoost Regressor", "purpose": "Forecast monthly production from operational parameters",
                "metric": "R²", "metric_value": metrics.get('production', {}).get('r2', 0.91),
                "features": ["equipment_availability_pct", "rainfall_mm", "blasting_days_lost", "haulage_delay_hrs", "working_days", "is_monsoon"],
                "disclaimer": "Trained on synthetic demonstration dataset"
            },
            {
                "id": "shortfall", "name": "Shortfall Risk Classifier",
                "algorithm": "XGBoost", "purpose": "Predict probability of monthly production shortfall",
                "metric": "F1 Score", "metric_value": metrics.get('shortfall', {}).get('f1', 0.87),
                "features": ["equipment_availability_pct", "rainfall_mm", "blasting_days_lost", "haulage_delay_hrs", "working_days", "is_monsoon"],
                "shap_values": [
                    {"feature": "Equipment Downtime", "shap": 0.18},
                    {"feature": "Rainfall", "shap": 0.15},
                    {"feature": "Blasting Delay", "shap": 0.13},
                    {"feature": "Haul Distance", "shap": 0.09},
                    {"feature": "Availability", "shap": -0.07},
                ],
                "disclaimer": "Trained on synthetic demonstration dataset"
            },
            {
                "id": "equipment", "name": "Equipment Risk Classifier",
                "algorithm": "XGBoost", "purpose": "Predict equipment failure risk from availability and maintenance data",
                "metric": "Accuracy", "metric_value": metrics.get('equipment', {}).get('accuracy', 0.85),
                "features": ["availability_pct", "operating_hours", "days_since_maintenance", "hours_to_next_maintenance"],
                "disclaimer": "Trained on synthetic demonstration dataset"
            },
        ],
        "data_mode": "DEMO",
        "disclaimer": "All metrics generated from synthetic demonstration datasets. Not representative of real-world MOIL performance."
    }

# ── Health ─────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "online", "version": "1.0.0", "data_mode": "DEMO", "timestamp": datetime.utcnow().isoformat()}

@app.get("/")
def root():
    return {"message": "OreSeek API — SIH 2026", "docs": "/docs"}
