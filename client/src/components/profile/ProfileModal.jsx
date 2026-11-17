import React, { useState } from 'react';
import { useSpeechOutput } from '../../hooks/useSpeechOutput';
import {
  User,
  X,
  Volume2,
  ShieldCheck,
  Check,
  GraduationCap,
  Trash2,
  Mic,
} from 'lucide-react';

const AVATARS = [
  { emoji: '🚀', label: 'Space Explorer' },
  { emoji: '🦖', label: 'Dino Scientist' },
  { emoji: '🧪', label: 'Chemistry Wizard' },
  { emoji: '🌱', label: 'Nature Ranger' },
  { emoji: '🤖', label: 'Robot Builder' },
  { emoji: '⭐', label: 'Star Astronomer' },
  { emoji: '🦋', label: 'Bio Explorer' },
  { emoji: '🔭', label: 'Astronomer' },
];

const GRADE_OPTIONS = [
  { id: 'kindergarten', label: '🧸 Kindergarten', desc: 'Ages 4–5 · Big ideas, simple words', numbers: [] },
  { id: 'primary', label: '🎒 Primary School', desc: 'Ages 6–10 · Curious hands-on experiments', numbers: [1, 2, 3, 4, 5] },
  { id: '6-8', label: '📚 Middle School', desc: 'Ages 11–13 · Real STEM terms', numbers: [6, 7, 8] },
  { id: '9-12', label: '🔬 High School', desc: 'Ages 14–18 · Deep science principles', numbers: [9, 10, 11, 12] },
];

const LANGUAGES = [
  { code: 'en-US', label: '🇺🇸 English (US)' },
  { code: 'en-IN', label: '🇮🇳 English (India)' },
  { code: 'hi-IN', label: '🇮🇳 Hindi' },
  { code: 'es-ES', label: '🇪🇸 Spanish' },
  { code: 'fr-FR', label: '🇫🇷 French' },
  { code: 'de-DE', label: '🇩🇪 German' },
  { code: 'ar-SA', label: '🇸🇦 Arabic' },
  { code: 'zh-CN', label: '🇨🇳 Chinese' },
];

