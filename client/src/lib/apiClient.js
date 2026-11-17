/**
 * Centralized API client for CurioForge
 * Uses relative paths so Vite proxy routes to http://localhost:8787
 */

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('/') ? endpoint : `/api/${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorObj = data?.error || {
      code: 'API_ERROR',
      message: typeof data === 'string' ? data : `Request failed with status ${response.status}`,
    };
    const err = new Error(errorObj.message);
    err.code = errorObj.code;
    err.status = response.status;
    throw err;
  }

  return data;
}

export const apiClient = {
  // Health
  checkHealth: () => request('/api/health'),

  // Tutor voice & interactive engine
  interactWithTutor: (payload) =>
    request('/api/tutor/interact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Curiosity engine chat
  chatCuriosity: (payload) =>
    request('/api/curiosity/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Blueprint generator
  generateBlueprint: (payload) =>
    request('/api/blueprint/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Results interpreter
  interpretResults: (payload) =>
    request('/api/results/interpret', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Weather
  geocodeCity: (city) => request(`/api/weather/geocode?q=${encodeURIComponent(city)}`),
  getForecast: (lat, lon, days = 7) => request(`/api/weather/forecast?lat=${lat}&lon=${lon}&days=${days}`),
};
