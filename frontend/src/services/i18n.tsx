import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'hi'

export interface Translations {
  [key: string]: {
    en: string
    hi: string
  }
}

export const DICTIONARY: Translations = {
  // Navigation
  navCommandCenter: { en: 'Command Center', hi: 'कमांड सेंटर' },
  navExploration: { en: 'Exploration', hi: 'अयस्क अन्वेषण' },
  navResources: { en: 'Resource Intelligence', hi: 'संसाधन आसूचना' },
  navProduction: { en: 'Production', hi: 'उत्पादन विश्लेषण' },
  navEquipment: { en: 'Equipment', hi: 'उपकरण स्थिति' },
  navEnvironment: { en: 'Environment', hi: 'पर्यावरण एवं अंतरिक्ष' },
  navAI: { en: 'AI Insights', hi: 'एआई इनसाइट्स' },
  navSimulator: { en: 'What-If Simulator', hi: 'सिम्युलेटर' },
  navData: { en: 'Data Center', hi: 'डेटा सेंटर' },

  // Header & Brand
  brandTitle: { en: 'ORESEEK', hi: 'ओरसीक' },
  brandSubtitle: { en: 'INTELLIGENCE', hi: 'आसूचना' },
  execReport: { en: 'Executive PDF Report', hi: 'कार्यकारी पीडीएफ रिपोर्ट' },
  judgeTour: { en: 'Judge Presentation', hi: 'जज डेमो टूर' },
  aiCopilot: { en: 'AI Copilot', hi: 'एआई कोपायलट' },
  spectralInspector: { en: 'Spectral Band Inspector', hi: 'स्पेक्ट्रल बैंड विश्लेषक' },
  demoBadge: { en: 'PROTOTYPE MODE', hi: 'प्रोटोटाइप मोड' },
  systemOnline: { en: 'System Online', hi: 'सिस्टम सक्रिय है' },

  // Dashboard KPIs
  monitoredArea: { en: 'Monitored Area', hi: 'निगरानी क्षेत्र' },
  highProspectivity: { en: 'High Prospectivity', hi: 'उच्च संभावना क्षेत्र' },
  resourcePotential: { en: 'Resource Potential', hi: 'संसाधन क्षमता' },
  productionForecast: { en: 'Production Forecast', hi: 'उत्पादन पूर्वानुमान' },
  shortfallRisk: { en: 'Shortfall Risk', hi: 'कमी का जोखिम' },
  equipmentAvail: { en: 'Equip. Availability', hi: 'उपकरण उपलब्धता' },
  runSimulator: { en: 'Run Simulator', hi: 'सिम्युलेटर चलाएं' },

  // Exploration
  spectralAnalysis: { en: 'Space Spectral Indices', hi: 'अंतरिक्ष स्पेक्ट्रल सूचकांक' },
  stratigraphyLog: { en: 'Downhole Stratigraphy', hi: 'बोरहोल स्तरिकी लॉग' },
  activeMines: { en: 'Active MOIL Mines', hi: 'सक्रिय मॉयल खदानें' },
  explorationTargets: { en: 'Exploration Targets', hi: 'अन्वेषण लक्ष्य' },

  // Simulator
  fleetPolicyTab: { en: 'Fleet & Shortfall', hi: 'फ्लीट एवं कमी नियंत्रण' },
  oreBlendingTab: { en: 'Smart Ore Blending', hi: 'स्मार्ट अयस्क सम्मिश्रण' },
  autoSolveBlend: { en: 'Auto-Solve Best Cost Ratio', hi: 'न्यूनतम लागत अनुपात हल करें' },
  
  // Audio & Situation Room
  situationRoomAudio: { en: 'AI Situation Room Audio Briefing', hi: 'एआई स्थिति कक्ष ऑडियो ब्रीफिंग' },
  playAudio: { en: 'Play AI Audio Report', hi: 'ऑडियो रिपोर्ट सुनें' },
  stopAudio: { en: 'Stop Briefing', hi: 'ब्रीफिंग रोकें' }
}

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key
})

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('oreseek_lang') as Language) || 'en'
  })

  useEffect(() => {
    localStorage.setItem('oreseek_lang', lang)
  }, [lang])

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][lang] || DICTIONARY[key]['en'] || key
    }
    return key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
