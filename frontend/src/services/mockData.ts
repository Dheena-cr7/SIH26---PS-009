export const MOCK_DASHBOARD = {
  data_mode: "DEMO",
  kpis: {
    monitored_area_km2: 24.6,
    high_prospectivity_zones: 7,
    estimated_resource_potential_mt: 14.8,
    resource_confidence_range: { low: 12.4, high: 17.2 },
    current_production_tonnes: 152340,
    forecast_production_mt: 1.84,
    production_target_mt: 2.00,
    shortfall_risk_pct: 68,
    shortfall_risk_level: 'HIGH',
    equipment_availability_pct: 82.3,
    critical_equipment_count: 4,
    average_mn_grade_pct: 31.4,
    total_drill_holes: 240,
  },
  alerts: [
    { id: 'AL-01', severity: 'HIGH', type: 'production', message: 'Production shortfall probability increased to 68%. Immediate action recommended.' },
    { id: 'AL-02', severity: 'MEDIUM', type: 'weather', message: 'Heavy rainfall (210mm) forecast for next 14-day operational window. Haulage risk elevated.' },
    { id: 'AL-03', severity: 'MEDIUM', type: 'equipment', message: 'EXC-04 availability at 71% — below 80% threshold. Schedule maintenance.' },
    { id: 'AL-04', severity: 'LOW', type: 'opportunity', message: 'MN-TARGET-01 identified as highest-priority zone (91% prospectivity, 84% confidence).' },
    { id: 'AL-05', severity: 'MEDIUM', type: 'equipment', message: 'DRL-03 maintenance overdue by 12 days. Failure risk elevated.' },
  ],
  shortfall_breakdown: [
    { factor: 'Equipment Downtime', contribution_pct: 31 },
    { factor: 'Weather / Rainfall', contribution_pct: 24 },
    { factor: 'Blasting Delay', contribution_pct: 18 },
    { factor: 'Haulage Constraints', contribution_pct: 15 },
    { factor: 'Other', contribution_pct: 12 },
  ]
}

