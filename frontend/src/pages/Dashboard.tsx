import { useEffect, useState } from 'react'
import { getDashboard } from '../services/api'
import { AlertTriangle, TrendingDown, Zap, Activity, Cpu, CloudRain, Target, Map } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'

const DEMO_DATA = {
  kpis: {
    monitored_area_km2: 24.6, high_prospectivity_zones: 7, estimated_resource_potential_mt: 12.8,
    resource_confidence_range: { low: 10.4, high: 15.1 }, current_production_tonnes: 152340,
    forecast_production_mt: 1.84, production_target_mt: 2.00, shortfall_risk_pct: 68,
    shortfall_risk_level: 'HIGH', equipment_availability_pct: 82.3, critical_equipment_count: 4,
    average_mn_grade_pct: 28.6, total_drill_holes: 200,
  },
  alerts: [
    { id: 'AL-01', severity: 'HIGH', type: 'production', message: 'Production shortfall probability increased to 68%. Immediate action recommended.' },
    { id: 'AL-02', severity: 'MEDIUM', type: 'weather', message: 'Heavy rainfall (210mm) forecast for next 14-day operational window. Haulage risk elevated.' },
    { id: 'AL-03', severity: 'MEDIUM', type: 'equipment', message: 'EXC-04 availability at 71% — below 80% threshold. Schedule maintenance.' },
    { id: 'AL-04', severity: 'LOW', type: 'opportunity', message: 'MN-TARGET-01 identified as highest-priority zone (91% prospectivity, 84% confidence).' },
  ],
  shortfall_breakdown: [
    { factor: 'Equipment Downtime', contribution_pct: 31 },
    { factor: 'Weather / Rainfall', contribution_pct: 24 },
    { factor: 'Blasting Delay', contribution_pct: 18 },
    { factor: 'Haulage Constraints', contribution_pct: 15 },
    { factor: 'Other', contribution_pct: 12 },
  ],
}

const SHORTFALL_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#8b5cf6']

function KPICard({ label, value, sub, color = '#f97316', icon: Icon }: any) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>
        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold text-text-primary mt-1">{value}</div>
      {sub && <div className="text-xs text-text-muted">{sub}</div>}
    </div>
  )
}

function AlertItem({ alert }: any) {
  const colors: any = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e' }
  const bg: any = { HIGH: 'rgba(239,68,68,0.06)', MEDIUM: 'rgba(245,158,11,0.06)', LOW: 'rgba(34,197,94,0.06)' }
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border" style={{ backgroundColor: bg[alert.severity], borderColor: `${colors[alert.severity]}25` }}>
      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors[alert.severity] }} />
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold uppercase" style={{ color: colors[alert.severity] }}>{alert.severity}</span>
          <span className="text-xs text-text-muted capitalize">{alert.type}</span>
        </div>
        <p className="text-xs text-text-secondary">{alert.message}</p>
      </div>
    </div>
  )
}

import AIVoiceBriefing from '../components/AIVoiceBriefing'

