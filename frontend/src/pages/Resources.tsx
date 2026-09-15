import { useEffect, useState } from 'react'
import { getResources } from '../services/api'
import { Database, TrendingUp, Info, BarChart2, CheckCircle2, AlertCircle, Box, Layers, Drill, Sparkles, HelpCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'
import Maptek3DViewer from '../components/Maptek3DViewer'

const DEMO_DATA = {
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

export default function Resources() {
  const [data, setData] = useState<any>(DEMO_DATA)
  const [activeTab, setActiveTab] = useState<'3d_model' | 'unfc_reserves' | 'borehole_strata'>('3d_model')
  const [selectedVoxel, setSelectedVoxel] = useState<any>(null)

  useEffect(() => {
    getResources().then(setData).catch(() => {})
  }, [])

  const d = data || DEMO_DATA

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Box className="w-6 h-6 text-accent-orange" />
            3D Orebody & Resource Intelligence
          </h1>
          <p className="text-text-muted text-sm mt-1">Maptek-Style 3D Voxel Model, UNFC Reserve Classification & Subsurface Grade Slicing</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex rounded-xl bg-surface-muted p-1 border border-surface-border text-xs">
          <button
            onClick={() => setActiveTab('3d_model')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === '3d_model' ? 'bg-accent-orange text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Box className="w-3.5 h-3.5" /> 3D Mine & Orebody Model
          </button>
          <button
            onClick={() => setActiveTab('unfc_reserves')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'unfc_reserves' ? 'bg-accent-blue text-white shadow-md' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> UNFC Reserves & Grades
          </button>
        </div>
      </div>

      {/* Main KPI Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card md:col-span-2 relative overflow-hidden bg-gradient-to-br from-bg-800 to-accent-orange/5 border-accent-orange/30">
          <div className="text-xs text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-accent-orange" />
            Total Estimated Manganese Resource Potential
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-black text-text-primary tracking-tight">{d.estimated_resource_potential_mt}</span>
            <span className="text-xl text-text-muted font-medium">Million Tonnes (Mt)</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs mt-3">
            <div className="px-2.5 py-1 rounded-md bg-surface-muted border border-surface-border text-text-secondary">
              90% CI Range: <span className="text-text-primary font-bold">{d.confidence_interval.low_mt} – {d.confidence_interval.high_mt} Mt</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 font-bold">
              {d.confidence_pct}% AI Confidence
            </div>
          </div>
        </div>

        <div className="card flex flex-col justify-between">
          <div className="text-xs text-text-muted uppercase tracking-wider">Average Deposit Grade</div>
          <div className="flex items-baseline gap-1 mt-1 mb-2">
            <span className="text-3xl font-black text-accent-orange">{d.average_mn_grade_pct}</span>
            <span className="text-lg text-text-muted">% Mn</span>
          </div>
          <div className="text-xs text-text-secondary">
            Verified across <span className="font-bold text-text-primary">{d.total_drill_holes}</span> diamond core boreholes
          </div>
          <div className="mt-auto pt-3 border-t border-surface-border flex justify-between items-center text-xs">
            <span className="text-text-muted">High-Grade Intercepts (&gt;35%)</span>
            <span className="font-mono text-green-400 font-bold">{d.high_grade_intercepts}</span>
          </div>
        </div>

        <div className="card flex flex-col justify-between">
          <div className="text-xs text-text-muted uppercase tracking-wider">UNFC Quality & Density</div>
          <div className="flex items-center gap-3 mt-1 mb-2">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#243055" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f97316" strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 16 * d.data_quality_score / 100} 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-primary">
                {d.data_quality_score}%
              </div>
            </div>
            <div className="text-xs text-text-secondary leading-tight">
              High geostatistical kriging confidence under JORC / UNFC 111 standards.
            </div>
          </div>
          <div className="mt-auto pt-3 border-t border-surface-border flex justify-between items-center text-xs">
            <span className="text-text-muted">Drill Grid Spacing</span>
            <span className="font-mono text-text-primary font-bold">50m x 50m</span>
          </div>
        </div>
      </div>

      {/* 3D MAPTEK BLOCK MODEL SECTION */}
      {activeTab === '3d_model' && (
        <div className="space-y-4">
          <Maptek3DViewer 
            cutoffGrade={20}
            onBlockSelect={(block) => setSelectedVoxel(block)}
          />
        </div>
      )}

      {/* UNFC & GRADE DISTRIBUTION TABS */}
      {activeTab === 'unfc_reserves' && (
        <div className="space-y-6">
          {/* UNFC Classification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="card border-green-500/30 bg-green-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">UNFC 111 (Measured)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 font-bold">PROVED</span>
              </div>
              <div className="text-3xl font-black text-text-primary">{d.unfc_breakdown.measured_111.mt} <span className="text-sm font-normal text-text-muted">Mt</span></div>
              <p className="text-xs text-text-secondary mt-1">Average Grade: <strong className="text-green-400 font-mono">{d.unfc_breakdown.measured_111.grade}% Mn</strong></p>
              <div className="mt-3 pt-2 border-t border-green-500/20 text-[11px] text-text-muted">
                Delineated by 25m infill drilling and underground development levels.
              </div>
            </div>

            <div className="card border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">UNFC 122 (Indicated)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 font-bold">PROBABLE</span>
              </div>
              <div className="text-3xl font-black text-text-primary">{d.unfc_breakdown.indicated_122.mt} <span className="text-sm font-normal text-text-muted">Mt</span></div>
              <p className="text-xs text-text-secondary mt-1">Average Grade: <strong className="text-blue-400 font-mono">{d.unfc_breakdown.indicated_122.grade}% Mn</strong></p>
              <div className="mt-3 pt-2 border-t border-blue-500/20 text-[11px] text-text-muted">
                50m exploratory borehole grid with strong geophysical continuity.
              </div>
            </div>

            <div className="card border-purple-500/30 bg-purple-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">UNFC 333 (Inferred)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-400 font-bold">EXPLORATION</span>
              </div>
              <div className="text-3xl font-black text-text-primary">{d.unfc_breakdown.inferred_333.mt} <span className="text-sm font-normal text-text-muted">Mt</span></div>
              <p className="text-xs text-text-secondary mt-1">Average Grade: <strong className="text-purple-400 font-mono">{d.unfc_breakdown.inferred_333.grade}% Mn</strong></p>
              <div className="mt-3 pt-2 border-t border-purple-500/20 text-[11px] text-text-muted">
                Extrapolated deep downdip fold limbs identified via satellite spectral anomalies.
              </div>
            </div>

          </div>

          {/* Grade Distribution & Lithology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="section-header flex items-center gap-2 mb-4">
                <BarChart2 className="w-4 h-4 text-accent-orange" />
                Deposit % Mn Grade Histogram
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={d.grade_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#243055" vertical={false} />
                    <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: '#1e2d4d' }}
                      contentStyle={{ background: '#141d35', border: '1px solid #243055', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(value: any, name: any, item: any) => [`${value} intercepts (${item.payload.category})`, 'Frequency']}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {d.grade_distribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={index > 3 ? '#d946ef' : index > 2 ? '#f97316' : index > 1 ? '#3b82f6' : '#64748b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="section-header flex items-center gap-2 mb-4">
                <Database className="w-4 h-4 text-accent-purple" />
                Sausar Belt Lithology Formations
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-text-muted uppercase border-b border-surface-border">
                    <tr>
                      <th className="pb-2 font-medium">Formation</th>
                      <th className="pb-2 font-medium">Mn Grade</th>
                      <th className="pb-2 font-medium">Potential</th>
                      <th className="pb-2 font-medium text-right">Area</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {d.geological_units.map((unit: any, i: number) => (
                      <tr key={i} className="hover:bg-surface-hover transition-colors">
                        <td className="py-2.5 text-text-primary font-medium">{unit.name}</td>
                        <td className="py-2.5 font-bold text-accent-orange font-mono">{unit.avg_grade}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            unit.mn_potential.includes('Very High') ? 'bg-red-500/20 text-red-400' :
                            unit.mn_potential.includes('Moderate') ? 'bg-amber-500/20 text-amber-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {unit.mn_potential}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-text-muted">{unit.area_km2} km²</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Mining & Geological Disclaimer */}
      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-accent-orange font-bold block mb-0.5">COMPLIANCE & SCIENTIFIC METHODOLOGY NOTICE</strong>
          3D Block model voxel resolution is 25m × 25m × 10m. Volumetric estimations utilize geostatistical Ordinary Kriging interpolated from diamond core drillholes and Sentinel-2 / Landsat surface alteration vectors under UNFC-1997 / CRIRSCO guidelines.
        </div>
      </div>

    </div>
  )
}