export const MOCK_ZONES = [
  {
    id: "MN-TARGET-01", name: "Balaghat North Extension", lat: 22.05, lon: 80.18,
    prospectivity_score: 91, confidence: 84, priority: "VERY HIGH", color: "#ef4444",
    polygon: [[22.03, 80.14], [22.03, 80.22], [22.07, 80.22], [22.07, 80.14]],
    evidence: { satellite: "Strong", geological: "Strong", terrain: "Moderate", historical: "Strong" },
    feature_importance: { spectral_signature: 31, geology: 27, structural_proximity: 18, terrain: 12, historical_evidence: 12 },
    recommendation: "Prioritize exploratory diamond drilling. High alteration index and fault intersections.",
    mn_grade_estimate: 31.2, area_km2: 3.2
  },
  {
    id: "MN-TARGET-09", name: "Sitasaongi North", lat: 21.30, lon: 79.88,
    prospectivity_score: 88, confidence: 82, priority: "VERY HIGH", color: "#ef4444",
    polygon: [[21.28, 79.85], [21.28, 79.91], [21.32, 79.91], [21.32, 79.85]],
    evidence: { satellite: "Strong", geological: "Strong", terrain: "Strong", historical: "Strong" },
    feature_importance: { spectral_signature: 30, geology: 28, structural_proximity: 17, terrain: 13, historical_evidence: 12 },
    recommendation: "Critical priority — drill intercepts from adjacent areas confirm strong manganese horizon.",
    mn_grade_estimate: 30.8, area_km2: 3.5
  },
  {
    id: "MN-TARGET-02", name: "Dongri Buzurg South", lat: 21.98, lon: 79.85,
    prospectivity_score: 83, confidence: 79, priority: "HIGH", color: "#f97316",
    polygon: [[21.96, 79.82], [21.96, 79.88], [22.00, 79.88], [22.00, 79.82]],
    evidence: { satellite: "Strong", geological: "Strong", terrain: "Moderate", historical: "Moderate" },
    feature_importance: { spectral_signature: 28, geology: 30, structural_proximity: 20, terrain: 11, historical_evidence: 11 },
    recommendation: "Schedule magnetic survey & exploratory core drillholes in Q1 cycle.",
    mn_grade_estimate: 27.8, area_km2: 2.8
  },
  {
    id: "MN-TARGET-03", name: "Ukwa Central Extension", lat: 21.65, lon: 79.62,
    prospectivity_score: 76, confidence: 78, priority: "HIGH", color: "#f97316",
    polygon: [[21.63, 79.59], [21.63, 79.65], [21.67, 79.65], [21.67, 79.59]],
    evidence: { satellite: "Moderate", geological: "Strong", terrain: "Moderate", historical: "Moderate" },
    feature_importance: { spectral_signature: 26, geology: 29, structural_proximity: 22, terrain: 12, historical_evidence: 11 },
    recommendation: "High potential zone. Gondite band continuity confirmed by geological mapping.",
    mn_grade_estimate: 25.4, area_km2: 4.1
  },
  {
    id: "MN-TARGET-07", name: "Tirodi Extension Block", lat: 21.75, lon: 79.98,
    prospectivity_score: 72, confidence: 74, priority: "HIGH", color: "#f97316",
    polygon: [[21.73, 79.95], [21.73, 80.01], [21.77, 80.01], [21.77, 79.95]],
    evidence: { satellite: "Moderate", geological: "Strong", terrain: "Moderate", historical: "Moderate" },
    feature_importance: { spectral_signature: 27, geology: 28, structural_proximity: 21, terrain: 12, historical_evidence: 12 },
    recommendation: "Strong structural fold control evident. Target synclinal fold limbs.",
    mn_grade_estimate: 24.6, area_km2: 2.7
  },
  {
    id: "MN-TARGET-04", name: "Kandri Northeast", lat: 21.42, lon: 79.38,
    prospectivity_score: 67, confidence: 72, priority: "MODERATE", color: "#eab308",
    polygon: [[21.40, 79.35], [21.40, 79.41], [21.44, 79.41], [21.44, 79.35]],
    evidence: { satellite: "Moderate", geological: "Moderate", terrain: "Low", historical: "Moderate" },
    feature_importance: { spectral_signature: 23, geology: 31, structural_proximity: 20, terrain: 14, historical_evidence: 12 },
    recommendation: "Conduct detailed ground IP/resistivity survey prior to drilling.",
    mn_grade_estimate: 22.1, area_km2: 2.4
  },
  {
    id: "MN-TARGET-10", name: "Beldongri Southeast", lat: 22.22, lon: 80.05,
    prospectivity_score: 63, confidence: 68, priority: "MODERATE", color: "#eab308",
    polygon: [[22.20, 80.02], [22.20, 80.08], [22.24, 80.08], [22.24, 80.02]],
    evidence: { satellite: "Moderate", geological: "Moderate", terrain: "Low", historical: "Moderate" },
    feature_importance: { spectral_signature: 24, geology: 29, structural_proximity: 22, terrain: 13, historical_evidence: 12 },
    recommendation: "Moderate alteration index. Soil geochemistry sampling scheduled.",
    mn_grade_estimate: 21.5, area_km2: 2.1
  }
]

