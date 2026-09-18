# -*- coding: utf-8 -*-
"""
Manganese Intelligence - Synthetic Dataset Generator
Generates coherent, realistic synthetic datasets for the SIH prototype.
All data is clearly labeled as synthetic demonstration data.
"""

import numpy as np
import pandas as pd
import json
import os
from datetime import datetime, timedelta

np.random.seed(42)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(BASE_DIR, '..', 'datasets')

def generate_prospectivity_zones():
    zones = [
        {
            "id": "MN-TARGET-01", "name": "Balaghat North Extension", "lat": 22.05, "lon": 80.18,
            "prospectivity_score": 91, "confidence": 84, "priority": "VERY HIGH",
            "area_km2": 3.2, "estimated_depth_m": 45,
            "spectral_score": 88, "geological_score": 92, "terrain_score": 76, "historical_score": 87,
            "feature_importance": {"spectral_signature": 31, "geology": 27, "structural_proximity": 18, "terrain": 12, "historical_evidence": 12},
            "evidence": {"satellite": "Strong", "geological": "Strong", "terrain": "Moderate", "historical": "Strong"},
            "recommendation": "Prioritize exploratory drilling in this zone. High spectral anomaly and strong geological correlation.",
            "mn_grade_estimate": 31.2, "color": "#ef4444",
            "polygon": [[22.04, 80.16], [22.04, 80.20], [22.06, 80.20], [22.06, 80.16]]
        },
        {
            "id": "MN-TARGET-02", "name": "Dongri Buzurg South", "lat": 21.98, "lon": 79.85,
            "prospectivity_score": 83, "confidence": 79, "priority": "HIGH",
            "area_km2": 2.8, "estimated_depth_m": 60,
            "spectral_score": 81, "geological_score": 85, "terrain_score": 72, "historical_score": 80,
            "feature_importance": {"spectral_signature": 28, "geology": 30, "structural_proximity": 20, "terrain": 11, "historical_evidence": 11},
            "evidence": {"satellite": "Strong", "geological": "Strong", "terrain": "Moderate", "historical": "Moderate"},
            "recommendation": "Schedule geophysical survey and core drilling in Q1 next cycle.",
            "mn_grade_estimate": 27.8, "color": "#f97316",
            "polygon": [[21.97, 79.83], [21.97, 79.87], [21.99, 79.87], [21.99, 79.83]]
        },
        {
            "id": "MN-TARGET-03", "name": "Ukwa Central", "lat": 21.65, "lon": 79.62,
            "prospectivity_score": 76, "confidence": 78, "priority": "HIGH",
            "area_km2": 4.1, "estimated_depth_m": 55,
            "spectral_score": 75, "geological_score": 78, "terrain_score": 68, "historical_score": 74,
            "feature_importance": {"spectral_signature": 26, "geology": 29, "structural_proximity": 22, "terrain": 12, "historical_evidence": 11},
            "evidence": {"satellite": "Moderate", "geological": "Strong", "terrain": "Moderate", "historical": "Moderate"},
            "recommendation": "High potential zone. Geophysical anomaly confirmed by geological mapping.",
            "mn_grade_estimate": 25.4, "color": "#f97316",
            "polygon": [[21.64, 79.60], [21.64, 79.64], [21.66, 79.64], [21.66, 79.60]]
        },
        {
            "id": "MN-TARGET-04", "name": "Kandri Northeast", "lat": 21.42, "lon": 79.38,
            "prospectivity_score": 67, "confidence": 72, "priority": "MODERATE",
            "area_km2": 2.4, "estimated_depth_m": 75,
            "spectral_score": 64, "geological_score": 70, "terrain_score": 60, "historical_score": 62,
            "feature_importance": {"spectral_signature": 23, "geology": 31, "structural_proximity": 20, "terrain": 14, "historical_evidence": 12},
            "evidence": {"satellite": "Moderate", "geological": "Moderate", "terrain": "Low", "historical": "Moderate"},
            "recommendation": "Conduct detailed geological mapping before drilling investment.",
            "mn_grade_estimate": 22.1, "color": "#eab308",
            "polygon": [[21.41, 79.36], [21.41, 79.40], [21.43, 79.40], [21.43, 79.36]]
        },
        {
            "id": "MN-TARGET-05", "name": "Chikla South Block", "lat": 21.89, "lon": 79.15,
            "prospectivity_score": 58, "confidence": 65, "priority": "MODERATE",
            "area_km2": 1.9, "estimated_depth_m": 90,
            "spectral_score": 55, "geological_score": 62, "terrain_score": 55, "historical_score": 50,
            "feature_importance": {"spectral_signature": 21, "geology": 28, "structural_proximity": 25, "terrain": 14, "historical_evidence": 12},
            "evidence": {"satellite": "Weak", "geological": "Moderate", "terrain": "Low", "historical": "Weak"},
            "recommendation": "Lower priority. Include in next regional exploration program.",
            "mn_grade_estimate": 19.8, "color": "#eab308",
            "polygon": [[21.88, 79.13], [21.88, 79.17], [21.90, 79.17], [21.90, 79.13]]
        },
        {
            "id": "MN-TARGET-06", "name": "Munsar West", "lat": 22.14, "lon": 79.52,
            "prospectivity_score": 48, "confidence": 60, "priority": "LOW",
            "area_km2": 1.5, "estimated_depth_m": 100,
            "spectral_score": 44, "geological_score": 52, "terrain_score": 45, "historical_score": 40,
            "feature_importance": {"spectral_signature": 19, "geology": 32, "structural_proximity": 25, "terrain": 13, "historical_evidence": 11},
            "evidence": {"satellite": "Weak", "geological": "Moderate", "terrain": "Low", "historical": "Weak"},
            "recommendation": "Low immediate priority. Monitor for new geological survey data.",
            "mn_grade_estimate": 16.5, "color": "#22c55e",
            "polygon": [[22.13, 79.50], [22.13, 79.54], [22.15, 79.54], [22.15, 79.50]]
        },
        {
            "id": "MN-TARGET-07", "name": "Tirodi Extension", "lat": 21.75, "lon": 79.98,
            "prospectivity_score": 72, "confidence": 74, "priority": "HIGH",
            "area_km2": 2.7, "estimated_depth_m": 65,
            "spectral_score": 70, "geological_score": 74, "terrain_score": 65, "historical_score": 71,
            "feature_importance": {"spectral_signature": 27, "geology": 28, "structural_proximity": 21, "terrain": 12, "historical_evidence": 12},
            "evidence": {"satellite": "Moderate", "geological": "Strong", "terrain": "Moderate", "historical": "Moderate"},
            "recommendation": "Strong structural control evident. Recommend targeted drilling program.",
            "mn_grade_estimate": 24.6, "color": "#f97316",
            "polygon": [[21.74, 79.96], [21.74, 80.00], [21.76, 80.00], [21.76, 79.96]]
        },
        {
            "id": "MN-TARGET-08", "name": "Gumgaon Block A", "lat": 21.55, "lon": 79.78,
            "prospectivity_score": 42, "confidence": 58, "priority": "LOW",
            "area_km2": 1.8, "estimated_depth_m": 110,
            "spectral_score": 40, "geological_score": 45, "terrain_score": 42, "historical_score": 38,
            "feature_importance": {"spectral_signature": 20, "geology": 30, "structural_proximity": 26, "terrain": 14, "historical_evidence": 10},
            "evidence": {"satellite": "Weak", "geological": "Low", "terrain": "Low", "historical": "Weak"},
            "recommendation": "Insufficient evidence. Deprioritize for current exploration cycle.",
            "mn_grade_estimate": 14.2, "color": "#22c55e",
            "polygon": [[21.54, 79.76], [21.54, 79.80], [21.56, 79.80], [21.56, 79.76]]
        },
        {
            "id": "MN-TARGET-09", "name": "Sitasaongi North", "lat": 21.30, "lon": 79.88,
            "prospectivity_score": 88, "confidence": 82, "priority": "VERY HIGH",
            "area_km2": 3.5, "estimated_depth_m": 50,
            "spectral_score": 85, "geological_score": 90, "terrain_score": 80, "historical_score": 84,
            "feature_importance": {"spectral_signature": 30, "geology": 28, "structural_proximity": 17, "terrain": 13, "historical_evidence": 12},
            "evidence": {"satellite": "Strong", "geological": "Strong", "terrain": "Strong", "historical": "Strong"},
            "recommendation": "Critical priority. Drill intercepts from adjacent areas confirm strong potential.",
            "mn_grade_estimate": 30.8, "color": "#ef4444",
            "polygon": [[21.29, 79.86], [21.29, 79.90], [21.31, 79.90], [21.31, 79.86]]
        },
        {
            "id": "MN-TARGET-10", "name": "Beldongri Southeast", "lat": 22.22, "lon": 80.05,
            "prospectivity_score": 63, "confidence": 68, "priority": "MODERATE",
            "area_km2": 2.1, "estimated_depth_m": 80,
            "spectral_score": 60, "geological_score": 66, "terrain_score": 58, "historical_score": 62,
            "feature_importance": {"spectral_signature": 24, "geology": 29, "structural_proximity": 22, "terrain": 13, "historical_evidence": 12},
            "evidence": {"satellite": "Moderate", "geological": "Moderate", "terrain": "Low", "historical": "Moderate"},
            "recommendation": "Moderate potential. Consider soil geochemistry survey before drilling.",
            "mn_grade_estimate": 21.5, "color": "#eab308",
            "polygon": [[22.21, 80.03], [22.21, 80.07], [22.23, 80.07], [22.23, 80.03]]
        },
    ]
    return zones