export function ProfileModal({ isOpen, onClose, profile, onSaveProfile, onClearHistory }) {
  const [nickname, setNickname] = useState(profile?.nickname || 'Leo');
  const [avatar, setAvatar] = useState(profile?.avatar || '🚀');
  const [gradeBand, setGradeBand] = useState(profile?.gradeBand || 'primary');
  const [gradeNumber, setGradeNumber] = useState(profile?.gradeNumber || 3);
  const [language, setLanguage] = useState(profile?.language || 'en-US');
  const [speechRate, setSpeechRate] = useState(profile?.speechRate || 0.85);
  const [autoSpeak, setAutoSpeak] = useState(profile?.autoSpeak !== false);
  const [activeTab, setActiveTab] = useState('account');

  const { speak, stop } = useSpeechOutput();

  if (!isOpen) return null;

  const selectedGrade = GRADE_OPTIONS.find((g) => g.id === gradeBand);

  const handleTestVoice = () => {
    stop();
    const testLines = {
      'en-US': `Hey ${nickname || 'Explorer'}! I'm your Curioforge guide. What shall we discover today?`,
      'en-IN': `Namaste ${nickname || 'Explorer'}! I'm your Curioforge science buddy!`,
      'hi-IN': `नमस्ते ${nickname || 'दोस्त'}! मैं आपका विज्ञान मित्र हूँ।`,
      'es-ES': `¡Hola ${nickname || 'amigo'}! ¡Soy tu guía de Curioforge!`,
      'fr-FR': `Salut ${nickname || 'ami'}! Je suis ton guide Curioforge!`,
      'de-DE': `Hallo ${nickname || 'Freund'}! Ich bin dein Curioforge-Tutor!`,
    };
    speak(testLines[language] || testLines['en-US'], {
      lang: language,
      rate: speechRate,
      pitch: 1.1,
    });
  };

  const handleSave = () => {
    stop();
    onSaveProfile({
      ...profile,
      nickname: nickname.trim() || 'Explorer',
      avatar,
      gradeBand,
      gradeNumber,
      language,
      speechRate,
      autoSpeak,
    });
    onClose();
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'voice', label: 'Voice & Language', icon: Volume2 },
    { id: 'safety', label: 'Privacy', icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-curio-border shadow-elevated flex flex-col max-h-[88vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-curio-border">
          <div>
            <h2 className="text-lg font-bold text-curio-text">Settings & Profile</h2>
            <p className="text-xs text-curio-text-muted">Personalize your learning experience</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-curio-bg-alt flex items-center justify-center hover:bg-red-50 hover:text-curio-red text-curio-text-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-curio-border px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
                  activeTab === tab.id
                    ? 'border-curio-blue text-curio-blue'
                    : 'border-transparent text-curio-text-muted hover:text-curio-text'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── Account Tab ── */}
          {activeTab === 'account' && (
            <>
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-curio-blue-light flex items-center justify-center text-3xl border-2 border-curio-blue/20">
                    {avatar}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-curio-text-muted uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={20}
                    placeholder="What should we call you?"
                    className="w-full px-3.5 py-2.5 bg-curio-bg-alt border border-curio-border rounded-xl text-sm text-curio-text placeholder-curio-text-muted focus:outline-none focus:border-curio-blue focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Avatar picker */}
              <div>
                <label className="block text-xs font-semibold text-curio-text-muted uppercase tracking-wider mb-2">
                  Choose Your Avatar
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATARS.map((a) => (
                    <button
                      key={a.emoji}
                      onClick={() => setAvatar(a.emoji)}
                      className={`p-3 rounded-2xl border text-2xl transition-all hover:scale-105 ${
                        avatar === a.emoji
                          ? 'border-curio-blue bg-curio-blue-light ring-2 ring-curio-blue ring-offset-1'
                          : 'border-curio-border bg-curio-bg-alt hover:border-curio-blue/50'
                      }`}
                      title={a.label}
                    >
                      {a.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade level */}
              <div>
                <label className="block text-xs font-semibold text-curio-text-muted uppercase tracking-wider mb-2">
                  <GraduationCap className="inline w-3.5 h-3.5 mr-1" />
                  Grade Level
                </label>
                <div className="space-y-2">
                  {GRADE_OPTIONS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => { setGradeBand(g.id); if (g.numbers[0]) setGradeNumber(g.numbers[0]); }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        gradeBand === g.id
                          ? 'border-curio-blue bg-curio-blue-light'
                          : 'border-curio-border bg-curio-bg-alt hover:border-curio-blue/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-curio-text">{g.label}</p>
                          <p className="text-xs text-curio-text-muted mt-0.5">{g.desc}</p>
                        </div>
                        {gradeBand === g.id && <Check className="w-4 h-4 text-curio-blue flex-shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Grade number picker */}
                {selectedGrade?.numbers?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-curio-text-muted mb-2">Specific grade:</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedGrade.numbers.map((n) => (
                        <button
                          key={n}
                          onClick={() => setGradeNumber(n)}
                          className={`w-10 h-10 rounded-xl border text-sm font-semibold transition-all ${
                            gradeNumber === n
                              ? 'bg-curio-blue text-white border-curio-blue'
                              : 'bg-curio-bg-alt border-curio-border text-curio-text hover:border-curio-blue'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Danger zone */}
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-xs font-semibold text-curio-red mb-2">Clear History</p>
                <p className="text-xs text-curio-text-muted mb-3">This removes all your learning sessions. Can't be undone.</p>
                <button
                  onClick={() => { if (confirm('Clear all history?')) { onClearHistory(); onClose(); } }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-red-200 rounded-xl text-xs text-curio-red font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear all sessions
                </button>
              </div>
            </>
          )}

          {/* ── Voice & Language Tab ── */}
          {activeTab === 'voice' && (
            <>
              {/* Language */}
              <div>
                <label className="block text-xs font-semibold text-curio-text-muted uppercase tracking-wider mb-2">
                  Language & Region
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`p-3 rounded-2xl border text-left text-sm transition-all ${
                        language === l.code
                          ? 'border-curio-blue bg-curio-blue-light text-curio-blue font-medium'
                          : 'border-curio-border bg-curio-bg-alt text-curio-text-secondary hover:border-curio-blue/40'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speech rate */}
              <div>
                <label className="block text-xs font-semibold text-curio-text-muted uppercase tracking-wider mb-2">
                  Speaking Speed: <span className="text-curio-blue font-bold">{speechRate}x</span>
                </label>
                <input
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full accent-curio-blue"
                />
                <div className="flex justify-between text-[11px] text-curio-text-muted mt-1">
                  <span>Slow (0.6x)</span>
                  <span>Normal (1.0x)</span>
                  <span>Fast (1.4x)</span>
                </div>
              </div>

              {/* Auto-speak toggle */}
              <div className="flex items-center justify-between p-4 bg-curio-bg-alt rounded-2xl border border-curio-border">
                <div>
                  <p className="text-sm font-semibold text-curio-text">Auto-speak responses</p>
                  <p className="text-xs text-curio-text-muted">Read answers aloud automatically</p>
                </div>
                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${autoSpeak ? 'bg-curio-blue' : 'bg-curio-border'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${autoSpeak ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Test voice */}
              <button
                onClick={handleTestVoice}
                className="w-full flex items-center justify-center gap-2 py-3 bg-curio-bg-alt border border-curio-border rounded-2xl text-sm font-medium text-curio-text hover:border-curio-blue hover:bg-curio-blue-light hover:text-curio-blue transition-all"
              >
                <Mic className="w-4 h-4" />
                Test voice settings
              </button>
            </>
          )}

          {/* ── Privacy Tab ── */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              {[
                { icon: '🔒', title: 'Kid-Safe Mode', desc: 'Filters out any unsafe content automatically. Always on.', on: true },
                { icon: '🌐', title: 'No External Links', desc: 'All answers stay within Curioforge. No outside websites.', on: true },
                { icon: '📵', title: 'No Personal Data Shared', desc: 'Your questions never leave your device (local mode).', on: true },
                { icon: '🎙️', title: 'Voice stays local', desc: 'Audio is processed locally and never uploaded.', on: true },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 bg-green-50 border border-green-100 rounded-2xl">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-curio-text">{item.title}</p>
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">Active</span>
                    </div>
                    <p className="text-xs text-curio-text-muted">{item.desc}</p>
                  </div>
                  <Check className="w-5 h-5 text-curio-green flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 px-6 py-4 border-t border-curio-border bg-curio-bg-alt/50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-curio-border bg-white text-sm font-medium text-curio-text hover:bg-curio-bg-alt transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-curio-blue text-white text-sm font-semibold hover:bg-curio-blue-hover transition-colors shadow-sm"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
