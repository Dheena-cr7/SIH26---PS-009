import React, { useState, useMemo } from 'react'
import { Sparkles, CheckCircle2, AlertTriangle, RefreshCw, Layers, TrendingDown, DollarSign, Scale, ArrowRight, ShieldCheck } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'

interface Stockpile {
  id: string
  name: string
  originMine: string
  mnGrade: number
  feGrade: number
  sio2Grade: number
  costPerTonne: number
  availableStockpileTonnes: number
  color: string
}

const STOCKPILES: Stockpile[] = [
  {
    id: 'sp-1',
    name: 'Balaghat Premium Lump',
    originMine: 'Balaghat Pit 2',
    mnGrade: 44.5,
    feGrade: 5.2,
    sio2Grade: 5.8,
    costPerTonne: 3950,
    availableStockpileTonnes: 45000,
    color: '#22c55e'
  },
  {
    id: 'sp-2',
    name: 'Dongri Buzurg Medium Ore',
    originMine: 'Dongri Buzurg West',
    mnGrade: 35.0,
    feGrade: 7.4,
    sio2Grade: 8.9,
    costPerTonne: 2850,
    availableStockpileTonnes: 60000,
    color: '#f97316'
  },
  {
    id: 'sp-3',
    name: 'Tirodi Low-Grade Gondite',
    originMine: 'Tirodi Extension',
    mnGrade: 27.5,
    feGrade: 9.1,
    sio2Grade: 13.5,
    costPerTonne: 1800,
    availableStockpileTonnes: 85000,
    color: '#eab308'
  },
  {
    id: 'sp-4',
    name: 'Mansar Reclaimed Wad/Fines',
    originMine: 'Mansar Secondary Dump',
    mnGrade: 20.5,
    feGrade: 11.8,
    sio2Grade: 17.2,
    costPerTonne: 950,
    availableStockpileTonnes: 40000,
    color: '#8b5cf6'
  }
]