def generate_drill_holes(n=200):
    records = []
    for i in range(n):
        lat = np.random.uniform(21.25, 22.30)
        lon = np.random.uniform(79.10, 80.25)
        depth = np.random.uniform(20, 150)
        # Grade correlated with prospectivity-like features
        base_grade = 20 + 15 * np.exp(-0.01 * ((lat - 21.65)**2 + (lon - 79.9)**2) * 100)
        noise = np.random.normal(0, 3)
        mn_grade = max(5, min(48, base_grade + noise))
        records.append({
            "drill_id": f"DH-{i+1:03d}",
            "lat": round(lat, 5), "lon": round(lon, 5),
            "depth_m": round(depth, 1),
            "mn_grade_pct": round(mn_grade, 2),
            "fe_grade_pct": round(np.random.uniform(5, 20), 2),
            "sio2_pct": round(np.random.uniform(5, 25), 2),
            "geological_unit": np.random.choice(["BIF", "Shale", "Quartzite", "Phyllite", "Limestone"], p=[0.35, 0.25, 0.20, 0.12, 0.08]),
            "core_recovery_pct": round(np.random.uniform(70, 100), 1),
            "year": np.random.randint(2018, 2026)
        })
    df = pd.DataFrame(records)
    df.to_csv(os.path.join(DATASETS_DIR, 'geology', 'drill_holes.csv'), index=False)
    print(f"  [OK] drill_holes.csv ({len(df)} rows)")
    return df

