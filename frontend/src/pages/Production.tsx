import { useEffect, useState } from 'react'
import { getProductionHistory, getProductionForecast, getShortfall } from '../services/api'
import { MOCK_PRODUCTION_HISTORY, MOCK_PRODUCTION_FORECAST, MOCK_SHORTFALL } from '../services/mockData'
import { BarChart3, TrendingDown, AlertTriangle, Cpu, CloudRain, Clock, Activity, ArrowRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine, AreaChart, Area } from 'recharts'
import { useNavigate } from 'react-router-dom'

export default function Production() {
  const [history, setHistory] = useState<any[]>(MOCK_PRODUCTION_HISTORY)
  const [forecast, setForecast] = useState<any[]>(MOCK_PRODUCTION_FORECAST)
  const [shortfall, setShortfall] = useState<any>(MOCK_SHORTFALL)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      getProductionHistory(),
      getProductionForecast(),
      getShortfall()
    ]).then(([histRes, foreRes, shortRes]) => {
      setHistory(histRes.history || [])
      setForecast(foreRes.forecast || [])
      setShortfall(shortRes)
    }).catch(console.error)
  }, [])

  // Combine history and forecast for charting
  const last6Months = history.slice(-6)
  const chartData = [...last6Months, ...forecast].map(d => ({
    month: d.month,
    Actual: d.is_forecast ? null : d.production_tonnes,
    Forecast: d.is_forecast ? d.forecast_tonnes : null,
    Target: d.target_tonnes,
    isForecast: d.is_forecast
  }))

  const s = shortfall || {
    shortfall_risk_pct: 68, risk_level: 'HIGH', expected_annual_gap_kt: 160,
    contributing_factors: [
      { factor: 'Equipment Downtime', contribution_pct: 31 },
      { factor: 'Weather / Rainfall', contribution_pct: 24 }
    ]
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-accent-green" />
            Production Analytics & Forecasting
          </h1>
          <p className="text-text-muted text-sm mt-1">XGBoost Time-Series Forecasting & Shortfall Prediction</p>
        </div>
        <button onClick={() => navigate('/simulator')} className="btn-secondary flex items-center gap-2 text-sm">
          Simulator <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-bg-800 to-red-900/20 border-red-500/30">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Predicted Shortfall Risk
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-red-400">{s.shortfall_risk_pct}%</span>
            <div className="badge-high mb-2">{s.risk_level} RISK</div>
          </div>
          <p className="text-sm text-text-secondary mt-4">
            AI predicts a high probability of missing the annual production target based on current equipment availability and weather forecasts.
          </p>
        </div>

        <div className="card">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-3">Expected Production Gap</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-text-primary">{s.expected_annual_gap_kt}</span>
            <span className="text-text-muted font-medium">kt / year</span>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-border">
            <div className="text-xs text-text-secondary mb-2">Top Drivers:</div>
            <div className="space-y-2">
              {s.contributing_factors.slice(0, 2).map((f: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">{f.factor}</span>
                  <span className="font-mono text-accent-orange font-semibold">{f.contribution_pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card flex flex-col justify-center items-center text-center p-6 bg-accent-orange/5 border-accent-orange/20">
          <Activity className="w-8 h-8 text-accent-orange mb-3" />
          <h3 className="text-lg font-bold text-text-primary mb-2">AI Corrective Actions Ready</h3>
          <p className="text-xs text-text-secondary mb-4">The recommendation engine has generated actionable steps to reduce the shortfall risk to 19%.</p>
          <button onClick={() => navigate('/ai')} className="btn-primary w-full text-sm py-2">
            View Recommendations
          </button>
        </div>
      </div>

      {/* Main Chart */}
      <div className="card h-[400px] flex flex-col">
        <div className="section-header flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-accent-blue" />
            Actual vs Target vs Forecast (Next 6 Months)
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-500"></span> Actual</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> AI Forecast</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm border-t-2 border-dashed border-text-muted"></span> Target</span>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#243055" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#141d35', border: '1px solid #243055', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v: any, name: any) => [`${Number(v).toLocaleString()} t`, String(name)]}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              />
              {/* Target Line */}
              <Line type="monotone" dataKey="Target" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} />
              {/* Actual Line */}
              <Line type="monotone" dataKey="Actual" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#141d35', strokeWidth: 2 }} activeDot={{ r: 6 }} connectNulls />
              {/* Forecast Line */}
              <Line type="monotone" dataKey="Forecast" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#141d35', strokeWidth: 2 }} strokeDasharray="3 3" activeDot={{ r: 6 }} connectNulls />
              
              {/* Split line indicating 'Today' */}
              {chartData.findIndex(d => d.isForecast) !== -1 && (
                <ReferenceLine x={chartData[chartData.findIndex(d => d.isForecast)].month} stroke="#f97316" strokeDasharray="3 3" opacity={0.5} label={{ position: 'top', value: 'Today', fill: '#f97316', fontSize: 10 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Details Table */}
      <div className="card">
         <div className="section-header mb-4">Forecast Parameter Breakdown</div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-text-muted uppercase border-b border-surface-border">
                <tr>
                  <th className="pb-2 font-medium">Month</th>
                  <th className="pb-2 font-medium">Predicted Output</th>
                  <th className="pb-2 font-medium">Target</th>
                  <th className="pb-2 font-medium">Gap</th>
                  <th className="pb-2 font-medium text-center">Expected Equip. Avail</th>
                  <th className="pb-2 font-medium text-center">Rainfall Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {forecast.map((f: any, i: number) => {
                  const gap = f.forecast_tonnes - f.target_tonnes;
                  const isNegative = gap < 0;
                  return (
                    <tr key={i} className="hover:bg-surface-hover transition-colors">
                      <td className="py-2.5 text-text-primary font-medium">{f.month} <span className="text-[10px] text-accent-blue ml-2 uppercase font-bold tracking-wider">Forecast</span></td>
                      <td className="py-2.5 font-mono text-text-primary">{f.forecast_tonnes.toLocaleString()} t</td>
                      <td className="py-2.5 font-mono text-text-muted">{f.target_tonnes.toLocaleString()} t</td>
                      <td className="py-2.5 font-mono">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isNegative ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>
                          {isNegative ? '' : '+'}{gap.toLocaleString()} t
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <div className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                          <Cpu className="w-3.5 h-3.5" /> {f.equipment_availability_pct}%
                        </div>
                      </td>
                      <td className="py-2.5 text-center">
                        <div className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                          <CloudRain className="w-3.5 h-3.5" /> {f.rainfall_mm}mm
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  )
}