export const MOCK_RESOURCES = {
  data_mode: "DEMO",
  estimated_resource_potential_mt: 14.8,
  confidence_interval: { low_mt: 12.4, high_mt: 17.2 },
  confidence_pct: 82,
  average_mn_grade_pct: 31.4,
  high_grade_intercepts: 58,
  total_drill_holes: 240,
  drill_coverage_km2: 22.5,
  data_quality_score: 84,
  unfc_breakdown: {
    measured_111: { mt: 6.2, grade: 36.4, pct: 42 },
    indicated_122: { mt: 5.4, grade: 29.8, pct: 36 },
    inferred_333: { mt: 3.2, grade: 22.5, pct: 22 },
  },
  grade_distribution: [
    { range: '5-15%', count: 18, pct: 7.5, category: 'Low Grade / Waste' },
    { range: '15-22%', count: 32, pct: 13.3, category: 'Sub-Economic' },
    { range: '22-28%', count: 64, pct: 26.6, category: 'Medium Grade' },
    { range: '28-35%', count: 72, pct: 30.0, category: 'High Grade' },
    { range: '35-42%', count: 38, pct: 15.8, category: 'Premium Grade' },
    { range: '42-48%+', count: 16, pct: 6.8, category: 'Battery / Ferromanganese Grade' },
  ],
  geological_units: [
    { name: 'Mansar Formation (Gondite Ore Bed)', type: 'Metasedimentary Manganiferous', mn_potential: 'Very High', area_km2: 9.4, avg_grade: '38.2%' },
    { name: 'Sitasaongi Formation (Footwall Schist)', type: 'Quartz-Muscovite Schist', mn_potential: 'Moderate', area_km2: 6.8, avg_grade: '18.4%' },
    { name: 'Tirodi Biotite Gneiss (Basement)', type: 'Granitoid Crystalline Complex', mn_potential: 'Low (Barren)', area_km2: 14.2, avg_grade: '4.1%' },
    { name: 'Lohangi Calc-Silicate Horizon', type: 'Dolomitic & Marble Band', mn_potential: 'Moderate', area_km2: 5.1, avg_grade: '21.0%' },
  ]
}

export const MOCK_PRODUCTION_HISTORY = [
  { month: '2025-04', production_tonnes: 148200, target_tonnes: 166667, equipment_availability_pct: 86.4, rainfall_mm: 12.0, blasting_days_lost: 0, haulage_delay_hrs: 6.2, working_days: 26, is_monsoon: 0 },
  { month: '2025-05', production_tonnes: 162400, target_tonnes: 166667, equipment_availability_pct: 88.1, rainfall_mm: 24.5, blasting_days_lost: 1, haulage_delay_hrs: 7.8, working_days: 25, is_monsoon: 0 },
  { month: '2025-06', production_tonnes: 143100, target_tonnes: 166667, equipment_availability_pct: 80.5, rainfall_mm: 185.0, blasting_days_lost: 3, haulage_delay_hrs: 22.4, working_days: 23, is_monsoon: 1 },
  { month: '2025-07', production_tonnes: 138800, target_tonnes: 166667, equipment_availability_pct: 78.2, rainfall_mm: 290.0, blasting_days_lost: 4, haulage_delay_hrs: 28.0, working_days: 22, is_monsoon: 1 },
  { month: '2025-08', production_tonnes: 141200, target_tonnes: 166667, equipment_availability_pct: 79.8, rainfall_mm: 265.0, blasting_days_lost: 4, haulage_delay_hrs: 26.5, working_days: 22, is_monsoon: 1 },
  { month: '2025-09', production_tonnes: 152340, target_tonnes: 166667, equipment_availability_pct: 82.3, rainfall_mm: 140.0, blasting_days_lost: 2, haulage_delay_hrs: 18.0, working_days: 24, is_monsoon: 1 },
]

export const MOCK_PRODUCTION_FORECAST = [
  { month: '2025-10', forecast_tonnes: 158400, target_tonnes: 166667, is_forecast: true, equipment_availability_pct: 85.0, rainfall_mm: 35.0 },
  { month: '2025-11', forecast_tonnes: 164200, target_tonnes: 166667, is_forecast: true, equipment_availability_pct: 88.5, rainfall_mm: 10.0 },
  { month: '2025-12', forecast_tonnes: 167500, target_tonnes: 166667, is_forecast: true, equipment_availability_pct: 89.0, rainfall_mm: 5.0 },
  { month: '2026-01', forecast_tonnes: 169000, target_tonnes: 166667, is_forecast: true, equipment_availability_pct: 90.2, rainfall_mm: 8.0 },
  { month: '2026-02', forecast_tonnes: 166800, target_tonnes: 166667, is_forecast: true, equipment_availability_pct: 89.4, rainfall_mm: 12.0 },
  { month: '2026-03', forecast_tonnes: 171200, target_tonnes: 166667, is_forecast: true, equipment_availability_pct: 91.0, rainfall_mm: 15.0 },
]

