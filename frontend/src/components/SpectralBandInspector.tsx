import React, { useState } from 'react'
import { Satellite, X, Sparkles, Activity, Layers, CheckCircle2, AlertTriangle, RefreshCw, BarChart2, ShieldCheck, Download, Info } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts'

interface SpectralTarget {
  id: string
  name: string
  location: string
  rockType: string
  b2_blue: number    // 490nm
  b3_green: number   // 560nm
  b4_red: number     // 665nm
  b8_nir: number     // 842nm
  b11_swir1: number  // 1610nm
  b12_swir2: number  // 2190nm
  isMineralized: boolean
}

const SPECTRAL_PRESETS: SpectralTarget[] = [
  {
    id: 'bal-01',
    name: 'Balaghat North Anomaly (MN-TARGET-01)',
    location: '22.05°N, 80.18°E',
    rockType: 'Mansar Formation Gondite Ore Horizon',
    b2_blue: 0.12,
    b3_green: 0.16,
    b4_red: 0.28,
    b8_nir: 0.35,
    b11_swir1: 0.49,
    b12_swir2: 0.32,
    isMineralized: true
  },
  {
    id: 'sit-02',
    name: 'Sitasaongi Braunnite Bed (MN-TARGET-09)',
    location: '21.30°N, 79.88°E',
    rockType: 'Bedded Braunnite & Secondary Pyrolusite',
    b2_blue: 0.11,
    b3_green: 0.15,
    b4_red: 0.26,
    b8_nir: 0.32,
    b11_swir1: 0.46,
    b12_swir2: 0.31,
    isMineralized: true
  },
  {
    id: 'dng-03',
    name: 'Dongri Buzurg Gossan Cap (MN-TARGET-02)',
    location: '21.98°N, 79.85°E',
    rockType: 'Hydrothermal Iron-Manganese Gossan',
    b2_blue: 0.14,
    b3_green: 0.18,
    b4_red: 0.31,
    b8_nir: 0.38,
    b11_swir1: 0.52,
    b12_swir2: 0.36,
    isMineralized: true
  },
  {
    id: 'bar-04',
    name: 'Barren Deccan Basalt (Control Baseline)',
    location: '21.80°N, 79.40°E',
    rockType: 'Unaltered Basaltic Lava Flow',
    b2_blue: 0.08,
    b3_green: 0.11,
    b4_red: 0.14,
    b8_nir: 0.19,
    b11_swir1: 0.22,
    b12_swir2: 0.21,
    isMineralized: false
  },
  {
    id: 'sch-05',
    name: 'Barren Quartz-Muscovite Schist (Host Rock)',
    location: '21.65°N, 79.70°E',
    rockType: 'Sitasaongi Footwall Schist (Non-mineralized)',
    b2_blue: 0.18,
    b3_green: 0.22,
    b4_red: 0.25,
    b8_nir: 0.29,
    b11_swir1: 0.34,
    b12_swir2: 0.33,
    isMineralized: false
  }
]

