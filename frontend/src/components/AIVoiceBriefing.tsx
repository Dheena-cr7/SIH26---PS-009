import React, { useState, useEffect, useRef } from 'react'
import { Play, Square, Radio, Volume2, Sparkles } from 'lucide-react'
import { useLanguage } from '../services/i18n'

const FEMALE_VOICE_KEYWORDS = [
  'zira', 'jenny', 'aria', 'samantha', 'victoria', 'karen', 'moira',
  'tessa', 'fiona', 'veena', 'hazel', 'catherine', 'susan', 'linda',
  'ava', 'allison', 'stephanie', 'neerja', 'heera', 'swara', 'kalpana', 'female',
  'ana', 'emma', 'olivia', 'mia', 'charlotte', 'sofia', 'clara', 'hindi', 'हिन्दी'
]

export default function AIVoiceBriefing() {
  const { lang, t } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('')
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const briefingTextEn = `Welcome to OreSeek AI Situation Room. Geological prospectivity models integrated with Sentinel-2 and Landsat spectral data have delineated fourteen point eight million tonnes of estimated manganese resources in the central Sausar belt. Our production forecasting model predicts a sixty-eight percent probability of a twenty-two thousand tonne production shortfall next quarter, driven by monsoon haulage delays and excavator fleet degradation. Three prescriptive AI mitigation actions are active to recover up to nine point four percent capacity. All systems and Heavy Earth Moving telemetry are streaming live.`

  const briefingTextHi = `ओरसीक एआई स्थिति कक्ष में आपका स्वागत है। सेंटिनल-2 और लैंडसैट स्पेक्ट्रल डेटा के साथ एकीकृत भूवैज्ञानिक संभावना मॉडल ने केंद्रीय सौसर बेल्ट में 14.8 मिलियन टन अनुमानित मैंगनीज संसाधनों की पहचान की है। हमारा उत्पादन पूर्वानुमान मॉडल मानसून परिवहन देरी और उत्खनन बेड़े की खराबी के कारण अगली तिमाही में 22 हजार टन उत्पादन कमी की 68 प्रतिशत संभावना बताता है। क्षमता को 9.4 प्रतिशत तक पुनः प्राप्त करने के लिए 3 उपचारात्मक एआई कार्रवाइयां सक्रिय हैं। सभी सिस्टम और उपकरण टेलीमैटिक्स लाइव स्ट्रीम हो रहे हैं।`

  const briefingText = lang === 'hi' ? briefingTextHi : briefingTextEn

  // Helper to pick best voice for current language
  const findBestVoiceForLang = (voices: SpeechSynthesisVoice[], currentLang: string): SpeechSynthesisVoice | null => {
    if (!voices || voices.length === 0) return null

    if (currentLang === 'hi') {
      // 1. Check for dedicated Hindi voices
      const hiVoices = voices.filter(v => 
        v.lang.toLowerCase().startsWith('hi') || 
        v.name.toLowerCase().includes('hindi') || 
        v.name.includes('हिन्दी')
      )
      if (hiVoices.length > 0) {
        const femaleHi = hiVoices.find(v => {
          const n = v.name.toLowerCase()
          return FEMALE_VOICE_KEYWORDS.some(kw => n.includes(kw))
        })
        return femaleHi || hiVoices[0]
      }

      // Fallback: Indian English voice with good phonetic capability
      const inVoices = voices.filter(v => v.lang.toLowerCase().includes('in'))
      if (inVoices.length > 0) return inVoices[0]
    }

    // Default English voices
    const enVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'))
    
    // Check highest quality natural/neural female voices first
    const naturalFemale = enVoices.find(v => {
      const name = v.name.toLowerCase()
      return FEMALE_VOICE_KEYWORDS.some(kw => name.includes(kw)) && (name.includes('natural') || name.includes('neural') || name.includes('online'))
    })
    if (naturalFemale) return naturalFemale

    // Check standard female english voices
    const namedFemale = enVoices.find(v => {
      const name = v.name.toLowerCase()
      return FEMALE_VOICE_KEYWORDS.some(kw => name.includes(kw))
    })
    if (namedFemale) return namedFemale

    // Check any voice with 'female' in name
    const genericFemale = voices.find(v => v.name.toLowerCase().includes('female'))
    if (genericFemale) return genericFemale

    // Fallback to Google / Natural English or first English voice
    const fallbackEn = enVoices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || enVoices[0]
    return fallbackEn || voices[0]
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false)
      return
    }

    synthRef.current = window.speechSynthesis

    const updateVoices = () => {
      if (!synthRef.current) return
      const voices = synthRef.current.getVoices()
      if (voices.length > 0) {
        setAvailableVoices(voices)
        const bestVoice = findBestVoiceForLang(voices, lang)
        if (bestVoice) {
          setSelectedVoiceName(bestVoice.name)
        }
      }
    }

    updateVoices()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [lang])

  // Stop speech if language is toggled during playback
  useEffect(() => {
    if (isPlaying && synthRef.current) {
      synthRef.current.cancel()
      setIsPlaying(false)
    }
  }, [lang])

  const toggleSpeech = () => {
    if (!synthRef.current) return

    if (isPlaying) {
      synthRef.current.cancel()
      setIsPlaying(false)
    } else {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(briefingText)
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US'
      utterance.rate = lang === 'hi' ? 0.95 : 1.02
      utterance.pitch = 1.08

      const allVoices = synthRef.current.getVoices()
      const targetVoice = allVoices.find(v => v.name === selectedVoiceName) || findBestVoiceForLang(allVoices, lang)
      if (targetVoice) {
        utterance.voice = targetVoice
      }

      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)

      synthRef.current.speak(utterance)
      setIsPlaying(true)
    }
  }

  if (!isSupported) return null

  // Filter voices matching current language
  const relevantVoiceOptions = availableVoices.filter(v => {
    const name = v.name.toLowerCase()
    if (lang === 'hi') {
      return v.lang.toLowerCase().startsWith('hi') || name.includes('hindi') || name.includes('हिन्दी') || v.lang.toLowerCase().includes('in')
    }
    return v.lang.toLowerCase().startsWith('en') && (
      FEMALE_VOICE_KEYWORDS.some(kw => name.includes(kw)) ||
      name.includes('google') ||
      name.includes('natural')
    )
  })

  return (
    <div className="card p-3.5 bg-gradient-to-r from-bg-900 to-accent-orange/10 border-accent-orange/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
          isPlaying ? 'bg-accent-orange text-black animate-pulse shadow-lg shadow-accent-orange/30' : 'bg-surface-muted text-accent-orange'
        }`}>
          <Radio className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-text-primary">{t('situationRoomAudio')}</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> {lang === 'hi' ? '🇮🇳 हिन्दी AI वक्ता' : '🇬🇧 AI NARRATOR'}
            </span>
            {selectedVoiceName && (
              <span className="text-[10px] text-text-muted border border-border/40 px-1.5 py-0.5 rounded bg-surface/50">
                {selectedVoiceName.replace(/Microsoft|Google|Desktop|English/gi, '').trim()}
              </span>
            )}
          </div>
          <p className="text-[11px] text-text-muted mt-0.5">
            {isPlaying ? t('situationRoomBroadcasting') : t('situationRoomSub')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        {/* Voice Selector if multiple voices exist for language */}
        {relevantVoiceOptions.length > 1 && (
          <select
            value={selectedVoiceName}
            onChange={(e) => {
              setSelectedVoiceName(e.target.value)
              if (isPlaying && synthRef.current) {
                synthRef.current.cancel()
                setIsPlaying(false)
              }
            }}
            className="text-[11px] bg-surface border border-border/60 text-text-secondary rounded px-2 py-1 outline-none focus:border-accent-orange"
            title="Select Voice Profile"
          >
            {relevantVoiceOptions.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name.length > 30 ? `${v.name.substring(0, 27)}...` : v.name}
              </option>
            ))}
          </select>
        )}

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
          className={`btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 transition-all whitespace-nowrap ${
            isPlaying ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 'shadow-accent-orange/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-3.5 h-3.5" /> {t('stopAudio')}
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" /> {t('playAudio')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