export const MOCK_SHORTFALL = {
  shortfall_risk_pct: 68,
  risk_level: "HIGH",
  expected_annual_gap_kt: 160,
  contributing_factors: [
    {"factor": "Equipment Downtime", "contribution_pct": 31, "shap_value": 0.18},
    {"factor": "Rainfall / Weather", "contribution_pct": 24, "shap_value": 0.15},
    {"factor": "Blasting Delay", "contribution_pct": 18, "shap_value": 0.13},
    {"factor": "Haulage Constraints", "contribution_pct": 15, "shap_value": 0.09},
    {"factor": "Grade Dilution", "contribution_pct": 12, "shap_value": 0.06}
  ]
}

export const MOCK_EQUIPMENT = {
  machines: [
    { machine_id: "EXC-01", type: "Excavator", availability_pct: 89.5, operating_hours_monthly: 537, downtime_hours_monthly: 63, maintenance_status: "OK", failure_risk: "LOW", production_impact_pct: -1.5, last_maintenance_days_ago: 18, hours_to_next_maintenance: 220, mine_assigned: "Balaghat Mine", is_critical: true },
    { machine_id: "EXC-02", type: "Excavator", availability_pct: 68.2, operating_hours_monthly: 409, downtime_hours_monthly: 191, maintenance_status: "OVERDUE", failure_risk: "HIGH", production_impact_pct: -4.8, last_maintenance_days_ago: 64, hours_to_next_maintenance: 0, mine_assigned: "Dongri Buzurg", is_critical: true },
    { machine_id: "EXC-03", type: "Excavator", availability_pct: 84.0, operating_hours_monthly: 504, downtime_hours_monthly: 96, maintenance_status: "SCHEDULED", failure_risk: "MEDIUM", production_impact_pct: -2.4, last_maintenance_days_ago: 38, hours_to_next_maintenance: 45, mine_assigned: "Sitasaongi", is_critical: true },
    { machine_id: "EXC-04", type: "Excavator", availability_pct: 71.4, operating_hours_monthly: 428, downtime_hours_monthly: 172, maintenance_status: "SCHEDULED", failure_risk: "HIGH", production_impact_pct: -4.2, last_maintenance_days_ago: 48, hours_to_next_maintenance: 12, mine_assigned: "Balaghat Mine", is_critical: true },
    { machine_id: "DMP-01", type: "Dumper", availability_pct: 92.0, operating_hours_monthly: 552, downtime_hours_monthly: 48, maintenance_status: "OK", failure_risk: "LOW", production_impact_pct: -1.2, last_maintenance_days_ago: 12, hours_to_next_maintenance: 310, mine_assigned: "Balaghat Mine", is_critical: true },
    { machine_id: "DMP-02", type: "Dumper", availability_pct: 74.5, operating_hours_monthly: 447, downtime_hours_monthly: 153, maintenance_status: "SCHEDULED", failure_risk: "MEDIUM", production_impact_pct: -3.8, last_maintenance_days_ago: 42, hours_to_next_maintenance: 28, mine_assigned: "Dongri Buzurg", is_critical: true },
    { machine_id: "DMP-03", type: "Dumper", availability_pct: 88.0, operating_hours_monthly: 528, downtime_hours_monthly: 72, maintenance_status: "OK", failure_risk: "LOW", production_impact_pct: -1.8, last_maintenance_days_ago: 22, hours_to_next_maintenance: 180, mine_assigned: "Sitasaongi", is_critical: true },
    { machine_id: "DMP-04", type: "Dumper", availability_pct: 91.2, operating_hours_monthly: 547, downtime_hours_monthly: 53, maintenance_status: "OK", failure_risk: "LOW", production_impact_pct: -1.3, last_maintenance_days_ago: 15, hours_to_next_maintenance: 290, mine_assigned: "Ukwa Mine", is_critical: true },
    { machine_id: "DRL-01", type: "Drill Rig", availability_pct: 86.0, operating_hours_monthly: 516, downtime_hours_monthly: 84, maintenance_status: "OK", failure_risk: "LOW", production_impact_pct: -2.1, last_maintenance_days_ago: 25, hours_to_next_maintenance: 160, mine_assigned: "Balaghat Mine", is_critical: true },
    { machine_id: "DRL-02", type: "Drill Rig", availability_pct: 72.0, operating_hours_monthly: 432, downtime_hours_monthly: 168, maintenance_status: "OVERDUE", failure_risk: "HIGH", production_impact_pct: -4.2, last_maintenance_days_ago: 58, hours_to_next_maintenance: 0, mine_assigned: "Dongri Buzurg", is_critical: true },
    { machine_id: "DRL-03", type: "Drill Rig", availability_pct: 76.5, operating_hours_monthly: 459, downtime_hours_monthly: 141, maintenance_status: "SCHEDULED", failure_risk: "MEDIUM", production_impact_pct: -3.5, last_maintenance_days_ago: 44, hours_to_next_maintenance: 18, mine_assigned: "Tirodi Mine", is_critical: true },
    { machine_id: "CRS-01", type: "Crusher", availability_pct: 94.0, operating_hours_monthly: 564, downtime_hours_monthly: 36, maintenance_status: "OK", failure_risk: "LOW", production_impact_pct: -0.9, last_maintenance_days_ago: 10, hours_to_next_maintenance: 400, mine_assigned: "Central Processing", is_critical: false },
  ]
}

