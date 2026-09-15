import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Presentation, ChevronLeft, ChevronRight, X, Sparkles, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react'

interface PresentationTourProps {
  isOpen: boolean
  onClose: () => void
}

const TOUR_STEPS = [
  {
    step: 1,
    title: "1. Problem Alignment & Satellite Exploration",
    route: "/exploration",
    subtitle: "PS-26009 • Space-Derived Spectral Indices",
    narrative: "Demonstrates how Sentinel-2 multi-spectral band ratios (Iron & Clay Alteration), magnetic anomalies, and structural fold axes delineate 10 high-potential manganese target zones with ML prospectivity confidence scores.",
    keyPoints: [
      "Layer toggles for Active Mines, Drillholes, and Sausar Geology Formations",
      "Interactive Satellite Imagery & Topographic raster overlays",
      "Feature importance breakdown for each target zone"
    ]
  },
  {
    step: 2,
    title: "2. 3D Subsurface Block Model & UNFC Reserves",
    route: "/resources",
    subtitle: "Maptek Vulcan-Style 3D Voxel Engine",
    narrative: "Visualizes the subterranean orebody across 1,152 sub-blocked voxels with interactive cutoff grade slicing, real-time in-situ tonnage calculations, and UNFC 111/122 proved and probable reserve classifications.",
    keyPoints: [
      "Full 3D orbit, pan, zoom, and cross-section slicing",
      "Dynamic grade-tonnage yield recalculation on cutoff adjustment",
      "Raycast 3D block inspection with % Mn, density, and bench RL elevation"
    ]
  },
  {
    step: 3,
    title: "3. Production Forecasting & Shortfall Early Warning",
    route: "/production",
    subtitle: "XGBoost Time-Series Forecasting (14-30 Day Alert)",
    narrative: "Predicts monthly extraction trajectories against MOIL annual targets. Detects shortfall risks weeks in advance with quantified root-cause attribution (weather, equipment breakdowns, ore dilution).",
    keyPoints: [
      "12-month historical actuals vs 6-month predictive projection",
      "Early warning gauge with 68% deficit alert indicator",
      "Quantified breakdown of shortfall drivers"
    ]
  },
  {
    step: 4,
    title: "4. What-If Scenario Simulator & Mitigation",
    route: "/simulator",
    subtitle: "Interactive Policy & Operations Testing",
    narrative: "Enables mine superintendents to simulate mitigation actions in real time: adjusting excavator fleet allocations, shift lengths, blast frequencies, and ore blending recipes to evaluate production recovery.",
    keyPoints: [
      "Live ML output recalculation as sliders move",
      "Trade-off analysis between production tonnes and unit cost/tonne",
      "Fast comparison of baseline vs mitigated scenarios"
    ]
  },
  {
    step: 5,
    title: "5. AI Explainability & Master Data Hub",
    route: "/ai",
    subtitle: "SHAP Feature Attribution & Data Management",
    narrative: "Delivers transparent, explainable AI decisions with SHAP waterfall plots and ranked prescriptive recommendations. Includes a unified catalog for importing drillcore and exporting spatial GeoJSONs.",
    keyPoints: [
      "SHAP feature importance ranking shortfall risk drivers",
      "Prescriptive actions with quantified recovery (+9.4%)",
      "Full dataset export and ingestion in Data Center"
    ]
  }
]

export default function PresentationTour({ isOpen, onClose }: PresentationTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  if (!isOpen) return null

  const activeTour = TOUR_STEPS[currentStep]

  const handleNavigateStep = (index: number) => {
    setCurrentStep(index)
    navigate(TOUR_STEPS[index].route)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-full card p-5 bg-bg-900/95 backdrop-blur-md border-accent-orange/40 shadow-2xl animate-slide-in">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent-orange flex items-center justify-center text-black font-bold text-xs">
            {activeTour.step}
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">{activeTour.title}</h3>
            <span className="text-[10px] text-accent-orange font-mono font-semibold">{activeTour.subtitle}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Narrative */}
      <div className="my-3 space-y-2 text-xs">
        <p className="text-text-secondary leading-relaxed">
          {activeTour.narrative}
        </p>

        <div className="p-2.5 rounded-lg bg-surface-muted/50 border border-surface-border space-y-1">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Demo Talking Points:</div>
          {activeTour.keyPoints.map((pt, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] text-text-primary">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-border text-xs">
        <div className="flex items-center gap-1">
          {TOUR_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleNavigateStep(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentStep === i ? 'w-5 bg-accent-orange' : 'bg-surface-border hover:bg-text-muted'
              }`}
            />
          ))}
          <span className="text-[10px] text-text-muted ml-2">Step {currentStep + 1} of 5</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentStep === 0}
            onClick={() => handleNavigateStep(currentStep - 1)}
            className="p-1.5 rounded bg-surface-muted hover:bg-surface-hover text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentStep === TOUR_STEPS.length - 1}
            onClick={() => handleNavigateStep(currentStep + 1)}
            className="btn-primary text-xs py-1 px-3 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  )
}
