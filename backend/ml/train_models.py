"""
Manganese Intelligence — ML Training Module
Trains and caches all ML models used by the API.
Uses XGBoost for prospectivity, production forecasting, shortfall, and equipment risk.
"""

import numpy as np
import pandas as pd
import pickle
import os
import json
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, r2_score, f1_score, accuracy_score
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'models')
DATASETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'datasets')


def ensure_models_dir():
    os.makedirs(MODELS_DIR, exist_ok=True)


def train_prospectivity_model():
    """Train XGBoost classifier for manganese prospectivity scoring."""
    np.random.seed(42)
    n = 1000

    # Synthetic feature space
    spectral = np.random.uniform(20, 100, n)
    geology = np.random.uniform(10, 100, n)
    structural = np.random.uniform(10, 100, n)
    terrain = np.random.uniform(20, 100, n)
    historical = np.random.uniform(10, 100, n)
    ndvi = np.random.uniform(0.2, 0.8, n)
    elevation = np.random.uniform(300, 700, n)
    slope = np.random.uniform(1, 25, n)

    # Label: high prospectivity (score > 65)
    score = 0.30 * spectral + 0.27 * geology + 0.18 * structural + 0.12 * terrain + 0.12 * historical
    score += np.random.normal(0, 5, n)
    labels = (score > 65).astype(int)

    X = np.column_stack([spectral, geology, structural, terrain, historical, ndvi, elevation, slope])
    y = labels

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = xgb.XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42, eval_metric='logloss')
    model.fit(X_train, y_train)

    y_prob = model.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, y_prob)

    ensure_models_dir()
    with open(os.path.join(MODELS_DIR, 'prospectivity_model.pkl'), 'wb') as f:
        pickle.dump(model, f)

    feature_names = ['spectral_signature', 'geology', 'structural_proximity', 'terrain', 'historical_evidence', 'ndvi', 'elevation', 'slope']
    importances = dict(zip(feature_names, [round(v * 100, 1) for v in model.feature_importances_]))

    metrics = {"auc": round(auc, 3), "feature_importance": importances}
    print(f"  [OK] Prospectivity model -- AUC: {auc:.3f}")
    return model, metrics


def train_production_forecast_model():
    """Train XGBoost regressor for monthly production forecasting."""
    prod_path = os.path.join(DATASETS_DIR, 'production', 'production_history.csv')
    df = pd.read_csv(prod_path)

    features = ['equipment_availability_pct', 'rainfall_mm', 'blasting_days_lost',
                 'haulage_delay_hrs', 'working_days', 'is_monsoon']
    X = df[features].values
    y = df['production_tonnes'].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = xgb.XGBRegressor(n_estimators=150, max_depth=4, learning_rate=0.08, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)

    with open(os.path.join(MODELS_DIR, 'production_model.pkl'), 'wb') as f:
        pickle.dump((model, features), f)

    metrics = {"r2": round(r2, 3), "features": features}
    print(f"  [OK] Production model -- R2: {r2:.3f}")
    return model, features, metrics


def train_shortfall_model():
    """Train XGBoost classifier for production shortfall risk prediction."""
    # Use fully synthetic data to ensure class balance
    np.random.seed(42)
    n = 500
    equip_arr = np.random.uniform(60, 99, n)
    rain_arr = np.random.uniform(0, 380, n)
    blast_arr = np.random.uniform(0, 8, n)
    haul_arr = rain_arr * 0.08 + blast_arr * 2 + np.random.normal(0, 2, n)
    haul_arr = np.clip(haul_arr, 0, 80)
    mon_arr = (rain_arr > 100).astype(float)
    wd_arr = np.clip(26 - blast_arr - mon_arr * 3, 18, 26)
    prod_arr = 166667 * (equip_arr / 100) * (1 - blast_arr * 0.025) * (1 - mon_arr * 0.06)
    prod_arr += np.random.normal(0, 8000, n)
    y = (prod_arr < 166667).astype(int)

    features = ['equipment_availability_pct', 'rainfall_mm', 'blasting_days_lost',
                 'haulage_delay_hrs', 'working_days', 'is_monsoon']
    X = np.column_stack([equip_arr, rain_arr, blast_arr, haul_arr, wd_arr, mon_arr])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    model = xgb.XGBClassifier(n_estimators=120, max_depth=4, learning_rate=0.1, random_state=42, eval_metric='logloss')
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    f1 = f1_score(y_test, y_pred, zero_division=0)

    with open(os.path.join(MODELS_DIR, 'shortfall_model.pkl'), 'wb') as f:
        pickle.dump((model, features), f)

    importances = dict(zip(features, [round(v * 100, 1) for v in model.feature_importances_]))
    metrics = {"f1": round(f1, 3), "feature_importance": importances}
    print(f"  OK Shortfall model - F1: {f1:.3f}")
    return model, features, metrics


def train_equipment_risk_model():
    """Train Random Forest-style XGBoost for equipment failure risk."""
    np.random.seed(42)
    n = 600
    availability = np.random.uniform(0.60, 0.99, n)
    hours = np.random.uniform(100, 700, n)
    days_since_maintenance = np.random.uniform(5, 120, n)
    hours_to_next = np.random.uniform(10, 500, n)

    # Risk is HIGH if availability < 0.78 or overdue maintenance
    risk = ((availability < 0.78) | (days_since_maintenance > 80)).astype(int)
    risk_noise = np.random.binomial(1, 0.05, n)
    risk = np.clip(risk + risk_noise, 0, 1)

    X = np.column_stack([availability, hours, days_since_maintenance, hours_to_next])
    y = risk

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = xgb.XGBClassifier(n_estimators=80, max_depth=3, random_state=42, eval_metric='logloss')
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    with open(os.path.join(MODELS_DIR, 'equipment_risk_model.pkl'), 'wb') as f:
        pickle.dump(model, f)

    metrics = {"accuracy": round(acc, 3)}
    print(f"  [OK] Equipment risk model -- Accuracy: {acc:.3f}")
    return model, metrics


def train_all():
    print("[INFO] Training ML models...")
    ensure_models_dir()
    results = {}

    _, prosp_metrics = train_prospectivity_model()
    _, _, prod_metrics = train_production_forecast_model()
    _, _, short_metrics = train_shortfall_model()
    _, equip_metrics = train_equipment_risk_model()

    results = {
        "prospectivity": {"name": "Prospectivity Classifier", "algorithm": "XGBoost", **{k: float(v) if isinstance(v, (float, int)) else v for k, v in prosp_metrics.items()}},
        "production": {"name": "Production Forecast", "algorithm": "XGBoost Regressor", **{k: float(v) if isinstance(v, (float, int)) else v for k, v in prod_metrics.items()}},
        "shortfall": {"name": "Shortfall Risk Classifier", "algorithm": "XGBoost", **{k: float(v) if isinstance(v, (float, int)) else v for k, v in short_metrics.items()}},
        "equipment": {"name": "Equipment Risk Classifier", "algorithm": "XGBoost", **{k: float(v) if isinstance(v, (float, int)) else v for k, v in equip_metrics.items()}},
    }

    class NpEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, (np.integer,)):
                return int(obj)
            if isinstance(obj, (np.floating, float)):
                return float(obj)
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            return super().default(obj)

    with open(os.path.join(MODELS_DIR, 'model_metrics.json'), 'w') as f:
        json.dump(results, f, indent=2, cls=NpEncoder)

    print("[OK] All models trained and saved.")
    return results


if __name__ == '__main__':
    train_all()
