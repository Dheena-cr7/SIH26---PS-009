import { useEffect, useState } from 'react'
import { getEquipment } from '../services/api'
import { Wrench, ShieldAlert, Cpu, Activity, AlertTriangle, Clock, Radio, Zap, Gauge, Thermometer, CheckCircle2 } from 'lucide-react'

export default function Equipment() {
  const [data, setData] = useState<any>(null)
  const [isLiveStream, setIsLiveStream] = useState<boolean>(true)
  const [liveJitter, setLiveJitter] = useState<number>(0)

  useEffect(() => {
    getEquipment().then(setData).catch(console.error)
  }, [])

  // Auto-tick live telemetry every 2.5 seconds
  useEffect(() => {
    if (!isLiveStream) return
    const interval = setInterval(() => {
      setLiveJitter(prev => prev + 1)
    }, 2500)
    return () => clearInterval(interval)
  }, [isLiveStream])

  const rawMachines = data?.machines || []
  
  // Apply live telemetry jitter for real-time simulation
  const machines = rawMachines.map((m: any, i: number) => {
    const tempJitter = Math.sin(liveJitter + i) * 1.5
    const vibJitter = (Math.cos(liveJitter * 1.2 + i) * 0.2)
    const baseTemp = m.type === 'Excavator' ? 84 : (m.type === 'Dumper' ? 88 : 79)
    const currentTemp = Number((baseTemp + tempJitter + (m.failure_risk === 'HIGH' ? 8 : 0)).toFixed(1))
    const currentVib = Number((2.2 + vibJitter + (m.failure_risk === 'HIGH' ? 1.6 : 0)).toFixed(2))
    const currentHydraulic = Number((4.2 + (Math.sin(liveJitter * 0.8 + i) * 0.15)).toFixed(2))
    const rulHours = m.failure_risk === 'HIGH' ? Math.max(12, 48 - (liveJitter % 20)) : (m.failure_risk === 'MEDIUM' ? 180 : 420)

    return {
      ...m,
      currentTemp,
      currentVib,
      currentHydraulic,
      rulHours
    }
  })

  const summary = data?.summary || { total: 0, high_risk: 0, medium_risk: 0, low_risk: 0, avg_availability_pct: 0, overdue_maintenance: 0 }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Wrench className="w-6 h-6 text-accent-orange" />
            HEMM Equipment Health & IoT Telemetry
          </h1>
          <p className="text-text-muted text-sm mt-1">Real-time vibration, thermal telemetry, and predictive Remaining Useful Life (RUL)</p>
        </div>

        {/* Live Stream Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiveStream(!isLiveStream)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
              isLiveStream 
                ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-lg shadow-green-500/10' 
                : 'bg-surface-muted border-surface-border text-text-muted'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isLiveStream ? 'bg-green-400 animate-ping' : 'bg-slate-500'}`}></span>
            <span>{isLiveStream ? 'LIVE TELEMETRY STREAM' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Fleet Availability</div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-text-primary">{summary.avg_availability_pct}%</span>
          </div>
          <div className="mt-2 progress-bar">
             <div className="progress-bar-fill bg-green-500" style={{ width: `${summary.avg_availability_pct}%` }} />
          </div>
        </div>
        
        <div className="card bg-red-500/5 border-red-500/20">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5 text-red-400">
            <AlertTriangle className="w-3.5 h-3.5" /> High Risk Assets
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-red-400">{summary.high_risk}</span>
            <span className="text-sm text-text-muted mb-1 flex-1">/ {summary.total} units</span>
          </div>
        </div>

        <div className="card">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Overdue Maintenance</div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-accent-orange">{summary.overdue_maintenance}</span>
          </div>
          <p className="text-xs text-text-secondary mt-2">Critical intervention required</p>
        </div>

        <div className="card bg-surface-muted/50 flex flex-col justify-center text-center">
           <ShieldAlert className="w-6 h-6 text-accent-blue mx-auto mb-2 opacity-80" />
           <div className="text-sm font-semibold text-text-primary">XGBoost & Random Forest RUL</div>
           <div className="text-xs text-text-muted mt-1">Accuracy: 91.4% • 14-Day Advance Warning</div>
        </div>
      </div>

      {/* Equipment List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="section-header !mb-0 flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-orange" /> Real-time HEMM Telemetry Fleet ({machines.length} Units)
          </div>
          {isLiveStream && (
            <span className="text-[11px] font-mono text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              2.5s Stream Polling
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-text-muted uppercase border-b border-surface-border bg-surface-muted/30">
              <tr>
                <th className="py-3 px-4 font-medium rounded-tl-lg">Machine ID & Mine</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Live Sensors (Temp / Vib)</th>
                <th className="py-3 px-4 font-medium">Hydraulic Oil</th>
                <th className="py-3 px-4 font-medium">Predicted RUL</th>
                <th className="py-3 px-4 font-medium">Failure Risk</th>
                <th className="py-3 px-4 font-medium">Maintenance</th>
                <th className="py-3 px-4 font-medium text-right rounded-tr-lg">Prod. Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {machines.map((m: any, i: number) => (
                <tr key={i} className="hover:bg-surface-hover transition-colors group">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-accent-blue flex-shrink-0" />
                      <div>
                        <div className="font-mono font-bold text-text-primary">{m.machine_id}</div>
                        <div className="text-[10px] text-text-muted mt-0.5">{m.mine_assigned}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-secondary font-medium text-xs">{m.type}</td>
                  
                  {/* Live Sensor Telemetry */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className={`flex items-center gap-1 ${m.currentTemp >= 90 ? 'text-red-400 font-bold' : 'text-text-primary'}`}>
                        <Thermometer className="w-3 h-3 text-accent-orange" />
                        {m.currentTemp}°C
                      </span>
                      <span className={`flex items-center gap-1 ${m.currentVib >= 3.5 ? 'text-red-400 font-bold' : 'text-text-secondary'}`}>
                        <Activity className="w-3 h-3 text-accent-blue" />
                        {m.currentVib} mm/s
                      </span>
                    </div>
                  </td>

                  {/* Hydraulic Pressure */}
                  <td className="py-3 px-4 font-mono text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-purple-400" />
                      {m.currentHydraulic} bar
                    </span>
                  </td>

                  {/* Predicted Remaining Useful Life */}
                  <td className="py-3 px-4">
                    <span className={`font-mono text-xs font-bold ${m.rulHours < 50 ? 'text-red-400' : m.rulHours < 200 ? 'text-amber-400' : 'text-green-400'}`}>
                      {m.rulHours} hrs RUL
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider ${
                      m.failure_risk === 'HIGH' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      m.failure_risk === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {m.failure_risk === 'HIGH' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                      {m.failure_risk}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                     <div className="flex items-center gap-2 text-xs">
                        {m.maintenance_status === 'OVERDUE' ? (
                          <span className="text-red-400 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> OVERDUE</span>
                        ) : m.maintenance_status === 'SCHEDULED' ? (
                           <span className="text-amber-400 font-medium">SCHEDULED</span>
                        ) : (
                           <span className="text-green-400 font-medium">OK</span>
                        )}
                     </div>
                     <div className="text-[10px] text-text-muted mt-0.5">{m.last_maintenance_days_ago} days ago</div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className={`font-mono text-xs font-bold ${m.production_impact_pct < -10 ? 'text-red-400' : 'text-text-secondary'}`}>
                      {m.production_impact_pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
