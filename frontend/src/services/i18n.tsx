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
  execReport: { en: 'Executive PDF Report', hi: 'कार्यकारी रिपोर्ट' },
  judgeTour: { en: 'Judge Presentation', hi: 'जज डेमो टूर' },
  aiCopilot: { en: 'AI Copilot', hi: 'एआई कोपायलट' },
  spectralInspector: { en: 'Spectral Band Inspector', hi: 'स्पेक्ट्रल बैंड विश्लेषक' },
  demoBadge: { en: 'PROTOTYPE MODE', hi: 'प्रोटोटाइप मोड' },
  systemOnline: { en: 'System Online', hi: 'सिस्टम सक्रिय है' },

  // Dashboard & Command Center
  dashboardSubtitle: { en: 'OreSeek Mine Intelligence — Central India Operations Scenario', hi: 'ओरसीक माइन इंटेलिजेंस — मध्य भारत संचालन परिदृश्य' },
  monitoredArea: { en: 'Monitored Area', hi: 'निगरानी क्षेत्र' },
  highProspectivity: { en: 'High Prospectivity', hi: 'उच्च संभावना क्षेत्र' },
  resourcePotential: { en: 'Resource Potential', hi: 'संसाधन क्षमता' },
  productionForecast: { en: 'Production Forecast', hi: 'उत्पादन पूर्वानुमान' },
  shortfallRisk: { en: 'Shortfall Risk', hi: 'कमी का जोखिम' },
  equipmentAvail: { en: 'Equip. Availability', hi: 'उपकरण उपलब्धता' },
  runSimulator: { en: 'Run Simulator', hi: 'सिम्युलेटर चलाएं' },
  shortfallRiskEngine: { en: 'Shortfall Risk Engine', hi: 'कमी जोखिम इंजन' },
  shortfallProbSub: { en: 'Probability of annual production target miss', hi: 'वार्षिक उत्पादन लक्ष्य चूकने की संभावना' },
  recentProductionVsTarget: { en: 'Recent Production vs Target', hi: 'हालिया उत्पादन बनाम लक्ष्य' },
  shortfallContributors: { en: 'Shortfall Contributors', hi: 'कमी के मुख्य कारक (SHAP)' },
  activeAlerts: { en: 'Active Alerts', hi: 'सक्रिय चेतावनियां' },
  intelligenceWorkflow: { en: 'Intelligence Workflow', hi: 'आसूचना कार्यप्रवाह' },
  viewFullAnalysis: { en: 'View Full Analysis →', hi: 'पूर्ण विश्लेषण देखें →' },
  fullAIExplanation: { en: 'Full AI Explanation →', hi: 'विस्तृत एआई व्याख्या →' },

  // Exploration & GIS
  explorationTitle: { en: 'Manganese Exploration Intelligence', hi: 'मैंगनीज अन्वेषण आसूचना' },
  explorationSubtitle: { en: 'Space-borne remote sensing, multi-spectral band ratios & AI mineral prospectivity mapping', hi: 'उपग्रह रिमोट सेंसिंग, मल्टी-स्पेक्ट्रल बैंड अनुपात एवं एआई खनिज संभावना मानचित्रण' },
  spectralAnalysis: { en: 'Space Spectral Indices', hi: 'अंतरिक्ष स्पेक्ट्रल सूचकांक' },
  stratigraphyLog: { en: 'Downhole Stratigraphy', hi: 'बोरहोल स्तरिकी लॉग' },
  activeMines: { en: 'Active MOIL Mines', hi: 'सक्रिय मॉयल खदानें' },
  explorationTargets: { en: 'Exploration Targets', hi: 'अन्वेषण लक्ष्य' },
  ironOxideIndex: { en: 'Iron Oxide Index (B4/B2)', hi: 'आयरन ऑक्साइड सूचकांक (B4/B2)' },
  clayMineralIndex: { en: 'Clay Mineral Ratio (B11/B12)', hi: 'क्ले खनिज अनुपात (B11/B12)' },
  ferrousIndex: { en: 'Ferrous Minerals (B11/B8)', hi: 'फेरस खनिज सूचकांक (B11/B8)' },

  // Resources & 3D Blocks
  resourcesTitle: { en: '3D Subsurface Resource Block Model', hi: '3D भूगर्भीय संसाधन ब्लॉक मॉडल' },
  resourcesSubtitle: { en: 'UNFC 111 / 122 / 333 volumetric kriging & reserve estimation', hi: 'UNFC 111 / 122 / 333 त्रिआयामी क्रिगिंग एवं भंडार आकलन' },
  provedReserve: { en: 'Proved Reserves (UNFC 111)', hi: 'प्रमाणित भंडार (UNFC 111)' },
  probableReserve: { en: 'Probable Reserves (UNFC 122)', hi: 'संभावित भंडार (UNFC 122)' },
  inferredResource: { en: 'Inferred Resource (UNFC 333)', hi: 'अनुमानित संसाधन (UNFC 333)' },
  cutoffGradeFilter: { en: 'Cutoff Grade Filter', hi: 'कटऑफ ग्रेड फ़िल्टर' },

  // Production & Fleet
  productionTitle: { en: 'Production Trajectory & Shortfall Forecasting', hi: 'उत्पादन प्रक्षेपवक्र एवं कमी पूर्वानुमान' },
  productionSubtitle: { en: 'XGBoost multi-variate shortfall early warning engine', hi: 'XGBoost बहु-चर कमी पूर्व चेतावनी इंजन' },
  equipmentTitle: { en: 'Heavy Earth Moving Machinery (HEMM) Telematics', hi: 'भारी खनन उपकरण (HEMM) टेलीमैटिक्स' },
  equipmentSubtitle: { en: 'Predictive maintenance, RUL estimation & breakdown prevention', hi: 'पूर्वानुमानित रखरखाव, RUL अनुमान एवं खराबी रोकथाम' },

  // Environment & Sump
  environmentTitle: { en: 'Environment & Space-Derived Indicators', hi: 'पर्यावरण एवं अंतरिक्ष-आधारित संकेतक' },
  environmentSubtitle: { en: 'Precipitation tracking, soil moisture, NDVI & pit sump inundation balancing', hi: 'वर्षा ट्रैकिंग, मिट्टी की नमी, NDVI एवं पिट संप जल निकासी संतुलन' },
  pitSumpEngineTitle: { en: 'Space-Based Pit Sump Inundation & Dewatering Engine', hi: 'अंतरिक्ष-आधारित पिट संप जलभराव एवं पंप निकासी इंजन' },
  pitSumpEngineSubtitle: { en: 'Real-time satellite precipitation, catchment runoff hydrograph & sump pump discharge balancing', hi: 'उपग्रह वर्षा डेटा, पिट जलग्रहण अपवाह हाइड्रोग्राफ एवं संप पंप निकासी संतुलन' },
  autoDispatchPumps: { en: 'Auto-Dispatch Pumps', hi: 'पंप ऑटो-डिस्पैच करें' },
  activeSlurryPumps: { en: 'Active Slurry Pumps Online', hi: 'सक्रिय स्लरी पंप' },
  runoffInflow: { en: 'Runoff Inflow', hi: 'अपवाह जल आवक' },
  pumpDischarge: { en: 'Pump Discharge', hi: 'पंप जल निकासी' },
  netSumpTrend: { en: 'Net Sump Trend', hi: 'शुद्ध संप जल प्रवृत्ति' },
  currentSumpLevel: { en: 'Current Pit Sump Water Level', hi: 'वर्तमान पिट संप जल स्तर' },

  // Simulator & Blending & Blast
  simulatorTitle: { en: 'What-If Simulator & Policy Engine', hi: 'व्हाट-इफ सिम्युलेटर एवं नीति इंजन' },
  simulatorSubtitle: { en: 'Interactive operational planning, fleet reallocation, blast sizing, and ore blending', hi: 'संवादात्मक परिचालन योजना, फ्लीट पुनः आवंटन, ब्लास्ट डिजाइन एवं अयस्क सम्मिश्रण' },
  fleetPolicyTab: { en: 'Fleet & Shortfall', hi: 'फ्लीट एवं कमी नियंत्रण' },
  oreBlendingTab: { en: 'Smart Blending', hi: 'स्मार्ट अयस्क सम्मिश्रण' },
  blastOptimizationTab: { en: 'Blast & Flyrock', hi: 'ब्लास्टिंग एवं फ्लाईरॉक' },
  autoSolveBlend: { en: 'Auto-Solve Best Cost Ratio', hi: 'न्यूनतम लागत अनुपात हल करें' },
  autoSetBlastPattern: { en: 'Auto-Set Optimum Pattern', hi: 'इष्टतम ब्लास्ट पैटर्न सेट करें' },
  runSimulationBtn: { en: 'RUN SIMULATION', hi: 'सिम्युलेशन चलाएं' },
  computingBtn: { en: 'Computing...', hi: 'गणना जारी है...' },
  currentBaseline: { en: 'Current Baseline', hi: 'वर्तमान बेसलाइन' },
  simulatedOutcome: { en: 'Simulated Outcome', hi: 'सिम्युलेटेड परिणाम' },
  annualProduction: { en: 'Annual Production', hi: 'वार्षिक उत्पादन' },
  newShortfallRisk: { en: 'New Shortfall Risk', hi: 'नया कमी जोखिम' },

  // AI Insights
  aiTitle: { en: 'Explainable AI & Prescriptive Recommendations', hi: 'व्याख्या योग्य एआई एवं उपचारात्मक सिफारिशें' },
  aiSubtitle: { en: 'TreeSHAP attribution, causal factor ranking & operational policy synthesis', hi: 'TreeSHAP एट्रिब्यूशन, कारणात्मक कारक रैंकिंग एवं परिचालन नीति संश्लेषण' },

  // Audio & Situation Room
  situationRoomAudio: { en: 'AI Situation Room Audio Briefing', hi: 'एआई स्थिति कक्ष ऑडियो ब्रीफिंग' },
  situationRoomSub: { en: 'Listen to 30-second AI executive audio briefing for judges & leadership', hi: 'जजों और प्रबंधन के लिए 30-सेकंड की एआई कार्यकारी ऑडियो ब्रीफिंग सुनें' },
  situationRoomBroadcasting: { en: 'Broadcasting live operational AI situation report (Executive Narrator)...', hi: 'लाइव परिचालन एआई स्थिति रिपोर्ट प्रसारित हो रही है...' },
  playAudio: { en: 'Play AI Audio Report', hi: 'ऑडियो रिपोर्ट सुनें' },
  stopAudio: { en: 'Stop Briefing', hi: 'ब्रीफिंग रोकें' },
  femaleAIVoice: { en: 'AI NARRATOR', hi: 'एआई वक्ता' },

  // AI Copilot
  copilotTitle: { en: 'OreSeek Copilot', hi: 'ओरसीक कोपायलट' },
  copilotSubtitle: { en: 'Geological & Mining Decision Assistant', hi: 'भूवैज्ञानिक एवं खनन निर्णय सहायक' },
  copilotPlaceholder: { en: 'Ask OreSeek Copilot anything...', hi: 'ओरसीक कोपायलट से कोई भी प्रश्न पूछें...' },
  copilotQuick: { en: 'Quick', hi: 'त्वरित' },
  copilotListening: { en: 'Listening... speak now', hi: 'सुन रहा हूँ... बोलिए' },
  copilotReadAloud: { en: 'Read aloud', hi: 'बोलकर सुनाएं' },
  copilotResetChat: { en: 'Reset Chat', hi: 'चैट रीसेट करें' },
  copilotWelcome: {
    en: "👋 Hello! I am **OreSeek AI Copilot**, your mining & geological intelligence assistant.\n\nI can analyze satellite prospectivity, explain UNFC 3D block models, predict production shortfalls, or formulate operational mitigation strategies. How can I assist you?",
    hi: "👋 नमस्ते! मैं **ओरसीक एआई कोपायलट** हूँ, आपका खनन और भूवैज्ञानिक आसूचना सहायक।\n\nमैं उपग्रह संभावना का विश्लेषण कर सकता हूँ, UNFC 3D ब्लॉक मॉडल समझा सकता हूँ, उत्पादन में कमी का पूर्वानुमान लगा सकता हूँ, या सुधारात्मक रणनीतियाँ बना सकता हूँ। मैं आपकी क्या मदद करूँ?"
  }
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