export const MOCK_ENVIRONMENT = {
  latest: {
    rainfall_mm: 210.0,
    ndvi: 0.685,
    land_surface_temp_c: 31.4,
    soil_moisture: 0.46,
    cloud_cover_pct: 78.0,
    mining_accessibility_score: 54.2,
    haulage_risk: "HIGH",
    blasting_feasibility: "LOW"
  },
  history: [
    { month: '2024-10', rainfall_mm: 38.0, ndvi: 0.540, land_surface_temp_c: 32.5, soil_moisture: 0.22, cloud_cover_pct: 25.0, mining_accessibility_score: 84.0, haulage_risk: "LOW", blasting_feasibility: "HIGH" },
    { month: '2024-11', rainfall_mm: 14.0, ndvi: 0.480, land_surface_temp_c: 30.1, soil_moisture: 0.18, cloud_cover_pct: 15.0, mining_accessibility_score: 92.0, haulage_risk: "LOW", blasting_feasibility: "HIGH" },
    { month: '2024-12', rainfall_mm: 8.0,  ndvi: 0.420, land_surface_temp_c: 26.8, soil_moisture: 0.15, cloud_cover_pct: 10.0, mining_accessibility_score: 96.0, haulage_risk: "LOW", blasting_feasibility: "HIGH" },
    { month: '2025-01', rainfall_mm: 12.0, ndvi: 0.390, land_surface_temp_c: 25.4, soil_moisture: 0.14, cloud_cover_pct: 12.0, mining_accessibility_score: 95.0, haulage_risk: "LOW", blasting_feasibility: "HIGH" },
    { month: '2025-02', rainfall_mm: 18.0, ndvi: 0.360, land_surface_temp_c: 29.8, soil_moisture: 0.13, cloud_cover_pct: 14.0, mining_accessibility_score: 93.0, haulage_risk: "LOW", blasting_feasibility: "HIGH" },
    { month: '2025-03', rainfall_mm: 22.0, ndvi: 0.340, land_surface_temp_c: 35.2, soil_moisture: 0.12, cloud_cover_pct: 18.0, mining_accessibility_score: 91.0, haulage_risk: "LOW", blasting_feasibility: "HIGH" },
    { month: '2025-04', rainfall_mm: 32.0, ndvi: 0.320, land_surface_temp_c: 39.5, soil_moisture: 0.11, cloud_cover_pct: 22.0, mining_accessibility_score: 88.0, haulage_risk: "LOW", blasting_feasibility: "HIGH" },
    { month: '2025-05', rainfall_mm: 48.0, ndvi: 0.350, land_surface_temp_c: 41.2, soil_moisture: 0.14, cloud_cover_pct: 35.0, mining_accessibility_score: 82.0, haulage_risk: "LOW", blasting_feasibility: "HIGH" },
    { month: '2025-06', rainfall_mm: 185.0, ndvi: 0.580, land_surface_temp_c: 33.4, soil_moisture: 0.42, cloud_cover_pct: 72.0, mining_accessibility_score: 58.0, haulage_risk: "HIGH", blasting_feasibility: "LOW" },
    { month: '2025-07', rainfall_mm: 290.0, ndvi: 0.720, land_surface_temp_c: 29.6, soil_moisture: 0.52, cloud_cover_pct: 88.0, mining_accessibility_score: 42.0, haulage_risk: "HIGH", blasting_feasibility: "LOW" },
    { month: '2025-08', rainfall_mm: 265.0, ndvi: 0.740, land_surface_temp_c: 30.2, soil_moisture: 0.49, cloud_cover_pct: 84.0, mining_accessibility_score: 46.0, haulage_risk: "HIGH", blasting_feasibility: "LOW" },
    { month: '2025-09', rainfall_mm: 210.0, ndvi: 0.685, land_surface_temp_c: 31.4, soil_moisture: 0.46, cloud_cover_pct: 78.0, mining_accessibility_score: 54.2, haulage_risk: "HIGH", blasting_feasibility: "LOW" },
  ],
  satellite_datasets: [
    { name: "Sentinel-2 Multi-Spectral (ESA)", resolution: "10m - 20m", bands: "B2, B3, B4, B8, B11, B12", update_frequency: "5 Days", status: "Live Feed Connected" },
    { name: "Landsat-8/9 OLI/TIRS (USGS/NASA)", resolution: "30m (Thermal 100m)", bands: "OLI Band 1-7, Thermal Band 10", update_frequency: "16 Days", status: "Operational" },
    { name: "ISRO MOSDAC / Cartosat-3", resolution: "0.28m Stereo DEM", bands: "Panchromatic & Multi-spectral", update_frequency: "On-demand", status: "Archive Synced" }
  ]
}

