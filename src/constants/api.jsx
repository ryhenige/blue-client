

const URL = window.location.hostname.includes("localhost")
  ? "localhost:5022"
  : "blue-api-prod.fly.dev";

export const API_URL = process.env.NODE_ENV === 'development' 
  ? `http://${URL}`
  : `https://${URL}`

export const WS_URL = process.env.NODE_ENV === 'development' 
  ? `ws://${URL}`
  : `wss://${URL}`

export const ENDPOINTS = {
  ME: `${API_URL}/api/me`,
  LOGIN: `${API_URL}/api/login`,
  REGISTER: `${API_URL}/api/register`,
  CHARACTERS: `${API_URL}/api/characters`
}
