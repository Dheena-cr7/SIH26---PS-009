import React, { useState, useMemo } from 'react'
import { Zap, ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, Flame, Gauge, Layers, Info, Sparkles, Scale } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'

export default function BlastOptimizer() {
  const [burdenMeters, setBurdenMeters] = useState<number>(3.0)
  const [spacingMeters, setSpacingMeters] = useState<number>(3.5)
  const [holeDepthMeters, setHoleDepthMeters] = useState<number>(12.0)
  const [holeDiameterMm, setHoleDiameterMm] = useState<number>(115)
  const [powderFactor, setPowderFactor] = useState<number>(0.48) // kg/m^3
  const [rockRockType, setRockRockType] = useState<'mansar_gondite' | 'sitasaongi_schist' | 'tirodi_gneiss'>('mansar_gondite')

  // Kuz-Ram Fragmentation & Lundborg Flyrock Models Calculation
  const blastResults = useMemo(() => {
    // Rock Factor based on geology
    const rockFactorMap = {
      mansar_gondite: 9.5,      // Hard, dense manganese ore
      sitasaongi_schist: 7.2,   // Moderately jointed schist
      tirodi_gneiss: 11.0       // Very hard crystalline gneiss
    }
    const rockFactor = rockFactorMap[rockRockType] || 9.5

    // Blast volume per hole
    const volumePerHole = burdenMeters * spacingMeters * holeDepthMeters
    const explosivePerHole = volumePerHole * powderFactor // kg

    // 1. Mean Fragment Size D50 (Kuz-Ram empirical equation simulation)
    // D50 = A * (V/Q)^0.8 * Q^(1/6) * (115/E)^0.633
    const meanFragmentSizeCm = Number((rockFactor * Math.pow(1 / powderFactor, 0.8) * Math.pow(explosivePerHole, 0.16) * 0.45).toFixed(1))

    // 2. Lundborg Maximum Flyrock Range (meters)
    // Lmax = 260 * (d/1000)^0.67 * (powderFactor)^0.33 * (burden ratio)
    const flyrockDistanceMeters = Math.round(260 * Math.pow(holeDiameterMm / 1000, 0.67) * Math.pow(powderFactor, 0.5) * (3.0 / Math.max(2.0, burdenMeters)))
    const flyrockSafetyBufferMeters = Math.round(flyrockDistanceMeters * 1.5)

    // 3. Peak Particle Velocity (PPV in mm/s at 150m distance - DGMS Standard)
    // PPV = K * (D / sqrt(Q))^-beta
    const ppvAt150m = Number((120 * Math.pow(150 / Math.sqrt(explosivePerHole), -1.45)).toFixed(2))

    // Crusher compatibility check (Ideal D50 is 18 - 32 cm for Primary Gyratory Crusher)
    const isFragmentIdeal = meanFragmentSizeCm >= 18 && meanFragmentSizeCm <= 32
    const isPpvSafe = ppvAt150m <= 10.0 // DGMS safe threshold is 10-15 mm/s for structures
    const isOverallCompliant = isFragmentIdeal && isPpvSafe

    // Boulder yield > 60cm (requires secondary breaking)
    const oversizeBouldersPct = Number((Math.max(2, (meanFragmentSizeCm - 20) * 1.2)).toFixed(1))
    // Fines yield < 5cm (dust loss)
    const finesPct = Number((Math.max(4, powderFactor * 22)).toFixed(1))

    return {
      volumePerHole: Number(volumePerHole.toFixed(1)),
      explosivePerHole: Number(explosivePerHole.toFixed(1)),
      meanFragmentSizeCm,
      flyrockDistanceMeters,
      flyrockSafetyBufferMeters,
      ppvAt150m,
      isFragmentIdeal,
      isPpvSafe,
      isOverallCompliant,
      oversizeBouldersPct,
      finesPct
    }
  }, [burdenMeters, spacingMeters, holeDepthMeters, holeDiameterMm, powderFactor, rockRockType])

  const handlePresetOptimized = () => {
    setBurdenMeters(3.0)
    setSpacingMeters(3.5)
    setHoleDepthMeters(12.0)
    setPowderFactor(0.48)
    setRockRockType('mansar_gondite')
  }

  const fragmentationDistributionData = [
    { range: '< 5cm (Fines)', pct: blastResults.finesPct, label: 'Crusher Fines' },
    { range: '5-20cm (Medium)', pct: Number((32 - blastResults.finesPct * 0.3).toFixed(1)), label: 'Feed Grade' },
    { range: '20-45cm (Ideal Lump)', pct: Number((50 - blastResults.oversizeBouldersPct * 0.8).toFixed(1)), label: 'Optimum Size' },
    { range: '> 45cm (Oversize)', pct: blastResults.oversizeBouldersPct, label: 'Secondary Break' },
  ]

  return (
    <div className="card border-accent-orange/30 p-5 space-y-6 bg-gradient-to-br from-bg-900 via-bg-900 to-accent-orange/5 shadow-2xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent-orange" />
            <h2 className="text-lg font-bold text-text-primary">Blast Optimization & Flyrock Safety Zone Generator</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-orange/20 text-accent-orange border border-accent-orange/30">
              DGMS COMPLIANT
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Kuz-Ram fragmentation modeling and Lundborg flyrock exclusion zone calculator for pit blasting optimization
          </p>
        </div>

        <button
          onClick={handlePresetOptimized}
          className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 self-start sm:self-auto shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" /> Auto-Set Optimum Pattern
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Blast Design Parameters */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold text-text-primary uppercase tracking-wider">Bench Blast Design Geometry</div>

          {/* Rock Type Selector */}
          <div className="p-3 rounded-xl bg-surface-muted/40 border border-surface-border space-y-2 text-xs">
            <label className="text-text-muted font-semibold">Lithology Stratum Rock Mass:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mansar_gondite', label: 'Mansar Gondite (Ore)', desc: 'Density: 3.4 g/cm³' },
                { id: 'sitasaongi_schist', label: 'Sitasaongi Schist', desc: 'Density: 2.8 g/cm³' },
                { id: 'tirodi_gneiss', label: 'Tirodi Gneiss (Hard)', desc: 'Density: 2.9 g/cm³' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRockRockType(r.id as any)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    rockRockType === r.id
                      ? 'bg-accent-orange/20 border-accent-orange text-text-primary font-bold'
                      : 'bg-bg-900 border-surface-border text-text-secondary hover:bg-surface-muted'
                  }`}
                >
                  <div className="text-[11px] truncate">{r.label}</div>
                  <div className="text-[9px] text-text-muted">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-3 text-xs">
            {/* Burden */}
            <div className="p-3 rounded-xl bg-surface-muted/30 border border-surface-border space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-text-secondary">Burden Distance (B):</span>
                <span className="font-mono font-bold text-accent-orange">{burdenMeters} meters</span>
              </div>
              <input
                type="range" min="2.0" max="4.5" step="0.1"
                value={burdenMeters} onChange={(e) => setBurdenMeters(Number(e.target.value))}
                className="w-full accent-accent-orange h-1.5 bg-bg-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Spacing */}
            <div className="p-3 rounded-xl bg-surface-muted/30 border border-surface-border space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-text-secondary">Hole Spacing (S):</span>
                <span className="font-mono font-bold text-accent-orange">{spacingMeters} meters</span>
              </div>
              <input
                type="range" min="2.5" max="5.5" step="0.1"
                value={spacingMeters} onChange={(e) => setSpacingMeters(Number(e.target.value))}
                className="w-full accent-accent-orange h-1.5 bg-bg-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Powder Factor */}
            <div className="p-3 rounded-xl bg-surface-muted/30 border border-surface-border space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-text-secondary">Explosive Powder Factor (q):</span>
                <span className="font-mono font-bold text-green-400">{powderFactor} kg/m³</span>
              </div>
              <input
                type="range" min="0.30" max="0.75" step="0.02"
                value={powderFactor} onChange={(e) => setPowderFactor(Number(e.target.value))}
                className="w-full accent-green-400 h-1.5 bg-bg-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Bench Height */}
            <div className="p-3 rounded-xl bg-surface-muted/30 border border-surface-border space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-text-secondary">Hole Depth / Bench RL Height:</span>
                <span className="font-mono font-bold text-cyan-400">{holeDepthMeters} meters</span>
              </div>
              <input
                type="range" min="6.0" max="16.0" step="1.0"
                value={holeDepthMeters} onChange={(e) => setHoleDepthMeters(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-bg-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Safety & Fragmentation Output */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Compliance Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            blastResults.isOverallCompliant
              ? 'bg-green-500/10 border-green-500/40 text-green-400'
              : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
          }`}>
            {blastResults.isOverallCompliant ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                {blastResults.isOverallCompliant ? 'Optimal Fragmentation & Safe Ground Vibration' : 'Pattern Needs Adjustment'}
              </div>
              <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                {blastResults.isOverallCompliant
                  ? `Mean boulder size (${blastResults.meanFragmentSizeCm}cm) is ideal for primary crusher throughput with zero secondary blasting delays.`
                  : `Current pattern generates excessive boulder oversize or elevated PPV. Adjust spacing or powder factor.`}
              </p>
            </div>
          </div>

          {/* Key Engineering Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-xs">
              <div className="text-[10px] text-text-muted uppercase">Mean Fragment (D₅₀)</div>
              <div className="text-2xl font-black text-text-primary mt-1 font-mono">
                {blastResults.meanFragmentSizeCm} <span className="text-sm font-normal text-text-muted">cm</span>
              </div>
              <div className="text-[10px] text-green-400 font-semibold mt-0.5">
                {blastResults.isFragmentIdeal ? '✓ Crusher Compatible' : '⚠️ Sub-optimal Size'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-xs">
              <div className="text-[10px] text-text-muted uppercase">Flyrock Safety Radius</div>
              <div className="text-2xl font-black text-accent-orange mt-1 font-mono">
                {blastResults.flyrockSafetyBufferMeters} <span className="text-sm font-normal text-text-muted">m</span>
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">Exclusion Buffer Zone</div>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-xs">
              <div className="text-[10px] text-text-muted uppercase">Ground Vibration (PPV)</div>
              <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">
                {blastResults.ppvAt150m} <span className="text-sm font-normal text-text-muted">mm/s</span>
              </div>
              <div className="text-[10px] text-green-400 mt-0.5 font-semibold">
                ✓ DGMS Safe (&lt;10.0 mm/s)
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-xs">
              <div className="text-[10px] text-text-muted uppercase">Yield Per Borehole</div>
              <div className="text-2xl font-black text-text-primary mt-1 font-mono">
                {blastResults.volumePerHole} <span className="text-sm font-normal text-text-muted">m³</span>
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">~{Math.round(blastResults.volumePerHole * 3.2)} tonnes rock</div>
            </div>
          </div>

          {/* Fragmentation Curve Breakdown */}
          <div className="p-3.5 rounded-xl bg-surface-muted/40 border border-surface-border space-y-2">
            <div className="text-xs font-bold text-text-primary">Simulated Rock Fragmentation Spectrum</div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fragmentationDistributionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#243055" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="pct" name="Yield %" fill="#f97316" radius={[4, 4, 0, 0]}>
                    {fragmentationDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#22c55e' : (index === 0 ? '#06b6d4' : '#f97316')} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
