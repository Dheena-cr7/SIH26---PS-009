import { useEffect, useState } from 'react'
import { getModels, getRecommendations, getShortfall } from '../services/api'
import { MOCK_MODELS, MOCK_RECOMMENDATIONS, MOCK_SHORTFALL } from '../services/mockData'
import { Brain, Network, Zap, CheckCircle2, AlertTriangle, ArrowRight, XCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'
import { useNavigate } from 'react-router-dom'

export default function AIInsights() {
  const [modelsData, setModelsData] = useState<any>(MOCK_MODELS)
  const [recsData, setRecsData] = useState<any>(MOCK_RECOMMENDATIONS)
  const [shortfallData, setShortfallData] = useState<any>(MOCK_SHORTFALL)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getModels(), getRecommendations(), getShortfall()])
      .then(([m, r, s]) => {
        setModelsData(m)
        setRecsData(r)
        setShortfallData(s)
      }).catch(console.error)
  }, [])

  const models = modelsData?.models || []
  const recommendations = recsData?.recommendations || []
  
  // Extract SHAP data for waterfall
  const shortfallModel = models.find((m: any) => m.id === 'shortfall')
  let shapValues = shortfallModel?.shap_values || []
  
  // Sort SHAP values by absolute magnitude for better display
  const sortedShap = [...shapValues].sort((a: any, b: any) => Math.abs(b.shap) - Math.abs(a.shap))

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Brain className="w-6 h-6 text-accent-purple" />
            AI Insights & Explainability
          </h1>
          <p className="text-text-muted text-sm mt-1">Model metrics, SHAP explanations, and prescribed actions</p>
        </div>
        <button onClick={() => navigate('/simulator')} className="btn-secondary flex items-center gap-2 text-sm">
          Simulate Outcomes <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card border-accent-orange/30 bg-gradient-to-br from-bg-800 to-accent-orange/5">
             <div className="flex items-center justify-between mb-4">
               <div className="section-header flex items-center gap-2 text-accent-orange">
                 <Zap className="w-5 h-5" /> Prescriptive AI Recommendations
               </div>
               <div className="text-sm font-bold text-text-primary">
                 Potential Impact: <span className="text-green-400">+{recsData?.total_potential_improvement_pct || 9.4}%</span>
               </div>
             </div>
             
             <div className="space-y-3">
               {recommendations.map((rec: any) => (
                 <div key={rec.id} className="bg-bg-900/50 rounded-lg p-4 border border-surface-border hover:border-accent-orange/40 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-muted text-xs font-bold text-text-primary">
                          {rec.rank}
                        </span>
                        <h3 className="font-bold text-text-primary">{rec.title}</h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider ${
                        rec.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        rec.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {rec.priority} PRIORITY
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3 leading-relaxed">{rec.description}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-muted">Reason:</span>
                        <span className="text-text-primary truncate max-w-[200px]" title={rec.reason}>{rec.reason}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-muted">Impact:</span>
                        <span className="font-bold text-green-400">+{rec.expected_impact_pct}% prod</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-muted">AI Conf:</span>
                        <span className="font-mono text-text-primary">{rec.confidence_pct}%</span>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Model Registry */}
          <div className="card">
            <div className="section-header flex items-center gap-2 mb-4">
              <Network className="w-5 h-5 text-accent-blue" /> Machine Learning Model Registry
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {models.map((m: any) => (
                <div key={m.id} className="p-3 rounded-lg border border-surface-border bg-surface-muted/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-text-primary text-sm">{m.name}</span>
                    <span className="text-[10px] text-accent-blue uppercase tracking-wider font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">{m.algorithm}</span>
                  </div>
                  <div className="text-xs text-text-muted mb-3 h-8">{m.purpose}</div>
                  <div className="flex items-center justify-between border-t border-surface-border pt-2">
                     <span className="text-xs text-text-secondary">{m.metric}</span>
                     <span className="font-mono font-bold text-text-primary">{m.metric_value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: SHAP Explainability */}
        <div className="space-y-4">
          <div className="card flex flex-col h-full">
            <div className="section-header mb-1">Shortfall Risk Explanation</div>
            <div className="text-xs text-text-muted mb-4">SHAP Value Waterfall (Impact on Prediction)</div>
            
            <div className="flex items-baseline gap-2 mb-6 p-4 rounded-lg bg-surface-muted/30 border border-surface-border">
              <span className="text-xs text-text-secondary uppercase">Current Risk</span>
              <span className="text-3xl font-black text-red-400">{shortfallData?.shortfall_risk_pct || 68}%</span>
              <AlertTriangle className="w-5 h-5 text-red-400 ml-auto" />
            </div>

            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedShap} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#243055" horizontal={true} vertical={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, fill: '#f1f5f9' }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip 
                    cursor={{ fill: '#1e2d4d' }}
                    contentStyle={{ background: '#141d35', border: '1px solid #243055', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [val > 0 ? `+${val}` : val, 'SHAP Impact']}
                  />
                  <Bar dataKey="shap" radius={[0, 4, 4, 0]}>
                    {sortedShap.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.shap > 0 ? '#ef4444' : '#22c55e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 pt-3 border-t border-surface-border space-y-2">
               <div className="flex items-center gap-2 text-xs">
                 <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                 <span className="text-text-secondary">Increases Risk (Pushes prediction towards Shortfall)</span>
               </div>
               <div className="flex items-center gap-2 text-xs">
                 <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                 <span className="text-text-secondary">Decreases Risk (Pushes prediction towards Target)</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
