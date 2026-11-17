import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge, Spinner } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { runSoilMoistureSimulation } from '../../lib/simulation/soilMoistureModel';
import { apiClient } from '../../lib/apiClient';
import { CloudRain, Droplets, Sparkles, Search, CheckCircle2, AlertTriangle } from 'lucide-react';

export function SoilMoistureLab() {
  const [days, setDays] = useState(14);
  const [soilType, setSoilType] = useState('loam');
  const [cropFactor, setCropFactor] = useState(0.8);
  const [thresholdPct, setThresholdPct] = useState(40);
  const [targetPct, setTargetPct] = useState(70);
  const [rainEvents, setRainEvents] = useState([0, 0, 15, 0, 0, 5, 0, 0, 20, 0, 0, 0, 0, 0]);
  const [showTable, setShowTable] = useState(false);

  // Weather state
  const [cityQuery, setCityQuery] = useState('');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherNotice, setWeatherNotice] = useState(null);

  // Prediction & AI Interpretation
  const [prediction, setPrediction] = useState('');
  const [interpreting, setInterpreting] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  // Run simulation model instantly in browser
  const simResult = useMemo(() => {
    return runSoilMoistureSimulation({
      days,
      soilType,
      rainMm: rainEvents,
      cropFactor,
      strategyA: { everyNDays: 2, mmPerEvent: 20 },
      strategyB: { thresholdPct, targetPct },
      stressPct: 25,
    });
  }, [days, soilType, rainEvents, cropFactor, thresholdPct, targetPct]);

  // Handle weather lookup
  const handleFetchWeather = async () => {
    if (!cityQuery.trim()) return;
    setWeatherLoading(true);
    setWeatherNotice(null);
    try {
      const geo = await apiClient.geocodeCity(cityQuery);
      if (geo.results && geo.results.length > 0) {
        const place = geo.results[0];
        const fc = await apiClient.getForecast(place.latitude, place.longitude, 7);
        const rainArray = fc.daily.map((d) => d.precipitationMm);
        setRainEvents(rainArray);
        setDays(7);
        setWeatherNotice(`Loaded 7-day live weather for ${place.name}, ${place.country} via Open-Meteo!`);
      } else {
        setWeatherNotice(`City "${cityQuery}" not found. Using custom inputs.`);
      }
    } catch (err) {
      setWeatherNotice(`Weather lookup error: ${err.message}. Manual inputs preserved.`);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Handle AI results interpretation
  const handleInterpretResults = async () => {
    setInterpreting(true);
    try {
      const payload = {
        gradeBand: 'primary',
        studentPrediction: prediction || null,
        inputs: {
          soilType,
          days,
          cropFactor,
          strategyA: { everyNDays: 2, mmPerEvent: 20 },
          strategyB: { thresholdPct, targetPct },
        },
        results: {
          A: {
            totalWaterMm: simResult.A.totalWaterMm,
            stressDays: simResult.A.stressDays,
            wastedMm: simResult.A.wastedMm,
          },
          B: {
            totalWaterMm: simResult.B.totalWaterMm,
            stressDays: simResult.B.stressDays,
            wastedMm: simResult.B.wastedMm,
          },
          waterSavedPct: simResult.waterSavedPct,
        },
      };

      const res = await apiClient.interpretResults(payload);
      setAiReport(res);
    } catch (err) {
      alert(`Interpretation error: ${err.message}`);
    } finally {
      setInterpreting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface rounded-xl border border-line-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-ink-primary">Soil Moisture & Irrigation Lab</h2>
            <Badge tone="info">SIMULATION — Simplified Model</Badge>
          </div>
          <p className="text-xs text-ink-muted">
            Compare fixed scheduled watering against intelligent sensor threshold watering in real-time.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="text-center p-3 bg-surface/80 border-primary-500/20">
          <p className="text-xs text-ink-secondary mb-1">Water Saved</p>
          <p className="text-2xl font-bold font-mono text-success">
            {simResult.waterSavedPct !== null ? `${simResult.waterSavedPct}%` : 'N/A'}
          </p>
          <span className="text-[10px] text-ink-muted">vs fixed schedule</span>
        </Card>
        <Card className="text-center p-3">
          <p className="text-xs text-ink-secondary mb-1">Sensor Water (B)</p>
          <p className="text-2xl font-bold font-mono text-primary-400">{simResult.B.totalWaterMm} mm</p>
          <span className="text-[10px] text-ink-muted">total applied</span>
        </Card>
        <Card className="text-center p-3">
          <p className="text-xs text-ink-secondary mb-1">Schedule Water (A)</p>
          <p className="text-2xl font-bold font-mono text-accent-400">{simResult.A.totalWaterMm} mm</p>
          <span className="text-[10px] text-ink-muted">every 2 days</span>
        </Card>
        <Card className="text-center p-3">
          <p className="text-xs text-ink-secondary mb-1">Plant Stress Days</p>
          <p className={`text-2xl font-bold font-mono ${simResult.B.stressDays > 0 ? 'text-warning' : 'text-success'}`}>
            {simResult.B.stressDays}
          </p>
          <span className="text-[10px] text-ink-muted">moisture &lt; 25%</span>
        </Card>
      </div>

      {/* Main Grid: Controls + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4 space-y-4">
            <h3 className="font-semibold text-sm text-ink-primary border-b border-line-subtle pb-2">
              Simulation Parameters
            </h3>

            {/* Soil Type */}
            <div>
              <label className="text-xs text-ink-secondary block mb-1">Soil Texture</label>
              <div className="grid grid-cols-3 gap-2">
                {['sand', 'loam', 'clay'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSoilType(st)}
                    className={`py-1.5 text-xs rounded-lg font-medium border capitalize transition-all ${
                      soilType === st
                        ? 'bg-primary-600 text-white border-primary-500 shadow-glow'
                        : 'bg-surface-raised text-ink-secondary border-line-subtle hover:bg-surface'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Sensor Threshold Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-ink-secondary">Watering Trigger (Sensor Threshold)</span>
                <span className="font-mono text-primary-400">{thresholdPct}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                value={thresholdPct}
                onChange={(e) => setThresholdPct(parseInt(e.target.value, 10))}
                className="w-full accent-primary-500 cursor-pointer"
              />
            </div>

            {/* Refill Target Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-ink-secondary">Refill Moisture Target</span>
                <span className="font-mono text-primary-400">{targetPct}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={targetPct}
                onChange={(e) => setTargetPct(parseInt(e.target.value, 10))}
                className="w-full accent-primary-500 cursor-pointer"
              />
            </div>

            {/* Weather Search */}
            <div className="pt-2 border-t border-line-subtle space-y-2">
              <label className="text-xs text-ink-secondary flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-info" />
                <span>Live Weather Grounding (Open-Meteo)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Nairobi, London..."
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFetchWeather()}
                  className="flex-1 bg-surface-raised border border-line-subtle rounded-lg px-3 py-1.5 text-xs text-ink-primary focus:outline-none focus:border-primary-400"
                />
                <Button size="sm" variant="secondary" onClick={handleFetchWeather} loading={weatherLoading}>
                  <Search className="w-3.5 h-3.5" />
                </Button>
              </div>
              {weatherNotice && <p className="text-[11px] text-info font-medium">{weatherNotice}</p>}
            </div>
          </Card>
        </div>

        {/* SVG Chart & Results */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-line-subtle pb-2">
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-primary-400 font-medium">
                  <span className="w-3 h-0.5 bg-primary-400 rounded"></span> Strategy B (Sensor)
                </span>
                <span className="flex items-center gap-1 text-accent-400 font-medium">
                  <span className="w-3 h-0.5 border-t border-dashed border-accent-400"></span> Strategy A (Fixed)
                </span>
                <span className="flex items-center gap-1 text-danger font-medium">
                  <span className="w-3 h-0.5 border-t border-dotted border-danger"></span> Stress Line (25%)
                </span>
              </div>
              <button
                onClick={() => setShowTable(!showTable)}
                className="text-xs text-ink-muted hover:text-ink-primary"
              >
                {showTable ? 'View Chart' : 'View Table'}
              </button>
            </div>

            {/* Custom SVG Line Chart */}
            {!showTable ? (
              <div className="w-full h-64 bg-bg-deep rounded-lg border border-line-subtle p-2 relative flex items-center justify-center">
                <svg viewBox="0 0 500 200" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#232D4A" strokeWidth="1" />
                  <line x1="40" y1="80" x2="480" y2="80" stroke="#232D4A" strokeWidth="1" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#232D4A" strokeWidth="1" />
                  <line x1="40" y1="180" x2="480" y2="180" stroke="#232D4A" strokeWidth="1" />

                  {/* Axis labels */}
                  <text x="15" y="25" fill="#8490B0" fontSize="10" fontFamily="monospace">100%</text>
                  <text x="20" y="85" fill="#8490B0" fontSize="10" fontFamily="monospace">60%</text>
                  <text x="20" y="145" fill="#8490B0" fontSize="10" fontFamily="monospace">25%</text>

                  {/* Stress Line (25%) */}
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#F87171" strokeWidth="1.5" strokeDasharray="3,3" />

                  {/* Strategy A (Fixed Schedule) Line */}
                  <polyline
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    points={simResult.A.moistureSeries
                      .map((val, idx) => {
                        const x = 40 + (idx / (days - 1)) * 440;
                        const y = 180 - (val / 100) * 160;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Strategy B (Sensor Rule) Line */}
                  <polyline
                    fill="none"
                    stroke="#4F8CFF"
                    strokeWidth="2.5"
                    points={simResult.B.moistureSeries
                      .map((val, idx) => {
                        const x = 40 + (idx / (days - 1)) * 440;
                        const y = 180 - (val / 100) * 160;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto font-mono text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-line-subtle text-ink-muted">
                      <th className="py-1">Day</th>
                      <th className="py-1">Rain</th>
                      <th className="py-1 text-accent-400">Moisture A</th>
                      <th className="py-1 text-primary-400">Moisture B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simResult.B.moistureSeries.map((bVal, i) => (
                      <tr key={i} className="border-b border-line-subtle/40 text-ink-secondary">
                        <td className="py-1">Day {i + 1}</td>
                        <td className="py-1">{rainEvents[i] || 0}mm</td>
                        <td className="py-1 text-accent-400">{simResult.A.moistureSeries[i]}%</td>
                        <td className="py-1 text-primary-400">{bVal}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* AI Results Interpretation */}
          <Card className="p-4 bg-primary-600/10 border-primary-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <h4 className="text-sm font-semibold text-ink-primary">AI Results Interpretation</h4>
              </div>
              <Button size="sm" onClick={handleInterpretResults} loading={interpreting}>
                Explain My Results
              </Button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="What was your prediction before this test? (Optional)"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                className="w-full bg-surface-raised border border-line-subtle rounded-lg px-3 py-1.5 text-xs text-ink-primary focus:outline-none focus:border-primary-400"
              />
            </div>

            {aiReport && (
              <div className="p-3 bg-surface rounded-lg border border-line-subtle text-xs space-y-2 animate-fadeIn">
                <p className="text-ink-primary leading-relaxed">{aiReport.explanation}</p>
                {aiReport.predictionFeedback && (
                  <p className="text-primary-400 font-medium">💡 {aiReport.predictionFeedback}</p>
                )}
                {aiReport.caveats?.length > 0 && (
                  <div className="text-ink-muted">
                    <span className="font-semibold text-warning">Notice:</span> {aiReport.caveats[0]}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