def generate_production_history():
    months = pd.date_range(start='2023-01-01', periods=36, freq='MS')
    target = 166667  # tonnes/month for 2 Mt/year target
    records = []
    for i, month in enumerate(months):
        # Seasonal pattern: monsoon (Jun-Sep) affects production
        month_num = month.month
        is_monsoon = 1 if month_num in [6, 7, 8, 9] else 0
        rainfall = np.random.uniform(150, 350) if is_monsoon else np.random.uniform(0, 50)
        equip_avail = np.random.uniform(0.70, 0.95) - is_monsoon * 0.08
        equip_avail = max(0.60, min(0.98, equip_avail))
        blasting_days_lost = np.random.randint(0, 5) if is_monsoon else np.random.randint(0, 2)
        # Production correlated with equipment and weather
        production = target * equip_avail * (1 - blasting_days_lost * 0.03) * (1 - is_monsoon * 0.05)
        production += np.random.normal(0, 5000)
        production = max(100000, int(production))
        records.append({
            "month": month.strftime('%Y-%m'),
            "production_tonnes": production,
            "target_tonnes": target,
            "equipment_availability_pct": round(equip_avail * 100, 1),
            "rainfall_mm": round(rainfall, 1),
            "blasting_days_lost": blasting_days_lost,
            "haulage_delay_hrs": round(np.random.uniform(0, 20) + is_monsoon * 15, 1),
            "working_days": 26 - blasting_days_lost - (2 if is_monsoon else 0),
            "is_monsoon": is_monsoon
        })
    df = pd.DataFrame(records)
    df.to_csv(os.path.join(DATASETS_DIR, 'production', 'production_history.csv'), index=False)
    print(f"  [OK] production_history.csv ({len(df)} rows)")
    return df

def generate_equipment():
    machines = []
    types = {
        "EXC": {"name": "Excavator", "count": 6, "critical": True},
        "DMP": {"name": "Dumper", "count": 10, "critical": True},
        "DRL": {"name": "Drill Rig", "count": 4, "critical": True},
        "LDR": {"name": "Loader", "count": 4, "critical": False},
        "CRS": {"name": "Crusher", "count": 3, "critical": False},
    }
    for prefix, info in types.items():
        for j in range(1, info["count"] + 1):
            avail = round(np.random.uniform(0.65, 0.98), 2)
            risk = "HIGH" if avail < 0.75 else ("MEDIUM" if avail < 0.88 else "LOW")
            prod_impact = round(-(1 - avail) * 15, 1) if info["critical"] else round(-(1 - avail) * 5, 1)
            machines.append({
                "machine_id": f"{prefix}-{j:02d}",
                "type": info["name"],
                "availability_pct": round(avail * 100, 1),
                "operating_hours_monthly": round(avail * 600, 0),
                "downtime_hours_monthly": round((1 - avail) * 600, 0),
                "maintenance_status": np.random.choice(["OK", "SCHEDULED", "OVERDUE"], p=[0.55, 0.30, 0.15]),
                "failure_risk": risk,
                "production_impact_pct": prod_impact,
                "last_maintenance_days_ago": np.random.randint(5, 90),
                "hours_to_next_maintenance": np.random.randint(20, 400),
                "mine_assigned": np.random.choice(["Mine-A", "Mine-B", "Mine-C"]),
                "is_critical": info["critical"]
            })
    with open(os.path.join(DATASETS_DIR, 'equipment', 'equipment.json'), 'w') as f:
        json.dump(machines, f, indent=2)
    print(f"  [OK] equipment.json ({len(machines)} machines)")
    return machines

