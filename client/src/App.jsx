import React, { useState, useEffect } from 'react';
import { InteractiveTutorView } from './features/tutor/InteractiveTutorView';
import { HomeView } from './features/home/HomeView';
import { ProfileModal } from './components/profile/ProfileModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { apiClient } from './lib/apiClient';
import {
  Sparkles,
  Volume2,
  Trash2,
  Lightbulb,
  Home,
  MessageCircle,
  Settings,
  User,
} from 'lucide-react';

const INITIAL_SESSIONS = [
  {
    id: 'demo-volcano',
    title: 'Baking Soda & Vinegar Eruption',
    date: new Date(Date.now() - 3600000).toISOString(),
    query: 'How do baking soda and vinegar react to make a volcano?',
    gradeBand: 'primary',
    avatar: '🌋',
    whatWeLearned: 'Acid (vinegar) and base (baking soda) react to produce carbon dioxide gas that creates fizzy foam!',
    response: {
      speechGreeting: 'Aree waah! That is one of my favorite science experiments in the world!',
      explanation: 'When baking soda (a base) meets vinegar (an acid), they react instantly to form water and tons of carbon dioxide gas bubbles! Those bubbles rush upwards just like real magma!',
      stemConcepts: [
        { name: 'Chemical Reaction', simpleWhy: 'Acid and base exchange atoms to create new molecules' },
        { name: 'Gas Expansion', simpleWhy: 'CO₂ bubbles expand rapidly to push foam out of the container' },
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
        safetyTip: 'Vinegar has a sharp smell — keep your face back and have an adult nearby!',
      },
    },
  },
];

