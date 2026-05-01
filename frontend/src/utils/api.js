import axios from 'axios'

// In development, Vite proxies /api → http://localhost:8080
// In production, set VITE_API_URL to your Cloud Run URL
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function getPrediction(answers) {
  const response = await axios.post(`${BASE_URL}/predict`, answers, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  })
  return response.data
}

export async function checkHealth() {
  const response = await axios.get(`${BASE_URL}/health`)
  return response.data
}
