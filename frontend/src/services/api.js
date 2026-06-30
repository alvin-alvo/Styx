import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getHealth = () => apiClient.get('/health')

export const getAPIs = () => apiClient.get('/api/v1/apis')

export const getAPIDetails = (id) => apiClient.get(`/api/v1/apis/${id}`)

export const getAPIScore = (id) => apiClient.get(`/api/v1/apis/${id}/score`)

export const getAPIDependencies = (id) => apiClient.get(`/api/v1/apis/${id}/dependencies`)

export const getAlerts = () => apiClient.get('/api/v1/alerts')

export const acknowledgeAlert = (id) => apiClient.patch(`/api/v1/alerts/${id}/acknowledge`)

export const simulateBlastRadius = (apiIds) =>
  apiClient.post('/api/v1/simulator/blast-radius', { api_ids: apiIds })

export const generateAISummary = (apiData, contextType) =>
  apiClient.post('/api/v1/ai/summary', { api_data: apiData, context_type: contextType })

export const sendChatMessage = (messages) =>
  apiClient.post('/api/v1/ai/chat', { messages })

export const getEbpfState = () =>
  apiClient.get('/api/v1/ebpf/state')

export const updateEbpfState = (status, speed) =>
  apiClient.put('/api/v1/ebpf/state', { status, speed })

export default apiClient