export default function Dashboard() {
  const [data, setData] = useState<any>(DEMO_DATA)
  const navigate = useNavigate()

  useEffect(() => {
    getDashboard().then(setData).catch(() => {})
  }, [])

  const d = data || DEMO_DATA
  const k = d.kpis

  const productionData = [
    { month: 'Apr', actual: 148200, target: 166667 },
    { month: 'May', actual: 162400, target: 166667 },
    { month: 'Jun', actual: 143100, target: 166667 },
    { month: 'Jul', actual: 138800, target: 166667 },
    { month: 'Aug', actual: 141200, target: 166667 },
    { month: 'Sep', actual: k.current_production_tonnes, target: 166667 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Executive Command Center</h1>
          <p className="text-text-muted text-sm mt-0.5">OreSeek Mine Intelligence — Central India Operations Scenario</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="demo-badge">DEMO DATA MODE</span>
          <button onClick={() => navigate('/simulator')} className="btn-primary flex items-center gap-2 text-xs">
            <Zap className="w-3.5 h-3.5" /> Run Simulator
          </button>
        </div>
      </div>

      {/* AI Voice Situation Room Audio Briefing */}
      <AIVoiceBriefing />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <KPICard label="Monitored Area" value={`${k.monitored_area_km2} km²`} sub="Central India" icon={Map} color="#3b82f6" />
        <KPICard label="High Prospectivity" value={`${k.high_prospectivity_zones} zones`} sub="Score ≥ 75" icon={Target} color="#8b5cf6" />
        <KPICard label="Resource Potential" value={`${k.estimated_resource_potential_mt} Mt`} sub={`${k.resource_confidence_range.low}–${k.resource_confidence_range.high} Mt range`} icon={Activity} color="#06b6d4" />
        <KPICard label="Production Forecast" value={`${k.forecast_production_mt} Mt`} sub="Annual (AI model)" icon={TrendingDown} color="#f97316" />
        <KPICard label="Shortfall Risk"
          value={<span style={{ color: k.shortfall_risk_pct >= 60 ? '#ef4444' : k.shortfall_risk_pct >= 35 ? '#f59e0b' : '#22c55e' }}>{k.shortfall_risk_pct}%</span>}
          sub={k.shortfall_risk_level} icon={AlertTriangle}
          color={k.shortfall_risk_pct >= 60 ? '#ef4444' : '#f59e0b'} />
        <KPICard label="Equip. Availability" value={`${k.equipment_availability_pct}%`} sub={`${k.critical_equipment_count} critical alerts`} icon={Cpu} color="#22c55e" />
      </div>

      {/* Second row: Shortfall gauge + production mini chart + shortfall breakdown + alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shortfall risk */}
        <div className="card">
          <div className="section-header">Shortfall Risk Engine</div>
          <div className="section-sub mb-4">Probability of annual production target miss</div>
          <div className="flex flex-col items-center py-2">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1a2540" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 50 * k.shortfall_risk_pct / 100} ${2 * Math.PI * 50 * (1 - k.shortfall_risk_pct / 100)}`}
                  strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-red-400">{k.shortfall_risk_pct}%</span>
                <span className="text-xs text-text-muted">risk</span>
              </div>
            </div>
            <div className="badge-high mt-3">HIGH RISK</div>
            <p className="text-xs text-text-muted text-center mt-2">Expected gap: ~160,000 t/year</p>
          </div>
          <button onClick={() => navigate('/production')} className="btn-secondary w-full text-xs mt-2">
            View Full Analysis →
          </button>
        </div>

        {/* Production mini chart */}
        <div className="card">
          <div className="section-header">Recent Production vs Target</div>
          <div className="section-sub mb-3">Tonnes — last 6 months (synthetic demo)</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={productionData} barGap={2}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => `${v.toLocaleString()} t`} contentStyle={{ background: '#1a2540', border: '1px solid #243055', fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="actual" name="Actual" radius={[3,3,0,0]}>
                {productionData.map((_, i) => (
                  <Cell key={i} fill={productionData[i].actual < productionData[i].target ? '#ef4444' : '#22c55e'} />
                ))}
              </Bar>
              <Bar dataKey="target" name="Target" fill="#3b82f620" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-1">
            <span className="flex items-center gap-1 text-xs text-text-muted"><span className="w-2 h-2 rounded-full bg-red-400"></span>Below Target</span>
            <span className="flex items-center gap-1 text-xs text-text-muted"><span className="w-2 h-2 rounded-full bg-green-400"></span>On Target</span>
          </div>
        </div>

        {/* Shortfall causes */}
        <div className="card">
          <div className="section-header">Shortfall Contributors</div>
          <div className="section-sub mb-3">AI model attribution (SHAP)</div>
          <div className="space-y-3">
            {(d.shortfall_breakdown || DEMO_DATA.shortfall_breakdown).map((item: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">{item.factor}</span>
                  <span className="font-mono font-semibold" style={{ color: SHORTFALL_COLORS[i] }}>{item.contribution_pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${item.contribution_pct * 3}%`, backgroundColor: SHORTFALL_COLORS[i] }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/ai')} className="btn-secondary w-full text-xs mt-3">
            Full AI Explanation →
          </button>
        </div>
      </div>

      {/* Alerts + Decision flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="section-header">Active Alerts</div>
            <span className="badge-high">{(d.alerts || DEMO_DATA.alerts).length} alerts</span>
          </div>
          <div className="space-y-2">
            {(d.alerts || DEMO_DATA.alerts).slice(0, 4).map((a: any) => (
              <AlertItem key={a.id} alert={a} />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-header mb-3">Intelligence Workflow</div>
          <div className="flex flex-col gap-1">
            {[
              { label: 'Satellite + Geological Data', done: true, path: '/exploration' },
              { label: 'AI Prospectivity Analysis', done: true, path: '/exploration' },
              { label: 'Resource Potential Estimate', done: true, path: '/resources' },
              { label: 'Production Forecast', done: true, path: '/production' },
              { label: 'Shortfall Risk: 68% HIGH', done: false, path: '/production', alert: true },
              { label: 'AI Recommendations Generated', done: false, path: '/ai' },
              { label: 'What-If Simulation Ready', done: false, path: '/simulator' },
            ].map((step, i) => (
              <button
                key={i}
                onClick={() => navigate(step.path)}
                className="flex items-center gap-3 p-2 rounded-lg text-left hover:bg-surface-hover transition-colors"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step.done ? 'bg-green-500/20 text-green-400' : step.alert ? 'bg-red-500/20 text-red-400 animate-pulse-slow' : 'bg-surface-muted text-text-muted'}`}>
                  {step.done ? '✓' : step.alert ? '!' : i + 1}
                </div>
                <span className={`text-xs ${step.alert ? 'text-red-400 font-semibold' : step.done ? 'text-text-secondary' : 'text-text-muted'}`}>
                  {step.label}
                </span>
                <span className="ml-auto text-text-muted text-xs">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-text-muted text-center py-2">
        Prototype decision-support system. Results use synthetic demonstration data.
        Requires certified exploration, drilling and assay data for operational use.
      </p>
    </div>
  )
}
