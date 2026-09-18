import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Map, Database, BarChart3, Wrench,
  Cloud, Brain, Sliders, Server, ChevronLeft, ChevronRight,
  Satellite, AlertTriangle, Activity, Presentation,
  FileText, Sparkles, Printer, Bot, Globe, Menu, X
} from 'lucide-react'

import { useLanguage } from '../services/i18n'
import ExecutiveReportModal from './ExecutiveReportModal'
import PresentationTour from './PresentationTour'
import OreSeekCopilot from './OreSeekCopilot'
import SpectralBandInspector from './SpectralBandInspector'

const navItemDefs = [
  { path: '/dashboard', labelKey: 'navCommandCenter', icon: LayoutDashboard },
  { path: '/exploration', labelKey: 'navExploration', icon: Map },
  { path: '/resources', labelKey: 'navResources', icon: Database },
  { path: '/production', labelKey: 'navProduction', icon: BarChart3 },
  { path: '/equipment', labelKey: 'navEquipment', icon: Wrench },
  { path: '/environment', labelKey: 'navEnvironment', icon: Cloud },
  { path: '/ai', labelKey: 'navAI', icon: Brain },
  { path: '/simulator', labelKey: 'navSimulator', icon: Sliders },
  { path: '/data', labelKey: 'navData', icon: Server },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { lang, setLang, t } = useLanguage()
  
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [isSpectralOpen, setIsSpectralOpen] = useState(false)

  // Auto-close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const activeNavItem = navItemDefs.find(n => n.path === location.pathname)

  const handleNavClick = (path: string) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  return (
    <div className={`flex h-screen overflow-hidden bg-bg-900 ${presentationMode ? 'presentation-mode' : ''}`}>
      
      {/* Modals & Interactive Tools */}
      <ExecutiveReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
      <PresentationTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
      <SpectralBandInspector isOpen={isSpectralOpen} onClose={() => setIsSpectralOpen(false)} />
      <OreSeekCopilot onOpenReport={() => setIsReportOpen(true)} onOpenTour={() => setIsTourOpen(true)} />

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar (Responsive: drawer on mobile, static on desktop) */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col bg-bg-800 border-r border-surface-border transition-all duration-300 ${
          mobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-16' : 'md:w-60'} flex-shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-surface-border min-h-[64px]">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-md">
            <Satellite className="w-4 h-4 text-white" />
          </div>
          {(!collapsed || mobileMenuOpen) && (
            <div className="min-w-0">
              <div className="text-base font-extrabold text-text-primary tracking-tight leading-tight">
                {t('brandTitle')}
              </div>
              <div className="text-[10px] text-accent-orange font-semibold leading-tight tracking-widest uppercase">
                {t('brandSubtitle')}
              </div>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block ml-auto p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden ml-auto p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItemDefs.map(({ path, labelKey, icon: Icon }) => {
            const active = location.pathname === path
            const label = t(labelKey)
            return (
              <button
                key={path}
                onClick={() => handleNavClick(path)}
                className={`nav-item w-full text-left ${active ? 'active' : ''} ${
                  collapsed && !mobileMenuOpen ? 'justify-center px-2' : ''
                }`}
                title={collapsed && !mobileMenuOpen ? label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-accent-orange' : ''}`} />
                {(!collapsed || mobileMenuOpen) && <span className="truncate text-xs font-medium">{label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Bottom Status & Presentation Controls */}
        <div className="p-3 border-t border-surface-border space-y-1.5">
          {(!collapsed || mobileMenuOpen) && (
            <>
              <button
                onClick={() => { setIsTourOpen(true); setMobileMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-accent-orange to-orange-600 hover:opacity-90 shadow-md transition-all"
              >
                <Presentation className="w-3.5 h-3.5" />
                {t('judgeTour')}
              </button>
              
              <button
                onClick={() => { setIsReportOpen(true); setMobileMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-accent-blue" />
                {t('execReport')}
              </button>

              <div className="flex items-center gap-2 px-2 pt-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow"></div>
                <span className="text-xs text-text-muted">{t('systemOnline')}</span>
              </div>
              <div className="demo-badge w-full justify-center">
                <AlertTriangle className="w-3 h-3" />
                {t('demoBadge')}
              </div>
            </>
          )}
          {collapsed && !mobileMenuOpen && (
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-surface-border bg-bg-800/90 backdrop-blur-md min-h-[56px]">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-surface-muted hover:bg-surface-hover text-text-primary md:hidden"
              title="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 truncate">
              <Activity className="w-4 h-4 text-accent-orange flex-shrink-0" />
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider truncate">
                {activeNavItem ? t(activeNavItem.labelKey) : t('brandTitle')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap justify-end">
            {/* Bilingual Switcher Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-lg text-xs font-bold border border-surface-border bg-surface-muted hover:bg-surface-hover text-text-primary transition-all shadow-sm"
              title="Switch Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-accent-cyan" />
              <span className="text-[11px]">{lang === 'en' ? '🇮🇳 हि' : '🇬🇧 EN'}</span>
            </button>

            {/* Spectral Inspector Tool Trigger */}
            <button
              onClick={() => setIsSpectralOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 hover:bg-accent-cyan/20 transition-all"
              title="Open Sentinel-2 Spectral Band Ratio Inspector"
            >
              <Satellite className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t('spectralInspector')}</span>
            </button>

            {/* AI Copilot Trigger */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-oreseek-copilot'))}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-accent-orange to-amber-500 hover:opacity-90 shadow-md transition-all"
              title="Open OreSeek AI Copilot"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('aiCopilot')}</span>
            </button>

            {/* Judge Tour Trigger */}
            <button
              onClick={() => setIsTourOpen(true)}
              className="btn-primary text-xs py-1.5 px-2.5 sm:px-3 flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('judgeTour')}</span>
            </button>
          </div>
        </header>

        {/* Page Content Container */}
        <div className={`flex-1 p-3.5 sm:p-6 ${presentationMode ? 'p-8' : ''}`}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
