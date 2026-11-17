import React, { useState, useEffect } from 'react';
import { InteractiveTutorView } from './features/tutor/InteractiveTutorView';
import { SoilMoistureLab } from './features/lab/SoilMoistureLab';
import { BlueprintViewer } from './features/blueprint/BlueprintViewer';
import { Card } from './components/ui/Card';
import { Badge } from './components/ui/Misc';
import { apiClient } from './lib/apiClient';
import { Sparkles, FlaskConical, FileText, CheckCircle2, AlertCircle, Laptop } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('tutor'); // 'tutor' | 'lab' | 'blueprint' | 'status'
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    apiClient.checkHealth()
      .then((data) => setHealthStatus(data))
      .catch((err) => {
        console.warn('Health check failed:', err);
        setHealthStatus({ status: 'offline', geminiConfigured: false });
      });
  }, []);

  return (
    <div className="min-h-screen bg-bg-deep text-ink-primary flex flex-col">
      {/* macOS Native Titlebar Style Header */}
      <header className="h-14 bg-surface/80 border-b border-line-subtle sticky top-0 z-50 backdrop-blur-md px-4 flex items-center justify-between select-none">
        {/* Left: macOS window indicator + Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 pr-2">
            <span className="w-3 h-3 rounded-full bg-danger/80 inline-block border border-danger/40"></span>
            <span className="w-3 h-3 rounded-full bg-warning/80 inline-block border border-warning/40"></span>
            <span className="w-3 h-3 rounded-full bg-success/80 inline-block border border-success/40"></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold font-display tracking-tight text-base text-ink-primary">
              CURIO<span className="text-transparent bg-clip-text bg-gradient-brand">FORGE</span>
            </span>
            <Badge tone="purple" className="hidden sm:inline-flex">macOS App</Badge>
          </div>
        </div>

        {/* Center: Tabs */}
        <nav className="flex items-center bg-surface-raised p-1 rounded-lg border border-line-subtle gap-1">
          <button
            onClick={() => setActiveTab('tutor')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'tutor'
                ? 'bg-primary-600 text-white shadow-glow'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Voice Tutor</span>
          </button>

          <button
            onClick={() => setActiveTab('lab')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'lab'
                ? 'bg-primary-600 text-white shadow-glow'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>STEM Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'blueprint'
                ? 'bg-primary-600 text-white shadow-glow'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Blueprint</span>
          </button>
        </nav>

        {/* Right: Health / Model indicator */}
        <div className="flex items-center gap-2 text-xs">
          {healthStatus?.geminiConfigured ? (
            <span className="flex items-center gap-1.5 text-success font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Gemini Live</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-warning font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Demo Mode</span>
            </span>
          )}
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'tutor' && <InteractiveTutorView />}
        {activeTab === 'lab' && <SoilMoistureLab />}
        {activeTab === 'blueprint' && (
          <BlueprintViewer onOpenLab={() => setActiveTab('lab')} />
        )}
      </main>

      {/* macOS Footbar */}
      <footer className="py-3 px-6 border-t border-line-subtle bg-bg-base/60 text-center text-xs text-ink-muted flex flex-wrap items-center justify-between gap-2">
        <span>CURIOFORGE — Turning Curiosity into Invention</span>
        <div className="flex items-center gap-2">
          <span>Target: Primary & Youth (Grades 2–12)</span>
          <span>•</span>
          <span>Multilingual Voice & Living Canvas</span>
        </div>
      </footer>
    </div>
  );
}