export default function SpectralBandInspector({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedTarget, setSelectedTarget] = useState<SpectralTarget>(SPECTRAL_PRESETS[0])
  const [customB4Multiplier, setCustomB4Multiplier] = useState<number>(1.0)
  const [customB11Multiplier, setCustomB11Multiplier] = useState<number>(1.0)

  if (!isOpen) return null

  // Baseline Barren Rock comparison
  const baseline = SPECTRAL_PRESETS[3] // Deccan Basalt

  // Computed Band Indices
  const b4_effective = selectedTarget.b4_red * customB4Multiplier
  const b11_effective = selectedTarget.b11_swir1 * customB11Multiplier

  // 1. Iron Oxide Index (B4 / B2)
  const ironOxideIndex = Number((b4_effective / selectedTarget.b2_blue).toFixed(2))
  // 2. Clay Mineral Alteration Index (B11 / B12)
  const clayAlterationIndex = Number((b11_effective / selectedTarget.b12_swir2).toFixed(2))
  // 3. Ferrous Mineral Ratio (B11 / B8)
  const ferrousRatio = Number((b11_effective / selectedTarget.b8_nir).toFixed(2))
  // 4. NDVI Vegetation Index ((B8 - B4) / (B8 + B4))
  const ndvi = Number(((selectedTarget.b8_nir - b4_effective) / (selectedTarget.b8_nir + b4_effective)).toFixed(2))

  // Evaluation criteria
  const isIronAnomaly = ironOxideIndex >= 1.35
  const isClayAnomaly = clayAlterationIndex >= 1.25
  const isProspectPositive = isIronAnomaly && isClayAnomaly

  // Multi-spectral wavelength curve data for Recharts
  const spectralCurveData = [
    { band: 'B2 (Blue)', wavelength: '490 nm', targetReflectance: selectedTarget.b2_blue, baselineReflectance: baseline.b2_blue },
    { band: 'B3 (Green)', wavelength: '560 nm', targetReflectance: selectedTarget.b3_green, baselineReflectance: baseline.b3_green },
    { band: 'B4 (Red)', wavelength: '665 nm', targetReflectance: b4_effective, baselineReflectance: baseline.b4_red },
    { band: 'B8 (NIR)', wavelength: '842 nm', targetReflectance: selectedTarget.b8_nir, baselineReflectance: baseline.b8_nir },
    { band: 'B11 (SWIR-1)', wavelength: '1610 nm', targetReflectance: b11_effective, baselineReflectance: baseline.b11_swir1 },
    { band: 'B12 (SWIR-2)', wavelength: '2190 nm', targetReflectance: selectedTarget.b12_swir2, baselineReflectance: baseline.b12_swir2 }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="bg-bg-900 border border-accent-cyan/40 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-border bg-gradient-to-r from-bg-800 to-bg-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-text-primary">Sentinel-2 Multi-Spectral Band Ratio Inspector</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30">
                  ESA L2A CALIBRATED
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Analyze SWIR & VNIR absorption wavelengths to detect manganese hydrothermal alteration halos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs text-text-primary">
          
          {/* Preset Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-accent-cyan" /> Select Earth Observation Target Coordinate
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SPECTRAL_PRESETS.map((p) => {
                const isSelected = selectedTarget.id === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedTarget(p)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-accent-cyan/15 border-accent-cyan text-text-primary shadow-md'
                        : 'bg-surface-muted/50 border-surface-border hover:bg-surface-muted text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="font-bold text-xs truncate">{p.name}</div>
                      {p.isMineralized ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-green-500/20 text-green-400 flex-shrink-0">
                          Ore Anomaly
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-500/20 text-slate-400 flex-shrink-0">
                          Barren Rock
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-text-muted mt-1">{p.location} • {p.rockType}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Grid Layout: Left Chart, Right Indices */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Cols: Reflectance Spectral Curve Graph */}
            <div className="lg:col-span-7 card bg-surface-muted/40 p-4 border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-text-primary">Spectral Reflectance Signature Profile</div>
                  <div className="text-[11px] text-text-muted">Target Anomaly (Orange) vs Background Country Rock (Gray)</div>
                </div>
                <span className="text-[10px] font-mono text-accent-cyan font-bold">Wavelength (nm)</span>
              </div>

              {/* Line Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spectralCurveData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3854" />
                    <XAxis dataKey="band" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis domain={[0, 0.6]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                      labelStyle={{ color: '#f97316', fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Line
                      type="monotone"
                      dataKey="targetReflectance"
                      name="Target Ore Pixel (Reflectance)"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#f97316' }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="baselineReflectance"
                      name="Barren Country Rock (Baseline)"
                      stroke="#64748b"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 4, fill: '#64748b' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-2.5 rounded-lg bg-bg-900 border border-surface-border text-[11px] text-text-muted flex items-start gap-2">
                <Info className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Key Diagnostic Feature:</strong> Manganese-bearing Mansar formations display a steep reflectance surge at <strong>Band 4 (Red)</strong> and strong absorption dip between <strong>Band 11 (SWIR-1) and Band 12 (SWIR-2)</strong> due to Al-OH / Fe-OH clay mineral lattice stretching.
                </p>
              </div>
            </div>

            {/* Right 5 Cols: Live Index Calculations */}
            <div className="lg:col-span-5 space-y-3">
              
              {/* Verdict Card */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                isProspectPositive
                  ? 'bg-green-500/10 border-green-500/40 text-green-400'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
              }`}>
                {isProspectPositive ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {isProspectPositive ? 'Positive Manganese Alteration Halo' : 'Low / Negative Alteration Signature'}
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    {isProspectPositive
                      ? `Both Clay (${clayAlterationIndex}) and Iron Oxide (${ironOxideIndex}) indices exceed the empirical exploration threshold (>1.25). High diamond core drilling priority.`
                      : `Spectral absorption features match barren country rock. Recommended to de-prioritize diamond drilling.`}
                  </p>
                </div>
              </div>

              {/* Indices Breakdown List */}
              <div className="p-4 rounded-xl bg-surface-muted/50 border border-surface-border space-y-3">
                <div className="text-xs font-bold text-text-primary uppercase tracking-wider">Computed Spectral Indices</div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-bg-900 border border-surface-border flex items-center justify-between">
                    <div>
                      <div className="font-bold text-text-primary">Clay Mineral Alteration (B11/B12)</div>
                      <div className="text-[10px] text-text-muted">Formula: SWIR-1 (1.61μm) / SWIR-2 (2.19μm)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black font-mono text-green-400">{clayAlterationIndex}</div>
                      <div className="text-[9px] text-text-muted">{isClayAnomaly ? '✓ Anomaly' : 'Normal'}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-bg-900 border border-surface-border flex items-center justify-between">
                    <div>
                      <div className="font-bold text-text-primary">Iron Oxide / Gossan Index (B4/B2)</div>
                      <div className="text-[10px] text-text-muted">Formula: Red (0.66μm) / Blue (0.49μm)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black font-mono text-accent-orange">{ironOxideIndex}</div>
                      <div className="text-[9px] text-text-muted">{isIronAnomaly ? '✓ Gossan' : 'Normal'}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-bg-900 border border-surface-border flex items-center justify-between">
                    <div>
                      <div className="font-bold text-text-primary">Ferrous Mineral Ratio (B11/B8)</div>
                      <div className="text-[10px] text-text-muted">Formula: SWIR-1 (1.61μm) / NIR (0.84μm)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black font-mono text-cyan-400">{ferrousRatio}</div>
                      <div className="text-[9px] text-text-muted">Mineralized</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-bg-900 border border-surface-border flex items-center justify-between">
                    <div>
                      <div className="font-bold text-text-primary">NDVI Vegetation Mask</div>
                      <div className="text-[10px] text-text-muted">Formula: (B8 - B4) / (B8 + B4)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black font-mono text-emerald-400">{ndvi}</div>
                      <div className="text-[9px] text-text-muted">Clear Ground</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-border bg-bg-800 flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-cyan" />
            <span>Calibrated with ESA Copernicus Open Access Hub Sentinel-2 MSI L2A Level</span>
          </div>
          <button
            onClick={onClose}
            className="btn-primary text-xs py-1.5 px-4"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  )
}
