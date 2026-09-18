import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Map, Database, BarChart3, Wrench,
  Cloud, Brain, Sliders, Server, ChevronLeft, ChevronRight,
  Satellite, AlertTriangle, Activity, Presentation
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
  { path: '/exploration', label: 'Exploration', icon: Map },
  { path: '/resources', label: 'Resource Intelligence', icon: Database },
  { path: '/production', label: 'Production', icon: BarChart3 },
  { path: '/equipment', label: 'Equipment', icon: Wrench },
  { path: '/environment', label: 'Environment', icon: Cloud },
  { path: '/ai', label: 'AI Insights', icon: Brain },
  { path: '/simulator', label: 'What-If Simulator', icon: Sliders },
  { path: '/data', label: 'Data Center', icon: Server },
]

import ExecutiveReportModal from './ExecutiveReportModal'
import PresentationTour from './PresentationTour'
import { FileText, Sparkles, Printer } from 'lucide-react'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)

  return (
    <div className={`flex h-screen overflow-hidden bg-bg-900 ${presentationMode ? 'presentation-mode' : ''}`}>
      
      {/* Modals */}
      <ExecutiveReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
      <PresentationTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      {/* Sidebar */}
      <aside className={`flex flex-col bg-bg-800 border-r border-surface-border transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-surface-border min-h-[64px]">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
            <Satellite className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-base font-extrabold text-text-primary tracking-tight leading-tight">ORE<span className="text-accent-orange">SEEK</span></div>
              <div className="text-[10px] text-accent-orange font-semibold leading-tight tracking-widest uppercase">Intelligence</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`nav-item w-full text-left ${active ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-accent-orange' : ''}`} />
                {!collapsed && <span className="truncate">{label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Bottom status */}
        <div className="p-3 border-t border-surface-border space-y-1.5">
          {!collapsed && (
            <>
              <button
                onClick={() => setIsTourOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-accent-orange to-orange-600 hover:opacity-90 shadow-md transition-all"
              >
                <Presentation className="w-3.5 h-3.5" />
                Judge Demo Tour
              </button>
              
              <button
                onClick={() => setIsReportOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-accent-blue" />
                Executive Briefing
              </button>

              <div className="flex items-center gap-2 px-2 pt-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow"></div>
                <span className="text-xs text-text-muted">System Online</span>
              </div>
              <div className="demo-badge w-full justify-center">
                <AlertTriangle className="w-3 h-3" />
                DEMO DATA MODE
              </div>
            </>
          )}
          {collapsed && (
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={() => setIsTourOpen(true)} 
                title="Judge Demo Tour" 
                className="p-2 rounded bg-accent-orange text-black"
              >
                <Presentation className="w-4 h-4" />
              </button>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow"></div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-surface-border bg-bg-800/80 backdrop-blur-sm min-h-[56px]">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-accent-orange" />
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              {navItems.find(n => n.path === location.pathname)?.label || 'OreSeek Intelligence'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReportOpen(true)}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-accent-blue" />
              <span className="hidden sm:inline">Executive PDF Report</span>
            </button>

            <button
              onClick={() => setIsTourOpen(true)}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Judge Presentation</span>
            </button>

            <span className="hidden lg:inline-flex demo-badge">Prototype Mode</span>
          </div>
        </header>

        <div className={`${presentationMode ? 'p-8' : 'p-6'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
