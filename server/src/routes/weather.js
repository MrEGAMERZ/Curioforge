import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { geocodeQuerySchema, forecastQuerySchema } from '../schemas/weather.js';
import { geocodeCity, getForecast } from '../services/openMeteo.js';

const router = Router();

router.get('/geocode', validate(geocodeQuerySchema), async (req, res, next) => {
  try {
    const { q } = req.query;
    const results = await geocodeCity(q);
    res.json({ results });
  } catch (err) {
    next(err);
  }
});

router.get('/forecast', validate(forecastQuerySchema), async (req, res, next) => {
  try {
    const { lat, lon, days } = req.query;
    const forecast = await getForecast({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      days: parseInt(days, 10) || 7,
    });
    res.json(forecast);
  } catch (err) {
    next(err);
  }
});

export default router;
