import axios from 'axios'

const API_BASE = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

export const getDashboard = () => api.get('/dashboard').then(r => r.data)
export const getExplorationZones = () => api.get('/exploration/zones').then(r => r.data)
export const getExplorationZone = (id: string) => api.get(`/exploration/${id}`).then(r => r.data)
export const getResources = () => api.get('/resources').then(r => r.data)
export const getProductionHistory = () => api.get('/production/history').then(r => r.data)
export const getProductionForecast = () => api.get('/production/forecast').then(r => r.data)
export const getShortfall = () => api.get('/production/shortfall').then(r => r.data)
export const getEquipment = () => api.get('/equipment').then(r => r.data)
export const getEnvironment = () => api.get('/environment').then(r => r.data)
export const getRecommendations = () => api.get('/recommendations').then(r => r.data)
export const getModels = () => api.get('/models').then(r => r.data)
export const runSimulation = (params: {
  equipment_availability_pct: number
  rainfall_scenario: string
  blasting_delay_days: number
  equipment_redeployment: boolean
  working_hours: number
}) => api.post('/simulator/run', params).then(r => r.data)

export default api
