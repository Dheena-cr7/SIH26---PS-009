import { useState, useEffect } from 'react'
import { runSimulation } from '../services/api'
import { computeLocalSimulation } from '../services/mockData'
import OreBlendingOptimizer from '../components/OreBlendingOptimizer'
import BlastOptimizer from '../components/BlastOptimizer'
import { Sliders as SlidersIcon, Play, RefreshCw, BarChart2, Activity, Zap, TrendingUp, AlertTriangle, Scale, Gauge, Flame } from 'lucide-react'

export default function Simulator() {
  const [activeTab, setActiveTab] = useState<'fleet_policy' | 'ore_blending' | 'blast_optimization'>('fleet_policy')
  const [params, setParams] = useState({
    equipment_availability_pct: 82.0,
    rainfall_scenario: 'MODERATE',
    blasting_delay_days: 3,
    equipment_redeployment: false,
    working_hours: 8.0
  })

  const [results, setResults] = useState<any>(() => computeLocalSimulation({
    equipment_availability_pct: 82.0,
    rainfall_scenario: 'MODERATE',
    blasting_delay_days: 3,
    equipment_redeployment: false,
    working_hours: 8.0
  }))
  const [loading, setLoading] = useState(false)

  // Run initial simulation to get baseline
  useEffect(() => {
    handleSimulate()
  }, [])

  const handleSimulate = async () => {
    setLoading(true)
    try {
      const res = await runSimulation(params)
      setResults(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setParams({
      equipment_availability_pct: 82.0,
      rainfall_scenario: 'MODERATE',
      blasting_delay_days: 3,
      equipment_redeployment: false,
      working_hours: 8.0
    })
  }

  const r = results?.results
  const b = results?.baseline

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header with Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <SlidersIcon className="w-6 h-6 text-accent-cyan" />
            What-If Simulator & Policy Engine
          </h1>
          <p className="text-text-muted text-sm mt-0.5">Interactive operational planning, fleet reallocation, blast sizing, and ore blending</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-bg-800 p-1 border border-surface-border self-start flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('fleet_policy')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'fleet_policy'
                ? 'bg-accent-cyan text-black shadow-md'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" /> Fleet & Shortfall
          </button>
          <button
            onClick={() => setActiveTab('ore_blending')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ore_blending'
                ? 'bg-accent-orange text-black shadow-md'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> Smart Blending
          </button>
          <button
            onClick={() => setActiveTab('blast_optimization')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'blast_optimization'
                ? 'bg-red-500 text-white shadow-md'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Blast & Flyrock
          </button>
        </div>
      </div>

      {activeTab === 'ore_blending' ? (
        <OreBlendingOptimizer />
      ) : activeTab === 'blast_optimization' ? (
        <BlastOptimizer />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card border-t-4 border-t-accent-cyan">
            <div className="flex items-center justify-between mb-6">
              <div className="section-header !mb-0">Scenario Parameters</div>
              <button onClick={handleReset} className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors">
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-6">
              {/* Equipment Availability */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-text-secondary">Fleet Availability Target</label>
                  <span className="font-mono text-accent-cyan font-bold">{params.equipment_availability_pct}%</span>
                </div>
                <input 
                  type="range" min="50" max="100" step="1"
                  value={params.equipment_availability_pct}
                  onChange={(e) => setParams({...params, equipment_availability_pct: parseFloat(e.target.value)})}
                  className="w-full accent-cyan-500 h-1.5 bg-surface-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-text-muted mt-1">
                  <span>Critical (50%)</span>
                  <span>Optimal (100%)</span>
                </div>
              </div>

              {/* Working Hours */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-text-secondary">Effective Working Hours / Shift</label>
                  <span className="font-mono text-accent-cyan font-bold">{params.working_hours} hrs</span>
                </div>
                <input 
                  type="range" min="4" max="12" step="0.5"
                  value={params.working_hours}
                  onChange={(e) => setParams({...params, working_hours: parseFloat(e.target.value)})}
                  className="w-full accent-cyan-500 h-1.5 bg-surface-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-text-muted mt-1">
                  <span>Reduced (4h)</span>
                  <span>Extended (12h)</span>
                </div>
              </div>

              {/* Blasting Delay */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-text-secondary">Blasting Sequence Delay</label>
                  <span className="font-mono text-accent-orange font-bold">{params.blasting_delay_days} days</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="1"
                  value={params.blasting_delay_days}
                  onChange={(e) => setParams({...params, blasting_delay_days: parseInt(e.target.value)})}
                  className="w-full accent-orange-500 h-1.5 bg-surface-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Rainfall Scenario */}
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-2">Weather / Rainfall Forecast</label>
                <div className="grid grid-cols-3 gap-2">
                  {['LOW', 'MODERATE', 'HEAVY'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setParams({...params, rainfall_scenario: level})}
                      className={`py-2 px-1 text-xs font-semibold rounded-md border transition-all ${
                        params.rainfall_scenario === level 
                          ? 'bg-accent-blue/20 border-accent-blue text-accent-blue' 
                          : 'bg-surface-muted/30 border-surface-border text-text-muted hover:bg-surface-muted'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Boolean Toggles */}
              <div className="pt-2">
                <label className="flex items-center justify-between p-3 rounded-lg border border-surface-border bg-surface-muted/20 cursor-pointer hover:bg-surface-muted/40 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-text-primary">Execute AI Redeployment</div>
                    <div className="text-xs text-text-muted mt-0.5">Move idle dumpers to bottleneck zones</div>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${params.equipment_redeployment ? 'bg-green-500' : 'bg-surface-muted'}`}>
                    <input type="checkbox" className="sr-only" checked={params.equipment_redeployment} onChange={(e) => setParams({...params, equipment_redeployment: e.target.checked})} />
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${params.equipment_redeployment ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </label>
              </div>
            </div>

            <button 
              onClick={handleSimulate}
              disabled={loading}
              className={`w-full mt-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-surface-muted cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:-translate-y-0.5'}`}
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
              {loading ? 'Computing...' : 'RUN SIMULATION'}
            </button>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Comparison */}
          {r && b && (
            <div className="grid grid-cols-2 gap-4">
              <div className="card border-surface-border bg-bg-900/50 opacity-80">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-4 text-center">Current Baseline</div>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-text-secondary">{b.annual_production_mt.toFixed(2)} <span className="text-lg">Mt</span></div>
                    <div className="text-xs text-text-muted mt-1">Annual Production</div>
                  </div>
                  <div className="text-center pb-2">
                    <div className="text-3xl font-bold text-red-400/80">{b.shortfall_risk_pct}%</div>
                    <div className="text-xs text-text-muted mt-1">Shortfall Risk</div>
                  </div>
                </div>
              </div>

              <div className="card border-accent-cyan/40 bg-accent-cyan/5 relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <div className="absolute top-0 right-0 p-2">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                    <TrendingUp className="w-3 h-3" /> +{r.improvement_vs_baseline_pct}%
                  </span>
                </div>
                <div className="text-xs text-accent-cyan uppercase tracking-wider mb-4 text-center font-bold">Simulated Outcome</div>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-black text-text-primary">{r.annual_production_mt.toFixed(2)} <span className="text-xl text-text-muted font-medium">Mt</span></div>
                    <div className="text-xs text-text-secondary mt-1 font-medium">Simulated Production</div>
                  </div>
                  <div className="text-center pb-2">
                    <div className={`text-4xl font-black ${r.shortfall_risk_pct < 40 ? 'text-green-400' : r.shortfall_risk_pct < 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {r.shortfall_risk_pct}%
                    </div>
                    <div className="text-xs text-text-secondary mt-1 font-medium">New Shortfall Risk ({r.risk_level})</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Metrics */}
          {r && (
            <div className="card">
              <div className="section-header mb-4">Detailed Projections</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-text-muted mb-1">Monthly Output</div>
                  <div className="text-xl font-bold text-text-primary">{r.monthly_production_tonnes.toLocaleString()} <span className="text-sm text-text-muted">t</span></div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Production Gap</div>
                  <div className={`text-xl font-bold ${r.production_gap_kt > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                    {r.production_gap_kt} <span className="text-sm text-text-muted">kt</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Target Match</div>
                  <div className="text-xl font-bold text-text-primary">
                    {Math.min(100, Math.round((r.annual_production_mt / r.production_target_mt) * 100))}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Equip. Utilization</div>
                  <div className="text-xl font-bold text-text-primary">{r.equipment_utilization_pct}%</div>
                </div>
              </div>
              
              {r.production_gap_kt === 0 && (
                <div className="mt-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div className="text-sm text-green-400 font-medium">
                    This scenario achieves the target production. The modeled operational parameters are sufficient to close the gap.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info Panel */}
          <div className="p-4 bg-surface-muted/30 rounded-xl border border-surface-border text-sm text-text-secondary flex gap-3">
            <Activity className="w-5 h-5 text-text-muted flex-shrink-0" />
            <p>
              The simulator feeds your inputs directly into the trained <strong className="text-text-primary">XGBoost Production Forecast Model</strong> in real-time, calculating new outcomes based on the complex non-linear relationships learned from historical data.
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  )
}
