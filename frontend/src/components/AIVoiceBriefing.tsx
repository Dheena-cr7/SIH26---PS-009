import React, { useState, useEffect, useRef } from 'react'
import { Play, Square, Radio, Volume2, Sparkles } from 'lucide-react'
import { useLanguage } from '../services/i18n'

const FEMALE_VOICE_NAMES = [
  'zira', 'jenny', 'aria', 'samantha', 'victoria', 'karen', 'moira',
  'tessa', 'fiona', 'veena', 'hazel', 'catherine', 'susan', 'linda',
  'ava', 'allison', 'stephanie', 'neerja', 'heera', 'swara', 'kalpana',
  'ana', 'emma', 'olivia', 'mia', 'charlotte', 'sofia', 'clara', 'female',
  'google uk english female', 'google us english'
]

const MALE_VOICE_NAMES = [
  'david', 'mark', 'george', 'guy', 'ravi', 'hemant', 'male', 'stefan',
  'paul', 'james', 'richard', 'microsoft david', 'microsoft mark'
]

export default function AIVoiceBriefing() {
  const { lang, t } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('')
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const briefingTextEn = `Welcome to OreSeek AI Situation Room. Geological prospectivity models integrated with Sentinel-2 and Landsat spectral data have delineated fourteen point eight million tonnes of estimated manganese resources in the central Sausar belt. Our production forecasting model predicts a sixty-eight percent probability of a twenty-two thousand tonne production shortfall next quarter, driven by monsoon haulage delays and excavator fleet degradation. Three prescriptive AI mitigation actions are active to recover up to nine point four percent capacity. All systems and Heavy Earth Moving telemetry are streaming live.`

  // Clean Devanagari phonetics with natural punctuation and spelled-out numerals for smooth speech synthesis
  const briefingTextHi = `ओरसीक एआई स्थिति कक्ष में आपका स्वागत है। सेंटिनल और लैंडसैट उपग्रह डेटा द्वारा केंद्रीय सौसर बेल्ट में चौदह दशमलव आठ मिलियन टन अनुमानित मैंगनीज भंडार की पहचान की गई है। हमारा उत्पादन पूर्वानुमान मॉडल मानसून परिवहन और मशीनरी खराबी के कारण अगली तिमाही में अड़सठ प्रतिशत जोखिम और बाईस हज़ार टन उत्पादन कमी का अनुमान लगाता है। नौ दशमलव चार प्रतिशत क्षमता की भरपाई के लिए तीन उपचारात्मक एआई कार्ययोजनाएं सक्रिय हैं। सभी उपकरण और खदान टेलीमैटिक्स लाइव स्ट्रीम हो रहे हैं।`

  const briefingText = lang === 'hi' ? briefingTextHi : briefingTextEn

  // Strictly pick the highest quality female voice available on the host OS / browser
  const findStrictFemaleVoice = (voices: SpeechSynthesisVoice[], currentLang: string): SpeechSynthesisVoice | null => {
    if (!voices || voices.length === 0) return null

    if (currentLang === 'hi') {
      // 1. Hindi female voices
      const hiVoices = voices.filter(v => 
        v.lang.toLowerCase().startsWith('hi') || 
        v.name.toLowerCase().includes('hindi') || 
        v.name.includes('हिन्दी')
      )
      
      const hiFemale = hiVoices.find(v => {
        const n = v.name.toLowerCase()
        return FEMALE_VOICE_NAMES.some(kw => n.includes(kw)) && !MALE_VOICE_NAMES.some(kw => n.includes(kw))
      })
      if (hiFemale) return hiFemale
      if (hiVoices.length > 0) return hiVoices[0]

      // Fallback: Indian English female voice
      const inFemale = voices.find(v => 
        v.lang.toLowerCase().includes('in') && 
        FEMALE_VOICE_NAMES.some(kw => v.name.toLowerCase().includes(kw)) &&
        !MALE_VOICE_NAMES.some(kw => v.name.toLowerCase().includes(kw))
      )
      if (inFemale) return inFemale
    }

    // English Voices: strictly filter for female
    const enVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'))

    // Priority 1: Microsoft Natural/Neural Female (Jenny, Aria, etc.)
    const naturalFemale = enVoices.find(v => {
      const n = v.name.toLowerCase()
      return (n.includes('jenny') || n.includes('aria') || n.includes('natural') || n.includes('online')) &&
             FEMALE_VOICE_NAMES.some(kw => n.includes(kw)) &&
             !MALE_VOICE_NAMES.some(kw => n.includes(kw))
    })
    if (naturalFemale) return naturalFemale

    // Priority 2: Built-in Desktop Female (Zira Desktop, Google UK English Female, Samantha, Victoria)
    const standardFemale = enVoices.find(v => {
      const n = v.name.toLowerCase()
      return (n.includes('zira') || n.includes('samantha') || n.includes('victoria') || n.includes('google uk english female') || n.includes('female')) &&
             !MALE_VOICE_NAMES.some(kw => n.includes(kw))
    })
    if (standardFemale) return standardFemale

    // Priority 3: Any English voice with a known female name
    const anyFemale = enVoices.find(v => {
      const n = v.name.toLowerCase()
      return FEMALE_VOICE_NAMES.some(kw => n.includes(kw)) && !MALE_VOICE_NAMES.some(kw => n.includes(kw))
    })
    if (anyFemale) return anyFemale

    // Priority 4: Any non-male English voice
    const nonMale = enVoices.find(v => !MALE_VOICE_NAMES.some(kw => v.name.toLowerCase().includes(kw)))
    if (nonMale) return nonMale

    return enVoices[0] || voices[0]
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
        const bestFemale = findStrictFemaleVoice(voices, lang)
        if (bestFemale) {
          setSelectedVoiceName(bestFemale.name)
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
      utterance.rate = lang === 'hi' ? 0.90 : 1.00
      utterance.pitch = lang === 'hi' ? 1.10 : 1.16

      const allVoices = synthRef.current.getVoices()
      const targetVoice = allVoices.find(v => v.name === selectedVoiceName) || findStrictFemaleVoice(allVoices, lang)
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

  // Filter curated female voice options for user selector
  const curatedFemaleVoices = availableVoices.filter(v => {
    const n = v.name.toLowerCase()
    if (MALE_VOICE_NAMES.some(kw => n.includes(kw))) return false
    if (lang === 'hi') {
      return v.lang.toLowerCase().startsWith('hi') || n.includes('hindi') || n.includes('हिन्दी') || v.lang.toLowerCase().includes('in')
    }
    return v.lang.toLowerCase().startsWith('en') && (
      FEMALE_VOICE_NAMES.some(kw => n.includes(kw)) ||
      n.includes('natural') ||
      n.includes('online') ||
      !MALE_VOICE_NAMES.some(kw => n.includes(kw))
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
              <Sparkles className="w-2.5 h-2.5" /> {lang === 'hi' ? '🇮🇳 महिला AI वक्ता (Female Voice)' : '🇬🇧 FEMALE AI NARRATOR'}
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
        {/* Voice Selector if multiple female voices exist for language */}
        {curatedFemaleVoices.length > 1 && (
          <select
            value={selectedVoiceName}
            onChange={(e) => {
              setSelectedVoiceName(e.target.value)
              if (isPlaying && synthRef.current) {
                synthRef.current.cancel()
                setIsPlaying(false)
              }
            }}
            className="text-[11px] bg-surface border border-border/60 text-text-secondary rounded px-2 py-1 outline-none focus:border-accent-orange cursor-pointer"
            title="Select Female Voice Profile"
          >
            {curatedFemaleVoices.map((v) => (
              <option key={v.name} value={v.name}>
                👩 {v.name.replace(/Microsoft|Google|Desktop|English/gi, '').trim()}
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
