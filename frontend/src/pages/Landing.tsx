import { useNavigate } from 'react-router-dom'
import { Satellite, Brain, Map, BarChart3, Zap, ArrowRight, Shield } from 'lucide-react'

const pipeline = [
  { icon: Satellite, label: 'Satellite Data', sub: 'Sentinel-2 · Landsat · MOSDAC', color: '#3b82f6' },
  { icon: Map, label: 'Geological Intelligence', sub: 'BIF · Structural · Drill Data', color: '#8b5cf6' },
  { icon: Brain, label: 'AI Prospectivity', sub: 'XGBoost · Spatial ML', color: '#f97316' },
  { icon: BarChart3, label: 'Production Forecast', sub: 'Time-series · Risk Models', color: '#22c55e' },
  { icon: Zap, label: 'Decisions & Simulation', sub: 'What-If · Recommendations', color: '#f59e0b' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-900 flex flex-col overflow-x-hidden">
      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5">
          <div style={{
            backgroundImage: 'linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            width: '100%',
            height: '100%'
          }} />
        </div>

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-orange/30 bg-accent-orange/10 text-accent-orange text-sm font-medium mb-8">
            <Satellite className="w-4 h-4" />
            SIH 2026 · PS-26009 · Ministry of Steel · MOIL Limited
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary mb-4 leading-tight tracking-tight">
            ORE<span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #f97316, #f59e0b)' }}>SEEK</span>
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary font-light mb-4">
            AI + Space Technology for Smarter Mineral Exploration & Mine Planning
          </p>

          <p className="text-base text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
            An AI-powered decision-support platform combining Earth observation, geological intelligence
            and mining operations analytics to accelerate mineral discovery and optimize production.
          </p>

          {/* Tagline */}
          <div className="text-accent-orange font-semibold text-lg mb-12 italic">
            "OreSeek: From Satellite Signals to Smarter Mining Decisions."
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/exploration')}
              className="btn-primary flex items-center gap-2 text-base px-8 py-3"
            >
              <Map className="w-5 h-5" />
              Explore Intelligence
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex items-center gap-2 text-base px-8 py-3"
            >
              <BarChart3 className="w-5 h-5" />
              Open Command Center
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pipeline */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
            {pipeline.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center text-center w-36">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 border"
                    style={{ backgroundColor: `${step.color}15`, borderColor: `${step.color}30` }}>
                    <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                  <div className="text-xs font-semibold text-text-primary">{step.label}</div>
                  <div className="text-xs text-text-muted mt-0.5">{step.sub}</div>
                </div>
                {i < pipeline.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0 mx-2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo flow */}
      <div className="bg-bg-800 border-t border-surface-border px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-text-primary mb-2">The Complete Intelligence Workflow</h2>
          <p className="text-text-muted text-center text-sm mb-10">DISCOVER → PREDICT → ACT → IMPROVE</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'AI Prospectivity Mapping', desc: 'Multi-spectral satellite analysis combined with geological data to identify high-priority exploration zones', icon: Map },
              { step: '02', title: 'Resource Intelligence', desc: 'AI-assisted resource potential estimation with confidence intervals from drill-hole and geological evidence', icon: Database },
              { step: '03', title: 'Production Forecasting', desc: 'XGBoost ML models forecast monthly production accounting for equipment, weather and operational factors', icon: BarChart3 },
              { step: '04', title: 'Shortfall Prediction', desc: 'Real-time shortfall risk scoring with explainable AI showing the key contributing factors', icon: Brain },
              { step: '05', title: 'AI Recommendations', desc: 'Data-driven corrective actions with predicted impact — from equipment redeployment to blast scheduling', icon: Zap },
              { step: '06', title: 'What-If Simulation', desc: 'Interactive scenario modelling — change equipment, weather and operations to see projected outcomes', icon: Shield },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="card-hover p-5">
                <div className="flex items-start gap-3">
                  <div className="text-xs font-mono font-bold text-accent-orange bg-accent-orange/10 px-2 py-1 rounded flex-shrink-0">{step}</div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary mb-1">{title}</div>
                    <div className="text-xs text-text-muted leading-relaxed">{desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-bg-900 px-8 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-3.5 h-3.5 text-text-muted" />
          <p className="text-xs text-text-muted max-w-2xl">
            Prototype decision-support system. Demonstration results use public and/or synthetic data where operational MOIL datasets are unavailable.
            Geological/resource estimates require validation using certified exploration, drilling and assay data before operational or regulatory use.
          </p>
        </div>
        <p className="text-xs text-text-muted/60 mt-2">Smart India Hackathon 2026 · PS-26009 · Space Technology Theme</p>
      </footer>
    </div>
  )
}

// Fix: import Database
function Database(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>
    </svg>
  )
}
