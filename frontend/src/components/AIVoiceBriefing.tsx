import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Play, Square, Sparkles, Mic, Radio } from 'lucide-react'

export default function AIVoiceBriefing() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  const briefingText = `Welcome to Manganese Intelligence Situation Room. 
  Geological prospectivity models integrated with Sentinel-2 and Landsat spectral data have delineated fourteen point eight million tonnes of estimated manganese resources in the central Sausar belt. 
  Our production forecasting model predicts a sixty-eight percent probability of a twenty-two thousand tonne production shortfall next quarter, driven by monsoon haulage delays and excavator fleet degradation. 
  Three prescriptive AI mitigation actions are active to recover up to nine point four percent capacity. 
  All systems and Heavy Earth Moving telemetry are streaming live.`

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false)
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(briefingText)
      utterance.rate = 1.05
      utterance.pitch = 1.0

      // Choose an English voice if available
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha')))
      if (preferredVoice) utterance.voice = preferredVoice

      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)

      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)
    }
  }

  if (!isSupported) return null

  return (
    <div className="card p-3.5 bg-gradient-to-r from-bg-900 to-accent-orange/10 border-accent-orange/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
          isPlaying ? 'bg-accent-orange text-black animate-pulse shadow-lg shadow-accent-orange/30' : 'bg-surface-muted text-accent-orange'
        }`}>
          <Radio className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-primary">AI Situation Room Audio Briefing</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent-orange/20 text-accent-orange border border-accent-orange/30">
              VOICE AI
            </span>
          </div>
          <p className="text-[11px] text-text-muted mt-0.5">
            {isPlaying ? 'Synthesizing live operational situation report...' : 'Listen to 30-second AI executive audio briefing for judges'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Animated Audio Equalizer Waveform */}
        {isPlaying && (
          <div className="flex items-center gap-1 h-5 px-2">
            <span className="w-1 bg-accent-orange rounded-full animate-bounce h-3"></span>
            <span className="w-1 bg-accent-orange rounded-full animate-bounce h-5 delay-75"></span>
            <span className="w-1 bg-accent-orange rounded-full animate-bounce h-4 delay-150"></span>
            <span className="w-1 bg-accent-orange rounded-full animate-bounce h-2 delay-100"></span>
            <span className="w-1 bg-accent-orange rounded-full animate-bounce h-5 delay-200"></span>
          </div>
        )}

        <button
          onClick={toggleSpeech}
          className={`btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 transition-all ${
            isPlaying ? 'bg-red-500 hover:bg-red-600 text-white' : ''
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-3.5 h-3.5" /> Stop Briefing
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" /> Play AI Audio Report
            </>
          )}
        </button>
      </div>
    </div>
  )
}
