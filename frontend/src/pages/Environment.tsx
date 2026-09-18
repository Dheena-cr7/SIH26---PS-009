import { useEffect, useState } from 'react'
import { getEnvironment } from '../services/api'
import { MOCK_ENVIRONMENT } from '../services/mockData'
import { Cloud, Satellite, Thermometer, Droplets, Map, Activity, Wind, Eye } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts'

export default function Environment() {
  const [data, setData] = useState<any>(MOCK_ENVIRONMENT)

  useEffect(() => {
    getEnvironment().then(setData).catch(console.error)
  }, [])

  const history = data?.history || []
  const latest = data?.latest || {}
  const datasets = data?.satellite_datasets || []

  // Derived datasets for charts
  const weatherData = history.slice(-12).map((d: any) => ({
    ...d,
    monthShort: d.month.split('-')[1] // Just get the month part
  }))

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Cloud className="w-6 h-6 text-accent-blue" />
          Environment & Space Data
        </h1>
        <p className="text-text-muted text-sm mt-1">Satellite-derived environmental indicators affecting mining operations</p>
      </div>

      {/* Latest Conditions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-blue-500/5 border-blue-500/20">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-blue-400" /> Rainfall (Monthly)
          </div>
          <div className="text-3xl font-bold text-text-primary">{latest.rainfall_mm || 0} <span className="text-lg text-text-muted font-normal">mm</span></div>
          <div className="mt-2 inline-flex">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${latest.haulage_risk === 'HIGH' ? 'bg-red-500/20 text-red-400' : latest.haulage_risk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
              HAULAGE RISK: {latest.haulage_risk || 'LOW'}
            </span>
          </div>
        </div>

        <div className="card bg-orange-500/5 border-orange-500/20">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-orange-400" /> Land Surface Temp
          </div>
          <div className="text-3xl font-bold text-text-primary">{latest.land_surface_temp_c || 0} <span className="text-lg text-text-muted font-normal">°C</span></div>
          <p className="text-xs text-text-secondary mt-2">Landsat 8/9 LST derived</p>
        </div>

        <div className="card bg-green-500/5 border-green-500/20">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-green-400" /> NDVI Index
          </div>
          <div className="text-3xl font-bold text-text-primary">{latest.ndvi || 0}</div>
          <p className="text-xs text-text-secondary mt-2">Sentinel-2 derived</p>
        </div>

        <div className="card bg-cyan-500/5 border-cyan-500/20">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-cyan-400" /> Soil Moisture
          </div>
          <div className="text-3xl font-bold text-text-primary">{latest.soil_moisture || 0}</div>
          <p className="text-xs text-text-secondary mt-2">SMAP / Sentinel-1 derived</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <div className="card">
            <div className="section-header mb-4">Rainfall vs Mining Accessibility</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weatherData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#243055" vertical={false} />
                  <XAxis dataKey="monthShort" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#141d35', border: '1px solid #243055', borderRadius: '8px', fontSize: '12px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="rainfall_mm" name="Rainfall (mm)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="mining_accessibility_score" name="Accessibility Score" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="card">
            <div className="section-header mb-4">Land Surface Temp & Soil Moisture Trend</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weatherData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#243055" vertical={false} />
                  <XAxis dataKey="monthShort" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#141d35', border: '1px solid #243055', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="land_surface_temp_c" name="Temp °C" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" />
                  <Line type="monotone" dataKey="soil_moisture" name="Soil Moisture" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Pit Sump Inundation & Dewatering Early Warning System */}
      <PitSumpDewateringModel latestRainfall={latest.rainfall_mm || 45} />

      {/* Satellite Integration Status */}
      <div className="card">
         <div className="section-header mb-4 flex items-center gap-2">
           <Satellite className="w-5 h-5 text-accent-purple" /> Satellite Data Sources
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {datasets.map((ds: any, i: number) => (
              <div key={i} className="bg-surface-hover rounded-lg p-4 border border-surface-border relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-full bg-accent-purple opacity-50 group-hover:opacity-100 transition-opacity"></div>
                 <div className="font-bold text-text-primary mb-1">{ds.name}</div>
                 <div className="text-xs text-text-muted mb-3 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5"/> {ds.source}</div>
                 
                 <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Resolution</span>
                      <span className="font-mono text-text-primary">{ds.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Frequency</span>
                      <span className="font-mono text-text-primary">{ds.update_freq}</span>
                    </div>
                    {ds.indices && (
                      <div className="mt-2 pt-2 border-t border-surface-border">
                        <span className="text-text-secondary block mb-1">Derived Products:</span>
                        <div className="flex flex-wrap gap-1">
                          {ds.indices.map((ind: string) => (
                             <span key={ind} className="bg-surface-muted px-1.5 py-0.5 rounded text-[10px] text-text-primary font-medium">{ind}</span>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}

function PitSumpDewateringModel({ latestRainfall }: { latestRainfall: number }) {
  const [activePumps, setActivePumps] = useState<number>(3)
  const [simulatedRainfall, setSimulatedRainfall] = useState<number>(latestRainfall || 65)
  const [sumpInitialWater, setSumpInitialWater] = useState<number>(12500) // m³

  // Constants
  const PIT_CATCHMENT_KM2 = 0.85
  const RUNOFF_COEFF = 0.65 // Runoff coefficient for fractured hard rock pit walls
  const SUMP_MAX_CAPACITY = 25000 // m³
  const PUMP_RATED_CAPACITY_M3HR = 850 // m³/hr per submersible slurry pump

  // Computations
  // Inflow volume rate = (Rainfall mm * 10^-3) * (Catchment * 10^6) * Runoff / 24 hrs
  const hourlyInflowM3 = Math.round((simulatedRainfall * PIT_CATCHMENT_KM2 * 1000 * RUNOFF_COEFF) / 24)
  const totalPumpDischargeRateM3 = activePumps * PUMP_RATED_CAPACITY_M3HR
  const netWaterAccumulationRateM3 = hourlyInflowM3 - totalPumpDischargeRateM3

  // Current volume & status
  const currentSumpWaterM3 = Math.min(SUMP_MAX_CAPACITY, Math.max(2000, sumpInitialWater + netWaterAccumulationRateM3 * 2))
  const sumpFillPct = Math.round((currentSumpWaterM3 / SUMP_MAX_CAPACITY) * 100)

  let overflowRisk = 'SAFE'
  let hoursToOverflow = Infinity
  let hoursToClear = 0

  if (netWaterAccumulationRateM3 > 0) {
    const remainingCapacity = SUMP_MAX_CAPACITY - currentSumpWaterM3
    hoursToOverflow = Number((remainingCapacity / netWaterAccumulationRateM3).toFixed(1))
    overflowRisk = hoursToOverflow < 8 ? 'CRITICAL' : hoursToOverflow < 24 ? 'WARNING' : 'MODERATE'
  } else if (netWaterAccumulationRateM3 < 0) {
    hoursToClear = Number((currentSumpWaterM3 / Math.abs(netWaterAccumulationRateM3)).toFixed(1))
    overflowRisk = 'SAFE'
  }

  const handleAutoDispatch = () => {
    // Dispatch enough pumps to ensure negative net accumulation
    const requiredPumps = Math.min(5, Math.ceil(hourlyInflowM3 / PUMP_RATED_CAPACITY_M3HR) + 1)
    setActivePumps(requiredPumps)
  }

  return (
    <div className="card border-accent-blue/30 bg-gradient-to-br from-bg-900 via-bg-900 to-blue-950/20 p-5 space-y-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-lg font-bold text-text-primary">Space-Based Pit Sump Inundation & Dewatering Engine</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
              overflowRisk === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              overflowRisk === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}>
              {overflowRisk} STATUS
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time satellite precipitation integration, pit catchment runoff hydrograph & sump pump discharge balancing
          </p>
        </div>

        <button
          onClick={handleAutoDispatch}
          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 self-start sm:self-auto shadow-md"
        >
          <Wind className="w-3.5 h-3.5" /> Auto-Dispatch Pumps
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold text-text-primary uppercase tracking-wider">Hydrological Variables</div>

          {/* Rainfall Intensity Slider */}
          <div className="p-3 rounded-xl bg-surface-muted/30 border border-surface-border space-y-1.5 text-xs">
            <div className="flex justify-between font-medium">
              <span className="text-text-secondary">Simulated Precipitation (GPM/IMD):</span>
              <span className="font-mono font-bold text-accent-cyan">{simulatedRainfall} mm/day</span>
            </div>
            <input
              type="range" min="0" max="180" step="5"
              value={simulatedRainfall} onChange={(e) => setSimulatedRainfall(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-bg-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>Dry (0mm)</span>
              <span>Monsoon Deluge (180mm)</span>
            </div>
          </div>

          {/* Dewatering Pumps Online Slider */}
          <div className="p-3 rounded-xl bg-surface-muted/30 border border-surface-border space-y-1.5 text-xs">
            <div className="flex justify-between font-medium">
              <span className="text-text-secondary">Active Slurry Pumps Online:</span>
              <span className="font-mono font-bold text-green-400">{activePumps} / 5 Pumps</span>
            </div>
            <input
              type="range" min="1" max="5" step="1"
              value={activePumps} onChange={(e) => setActivePumps(Number(e.target.value))}
              className="w-full accent-green-400 h-1.5 bg-bg-800 rounded-lg cursor-pointer"
            />
            <div className="text-[10px] text-text-muted">
              Rated Capacity: {activePumps * PUMP_RATED_CAPACITY_M3HR} m³/hr ({activePumps} × 850 m³/hr)
            </div>
          </div>

          {/* Static Pit Geo Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-surface-muted/20 border border-surface-border">
              <div className="text-[10px] text-text-muted">Pit Catchment Area</div>
              <div className="font-mono font-bold text-text-primary mt-0.5">0.85 km²</div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-muted/20 border border-surface-border">
              <div className="text-[10px] text-text-muted">Sump Max Capacity</div>
              <div className="font-mono font-bold text-text-primary mt-0.5">25,000 m³</div>
            </div>
          </div>
        </div>

        {/* Dynamic Water Balance Display */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-muted border border-surface-border">
              <div className="text-[10px] text-text-muted uppercase">Runoff Inflow</div>
              <div className="text-xl font-black text-cyan-400 font-mono mt-1">
                {hourlyInflowM3.toLocaleString()} <span className="text-xs font-normal text-text-muted">m³/h</span>
              </div>
              <div className="text-[9px] text-text-muted mt-0.5">Catchment Inflow</div>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted border border-surface-border">
              <div className="text-[10px] text-text-muted uppercase">Pump Discharge</div>
              <div className="text-xl font-black text-green-400 font-mono mt-1">
                {totalPumpDischargeRateM3.toLocaleString()} <span className="text-xs font-normal text-text-muted">m³/h</span>
              </div>
              <div className="text-[9px] text-text-muted mt-0.5">{activePumps} High-Head Pumps</div>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted border border-surface-border">
              <div className="text-[10px] text-text-muted uppercase">Net Sump Trend</div>
              <div className={`text-xl font-black font-mono mt-1 ${netWaterAccumulationRateM3 > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {netWaterAccumulationRateM3 > 0 ? `+${netWaterAccumulationRateM3}` : netWaterAccumulationRateM3} <span className="text-xs font-normal text-text-muted">m³/h</span>
              </div>
              <div className="text-[9px] text-text-muted mt-0.5">
                {netWaterAccumulationRateM3 > 0 ? '⚠️ Water Rising' : '✓ Dewatering Steady'}
              </div>
            </div>
          </div>

          {/* Sump Capacity Bar */}
          <div className="p-4 rounded-xl bg-surface-muted/40 border border-surface-border space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-text-secondary">Current Pit Sump Water Level:</span>
              <span className="font-mono font-bold text-text-primary">
                {currentSumpWaterM3.toLocaleString()} / {SUMP_MAX_CAPACITY.toLocaleString()} m³ ({sumpFillPct}%)
              </span>
            </div>
            
            <div className="w-full bg-bg-900 rounded-full h-4 overflow-hidden p-0.5 border border-surface-border">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  sumpFillPct > 85 ? 'bg-gradient-to-r from-red-600 to-rose-500' :
                  sumpFillPct > 60 ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                  'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                style={{ width: `${Math.min(100, sumpFillPct)}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-text-muted pt-1">
              <span>0% (Dry Floor)</span>
              <span>50% Warning Line</span>
              <span>100% Inundation Cutoff</span>
            </div>
          </div>

          {/* Warning / Guidance Callout */}
          <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
            overflowRisk === 'CRITICAL'
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : overflowRisk === 'WARNING'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-green-500/10 border-green-500/30 text-green-300'
          }`}>
            <Droplets className="w-4 h-4 flex-shrink-0" />
            <div className="leading-tight">
              {netWaterAccumulationRateM3 > 0 ? (
                <span>
                  <strong>Haulage Inundation Warning:</strong> Inflow exceeds discharge by {netWaterAccumulationRateM3} m³/hr. Estimated pit floor overflow in <strong>{hoursToOverflow} hours</strong> if extra pumps are not mobilized.
                </span>
              ) : (
                <span>
                  <strong>Safe Dewatering Equilibrium:</strong> Pump discharge rate exceeds inflow by {Math.abs(netWaterAccumulationRateM3)} m³/hr. Pit floor is dry and haul roads remain fully accessible.
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

