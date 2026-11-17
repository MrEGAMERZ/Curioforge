import React, { useState, useEffect } from 'react';
import { InteractiveTutorView } from './features/tutor/InteractiveTutorView';
import { ProfileModal } from './components/profile/ProfileModal';
import { Badge } from './components/ui/Misc';
import { useLocalStorage } from './hooks/useLocalStorage';
import { apiClient } from './lib/apiClient';
import {
  Sparkles,
  History,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Mic,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  const [healthStatus, setHealthStatus] = useState(null);

  // Profile State (Personalization / Account)
  const [profile, setProfile] = useLocalStorage('curioforge:v1:profile', {
    nickname: 'Aarav',
    avatar: '🚀',
    gradeBand: 'primary',
    language: 'en-US',
    speechRate: 1.0,
    speechPitch: 1.1,
    autoSpeak: true,
    favoriteTheme: 'chemistry',
    stars: 3,
  });

  // Session History State ("What We Learned")
  const [sessions, setSessions] = useLocalStorage('curioforge:v1:sessions', [
    {
      id: 'demo-volcano',
      title: 'Baking Soda & Vinegar Eruption',
      date: new Date(Date.now() - 3600000).toISOString(),
      query: 'How do baking soda and vinegar react to make a volcano?',
      gradeBand: 'primary',
      avatar: '🌋',
      whatWeLearned: 'Acid (vinegar) and base (baking soda) react to produce carbon dioxide gas bubbles that expand and foam!',
      response: {
        speechGreeting: 'Aree waah! That is one of my favorite science experiments in the world!',
        explanation: 'When baking soda (a base) meets vinegar (an acid), they react instantly to form water and tons of carbon dioxide gas bubbles! Those bubbles rush upwards just like real magma!',
        stemConcepts: [
          { name: 'Chemical Reaction', simpleWhy: 'Acid and base exchange atoms to create new molecules' },
          { name: 'Gas Expansion', simpleWhy: 'CO2 bubbles expand rapidly to push foam out of the container' },
        ],
        interactiveSimulationType: 'volcano_reaction',
        simulationParameters: {
          title: 'Fizzy Vinegar & Baking Soda Volcano Lab',
          promptQuestion: 'What happens if you increase the amount of vinegar?',
        },
        householdActivity: {
          title: 'Kitchen Magma Lab',
          materials: ['Baking soda (2 spoons)', 'Vinegar or lemon juice', 'A cup or bottle', 'Tray for spills'],
          steps: [
            'Place your cup right in the center of the tray.',
            'Drop in 2 big spoons of baking soda.',
            'Pour in vinegar slowly and watch the bubbling lava rise!',
          ],
          safetyTip: 'Vinegar has a sharp smell and can sting eyes — keep your distance and have an adult watch!',
        },
      },
    },
  ]);

  const [currentSession, setCurrentSession] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    apiClient
      .checkHealth()
      .then((data) => setHealthStatus(data))
      .catch((err) => {
        console.warn('Health check failed:', err);
        setHealthStatus({ status: 'offline', geminiConfigured: false });
      });
  }, []);

  const handleSaveSession = (savedSession) => {
    setSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === savedSession.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = savedSession;
        return copy;
      }
      return [savedSession, ...prev].slice(0, 30); // Keep last 30 explorations
    });
    setCurrentSession(savedSession);
  };

  const handleStartNewSession = () => {
    setCurrentSession(null);
  };

  const handleDeleteSession = (e, id) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSession?.id === id) {
      setCurrentSession(null);
    }
  };

  const handleClearAllHistory = () => {
    setSessions([]);
    setCurrentSession(null);
  };

  // Format date helper
  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (_) {
      return 'Recently';
    }
  };

  const gradeLabels = {
    kindergarten: 'Ages 4–5',
    primary: 'Grade 1–5',
    '6-8': 'Grade 6–8',
    '9-12': 'Grade 9–12',
  };

  return (
    <div className="min-h-screen bg-bg-deep text-ink-primary flex flex-col font-sans select-none">
      {/* Native macOS Style Top Titlebar Header */}
      <header className="h-14 bg-surface/90 border-b border-line-subtle sticky top-0 z-40 backdrop-blur-md px-4 flex items-center justify-between">
        {/* Left: macOS Window Traffic Lights + Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 pr-2">
            <span className="w-3 h-3 rounded-full bg-danger/80 inline-block border border-danger/40"></span>
            <span className="w-3 h-3 rounded-full bg-warning/80 inline-block border border-warning/40"></span>
            <span className="w-3 h-3 rounded-full bg-success/80 inline-block border border-success/40"></span>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleStartNewSession}
            title="Return to Voice Dashboard"
          >
            <span className="font-extrabold font-display tracking-tight text-base text-ink-primary">
              CURIO<span className="text-transparent bg-clip-text bg-gradient-brand">FORGE</span>
            </span>
            <Badge tone="purple" className="hidden sm:inline-flex">
              STEM Voice Companion
            </Badge>
          </div>
        </div>

        {/* Right: Student Profile Pill & Settings Action */}
        <div className="flex items-center gap-2.5">
          {/* AI Connection Status */}
          <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 bg-surface-raised rounded-full border border-line-subtle">
            {healthStatus?.geminiConfigured ? (
              <span className="text-success font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Gemini 2.0 Live</span>
              </span>
            ) : (
              <span className="text-accent-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Interactive STEM Mode</span>
              </span>
            )}
          </div>

          {/* Account / Personalization Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-raised hover:bg-surface border border-line-subtle hover:border-primary-500/50 rounded-xl text-xs text-ink-primary transition-all shadow-sm group"
            title="Open Account & Personalization Settings"
          >
            <span className="text-base">{profile.avatar || '🚀'}</span>
            <div className="text-left hidden sm:block">
              <span className="font-bold text-ink-primary block leading-none">
                {profile.nickname || 'Explorer'}
              </span>
              <span className="text-[10px] text-ink-muted leading-tight">
                {gradeLabels[profile.gradeBand] || 'Primary'}
              </span>
            </div>
            <Settings className="w-4 h-4 text-ink-muted group-hover:text-primary-400 transition-colors ml-0.5" />
          </button>
        </div>
      </header>

      {/* Main 2-Column Dashboard Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: "What We Learned" / Session History */}
        <aside className="w-full md:w-80 lg:w-96 bg-surface-raised/40 border-r border-line-subtle flex flex-col flex-shrink-0 h-[360px] md:h-auto overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-line-subtle flex items-center justify-between bg-surface/50">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-400" />
              <h2 className="font-bold text-sm text-ink-primary font-display">
                What We Learned
              </h2>
              {sessions.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary-600/30 text-primary-300 text-[10px] font-bold">
                  {sessions.length}
                </span>
              )}
            </div>

            {/* Start New Curiosity Button */}
            <button
              onClick={handleStartNewSession}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                currentSession === null
                  ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-glow'
                  : 'bg-surface-raised hover:bg-surface border border-line-subtle text-ink-secondary hover:text-ink-primary'
              }`}
              title="Start a new voice conversation"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Adventure</span>
            </button>
          </div>

          {/* Past Sessions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {sessions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-ink-muted">
                <div className="w-12 h-12 rounded-2xl bg-surface-raised flex items-center justify-center text-xl">
                  🌱
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-primary">No explorations yet!</p>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    Tap the microphone and ask your first science question.
                  </p>
                </div>
              </div>
            ) : (
              sessions.map((sess) => {
                const isSelected = currentSession?.id === sess.id;
                return (
                  <div
                    key={sess.id}
                    onClick={() => setCurrentSession(sess)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all relative group ${
                      isSelected
                        ? 'bg-primary-600/20 border-primary-500 shadow-glow'
                        : 'bg-surface border-line-subtle hover:bg-surface-raised hover:border-line-strong'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 pr-6">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{sess.avatar || '🔬'}</span>
                          <h4 className="text-xs font-bold text-ink-primary line-clamp-1 leading-snug">
                            {sess.title || sess.query}
                          </h4>
                        </div>

                        {/* What we learned summary badge */}
                        {sess.whatWeLearned && (
                          <div className="p-2 rounded-lg bg-surface-raised/70 border border-line-subtle/80 flex items-start gap-1.5 mt-1">
                            <Lightbulb className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-ink-secondary line-clamp-2 leading-relaxed">
                              {sess.whatWeLearned}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1 text-[10px] text-ink-muted">
                          <span>{formatDate(sess.date)}</span>
                          <span>•</span>
                          <span className="capitalize">{gradeLabels[sess.gradeBand] || 'Primary'}</span>
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDeleteSession(e, sess.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-ink-muted hover:text-danger rounded-md hover:bg-surface transition-all absolute top-3 right-3"
                        title="Delete exploration"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* History Footer */}
          {sessions.length > 0 && (
            <div className="p-2.5 border-t border-line-subtle bg-surface/30 text-center">
              <button
                onClick={handleClearAllHistory}
                className="text-[11px] text-ink-muted hover:text-danger transition-colors underline"
              >
                Clear all history
              </button>
            </div>
          )}
        </aside>

        {/* Right Main Stage: Live Voice Platform & Real-Time Tutor */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <InteractiveTutorView
            currentSession={currentSession}
            onSaveSession={handleSaveSession}
            profile={profile}
            onStartNew={handleStartNewSession}
          />
        </main>
      </div>

      {/* Account & Personalization Settings Modal */}
      <ProfileModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={(newProf) => setProfile(newProf)}
        onClearHistory={handleClearAllHistory}
      />
    </div>
  );
}