export default function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'chat'
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [profile, setProfile] = useLocalStorage('curioforge:v1:profile', {
    nickname: 'Leo',
    avatar: '🚀',
    gradeBand: 'primary',
    gradeNumber: 3,
    language: 'en-US',
    speechRate: 0.85,
    speechPitch: 1.1,
    autoSpeak: true,
    favoriteTheme: 'chemistry',
    stars: 3,
  });

  const [sessions, setSessions] = useLocalStorage('curioforge:v1:sessions', INITIAL_SESSIONS);
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    apiClient
      .checkHealth()
      .then((data) => setHealthStatus(data))
      .catch(() => setHealthStatus({ status: 'offline', geminiConfigured: false }));
  }, []);

  const handleSaveSession = (savedSession) => {
    setSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === savedSession.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = savedSession;
        return copy;
      }
      return [savedSession, ...prev].slice(0, 30);
    });
    setCurrentSession(savedSession);
  };

  const handleStartFromHome = (query) => {
    setCurrentSession(null);
    setActiveTab('chat');
    // Pass query to tutor view via URL-like state
    if (query) {
      window._pendingQuery = query;
    }
  };

  const handleDeleteSession = (e, id) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSession?.id === id) setCurrentSession(null);
  };

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = now - d;
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (_) { return 'Recently'; }
  };

  const gradeLabel = (band, num) => {
    if (num) return `Grade ${num}`;
    const map = { kindergarten: 'KG', primary: 'Primary', '6-8': 'Middle', '9-12': 'High School' };
    return map[band] || 'Primary';
  };

  const geminiOk = healthStatus?.geminiConfigured;

  return (
    <div className="h-screen flex flex-col bg-curio-bg text-curio-text font-sans select-none overflow-hidden">

      {/* ══════════════════════════════════════════════════
          TITLEBAR — macOS-style white bar
      ══════════════════════════════════════════════════ */}
      <header
        className="titlebar-drag flex items-center px-4 border-b border-curio-border bg-white/90 backdrop-blur-md"
        style={{ height: 'var(--titlebar-height)', WebkitAppRegion: 'drag' }}
      >
        {/* Traffic lights placeholder (Electron adds real ones) */}
        <div className="titlebar-no-drag flex items-center gap-1.5 mr-6" style={{ WebkitAppRegion: 'no-drag' }}>
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>

        {/* Wordmark */}
        <div className="flex items-center gap-2 mr-auto">
          <div className="w-6 h-6 rounded-lg bg-curio-blue flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-curio-text tracking-tight">Curioforge</span>
        </div>

        {/* Centre tab switcher */}
        <div
          className="titlebar-no-drag absolute left-1/2 -translate-x-1/2 flex items-center bg-curio-bg-alt rounded-full p-0.5 gap-0.5"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-white text-curio-text shadow-sm shadow-black/10'
                : 'text-curio-text-secondary hover:text-curio-text'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-white text-curio-text shadow-sm shadow-black/10'
                : 'text-curio-text-secondary hover:text-curio-text'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Chat &amp; Voice
          </button>
        </div>

        {/* Right side — Sound + Profile */}
        <div
          className="titlebar-no-drag flex items-center gap-3 ml-auto"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          {/* Gemini status dot */}
          {healthStatus && (
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${geminiOk ? 'bg-curio-green' : 'bg-curio-orange'}`} />
              <span className="text-xs text-curio-text-muted hidden sm:block">
                {geminiOk ? 'AI Ready' : 'Offline'}
              </span>
            </div>
          )}

          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-curio-bg-alt transition-colors text-curio-text-secondary hover:text-curio-text"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="text-xs font-medium hidden sm:block">{isSoundOn ? 'Sound on' : 'Muted'}</span>
          </button>

          {/* Profile avatar pill */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 hover:bg-curio-bg-alt rounded-full px-2 py-1 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-curio-blue-light flex items-center justify-center text-xs font-bold text-curio-blue">
              {profile.nickname?.[0]?.toUpperCase() || 'L'}
            </div>
            <span className="text-sm font-medium text-curio-text hidden sm:block">{profile.nickname}</span>
            <div className="w-7 h-7 rounded-full bg-curio-bg-alt border border-curio-border flex items-center justify-center">
              <User className="w-4 h-4 text-curio-text-secondary" />
            </div>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR: session history (only on chat tab) ── */}
        {activeTab === 'chat' && (
          <aside className="w-64 flex-shrink-0 border-r border-curio-border bg-curio-bg flex flex-col">
            <div className="p-3 border-b border-curio-border">
              <p className="text-xs font-semibold text-curio-text-muted uppercase tracking-wider px-1 mb-2">
                Recent Sessions
              </p>
              <button
                onClick={() => setCurrentSession(null)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-curio-blue text-white text-sm font-medium hover:bg-curio-blue-hover transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                New conversation
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {sessions.length === 0 ? (
                <div className="p-6 text-center text-curio-text-muted">
                  <p className="text-2xl mb-2">🌱</p>
                  <p className="text-xs">No sessions yet. Ask your first question!</p>
                </div>
              ) : (
                sessions.map((sess) => {
                  const isSelected = currentSession?.id === sess.id;
                  return (
                    <div
                      key={sess.id}
                      onClick={() => setCurrentSession(sess)}
                      className={`p-3 rounded-xl cursor-pointer transition-all group relative ${
                        isSelected
                          ? 'bg-curio-blue-light border border-curio-blue/30'
                          : 'hover:bg-curio-bg-alt border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-2 pr-5">
                        <span className="text-base flex-shrink-0 mt-0.5">{sess.avatar || '🔬'}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold line-clamp-2 leading-snug ${isSelected ? 'text-curio-blue' : 'text-curio-text'}`}>
                            {sess.title || sess.query}
                          </p>
                          {sess.whatWeLearned && (
                            <div className="mt-1.5 flex items-start gap-1">
                              <Lightbulb className="w-3 h-3 text-curio-orange flex-shrink-0 mt-0.5" />
                              <p className="text-[10px] text-curio-text-muted line-clamp-2 leading-relaxed">
                                {sess.whatWeLearned}
                              </p>
                            </div>
                          )}
                          <p className="text-[10px] text-curio-text-muted mt-1">{formatDate(sess.date)}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(e, sess.id)}
                        className="absolute top-2.5 right-2 opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-red-100 text-curio-text-muted hover:text-curio-red transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {sessions.length > 0 && (
              <div className="p-2 border-t border-curio-border">
                <button
                  onClick={() => { setSessions([]); setCurrentSession(null); }}
                  className="w-full text-[11px] text-curio-text-muted hover:text-curio-red transition-colors py-1"
                >
                  Clear all history
                </button>
              </div>
            )}
          </aside>
        )}

        {/* ── MAIN STAGE ── */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'home' ? (
            <HomeView
              profile={profile}
              sessions={sessions}
              onStartChat={handleStartFromHome}
              onResumeSession={(sess) => { setCurrentSession(sess); setActiveTab('chat'); }}
            />
          ) : (
            <InteractiveTutorView
              currentSession={currentSession}
              onSaveSession={handleSaveSession}
              profile={profile}
              onStartNew={() => setCurrentSession(null)}
              isSoundOn={isSoundOn}
            />
          )}
        </main>
      </div>

      {/* Footer bar */}
      <footer className="h-7 border-t border-curio-border bg-curio-bg flex items-center justify-between px-4">
        <span className="text-[10px] text-curio-text-muted">Curioforge • Designed for curious minds</span>
        <span className="text-[10px] text-curio-text-muted">Quiet Studio Mode</span>
      </footer>

      {/* Settings / Profile Modal */}
      <ProfileModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={(newProf) => setProfile(newProf)}
        onClearHistory={() => { setSessions([]); setCurrentSession(null); }}
      />
    </div>
  );
}
