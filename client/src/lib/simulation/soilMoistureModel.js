/**
 * Soil Moisture Simulation Engine
 * Pure JavaScript, deterministic simulation per ARCHITECTURE.md §10
 * Illustrative teaching model: always labelled SIMULATION.
 */

export const SOIL_CAPACITIES = {
  sand: 60,  // Root zone capacity in mm
  loam: 120,
  clay: 150,
};

export function runSoilMoistureSimulation({
  days = 14,
  soilType = 'loam',
  rainMm = [],
  etMm = [],
  cropFactor = 0.8,
  startPct = 70,
  strategyA = { everyNDays: 2, mmPerEvent: 20 },      // Fixed schedule
  strategyB = { thresholdPct: 40, targetPct: 70 },     // Sensor rule
  stressPct = 25,
}) {
  const capacity = SOIL_CAPACITIES[soilType] || 120;
  const numDays = Math.max(1, Math.min(days, 30));

  // Initialize rain & ET series
  const rain = Array.from({ length: numDays }, (_, i) => rainMm[i] ?? 0);
  const et = Array.from({ length: numDays }, (_, i) => etMm[i] ?? 5);

  function simulateStrategy(isStrategyA) {
    let stored = (startPct / 100) * capacity;
    const moistureSeries = [];
    const irrigationSeries = [];
    let totalWaterMm = 0;
    let wastedMm = 0;
    let stressDays = 0;

    for (let d = 0; d < numDays; d++) {
      let irrigation = 0;

      if (isStrategyA) {
        // Strategy A: Water fixed amount every N days
        if (d % strategyA.everyNDays === 0) {
          irrigation = strategyA.mmPerEvent;
        }
      } else {
        // Strategy B: If current moisture < threshold, refill to target
        const currentMoisturePct = (stored / capacity) * 100;
        if (currentMoisturePct < strategyB.thresholdPct) {
          const targetWaterMm = (strategyB.targetPct / 100) * capacity;
          irrigation = Math.max(0, targetWaterMm - stored);
        }
      }

      totalWaterMm += irrigation;
      irrigationSeries.push(Number(irrigation.toFixed(1)));

      // Water balance calculation
      const dailyEt = et[d] * cropFactor;
      stored = stored + rain[d] + irrigation - dailyEt;

      // Calculate runoff / drainage
      if (stored > capacity) {
        wastedMm += (stored - capacity);
        stored = capacity;
      }

      if (stored < 0) {
        stored = 0;
      }

      const currentPct = (stored / capacity) * 100;
      moistureSeries.push(Number(currentPct.toFixed(1)));

      if (currentPct < stressPct) {
        stressDays++;
      }
    }

    return {
      moistureSeries,
      irrigationSeries,
      totalWaterMm: Number(totalWaterMm.toFixed(1)),
      wastedMm: Number(wastedMm.toFixed(1)),
      stressDays,
    };
  }

  const resultA = simulateStrategy(true);
  const resultB = simulateStrategy(false);

  let waterSavedPct = null;
  if (resultA.totalWaterMm > 0) {
    waterSavedPct = Number((((resultA.totalWaterMm - resultB.totalWaterMm) / resultA.totalWaterMm) * 100).toFixed(1));
  }

  return {
    capacity,
    days: numDays,
    soilType,
    A: resultA,
    B: resultB,
    waterSavedPct,
    stressPct,
  };
}
