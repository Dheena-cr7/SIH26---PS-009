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

export default api