def generate_environment():
    months = pd.date_range(start='2023-01-01', periods=36, freq='MS')
    records = []
    for month in months:
        m = month.month
        is_monsoon = m in [6, 7, 8, 9]
        rainfall = round(np.random.uniform(150, 380) if is_monsoon else np.random.uniform(0, 60), 1)
        ndvi = round(np.random.uniform(0.55, 0.80) if is_monsoon else np.random.uniform(0.30, 0.55), 3)
        lst = round(np.random.uniform(28, 35) if is_monsoon else np.random.uniform(32, 42), 1)
        soil_moisture = round(np.random.uniform(0.35, 0.55) if is_monsoon else np.random.uniform(0.10, 0.30), 3)
        cloud_cover = round(np.random.uniform(60, 95) if is_monsoon else np.random.uniform(5, 40), 1)
        records.append({
            "month": month.strftime('%Y-%m'),
            "rainfall_mm": rainfall,
            "ndvi": ndvi,
            "land_surface_temp_c": lst,
            "soil_moisture": soil_moisture,
            "cloud_cover_pct": cloud_cover,
            "mining_accessibility_score": round(max(20, 100 - rainfall * 0.15 - cloud_cover * 0.3), 1),
            "haulage_risk": "HIGH" if rainfall > 200 else ("MEDIUM" if rainfall > 80 else "LOW"),
            "blasting_feasibility": "LOW" if rainfall > 150 else ("MEDIUM" if rainfall > 50 else "HIGH"),
        })
    df = pd.DataFrame(records)
    df.to_csv(os.path.join(DATASETS_DIR, 'environment', 'environment.csv'), index=False)
    print(f"  [OK] environment.csv ({len(df)} rows)")
    return df

def generate_geology_units():
    units = [
        {"id": "GU-01", "name": "Sausar Group Metasediments", "type": "Metasediment", "mn_potential": "High", "area_km2": 8.5, "lat": 21.65, "lon": 79.82, "age_ma": 1600},
        {"id": "GU-02", "name": "Gondwana Sedimentaries", "type": "Sedimentary", "mn_potential": "Low", "area_km2": 12.3, "lat": 21.90, "lon": 79.55, "age_ma": 250},
        {"id": "GU-03", "name": "Deccan Trap Basalt", "type": "Volcanic", "mn_potential": "Very Low", "area_km2": 15.7, "lat": 22.10, "lon": 79.95, "age_ma": 65},
        {"id": "GU-04", "name": "BIF-Shale Association", "type": "BIF", "mn_potential": "Very High", "area_km2": 6.2, "lat": 21.42, "lon": 79.75, "age_ma": 2000},
        {"id": "GU-05", "name": "Archaean Basement Complex", "type": "Metamorphic", "mn_potential": "Moderate", "area_km2": 9.8, "lat": 21.30, "lon": 80.05, "age_ma": 2800},
    ]
    with open(os.path.join(DATASETS_DIR, 'geology', 'geology_units.json'), 'w') as f:
        json.dump(units, f, indent=2)
    print(f"  [OK] geology_units.json ({len(units)} units)")
    return units

def generate_all():
    print("[INFO] Generating synthetic datasets...")
    os.makedirs(os.path.join(DATASETS_DIR, 'geology'), exist_ok=True)
    os.makedirs(os.path.join(DATASETS_DIR, 'production'), exist_ok=True)
    os.makedirs(os.path.join(DATASETS_DIR, 'equipment'), exist_ok=True)
    os.makedirs(os.path.join(DATASETS_DIR, 'environment'), exist_ok=True)

    zones = generate_prospectivity_zones()
    with open(os.path.join(DATASETS_DIR, 'geology', 'prospectivity_zones.json'), 'w') as f:
        json.dump(zones, f, indent=2)
    print(f"  [OK] prospectivity_zones.json ({len(zones)} zones)")

    generate_drill_holes()
    generate_production_history()
    generate_equipment()
    generate_environment()
    generate_geology_units()
    print("[OK] All datasets generated successfully.")

if __name__ == '__main__':
    generate_all()
