import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bot, Sparkles, Send, X, Minimize2, Maximize2, Mic, MicOff,
  Volume2, VolumeX, RotateCcw, ArrowRight, MapPin, Database,
  Sliders, Brain, Wrench, ShieldAlert, CheckCircle2, ChevronRight,
  ExternalLink, Layers, Activity
} from 'lucide-react'
import { useLanguage, DICTIONARY } from '../services/i18n'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  actions?: Array<{ label: string; path?: string; actionType?: string }>
}

const STARTER_PROMPTS_EN = [
  { text: "What is the highest priority exploration target?", category: "Exploration" },
  { text: "How do we recover the 22,000t production shortfall?", category: "Operations" },
  { text: "Explain our UNFC 111 vs 122 reserve classification.", category: "3D Reserves" },
  { text: "Which heavy mining equipment needs urgent repair?", category: "Equipment" },
  { text: "What satellite spectral bands detect manganese alteration?", category: "Space Tech" }
]

const STARTER_PROMPTS_HI = [
  { text: "सर्वोच्च प्राथमिकता वाला अन्वेषण लक्ष्य कौन सा है?", category: "अन्वेषण" },
  { text: "हम 22,000 टन उत्पादन कमी की भरपाई कैसे करें?", category: "परिचालन" },
  { text: "UNFC 111 और 122 भंडार वर्गीकरण समझाएं।", category: "3D भंडार" },
  { text: "किन भारी खनन उपकरणों को तत्काल मरम्मत की आवश्यकता है?", category: "उपकरण" },
  { text: "कौन से उपग्रह स्पेक्ट्रल बैंड मैंगनीज की पहचान करते हैं?", category: "अंतरिक्ष" }
]

interface KnowledgeItem {
  keywords: string[]
  replyEn: string
  replyHi: string
  actionsEn?: Array<{ label: string; path?: string; actionType?: string }>
  actionsHi?: Array<{ label: string; path?: string; actionType?: string }>
}

