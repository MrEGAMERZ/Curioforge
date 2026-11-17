const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Geocode city name to lat/lon using Open-Meteo Geocoding API
 */
export async function geocodeCity(query) {
  const cacheKey = `geo:${query.toLowerCase().trim()}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CurioForge/1.0' } });
    if (!res.ok) throw new Error(`Geocoding HTTP error ${res.status}`);
    const data = await res.json();

    const results = (data.results || []).map((item) => ({
      name: item.name,
      admin1: item.admin1 || '',
      country: item.country || '',
      latitude: item.latitude,
      longitude: item.longitude,
    }));

    cache.set(cacheKey, { timestamp: Date.now(), data: results });
    return results;
  } catch (err) {
    console.error('[Open-Meteo Geocode Error]:', err.message);
    throw { status: 502, code: 'WEATHER_UNAVAILABLE', message: 'Unable to reach Open-Meteo geocoding service.' };
  }
}

/**
 * Fetch 7-day daily rain & ET forecast
 */
export async function getForecast({ latitude, longitude, days = 7 }) {
  const safeDays = Math.min(Math.max(parseInt(days, 10) || 7, 1), 7);
  const cacheKey = `fc:${latitude.toFixed(2)},${longitude.toFixed(2)}:${safeDays}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_sum,et0_fao_evapotranspiration,temperature_2m_max&timezone=auto&forecast_days=${safeDays}`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CurioForge/1.0' } });
    if (!res.ok) throw new Error(`Forecast HTTP error ${res.status}`);
    const data = await res.json();

    const daily = (data.daily?.time || []).map((date, idx) => ({
      date,
      precipitationMm: Number((data.daily?.precipitation_sum?.[idx] || 0).toFixed(1)),
      et0Mm: Number((data.daily?.et0_fao_evapotranspiration?.[idx] || 4.5).toFixed(1)),
      tempMaxC: Number((data.daily?.temperature_2m_max?.[idx] || 25).toFixed(1)),
    }));

    const formatted = {
      source: 'Open-Meteo',
      fetchedAt: new Date().toISOString(),
      timezone: data.timezone || 'auto',
      daily,
    };

    cache.set(cacheKey, { timestamp: Date.now(), data: formatted });
    return formatted;
  } catch (err) {
    console.error('[Open-Meteo Forecast Error]:', err.message);
    throw { status: 502, code: 'WEATHER_UNAVAILABLE', message: 'Unable to fetch forecast from Open-Meteo.' };
  }
}
