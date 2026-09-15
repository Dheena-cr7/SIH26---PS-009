import React from 'react'
import { Printer, Download, X, Building, CheckCircle2, AlertTriangle, TrendingUp, Cpu, Sparkles, FileText, Calendar, ShieldCheck } from 'lucide-react'

interface ExecutiveReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ExecutiveReportModal({ isOpen, onClose }: ExecutiveReportModalProps) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-bg-900 border border-surface-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-8">
        
        {/* Modal Top Actions (Non-printable toolbar) */}
        <div className="print:hidden flex items-center justify-between p-4 border-b border-surface-border bg-bg-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-orange" />
            <span className="text-sm font-bold text-text-primary">Executive Decision-Support Report Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 shadow-lg"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div id="printable-report" className="p-8 space-y-6 text-text-primary bg-bg-950 print:bg-white print:text-black print:p-0">
          
          {/* Document Header */}
          <div className="border-b-2 border-accent-orange/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-accent-orange uppercase tracking-widest print:text-orange-700">
                <Building className="w-4 h-4" /> Ministry of Steel • MOIL Limited
              </div>
              <h1 className="text-2xl font-black text-text-primary print:text-black mt-1">
                MANGANESE INTELLIGENCE EXECUTIVE BRIEFING
              </h1>
              <p className="text-xs text-text-muted print:text-gray-600 mt-0.5">
                AI & Space Technology Decision Support Platform • Problem Statement PS-26009
              </p>
            </div>
            <div className="text-right text-xs space-y-1">
              <div className="font-mono text-text-secondary print:text-gray-700">REF: MOIL/AI-2026-Q3-09</div>
              <div className="text-text-muted print:text-gray-500">Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 print:border print:border-green-600 print:text-green-800">
                OFFICIAL REPORT
              </div>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-accent-orange print:text-orange-800 flex items-center gap-2">
              1. Executive Summary & Key Directives
            </h2>
            <p className="text-xs text-text-secondary print:text-gray-800 leading-relaxed">
              Multi-sensor satellite imagery (Sentinel-2 L2A & Landsat-8) and geophysical inversion models have delineated 
              <strong> 14.8 Mt of estimated manganese resource potential</strong> across 10 target zones in the Sausar Fold Belt. 
              The short-term production risk model flags a <strong>68% probability of a 22,000-tonne shortfall</strong> over the next 60 days, 
              principally caused by heavy monsoon haulage delays and critical excavator fleet degradation. 
              Prescriptive machine learning actions have been formulated to recover <strong>+9.4% of capacity</strong> (+15,600 tonnes).
            </p>
          </div>

          {/* 2. Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
            <div className="p-3 rounded-lg bg-surface-muted/60 print:bg-gray-100 border border-surface-border print:border-gray-300 text-xs">
              <div className="text-[10px] text-text-muted print:text-gray-600 uppercase">Estimated Resource</div>
              <div className="text-xl font-black text-text-primary print:text-black mt-1">14.8 Mt</div>
              <div className="text-[10px] text-green-400 print:text-green-700 font-semibold mt-0.5">82% Confidence</div>
            </div>

            <div className="p-3 rounded-lg bg-surface-muted/60 print:bg-gray-100 border border-surface-border print:border-gray-300 text-xs">
              <div className="text-[10px] text-text-muted print:text-gray-600 uppercase">Average Grade</div>
              <div className="text-xl font-black text-accent-orange print:text-orange-700 mt-1">31.4% Mn</div>
              <div className="text-[10px] text-text-muted print:text-gray-600 mt-0.5">240 Core Drillholes</div>
            </div>

            <div className="p-3 rounded-lg bg-surface-muted/60 print:bg-gray-100 border border-surface-border print:border-gray-300 text-xs">
              <div className="text-[10px] text-text-muted print:text-gray-600 uppercase">60-Day Shortfall Risk</div>
              <div className="text-xl font-black text-red-400 print:text-red-700 mt-1">68% HIGH</div>
              <div className="text-[10px] text-red-400 print:text-red-700 mt-0.5">-22,400 tonnes gap</div>
            </div>

            <div className="p-3 rounded-lg bg-surface-muted/60 print:bg-gray-100 border border-surface-border print:border-gray-300 text-xs">
              <div className="text-[10px] text-text-muted print:text-gray-600 uppercase">Recovery Potential</div>
              <div className="text-xl font-black text-green-400 print:text-green-700 mt-1">+9.4%</div>
              <div className="text-[10px] text-text-muted print:text-gray-600 mt-0.5">3 Actions Queued</div>
            </div>
          </div>

          {/* 3. High-Priority Exploration Targets */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-accent-orange print:text-orange-800">
              2. Priority Satellite Prospectivity Targets
            </h2>
            <table className="w-full text-left text-xs border border-surface-border print:border-gray-300">
              <thead className="bg-surface-muted print:bg-gray-200 text-text-muted print:text-black uppercase text-[10px]">
                <tr>
                  <th className="p-2">Target ID & Name</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">Est. Grade</th>
                  <th className="p-2">Area (km²)</th>
                  <th className="p-2">Prescribed Program</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border print:divide-gray-300">
                <tr>
                  <td className="p-2 font-bold text-text-primary print:text-black">MN-TARGET-01 (Balaghat North)</td>
                  <td className="p-2 font-bold text-red-400 print:text-red-700">91% (VERY HIGH)</td>
                  <td className="p-2 font-mono">31.2% Mn</td>
                  <td className="p-2">3.2 km²</td>
                  <td className="p-2 text-text-secondary print:text-gray-700">Prioritize 50m diamond core drilling along synclinal limb.</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-text-primary print:text-black">MN-TARGET-09 (Sitasaongi North)</td>
                  <td className="p-2 font-bold text-red-400 print:text-red-700">88% (VERY HIGH)</td>
                  <td className="p-2 font-mono">30.8% Mn</td>
                  <td className="p-2">3.5 km²</td>
                  <td className="p-2 text-text-secondary print:text-gray-700">Intercepts confirm high-grade Mansar Gondite continuity.</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-text-primary print:text-black">MN-TARGET-02 (Dongri Buzurg South)</td>
                  <td className="p-2 font-bold text-orange-400 print:text-orange-700">83% (HIGH)</td>
                  <td className="p-2 font-mono">27.8% Mn</td>
                  <td className="p-2">2.8 km²</td>
                  <td className="p-2 text-text-secondary print:text-gray-700">Schedule ground magnetic validation in Q4 cycle.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. AI Prescriptive Mitigation Plan */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-accent-orange print:text-orange-800">
              3. AI Prescriptive Action Plan for Shortfall Mitigation
            </h2>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-surface-muted/40 print:bg-gray-50 border border-surface-border print:border-gray-200 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-orange text-black font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                <div>
                  <div className="font-bold text-text-primary print:text-black">Deploy 2 Standby Excavators to Pit Floor 4 (Dongri Buzurg)</div>
                  <p className="text-text-muted print:text-gray-600 mt-0.5">Compensates for scheduled hydraulic overhaul on Excavator EXC-02. Expected yield: <strong>+4.5% output</strong>.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-muted/40 print:bg-gray-50 border border-surface-border print:border-gray-200 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-orange text-black font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                <div>
                  <div className="font-bold text-text-primary print:text-black">Implement Smart Ore Blending (Balaghat High-Grade with Tirodi Medium-Grade)</div>
                  <p className="text-text-muted print:text-gray-600 mt-0.5">Maintains minimum 38% Mn plant delivery specification while reducing grade dilution by 12%. Expected yield: <strong>+3.2% output</strong>.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-muted/40 print:bg-gray-50 border border-surface-border print:border-gray-200 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-orange text-black font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
                <div>
                  <div className="font-bold text-text-primary print:text-black">Optimize Drainage Pump Schedule for Inundation Zones</div>
                  <p className="text-text-muted print:text-gray-600 mt-0.5">Pre-clears pit sumps prior to forecasted precipitation fronts to prevent haulage stoppages. Expected yield: <strong>+1.7% output</strong>.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t border-surface-border print:border-gray-300 flex justify-between items-end text-xs text-text-muted print:text-gray-600">
            <div>
              <div className="flex items-center gap-1 text-green-400 print:text-green-700 font-bold mb-1">
                <ShieldCheck className="w-4 h-4" /> AI Model Audit Verified (XGBoost + SHAP)
              </div>
              <div>Certified under Smart India Hackathon 2026 Guidelines</div>
            </div>
            <div className="text-right">
              <div className="border-b border-text-muted/40 w-36 mb-1"></div>
              <div className="font-semibold text-text-primary print:text-black">Chief Mine Planner</div>
              <div>MOIL Central Operations Hub</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