const KNOWLEDGE_RESPONSES: KnowledgeItem[] = [
  {
    keywords: ["target", "priority", "balaghat", "prospectivity", "exploration", "drill", "लक्ष्य", "प्राथमिकता", "बालाघाट", "अन्वेषण", "संभावना"],
    replyEn: `**MN-TARGET-01 (Balaghat North Extension)** is ranked as the **#1 Exploration Target** with a **91% AI Prospectivity Score** and **84% Confidence**:
• **Estimated Grade**: 31.2% Mn across 3.2 km² surface area.
• **Space Spectral Signature**: Strong Sentinel-2 hydrothermal iron/clay alteration anomaly (B4/B2 ratio: 1.48).
• **Geological Marker**: Direct strike continuation of the high-grade Mansar Formation Gondite ore bed.
• **Recommended Program**: Immediate 50m grid diamond core drilling along the northern synclinal fold limb.`,
    replyHi: `**MN-TARGET-01 (बालाघाट उत्तर विस्तार)** को **91% एआई संभावना स्कोर** और **84% विश्वास** के साथ **#1 अन्वेषण लक्ष्य** के रूप में स्थान दिया गया है:
• **अनुमानित ग्रेड**: 3.2 वर्ग किमी क्षेत्र में 31.2% मैंगनीज (Mn)।
• **अंतरिक्ष स्पेक्ट्रल हस्ताक्षर**: मजबूत सेंटिनल-2 हाइड्रोथर्मल आयरन/क्ले विसंगति (B4/B2 अनुपात: 1.48)।
• **भूवैज्ञानिक मार्कर**: उच्च-ग्रेड मनसर फॉर्मेशन गोंडाइट अयस्क परत का सीधा विस्तार।
• **अनुशंसित कार्यक्रम**: उत्तरी अभिनति मोड़ पर तत्काल 50 मीटर ग्रिड डायमंड कोर ड्रिलिंग।`,
    actionsEn: [
      { label: "📍 View Balaghat on GIS Map", path: "/exploration" },
      { label: "🧊 Inspect 3D Voxel Model", path: "/resources" }
    ],
    actionsHi: [
      { label: "📍 जीआईएस मानचित्र पर बालाघाट देखें", path: "/exploration" },
      { label: "🧊 3D ब्लॉक मॉडल का निरीक्षण करें", path: "/resources" }
    ]
  },
  {
    keywords: ["shortfall", "deficit", "monsoon", "recover", "mitigation", "22,000", "gap", "delay", "कमी", "घाटा", "मानसून", "भरपाई", "सुधार"],
    replyEn: `The predictive XGBoost model flags a **68% probability of a 22,400-tonne production shortfall** over the next 60 days.

**Key Root Causes Identified by SHAP Attribution:**
1. **Equipment Downtime (31%)**: Excavator EXC-02 & Drill DRL-02 overdue for overhaul.
2. **Monsoon Haulage Delays (24%)**: 210mm forecasted rainfall causing pit ramp slippage.
3. **Blasting Stoppages (18%)**: Water accumulation in bench blast holes.

**Prescriptive AI Mitigation Package (+9.4% / +15,600t Recovery):**
• **Action 1**: Deploy 2 standby excavators to Pit Floor 4 (+4.5% output).
• **Action 2**: Smart Ore Blending (Balaghat 42% + Tirodi 28% at 60:40 ratio) (+3.2% output).
• **Action 3**: Advance pit sump drainage pumping before rain fronts (+1.7% output).`,
    replyHi: `पूर्वानुमानित XGBoost मॉडल अगले 60 दिनों में **22,400 टन उत्पादन कमी की 68% संभावना** की पहचान करता है।

**SHAP एट्रिब्यूशन द्वारा पहचाने गए मुख्य कारण:**
1. **उपकरण खराबी (31%)**: उत्खननकर्ता EXC-02 और ड्रिल DRL-02 ओवरहाल हेतु लंबित।
2. **मानसून परिवहन देरी (24%)**: 210 मिमी अनुमानित वर्षा के कारण रैंप फिसलन।
3. **ब्लास्टिंग रुकावट (18%)**: बेंच ब्लास्ट होल में पानी का जमाव।

**उपचारात्मक एआई कार्ययोजना (+9.4% / +15,600 टन भरपाई):**
• **कदम 1**: पिट फ्लोर 4 पर 2 स्टैंडबाय उत्खननकर्ता तैनात करें (+4.5% उत्पादन)।
• **कदम 2**: स्मार्ट अयस्क सम्मिश्रण (बालाघाट 42% + तिरोड़ी 28% 60:40 अनुपात में) (+3.2% उत्पादन)।
• **कदम 3**: वर्षा से पहले पिट संप जल निकासी पंपिंग बढ़ाएं (+1.7% उत्पादन)।`,
    actionsEn: [
      { label: "🎛️ Test Mitigations in Simulator", path: "/simulator" },
      { label: "🤖 View SHAP Explanations", path: "/ai" }
    ],
    actionsHi: [
      { label: "🎛️ सिम्युलेटर में परीक्षण करें", path: "/simulator" },
      { label: "🤖 SHAP व्याख्याएं देखें", path: "/ai" }
    ]
  },
  {
    keywords: ["unfc", "reserve", "tonnage", "resource", "111", "122", "333", "grade", "3d", "भंडार", "संसाधन", "टन", "ग्रेड", "ब्लॉक"],
    replyEn: `OreSeek calculates a total in-situ geological reserve of **14.8 Million Tonnes (Mt)** with **82% Kriging Confidence** across the Sausar Belt:

**UNFC Standard Breakdown:**
• **UNFC 111 (Proved / Measured)**: **6.2 Mt** @ **36.4% Mn** (High drilling density, 50m spacing)
• **UNFC 122 (Probable / Indicated)**: **5.4 Mt** @ **29.8% Mn** (100m spacing, structural continuity)
• **UNFC 333 (Inferred Resource)**: **3.2 Mt** @ **22.5% Mn** (Satellite spectral & magnetic anomaly extrapolation)

The 3D Maptek-style voxel engine supports real-time cutoff grade filtering between 15% and 45% Mn.`,
    replyHi: `ओरसीक सौसर बेल्ट में **82% क्रिगिंग विश्वास** के साथ कुल **14.8 मिलियन टन (Mt)** भूगर्भीय भंडार की गणना करता है:

**UNFC मानक वर्गीकरण:**
• **UNFC 111 (प्रमाणित / मेजर्ड)**: **6.2 Mt** @ **36.4% Mn** (50 मीटर सघन ड्रिलिंग)
• **UNFC 122 (संभावित / इंडिकेटेड)**: **5.4 Mt** @ **29.8% Mn** (100 मीटर ड्रिलिंग)
• **UNFC 333 (अनुमानित / इन्फर्ड)**: **3.2 Mt** @ **22.5% Mn** (उपग्रह स्पेक्ट्रल एक्सट्रापोलेशन)

3D वोक्सेल इंजन 15% से 45% Mn के बीच वास्तविक समय कटऑफ ग्रेड फ़िल्टरिंग का समर्थन करता है।`,
    actionsEn: [
      { label: "🧊 Open 3D Voxel Block Model", path: "/resources" },
      { label: "📊 View Production Trajectory", path: "/production" }
    ],
    actionsHi: [
      { label: "🧊 3D ब्लॉक मॉडल खोलें", path: "/resources" },
      { label: "📊 उत्पादन प्रक्षेपवक्र देखें", path: "/production" }
    ]
  },
  {
    keywords: ["equipment", "machine", "excavator", "dumper", "drill", "maintenance", "telemetry", "rul", "उपकरण", "मशीन", "उत्खनन", "डंपर", "रखरखाव"],
    replyEn: `Live HEMM telematics monitoring tracks **12 active mining assets**:

⚠️ **Critical Alerts:**
• **EXC-02 (Excavator - Dongri Buzurg)**: Availability down to **68.2%**. Hydraulic pressure oscillating (4.8 bar). **Overdue by 64 days**. Estimated RUL: **18 operating hours**.
• **DRL-02 (Drill Rig - Dongri Buzurg)**: Availability at **72.0%**. Bearing vibration spike (3.8 mm/s). Maintenance **Overdue**.

✅ **Recommended Workflow:**
Reallocate standby unit **EXC-01** (89.5% avail) to Pit Floor 4 immediately while sending EXC-02 to the central workshop.`,
    replyHi: `लाइव HEMM टेलीमैटिक्स मॉनिटरिंग **12 सक्रिय खनन संपत्तियों** को ट्रैक करता है:

⚠️ **गंभीर चेतावनियां:**
• **EXC-02 (उत्खननकर्ता - डोंगरी बुजुर्ग)**: उपलब्धता घटकर **68.2%**। हाइड्रोलिक दबाव अस्थिर (4.8 बार)। **64 दिन से लंबित**। शेष उपयोगी जीवन (RUL): **18 परिचालन घंटे**।
• **DRL-02 (ड्रिल रिग - डोंगरी बुजुर्ग)**: उपलब्धता **72.0%**। बेयरिंग कंपन वृद्धि (3.8 mm/s)।

✅ **अनुशंसित कार्यप्रवाह:**
स्टैंडबाय यूनिट **EXC-01** (89.5% उपलब्धता) को तुरंत पिट फ्लोर 4 पर पुनः आवंटित करें तथा EXC-02 को कार्यशाला भेजें।`,
    actionsEn: [
      { label: "🚜 Open Equipment Telematics", path: "/equipment" },
      { label: "⚡ Run Fleet Simulator", path: "/simulator" }
    ],
    actionsHi: [
      { label: "🚜 उपकरण टेलीमैटिक्स खोलें", path: "/equipment" },
      { label: "⚡ फ्लीट सिम्युलेटर चलाएं", path: "/simulator" }
    ]
  },
  {
    keywords: ["satellite", "sentinel", "landsat", "band", "space", "remote sensing", "spectral", "उपग्रह", "सेंटिनल", "लैंडसैट", "बैंड", "अंतरिक्ष", "स्पेक्ट्रल"],
    replyEn: `OreSeek processes multi-temporal Earth Observation data from **ESA Sentinel-2, USGS Landsat-8/9, and ISRO MOSDAC**:

**Key Spectral Ratios for Manganese Exploration:**
1. **Iron Oxide / Gossan Index**: $\\text{Band 4 (Red)} / \\text{Band 2 (Blue)}$ — Identifies oxidized manganiferous caps.
2. **Clay Mineral Alteration**: $\\text{Band 11 (SWIR-1)} / \\text{Band 12 (SWIR-2)}$ — Pinpoints hydrothermal alteration haloes.
3. **Ferrous Silicate Ratio**: $\\text{Band 11 (SWIR-1)} / \\text{Band 8 (NIR)}$ — Separates Gondite ore from barren schist.
4. **Environmental NDVI Tracking**: Monitored at 10m resolution for environmental ESG compliance.`,
    replyHi: `ओरसीक **ESA सेंटिनल-2, USGS लैंडसैट-8/9 एवं ISRO MOSDAC** से पृथ्वी अवलोकन डेटा प्रोसेस करता है:

**मैंगनीज अन्वेषण हेतु मुख्य स्पेक्ट्रल अनुपात:**
1. **आयरन ऑक्साइड सूचकांक**: $\\text{बैंड 4 (लाल)} / \\text{बैंड 2 (नीला)}$ — ऑक्सीकृत मैंगनीज कैप्स की पहचान।
2. **क्ले खनिज परिवर्तन**: $\\text{बैंड 11 (SWIR-1)} / \\text{बैंड 12 (SWIR-2)}$ — हाइड्रोथर्मल हेलो की पहचान।
3. **फेरस सिलिकेट अनुपात**: $\\text{बैंड 11 (SWIR-1)} / \\text{बैंड 8 (NIR)}$ — गोंडाइट अयस्क को बंजर शिस्ट से अलग करता है।
4. **पर्यावरणीय NDVI ट्रैकिंग**: ESG अनुपालन हेतु 10 मीटर रिज़ॉल्यूशन पर निगरानी।`,
    actionsEn: [
      { label: "🛰️ Open Satellite Exploration GIS", path: "/exploration" },
      { label: "🌱 View Environmental NDVI", path: "/environment" }
    ],
    actionsHi: [
      { label: "🛰️ उपग्रह अन्वेषण जीआईएस खोलें", path: "/exploration" },
      { label: "🌱 पर्यावरणीय NDVI देखें", path: "/environment" }
    ]
  },
  {
    keywords: ["moil", "sih", "hackathon", "objective", "problem statement", "ps-26009", "ministry", "मॉयल", "हैकथॉन", "उद्देश्य", "मंत्रालय"],
    replyEn: `**OreSeek** is specifically engineered for **SIH 2026 Problem Statement PS-26009 (Ministry of Steel / MOIL Limited)**:

**Platform Value Pillars:**
1. **Discover**: Space-based prospectivity delineates new manganese horizons in the Sausar Fold Belt.
2. **Quantify**: 3D UNFC block modelling provides JORC-compliant resource estimation.
3. **Forecast**: XGBoost predicts production trajectories and provides 14-30 day shortfall early warnings.
4. **Mitigate**: Interactive What-If simulation optimizes fleet allocations, blast patterns, and ore blending.`,
    replyHi: `**ओरसीक** को विशेष रूप से **SIH 2026 समस्या विवरण PS-26009 (इस्पात मंत्रालय / मॉयल लिमिटेड)** के लिए तैयार किया गया है:

**प्लेटफ़ॉर्म के मुख्य स्तंभ:**
1. **खोज**: अंतरिक्ष-आधारित संभावना सौसर फोल्ड बेल्ट में नए मैंगनीज क्षितिजों की पहचान करती है।
2. **मात्रा निर्धारण**: 3D UNFC ब्लॉक मॉडलिंग सटीक संसाधन अनुमान प्रदान करती है।
3. **पूर्वानुमान**: XGBoost उत्पादन में 14-30 दिन पूर्व कमी की चेतावनी देता है।
4. **सुधार**: सिम्युलेटर फ्लीट आवंटन, ब्लास्ट डिजाइन और अयस्क सम्मिश्रण को अनुकूलित करता है।`,
    actionsEn: [
      { label: "📄 Open Executive PDF Report", actionType: "report" },
      { label: "🎯 Start Judge Demo Tour", actionType: "tour" }
    ],
    actionsHi: [
      { label: "📄 कार्यकारी पीडीएफ रिपोर्ट खोलें", actionType: "report" },
      { label: "🎯 जज डेमो टूर शुरू करें", actionType: "tour" }
    ]
  }
]

