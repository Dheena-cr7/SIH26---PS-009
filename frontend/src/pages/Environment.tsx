import { useEffect, useState } from 'react'
import { getEnvironment } from '../services/api'
import { Cloud, Satellite, Thermometer, Droplets, Map, Activity, Wind, Eye } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts'

export default function Environment() {
  const [data, setData] = useState<any>(null)

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
