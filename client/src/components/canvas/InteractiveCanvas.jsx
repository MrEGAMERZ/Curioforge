import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Misc';
import { ThreeDLabCanvas } from './ThreeDLabCanvas';
import { Play, RotateCcw, Volume2, Sparkles, Box, Layers } from 'lucide-react';

export function InteractiveCanvas({
  type = 'volcano_reaction',
  title = 'Interactive Science Lab',
  promptQuestion = 'What do you think will happen?',
  onPredict,
}) {
  const [viewMode, setViewMode] = useState('3d'); // '3d' | '2d'
  const canvasRef = useRef(null);
  const [sliderVal, setSliderVal] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [predictionMade, setPredictionMade] = useState(false);
  const [predictionChoice, setPredictionChoice] = useState('');
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  const playBubbleSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + Math.random() * 400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700 + Math.random() * 300, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (_) {}
  };

  useEffect(() => {
    if (viewMode !== '2d') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (type === 'volcano_reaction' || type === 'custom_canvas') {
        // Mountain / Crater
        ctx.fillStyle = '#1A2440';
        ctx.beginPath();
        ctx.moveTo(80, height);
        ctx.lineTo(170, 140);
        ctx.lineTo(230, 140);
        ctx.lineTo(320, height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0D1322';
        ctx.beginPath();
        ctx.ellipse(200, 140, 30, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(200, 142, 22, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        if (isPlaying) {
          for (let i = 0; i < sliderVal * 2; i++) {
            particlesRef.current.push({
              x: 200 + (Math.random() - 0.5) * 40,
              y: 138,
              vx: (Math.random() - 0.5) * (sliderVal * 1.5),
              vy: -(Math.random() * 4 + sliderVal * 1.8),
              size: Math.random() * 6 + 4,
              color: Math.random() > 0.4 ? '#F87171' : '#FBBF24',
              alpha: 1,
            });
          }

          if (Math.random() > 0.6) playBubbleSound();
        }

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08;
          p.alpha -= 0.015;

          if (p.alpha <= 0 || p.y > height) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.fillStyle = '#EAEEF9';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('Baking Soda + Vinegar Volcano', 20, 30);
      } else {
        ctx.fillStyle = '#34416A';
        ctx.fillRect(0, 80, width, height - 80);

        const waterHeight = (sliderVal / 5) * (height - 90);
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(0, height - waterHeight, width, waterHeight);

        ctx.fillStyle = '#34D399';
        ctx.font = '12px Inter';
        ctx.fillText(`Soil Moisture: ${sliderVal * 20}%`, 20, 40);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [type, isPlaying, sliderVal, viewMode]);

  const handleTrigger = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 4000);
  };

  return (
    <div className="space-y-2">
      {/* View Mode Toggle: 3D vs 2D */}
      <div className="flex items-center justify-end gap-1.5 px-1">
        <button
          onClick={() => setViewMode('3d')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            viewMode === '3d'
              ? 'bg-primary-600 text-white shadow-glow'
              : 'bg-surface-raised text-ink-muted hover:text-ink-primary border border-line-subtle'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Lab View</span>
        </button>

        <button
          onClick={() => setViewMode('2d')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            viewMode === '2d'
              ? 'bg-primary-600 text-white shadow-glow'
              : 'bg-surface-raised text-ink-muted hover:text-ink-primary border border-line-subtle'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2D View</span>
        </button>
      </div>

      {viewMode === '3d' ? (
        <ThreeDLabCanvas type={type} title={title} promptQuestion={promptQuestion} />
      ) : (
        <Card className="overflow-hidden border-primary-500/30 bg-surface/90 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-line-subtle mb-3">
            <div className="flex items-center gap-2">
              <Badge tone="purple" icon={<Sparkles className="w-3.5 h-3.5" />}>
                Interactive 2D Living Canvas
              </Badge>
              <h3 className="font-semibold text-ink-primary text-sm">{title}</h3>
            </div>
            <Badge tone="info">2D Particle Mode</Badge>
          </div>

          {/* Socratic Challenge */}
          {!predictionMade && (
            <div className="mb-3 p-3 bg-primary-600/15 border border-primary-500/30 rounded-lg">
              <p className="text-xs font-semibold text-primary-400 mb-2">🤔 Socratic Challenge: {promptQuestion}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setPredictionChoice('Huge eruption of CO2 foam');
                    setPredictionMade(true);
                  }}
                  className="text-xs px-3 py-1 bg-surface-raised hover:bg-surface border border-line-strong rounded-md text-ink-primary"
                >
                  🚀 Big fizzy eruption!
                </button>
                <button
                  onClick={() => {
                    setPredictionChoice('Nothing happens');
                    setPredictionMade(true);
                  }}
                  className="text-xs px-3 py-1 bg-surface-raised hover:bg-surface border border-line-strong rounded-md text-ink-primary"
                >
                  😴 It stays quiet
                </button>
              </div>
            </div>
          )}

          {/* Canvas Viewport */}
          <div className="relative rounded-lg overflow-hidden bg-bg-deep border border-line-subtle flex justify-center">
            <canvas ref={canvasRef} width={400} height={220} className="w-full max-w-md h-auto block" />
          </div>

          {/* Controls */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink-secondary">Setting:</label>
              <input
                type="range"
                min="1"
                max="5"
                value={sliderVal}
                onChange={(e) => setSliderVal(parseInt(e.target.value, 10))}
                className="w-28 accent-primary-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-ink-primary font-medium">{sliderVal} spoons</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTrigger}
                disabled={isPlaying}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium rounded-lg shadow-glow active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPlaying ? 'Reacting...' : 'Pour & React!'}</span>
              </button>
              <button
                onClick={() => {
                  particlesRef.current = [];
                  setIsPlaying(false);
                  setPredictionMade(false);
                }}
                className="p-2 text-ink-muted hover:text-ink-primary bg-surface-raised border border-line-subtle rounded-lg text-xs"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}