export default function OreSeekCopilot({ onOpenReport, onOpenTour }: { onOpenReport?: () => void; onOpenTour?: () => void }) {
  const { lang, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputQuery, setInputQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const getInitialWelcomeMessage = (currentLang: 'en' | 'hi'): Message => ({
    id: 'welcome',
    sender: 'assistant',
    text: currentLang === 'hi' ? DICTIONARY.copilotWelcome.hi : DICTIONARY.copilotWelcome.en,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actions: currentLang === 'hi' ? [
      { label: "🎯 अन्वेषण लक्ष्य देखें", path: "/exploration" },
      { label: "🧊 3D भंडार निरीक्षण", path: "/resources" },
      { label: "⚡ कमी जोखिम हल करें", path: "/simulator" }
    ] : [
      { label: "🎯 Delineate Exploration Targets", path: "/exploration" },
      { label: "🧊 Inspect 3D Reserves", path: "/resources" },
      { label: "⚡ Solve Shortfall Risk", path: "/simulator" }
    ]
  })

  const [messages, setMessages] = useState<Message[]>([getInitialWelcomeMessage(lang)])

  const chatEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const recognitionRef = useRef<any>(null)

  // Update welcome message if chat hasn't started yet when lang changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome') {
      setMessages([getInitialWelcomeMessage(lang)])
    }
  }, [lang])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, isOpen])

  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true)
      setIsMinimized(false)
    }
    window.addEventListener('open-oreseek-copilot', handleOpenEvent)
    return () => window.removeEventListener('open-oreseek-copilot', handleOpenEvent)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    // Voice recognition setup
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US'
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript
        setInputQuery(transcript)
        setIsListening(false)
        handleSend(transcript)
      }
      recognition.onerror = () => setIsListening(false)
      recognition.onend = () => setIsListening(false)
      recognitionRef.current = recognition
    }
  }, [lang])

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(lang === 'hi' ? "इस ब्राउज़र में वाक् पहचान (Speech Recognition) समर्थित नहीं है।" : "Speech recognition is not supported in this browser.")
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-US'
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        setIsListening(false)
      }
    }
  }

  const speakText = (text: string) => {
    if (!synthRef.current) return
    if (isSpeaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      return
    }

    synthRef.current.cancel()
    // Clean markdown symbols for natural speech
    const clean = text.replace(/[*#•`$]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1')
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US'
    utterance.rate = lang === 'hi' ? 0.95 : 1.05

    const voices = synthRef.current.getVoices()
    if (lang === 'hi') {
      const hiVoice = voices.find(v => 
        v.lang.toLowerCase().startsWith('hi') || 
        v.name.toLowerCase().includes('hindi') || 
        v.name.includes('हिन्दी') ||
        v.name.includes('Swara') ||
        v.name.includes('Kalpana') ||
        v.name.includes('Neerja') ||
        v.name.includes('Heera')
      )
      if (hiVoice) utterance.voice = hiVoice
    } else {
      const naturalFemale = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Zira') || v.name.includes('Aria') || v.name.includes('Female'))
      )
      if (naturalFemale) utterance.voice = naturalFemale
    }

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current.speak(utterance)
    setIsSpeaking(true)
  }

  const findBestResponse = (query: string) => {
    const q = query.toLowerCase()
    for (const item of KNOWLEDGE_RESPONSES) {
      if (item.keywords.some(kw => q.includes(kw.toLowerCase()))) {
        return {
          reply: lang === 'hi' ? item.replyHi : item.replyEn,
          actions: lang === 'hi' ? item.actionsHi : item.actionsEn
        }
      }
    }

    // Default fallback generator
    if (lang === 'hi') {
      return {
        reply: `वर्तमान **ओरसीक आसूचना डेटा** के आधार पर:
• **प्राथमिकता अन्वेषण**: बालाघाट उत्तर (91%) और सीतासावंगी उत्तर (88%) प्राथमिक उच्च-ग्रेड लक्ष्य हैं।
• **भंडार आधार**: JORC/UNFC 111 और 122 वर्गीकरण में 14.8 मिलियन टन अनुमानित मैंगनीज।
• **परिचालन चेतावनी**: 68% मानसून उत्पादन कमी का जोखिम सक्रिय। उत्खननकर्ता पुनः आवंटन और 60:40 सम्मिश्रण द्वारा **+9.4% क्षमता भरपाई** संभव है।`,
        actions: [
          { label: "📊 कमांड सेंटर खोलें", path: "/dashboard" },
          { label: "🎛️ व्हाट-इफ सिम्युलेटर चलाएं", path: "/simulator" }
        ]
      }
    }

    return {
      reply: `Based on current **OreSeek Intelligence Stream**:
• **Target Priority**: Balaghat North (91%) & Sitasaongi North (88%) represent the primary high-grade targets.
• **Reserve Base**: 14.8 Mt estimated manganese in-situ across JORC/UNFC 111 & 122 classifications.
• **Operational Flag**: 68% monsoon shortfall risk active. Prescriptive actions show **+9.4% capacity recovery** through excavator standby reallocation and smart 60:40 ore blending.`,
      actions: [
        { label: "📊 Open Command Center", path: "/dashboard" },
        { label: "🎛️ Run What-If Simulation", path: "/simulator" }
      ]
    }
  }

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim()
    if (!query) return

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInputQuery('')
    setIsTyping(true)

    setTimeout(() => {
      const match = findBestResponse(query)
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: match.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: match.actions
      }
      setMessages(prev => [...prev, assistantMsg])
      setIsTyping(false)
    }, 600)
  }

  const handleActionClick = (action: { label: string; path?: string; actionType?: string }) => {
    if (action.path) {
      navigate(action.path)
    } else if (action.actionType === 'report' && onOpenReport) {
      onOpenReport()
    } else if (action.actionType === 'tour' && onOpenTour) {
      onOpenTour()
    }
  }

  const handleResetChat = () => {
    if (synthRef.current) synthRef.current.cancel()
    setIsSpeaking(false)
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: lang === 'hi' 
          ? "चैट मेमोरी रीसेट हो गई है। अन्वेषण मानचित्रों, 3D ब्लॉक मॉडल, उत्पादन पूर्वानुमान या उपकरण स्थिति के बारे में मुझसे कोई भी प्रश्न पूछें!"
          : "Chat memory reset. Ask me any question about prospectivity maps, 3D orebody block models, production forecasting, or equipment health!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: lang === 'hi' ? [
          { label: "🎯 अन्वेषण लक्ष्य देखें", path: "/exploration" },
          { label: "🧊 3D भंडार निरीक्षण", path: "/resources" }
        ] : [
          { label: "🎯 Delineate Exploration Targets", path: "/exploration" },
          { label: "🧊 Inspect 3D Reserves", path: "/resources" }
        ]
      }
    ])
  }

  const starterPrompts = lang === 'hi' ? STARTER_PROMPTS_HI : STARTER_PROMPTS_EN

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false) }}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-accent-orange via-orange-600 to-amber-500 text-white font-bold text-xs shadow-[0_0_25px_rgba(249,115,22,0.45)] hover:shadow-[0_0_35px_rgba(249,115,22,0.7)] hover:scale-105 transition-all duration-300 animate-bounce-subtle"
          title={t('aiCopilot')}
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
          </div>
          <span className="tracking-wide">{t('aiCopilot')}</span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
        </button>
      )}

      {/* Copilot Chat Window */}
      {isOpen && (
        <div
          className={`fixed right-6 z-50 transition-all duration-300 ease-out flex flex-col rounded-2xl border border-accent-orange/40 bg-bg-900/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.85)] overflow-hidden ${
            isMinimized ? 'bottom-6 w-80 h-14' : 'bottom-6 w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-5rem)]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-bg-800 to-bg-900 border-b border-surface-border">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-orange to-orange-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black tracking-wider text-text-primary uppercase truncate">{t('copilotTitle')}</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                    LIVE ML
                  </span>
                </div>
                <div className="text-[10px] text-text-muted truncate">{t('copilotSubtitle')}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-text-muted">
              <button
                onClick={handleResetChat}
                className="p-1.5 hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
                title={t('copilotResetChat')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false)
                  if (synthRef.current) synthRef.current.cancel()
                  setIsSpeaking(false)
                }}
                className="p-1.5 hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-semibold text-text-muted">
                        {msg.sender === 'user' ? (lang === 'hi' ? 'आप' : 'You') : (lang === 'hi' ? 'ओरसीक एआई' : 'OreSeek AI')}
                      </span>
                      <span className="text-[9px] text-text-muted/60">{msg.timestamp}</span>
                      {msg.sender === 'assistant' && (
                        <button
                          onClick={() => speakText(msg.text)}
                          className="ml-1 text-text-muted hover:text-accent-orange transition-colors"
                          title={t('copilotReadAloud')}
                        >
                          {isSpeaking ? <VolumeX className="w-3 h-3 text-accent-orange" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-2xl max-w-[92%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-accent-orange text-white rounded-tr-sm font-medium shadow-md'
                          : 'bg-surface-muted/90 text-text-primary border border-surface-border rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {/* Formatted body */}
                      <div className="space-y-1.5 whitespace-pre-wrap">
                        {msg.text.split('\n\n').map((para, idx) => (
                          <p key={idx}>{renderFormattedText(para)}</p>
                        ))}
                      </div>

                      {/* Interactive Action Chips */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-surface-border/60 flex flex-wrap gap-1.5">
                          {msg.actions.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => handleActionClick(act)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-accent-orange/15 hover:bg-accent-orange/25 text-accent-orange border border-accent-orange/30 hover:border-accent-orange transition-all flex items-center gap-1"
                            >
                              <span>{act.label}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 p-3 max-w-[120px] rounded-xl bg-surface-muted/80 border border-surface-border">
                    <span className="w-2 h-2 rounded-full bg-accent-orange animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-accent-orange animate-bounce delay-100"></span>
                    <span className="w-2 h-2 rounded-full bg-accent-orange animate-bounce delay-200"></span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Starter Prompt Chips */}
              <div className="px-3 py-2 bg-bg-950/60 border-t border-surface-border overflow-x-auto no-scrollbar flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-accent-orange uppercase flex-shrink-0 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3 h-3" /> {t('copilotQuick')}:
                </span>
                {starterPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt.text)}
                    className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium bg-surface-muted hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-surface-border hover:border-accent-orange/50 transition-all whitespace-nowrap"
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="p-3 bg-bg-800 border-t border-surface-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      placeholder={t('copilotPlaceholder')}
                      className="w-full py-2 pl-3 pr-9 text-xs bg-bg-900 border border-surface-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-orange transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                        isListening ? 'text-red-400 animate-pulse' : 'text-text-muted hover:text-text-primary'
                      }`}
                      title={isListening ? t('copilotListening') : "Speak query"}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!inputQuery.trim()}
                    className="p-2 rounded-xl bg-accent-orange hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-accent-orange text-white font-bold transition-all shadow-md flex-shrink-0"
                    title="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

function renderFormattedText(text: string) {
  const lines = text.split('\n')
  return lines.map((line, lIdx) => {
    const parts = line.split(/(\*\*.*?\*\*)/g)
    return (
      <span key={lIdx} className="block">
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-text-primary">
                {part.slice(2, -2)}
              </strong>
            )
          }
          return part
        })}
      </span>
    )
  })
}