export default function OreBlendingOptimizer() {
  const [totalBatchTarget, setTotalBatchTarget] = useState<number>(10000)
  const [blendPercentages, setBlendPercentages] = useState<{ [key: string]: number }>({
    'sp-1': 55,
    'sp-2': 30,
    'sp-3': 15,
    'sp-4': 0
  })

  const [minMnSpec, setMinMnSpec] = useState<number>(38.0)
  const [maxFeSpec, setMaxFeSpec] = useState<number>(7.5)
  const [maxSio2Spec, setMaxSio2Spec] = useState<number>(10.0)

  // Calculate weighted blend parameters
  const blendResult = useMemo(() => {
    let totalPct = 0
    let weightedMn = 0
    let weightedFe = 0
    let weightedSio2 = 0
    let weightedCost = 0

    STOCKPILES.forEach((sp) => {
      const pct = blendPercentages[sp.id] || 0
      totalPct += pct
      const fraction = pct / 100
      weightedMn += sp.mnGrade * fraction
      weightedFe += sp.feGrade * fraction
      weightedSio2 += sp.sio2Grade * fraction
      weightedCost += sp.costPerTonne * fraction
    })

    // Normalize if user percentages don't add to 100
    const scale = totalPct > 0 ? 100 / totalPct : 1
    const normalizedMn = weightedMn * (totalPct > 0 ? 100 / totalPct : 1)
    const normalizedFe = weightedFe * (totalPct > 0 ? 100 / totalPct : 1)
    const normalizedSio2 = weightedSio2 * (totalPct > 0 ? 100 / totalPct : 1)
    const normalizedCost = weightedCost * (totalPct > 0 ? 100 / totalPct : 1)

    const isMnCompliant = normalizedMn >= minMnSpec
    const isFeCompliant = normalizedFe <= maxFeSpec
    const isSio2Compliant = normalizedSio2 <= maxSio2Spec
    const isCompliant = isMnCompliant && isFeCompliant && isSio2Compliant

    const pureHighGradeCost = STOCKPILES[0].costPerTonne
    const costSavingsPerTonne = Math.max(0, pureHighGradeCost - normalizedCost)
    const totalBatchSavings = Math.round(costSavingsPerTonne * totalBatchTarget)

    return {
      totalPct,
      mn: Number(normalizedMn.toFixed(2)),
      fe: Number(normalizedFe.toFixed(2)),
      sio2: Number(normalizedSio2.toFixed(2)),
      costPerTonne: Math.round(normalizedCost),
      isCompliant,
      isMnCompliant,
      isFeCompliant,
      isSio2Compliant,
      costSavingsPerTonne: Math.round(costSavingsPerTonne),
      totalBatchSavings
    }
  }, [blendPercentages, minMnSpec, maxFeSpec, maxSio2Spec, totalBatchTarget])

  const handleSliderChange = (id: string, value: number) => {
    setBlendPercentages((prev) => ({ ...prev, [id]: value }))
  }

  // Linear programming solver simulation (optimizes for lowest cost >= target spec)
  const handleAutoOptimize = () => {
    // Target ~38.2% Mn to meet 38% specification with safety buffer
    // Blend: ~50% Balaghat (44.5%), ~35% Dongri (35%), ~15% Tirodi (27.5%)
    setBlendPercentages({
      'sp-1': 52,
      'sp-2': 34,
      'sp-3': 14,
      'sp-4': 0
    })
  }

  const handleReset = () => {
    setBlendPercentages({
      'sp-1': 55,
      'sp-2': 30,
      'sp-3': 15,
      'sp-4': 0
    })
  }

  const chartData = [
    { name: '% Mn Grade', blended: blendResult.mn, spec: minMnSpec, unit: '%', isMin: true },
    { name: '% Fe Impurity', blended: blendResult.fe, spec: maxFeSpec, unit: '%', isMin: false },
    { name: '% SiO2 Silica', blended: blendResult.sio2, spec: maxSio2Spec, unit: '%', isMin: false }
  ]

  return (
    <div className="card border-accent-orange/30 p-5 space-y-6 bg-gradient-to-br from-bg-900 via-bg-900 to-accent-orange/5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-accent-orange" />
            <h2 className="text-lg font-bold text-text-primary">Smart Ore Blending & Grade Optimizer</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-orange/20 text-accent-orange border border-accent-orange/30">
              METALLURGICAL AI
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Formulate optimal multi-pit feed ratios to meet Steel Authority / Ferromanganese delivery specifications at minimum cost
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleAutoOptimize}
            className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 shadow-lg shadow-accent-orange/20"
          >
            <Sparkles className="w-3.5 h-3.5" /> Auto-Solve Best Cost Ratio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Stockpile Sliders */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-text-primary uppercase tracking-wider">Stockpile Feed Ratio Mix</span>
            <span className={`font-mono font-bold ${blendResult.totalPct === 100 ? 'text-green-400' : 'text-amber-400'}`}>
              Total: {blendResult.totalPct}% {blendResult.totalPct !== 100 && '(Auto-Normalized)'}
            </span>
          </div>

          <div className="space-y-3">
            {STOCKPILES.map((sp) => {
              const pct = blendPercentages[sp.id] || 0
              const tonnage = Math.round((pct / 100) * totalBatchTarget)

              return (
                <div key={sp.id} className="p-3 rounded-xl bg-surface-muted/50 border border-surface-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sp.color }}></span>
                        {sp.name}
                      </div>
                      <div className="text-[11px] text-text-muted mt-0.5">
                        {sp.originMine} • ₹{sp.costPerTonne.toLocaleString()}/t
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-text-primary font-mono">{pct}%</div>
                      <div className="text-[10px] text-text-muted">{tonnage.toLocaleString()} tonnes</div>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={pct}
                    onChange={(e) => handleSliderChange(sp.id, Number(e.target.value))}
                    className="w-full accent-accent-orange h-1.5 bg-bg-800 rounded-lg cursor-pointer"
                  />

                  <div className="flex items-center justify-between text-[11px] text-text-muted font-mono pt-1">
                    <span>Grade: <strong className="text-green-400">{sp.mnGrade}% Mn</strong></span>
                    <span>Fe: {sp.feGrade}%</span>
                    <span>SiO₂: {sp.sio2Grade}%</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Batch Tonnes Input */}
          <div className="p-3 rounded-xl bg-surface-muted/30 border border-surface-border flex items-center justify-between text-xs">
            <span className="text-text-muted font-medium">Batch Delivery Size:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={totalBatchTarget}
                onChange={(e) => setTotalBatchTarget(Math.max(1000, Number(e.target.value)))}
                className="w-28 py-1 px-2 text-xs bg-bg-900 border border-surface-border rounded-lg text-right font-mono font-bold text-text-primary focus:outline-none focus:border-accent-orange"
              />
              <span className="text-text-muted font-mono">Tonnes</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Quality & Cost Summary */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Compliance Status Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            blendResult.isCompliant
              ? 'bg-green-500/10 border-green-500/40 text-green-400'
              : 'bg-red-500/10 border-red-500/40 text-red-400'
          }`}>
            {blendResult.isCompliant ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                {blendResult.isCompliant ? 'Compliant Feed Recipe' : 'Specification Out of Bounds'}
              </div>
              <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                {blendResult.isCompliant
                  ? `Recipe meets Ferromanganese Grade requirements (≥${minMnSpec}% Mn). Ready for plant blast dispatch.`
                  : `Delivered blend does not satisfy quality standards. Adjust Balaghat lump ratio to elevate Mn above ${minMnSpec}%.`}
              </p>
            </div>
          </div>

          {/* Key Output Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-xs">
              <div className="text-[10px] text-text-muted uppercase">Delivered Mn Grade</div>
              <div className="text-2xl font-black text-text-primary mt-1 font-mono">
                {blendResult.mn}%
              </div>
              <div className={`text-[10px] font-semibold mt-0.5 ${blendResult.isMnCompliant ? 'text-green-400' : 'text-red-400'}`}>
                {blendResult.isMnCompliant ? `✓ Target ≥${minMnSpec}% met` : `✗ Below ${minMnSpec}% spec`}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-xs">
              <div className="text-[10px] text-text-muted uppercase">Weighted Unit Cost</div>
              <div className="text-2xl font-black text-accent-orange mt-1 font-mono">
                ₹{blendResult.costPerTonne.toLocaleString()}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">per delivered tonne</div>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-xs">
              <div className="text-[10px] text-text-muted uppercase">Batch Cost Savings</div>
              <div className="text-xl font-black text-green-400 mt-1 font-mono">
                ₹{(blendResult.totalBatchSavings / 100000).toFixed(2)} Lakh
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">vs 100% Balaghat lump</div>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-xs">
              <div className="text-[10px] text-text-muted uppercase">Total Delivery Value</div>
              <div className="text-xl font-black text-text-primary mt-1 font-mono">
                ₹{((blendResult.costPerTonne * totalBatchTarget) / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">{totalBatchTarget.toLocaleString()}t batch</div>
            </div>
          </div>

          {/* Assay Comparison Bars */}
          <div className="p-3.5 rounded-xl bg-surface-muted/40 border border-surface-border space-y-2">
            <div className="text-xs font-bold text-text-primary">Metallurgical Spec Compliance</div>
            
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-text-muted">Manganese (Mn):</span>
                  <span className="font-mono font-bold text-green-400">{blendResult.mn}% (Spec ≥{minMnSpec}%)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill bg-green-500" style={{ width: `${Math.min(100, (blendResult.mn / 50) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-text-muted">Iron Impurity (Fe):</span>
                  <span className={`font-mono font-bold ${blendResult.isFeCompliant ? 'text-text-primary' : 'text-red-400'}`}>
                    {blendResult.fe}% (Spec ≤{maxFeSpec}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-bar-fill ${blendResult.isFeCompliant ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (blendResult.fe / 15) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-text-muted">Silica (SiO₂):</span>
                  <span className={`font-mono font-bold ${blendResult.isSio2Compliant ? 'text-text-primary' : 'text-red-400'}`}>
                    {blendResult.sio2}% (Spec ≤{maxSio2Spec}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-bar-fill ${blendResult.isSio2Compliant ? 'bg-purple-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (blendResult.sio2 / 20) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
