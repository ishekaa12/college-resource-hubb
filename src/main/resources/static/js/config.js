// config.js - Put this in your frontend project root

// Detect if running on mobile or local
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Configuration for different environments
const API_CONFIGS = {
  // Local development on computer
  local: 'http://localhost:8080',

  // When testing on same WiFi network (replace with your computer's IP)
  network: 'http://192.168.0.108:8080', // CHANGE THIS TO YOUR IP

  // When using ngrok (replace with your ngrok URL)
  ngrok: 'https://https://umbrellaless-condylar-maryln.ngrok-free.dev/api/resources'; // CHANGE THIS

  // Production (when deployed)
  production: 'https://your-production-url.com'
};

// Choose which config to use
// Change 'network' to 'ngrok' if using ngrok, or 'local' for desktop testing
export const API_BASE_URL = API_CONFIGS.network;

// Alternative: Auto-detect (but manual is more reliable)
// export const API_BASE_URL = isMobile ? API_CONFIGS.network : API_CONFIGS.local;

export default {
  API_BASE_URL,
  UPLOAD_ENDPOINT: `${API_BASE_URL}/api/resources/upload`,
  LIST_ENDPOINT: `${API_BASE_URL}/api/resources`,
  DOWNLOAD_ENDPOINT: (id) => `${API_BASE_URL}/api/resources/download/${id}`,
  SEARCH_ENDPOINT: `${API_BASE_URL}/api/resources/search`
};