export const MOCK_MODELS = {
  models: [
    {
      id: "prospectivity", name: "Prospectivity AI Classifier",
      algorithm: "XGBoost Classifier", purpose: "Classify manganese prospectivity from geological and spectral features",
      metric: "AUC-ROC", metric_value: 0.89,
      features: ["spectral_signature", "geology", "structural_proximity", "terrain", "historical_evidence", "ndvi", "elevation", "slope"],
      disclaimer: "Calibrated on Sausar Belt regional exploration datasets"
    },
    {
      id: "production", name: "Production Forecast Model",
      algorithm: "XGBoost Regressor", purpose: "Forecast monthly production from operational & meteorological parameters",
      metric: "R² Score", metric_value: 0.91,
      features: ["equipment_availability_pct", "rainfall_mm", "blasting_days_lost", "haulage_delay_hrs", "working_days", "is_monsoon"],
      disclaimer: "Trained on historical monthly extraction actuals"
    },
    {
      id: "shortfall", name: "Shortfall Risk Classifier",
      algorithm: "XGBoost Classifier", purpose: "Predict probability of monthly production shortfall (14-30 day early alert)",
      metric: "F1 Score", metric_value: 0.87,
      features: ["equipment_availability_pct", "rainfall_mm", "blasting_days_lost", "haulage_delay_hrs", "working_days", "is_monsoon"],
      shap_values: [
        { feature: "Equipment Downtime", shap: 0.18 },
        { feature: "Monsoon Rainfall", shap: 0.15 },
        { feature: "Blasting Delay", shap: 0.13 },
        { feature: "Haulage Distance", shap: 0.09 },
        { feature: "Fleet Availability", shap: -0.07 },
      ],
      disclaimer: "Real-time SHAP attribution explainability engine"
    },
    {
      id: "equipment", name: "Equipment Risk Classifier",
      algorithm: "Random Forest & XGBoost", purpose: "Predict equipment failure risk from live telemetry and maintenance history",
      metric: "Accuracy", metric_value: 0.85,
      features: ["availability_pct", "operating_hours", "days_since_maintenance", "hydraulic_pressure", "engine_temp"],
      disclaimer: "Integrated with HEMM telematics log stream"
    },
  ],
  data_mode: "DEMO"
}

