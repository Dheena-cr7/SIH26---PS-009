import axios from 'axios'
import {
  MOCK_DASHBOARD,
  MOCK_ZONES,
  MOCK_RESOURCES,
  MOCK_PRODUCTION_HISTORY,
  MOCK_PRODUCTION_FORECAST,
  MOCK_SHORTFALL,
  MOCK_EQUIPMENT,
  MOCK_ENVIRONMENT,
  MOCK_MODELS,
  MOCK_RECOMMENDATIONS,
  computeLocalSimulation
} from './mockData'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 3500, // Quick timeout so user is never stuck if backend is sleeping or unreachable
})

// Safe fetch wrapper that falls back to mockData if backend is down or not deployed
async function safeFetch<T>(requestFn: () => Promise<T>, fallbackData: T): Promise<T> {
  try {
    const res = await requestFn()
    return res
  } catch (err) {
    // Graceful fallback to offline/demo data
    return fallbackData
  }
}

export const getDashboard = () => 
  safeFetch(() => api.get('/dashboard').then(r => r.data), MOCK_DASHBOARD)

export const getExplorationZones = () => 
  safeFetch(() => api.get('/exploration/zones').then(r => r.data), { zones: MOCK_ZONES, total: MOCK_ZONES.length, data_mode: "DEMO" })

export const getExplorationZone = (id: string) => 
  safeFetch(
    () => api.get(`/exploration/${id}`).then(r => r.data),
    { zone: MOCK_ZONES.find(z => z.id === id) || MOCK_ZONES[0], data_mode: "DEMO" }
  )

export const getResources = () => 
  safeFetch(() => api.get('/resources').then(r => r.data), MOCK_RESOURCES)

export const getProductionHistory = () => 
  safeFetch(() => api.get('/production/history').then(r => r.data), { history: MOCK_PRODUCTION_HISTORY, data_mode: "DEMO" })

export const getProductionForecast = () => 
  safeFetch(() => api.get('/production/forecast').then(r => r.data), { forecast: MOCK_PRODUCTION_FORECAST, data_mode: "DEMO" })

export const getShortfall = () => 
  safeFetch(() => api.get('/production/shortfall').then(r => r.data), MOCK_SHORTFALL)

export const getEquipment = () => 
  safeFetch(() => api.get('/equipment').then(r => r.data), MOCK_EQUIPMENT)

export const getEnvironment = () => 
  safeFetch(() => api.get('/environment').then(r => r.data), MOCK_ENVIRONMENT)

export const getRecommendations = () => 
  safeFetch(() => api.get('/recommendations').then(r => r.data), MOCK_RECOMMENDATIONS)

export const getModels = () => 
  safeFetch(() => api.get('/models').then(r => r.data), MOCK_MODELS)

export const runSimulation = (params: {
  equipment_availability_pct: number
  rainfall_scenario: string
  blasting_delay_days: number
  equipment_redeployment: boolean
  working_hours: number
}) => 
  safeFetch(
    () => api.post('/simulator/run', params).then(r => r.data),
    computeLocalSimulation(params)
  )

export const askCopilot = async (payload: {
  query: string
  lang: string
  history?: Array<{ sender: string; text: string }>
  api_key?: string
}) => {
  try {
    const res = await api.post('/copilot/chat', payload, { timeout: 9000 })
    return res.data
  } catch (err) {
    // If backend proxy is unreachable, try direct client-side Gemini if API key is provided
    const clientKey = payload.api_key || (import.meta as any).env?.VITE_GEMINI_API_KEY
    if (clientKey) {
      try {
        const systemContext = `You are OreSeek AI Copilot, an elite mining geologist and operations intelligence assistant engineered for MOIL Limited (Ministry of Steel) and Smart India Hackathon PS-26009.
Operational Knowledge Base:
- Active Deposits: Balaghat North Extension (Score 91%, 31.2% Mn), Sitasaongi North (88%), Dongri Buzurg South (83%), Ukwa (76%), Tirodi (72%).
- In-situ Geological Reserves: 14.8 Million Tonnes (Mt) under UNFC standards (UNFC 111 Proved: 6.2 Mt @ 36.4% Mn; UNFC 122 Probable: 5.4 Mt @ 29.8% Mn; UNFC 333 Inferred: 3.2 Mt @ 22.5% Mn).
- Shortfall Risk: 68% probability of a 22,400-tonne production shortfall over the next 60 days. Main SHAP factors: Equipment Downtime (31%), Monsoon Haulage Delays (24%), Blasting Delays (18%).
- Prescriptive Mitigations: Deploy 2 standby excavators to Pit Floor 4 (+4.5% output), Smart 60:40 Ore Blending (Balaghat:Tirodi, +3.2% output), Pre-clearing pit sump pumps (+1.7% output). Total recovery: +9.4% (+15,600t).
- Satellite Tech: Sentinel-2 & Landsat-8/9 Band Ratios: Iron Oxide (B4/B2), Clay Alteration (B11/B12), Ferrous Silicate (B11/B8).
- Critical HEMM Machine: Excavator EXC-02 (68.2% availability, overdue 64 days), Drill DRL-02 (72.0% availability).
Formatting: Keep answers structured, professional, concise, with markdown bullet points and bold highlights. If lang is 'hi', respond in Hindi.`

        const contents = (payload.history || []).slice(-4).map(h => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        }))
        contents.push({ role: 'user', parts: [{ text: `User query in ${payload.lang} language: ${payload.query}` }] })

        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${clientKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemContext }] },
            contents,
            generationConfig: { temperature: 0.4, maxOutputTokens: 800 }
          })
        })

        if (gRes.ok) {
          const gData = await gRes.json()
          const genText = gData?.candidates?.[0]?.content?.parts?.[0]?.text
          if (genText) {
            return {
              reply: genText,
              model_used: 'google-gemini-1.5-flash-direct',
              source: 'GENAI_LLM',
              actions: [
                { label: '📍 View GIS Exploration Map', path: '/exploration' },
                { label: '🧊 Open 3D Voxel Model', path: '/resources' }
              ]
            }
          }
        }
      } catch (e) {
        console.warn('Direct Gemini call failed:', e)
      }
    }

    // Fallback: Domain RAG
    return null
  }
}

export default api