export const MOCK_RECOMMENDATIONS = {
  total_potential_improvement_pct: 9.4,
  recommendations: [
    {
      id: "REC-01",
      title: "Deploy 2 Standby Excavators to Pit Floor 4 (Dongri Buzurg)",
      category: "Equipment Optimization",
      urgency: "HIGH",
      potential_gain_pct: 4.5,
      impact_tonnes: 7500,
      description: "Compensates for scheduled hydraulic overhaul on Excavator EXC-02. Reallocates reserve units to maintain high cycle rates.",
      action_items: ["Transfer EXC-01 standby crew to Bench 4", "Pre-position diesel bowsers at South ramp"]
    },
    {
      id: "REC-02",
      title: "Implement Smart Ore Blending (Balaghat High-Grade + Tirodi Medium-Grade)",
      category: "Grade Blending",
      urgency: "MEDIUM",
      potential_gain_pct: 3.2,
      impact_tonnes: 5330,
      description: "Maintains required 38% Mn plant delivery specification while reducing grade dilution by 12%.",
      action_items: ["Set blending hopper feed ratio to 60:40", "Activate real-time XRF grade sensor on Conveyor 2"]
    },
    {
      id: "REC-03",
      title: "Optimize Pit Drainage Sump Pumping Schedule",
      category: "Weather Mitigation",
      urgency: "MEDIUM",
      potential_gain_pct: 1.7,
      impact_tonnes: 2830,
      description: "Pre-clears pit sumps prior to forecasted heavy precipitation front to prevent haulage ramp flooding.",
      action_items: ["Double pumping rate during night shift", "Clear drainage channels on West face"]
    }
  ]
}

export function computeLocalSimulation(params: {
  equipment_availability_pct: number
  rainfall_scenario: string
  blasting_delay_days: number
  equipment_redeployment: boolean
  working_hours: number
}) {
  const rainPenaltyMap: Record<string, number> = { LOW: 0, MODERATE: 8, HEAVY: 22 }
  const rainPenalty = rainPenaltyMap[params.rainfall_scenario] || 8
  const equipAvail = params.equipment_availability_pct
  const blastDelay = params.blasting_delay_days
  const redeployBonus = params.equipment_redeployment ? 6.5 : 0
  const hoursFactor = params.working_hours / 8.0

  const baselineRisk = 68
  const baselineProd = 1.84

  let shortfallRisk = baselineRisk
  shortfallRisk -= (equipAvail - 82) * 0.8
  shortfallRisk += rainPenalty * 0.7
  shortfallRisk += (blastDelay - 3) * 3.5
  shortfallRisk -= redeployBonus * 1.2
  shortfallRisk -= (hoursFactor - 1.0) * 15
  shortfallRisk = Math.max(8, Math.min(95, Math.round(shortfallRisk)))

  const baseMonthly = 166667 * (equipAvail / 100) * (1 - blastDelay * 0.025) * (1 - rainPenalty * 0.008) * hoursFactor
  const monthlyProd = Math.round(baseMonthly * (1 + (redeployBonus / 100)))
  const annualProdMt = Math.round((monthlyProd * 12 / 1e6) * 100) / 100
  const improvementPct = Math.round(((annualProdMt - baselineProd) / baselineProd * 100) * 10) / 10

  return {
    inputs: params,
    results: {
      monthly_production_tonnes: monthlyProd,
      annual_production_mt: annualProdMt,
      production_target_mt: 2.00,
      shortfall_risk_pct: shortfallRisk,
      risk_level: shortfallRisk >= 60 ? "HIGH" : (shortfallRisk >= 35 ? "MEDIUM" : "LOW"),
      production_gap_kt: Math.max(0, Math.round((2.00 - annualProdMt) * 1000)),
      equipment_utilization_pct: Math.round(equipAvail * hoursFactor * 0.95 * 10) / 10,
      improvement_vs_baseline_pct: improvementPct,
    },
    baseline: {
      annual_production_mt: baselineProd,
      shortfall_risk_pct: baselineRisk,
    },
    data_mode: "CLIENT_SIMULATION"
  }
}
