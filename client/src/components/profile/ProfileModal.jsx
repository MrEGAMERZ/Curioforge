import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useSpeechOutput } from '../../hooks/useSpeechOutput';
import {
  User,
  Award,
  Star,
  X,
  Sparkles,
  Volume2,
  ShieldCheck,
  Check,
  Sliders,
  GraduationCap,
} from 'lucide-react';

const AVATARS = [
  { id: 'rocket', emoji: '🚀', label: 'Space Explorer' },
  { id: 'dino', emoji: '🦖', label: 'Dino Scientist' },
  { id: 'chemistry', emoji: '🧪', label: 'Chemistry Wizard' },
  { id: 'nature', emoji: '🌱', label: 'Nature Ranger' },
  { id: 'robot', emoji: '🤖', label: 'Robot Builder' },
  { id: 'star', emoji: '⭐', label: 'Star Astronomer' },
];

const GRADE_OPTIONS = [
  { id: 'kindergarten', label: '🧸 Kindergarten / Early Years (Ages 4–5)', desc: 'Wonder-filled stories, huge ideas, zero big words' },
  { id: 'primary', label: '🎒 Primary School (Grades 1–5, Ages 6–10)', desc: 'Curious, playful analogies, hands-on kitchen experiments' },
  { id: '6-8', label: '📚 Middle School (Grades 6–8, Ages 11–13)', desc: 'Real STEM terms, molecules, circuits, and cause & effect' },
  { id: '9-12', label: '🔬 High School (Grades 9–12, Ages 14–18)', desc: 'Chemical formulas, physical principles, engineering depth' },
];

const LANGUAGES = [
  { code: 'en-US', label: '🇺🇸 English (US)' },
  { code: 'en-IN', label: '🇮🇳 English (India)' },
  { code: 'hi-IN', label: '🇮🇳 Hindi (हिन्दी)' },
  { code: 'es-ES', label: '🇪🇸 Spanish (Español)' },
  { code: 'fr-FR', label: '🇫🇷 French (Français)' },
  { code: 'de-DE', label: '🇩🇪 German (Deutsch)' },
];

export function ProfileModal({ isOpen, onClose, profile, onSaveProfile, onClearHistory }) {
  const [nickname, setNickname] = useState(profile?.nickname || 'Aarav');
  const [avatar, setAvatar] = useState(profile?.avatar || '🚀');
  const [gradeBand, setGradeBand] = useState(profile?.gradeBand || 'primary');
  const [language, setLanguage] = useState(profile?.language || 'en-US');
  const [speechRate, setSpeechRate] = useState(profile?.speechRate || 1.0);
  const [speechPitch, setSpeechPitch] = useState(profile?.speechPitch || 1.1);
  const [autoSpeak, setAutoSpeak] = useState(profile?.autoSpeak !== false);
  const [favoriteTheme, setFavoriteTheme] = useState(profile?.favoriteTheme || 'chemistry');
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'voice' | 'safety'

  const { speak, stop, isSpeaking } = useSpeechOutput();

  if (!isOpen) return null;

  const handleTestVoice = () => {
    stop();
    const testLines = {
      'en-US': `Hey ${nickname || 'Explorer'}! I am your CurioForge tutor. What science adventure are we starting today?`,
      'en-IN': `Namaste ${nickname || 'Explorer'}! I am your CurioForge science buddy. Let's make an awesome experiment!`,
      'hi-IN': `नमस्ते ${nickname || 'दोस्त'}! मैं आपका विज्ञान मित्र हूँ। आज क्या नया सीखें?`,
      'es-ES': `¡Hola ${nickname || 'amigo'}! Soy tu tutor de ciencias en CurioForge. ¡Vamos a experimentar!`,
      'fr-FR': `Salut ${nickname || 'ami'}! Je suis ton tuteur CurioForge. Prêt pour une aventure scientifique?`,
      'de-DE': `Hallo ${nickname || 'Freund'}! Ich bin dein CurioForge Tutor. Bereit für ein Experiment?`,
    };
    speak(testLines[language] || testLines['en-US'], {
      lang: language,
      rate: speechRate,
      pitch: speechPitch,
    });
  };

  const handleSave = () => {
    stop();
    onSaveProfile({
      ...profile,
      nickname: nickname.trim() || 'Explorer',
      avatar,
      gradeBand,
      language,
      speechRate,
      speechPitch,
      autoSpeak,
      favoriteTheme,
    });
    onClose();
  };

  const badges = profile?.badges || [
    { title: '🌋 Magma Master', desc: 'Explored volcanic chemical reactions' },
    { title: '💧 Water Guardian', desc: 'Simulated smart irrigation' },
    { title: '⚡ Circuit Spark', desc: 'Tested household conductors' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-deep/80 backdrop-blur-md animate-fadeIn">
      <Card className="w-full max-w-lg bg-surface border-primary-500/40 shadow-elevated relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-line-subtle bg-surface-raised/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-xl shadow-md">
              {avatar}
            </div>
            <div>
              <h3 className="font-bold text-base text-ink-primary font-display flex items-center gap-2">
                <span>Account & Personalization</span>
              </h3>
              <p className="text-xs text-ink-muted">Set student grade, name, and tutor voice</p>
            </div>
          </div>
          <button
            onClick={() => {
              stop();
              onClose();
            }}
            className="p-1.5 text-ink-muted hover:text-ink-primary rounded-lg hover:bg-surface-raised transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-line-subtle px-5 bg-surface-raised/20 text-xs">
          <button
            onClick={() => setActiveTab('account')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'account'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student & Grade</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'voice'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice & Language</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'safety'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safety & Themes</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'account' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Nickname Input */}
              <div>
                <label className="text-xs font-semibold text-ink-secondary block mb-1.5">
                  Student Name or Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Aarav, Maya, Leo..."
                  className="w-full bg-surface-raised border border-line-subtle rounded-xl px-3.5 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-primary-400 font-medium"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-semibold text-ink-secondary block mb-1.5">
                  Choose Explorer Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatar(av.emoji)}
                      className={`h-11 rounded-xl text-lg flex items-center justify-center border transition-all ${
                        avatar === av.emoji
                          ? 'bg-primary-600/30 border-primary-500 scale-105 shadow-glow'
                          : 'bg-surface-raised border-line-subtle hover:border-line-strong'
                      }`}
                      title={av.label}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Band Selector */}
              <div>
                <label className="text-xs font-semibold text-ink-secondary flex items-center gap-1.5 mb-1.5">
                  <GraduationCap className="w-4 h-4 text-primary-400" />
                  <span>Which Grade is the Student in?</span>
                </label>
                <div className="space-y-2">
                  {GRADE_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      onClick={() => setGradeBand(opt.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        gradeBand === opt.id
                          ? 'bg-primary-600/20 border-primary-500 shadow-glow'
                          : 'bg-surface-raised border-line-subtle hover:bg-surface'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gradeBand"
                        checked={gradeBand === opt.id}
                        onChange={() => setGradeBand(opt.id)}
                        className="mt-0.5 text-primary-500 focus:ring-primary-500"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-ink-primary block">{opt.label}</span>
                        <p className="text-[11px] text-ink-muted leading-relaxed">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Language Selection */}
              <div>
                <label className="text-xs font-semibold text-ink-secondary block mb-1.5">
                  Tutor Spoken Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-surface-raised border border-line-subtle rounded-xl px-3.5 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-primary-400"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-ink-muted mt-1">
                  The AI answers in this language and speaks aloud using native speech synthesis.
                </p>
              </div>

              {/* Speech Speed & Pitch */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-medium text-ink-secondary mb-1">
                    <span>Voice Speed</span>
                    <span className="font-mono text-primary-400">{speechRate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.25"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full accent-primary-500"
                  />
                  <div className="flex justify-between text-[10px] text-ink-muted mt-0.5">
                    <span>Gentle</span>
                    <span>Brisk</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-ink-secondary mb-1">
                    <span>Voice Pitch</span>
                    <span className="font-mono text-primary-400">{speechPitch.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full accent-primary-500"
                  />
                  <div className="flex justify-between text-[10px] text-ink-muted mt-0.5">
                    <span>Deeper</span>
                    <span>Playful</span>
                  </div>
                </div>
              </div>

              {/* Auto Speak Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-line-subtle">
                <div>
                  <span className="text-xs font-semibold text-ink-primary block">
                    Auto-Speak Tutor Answers
                  </span>
                  <p className="text-[11px] text-ink-muted">
                    Read the explanation aloud automatically when answering
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(e) => setAutoSpeak(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 accent-primary-500 cursor-pointer"
                />
              </div>

              {/* Test Voice Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="w-full py-2.5 px-4 rounded-xl border border-primary-500/40 bg-primary-600/15 hover:bg-primary-600/25 text-primary-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-primary-400' : ''}`} />
                  <span>{isSpeaking ? 'Speaking sample...' : '🔊 Test Tutor Voice Out Loud'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Safety Shield */}
              <div className="p-3.5 bg-success/10 border border-success/30 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-success">Strict Child Safety Active</h4>
                  <p className="text-[11px] text-ink-secondary leading-relaxed">
                    All experiments use 100% safe household items (water, vinegar, baking soda, lemons, paper).
                    Mains electricity, toxic chemicals, and open flames are strictly forbidden.
                  </p>
                </div>
              </div>

              {/* Favorite Theme */}
              <div>
                <label className="text-xs font-semibold text-ink-secondary block mb-1.5">
                  Favorite STEM Field
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'chemistry', label: '🧪 Chemistry & Fizz' },
                    { id: 'nature', label: '🌱 Nature & Plants' },
                    { id: 'physics', label: '⚡ Electricity & Bulbs' },
                    { id: 'space', label: '🚀 Space & Stars' },
                    { id: 'robots', label: '🤖 Robots & Gadgets' },
                    { id: 'dinosaurs', label: '🦕 Dinosaurs & Earth' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setFavoriteTheme(theme.id)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                        favoriteTheme === theme.id
                          ? 'bg-primary-600/30 border-primary-500 text-ink-primary font-semibold shadow-glow'
                          : 'bg-surface-raised border-line-subtle text-ink-secondary hover:text-ink-primary'
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Earned Badges */}
              <div className="pt-2 border-t border-line-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-ink-secondary flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-warning" />
                    <span>Explorer Badges Earned</span>
                  </span>
                  <span className="text-xs font-mono text-warning font-bold">★ {profile?.stars || 3} Stars</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {badges.map((b, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 bg-surface-raised border border-line-subtle rounded-full text-ink-primary font-medium"
                      title={b.desc}
                    >
                      {b.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reset History */}
              {onClearHistory && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Clear all past session history?')) {
                        onClearHistory();
                      }
                    }}
                    className="text-xs text-danger/80 hover:text-danger underline transition-colors"
                  >
                    Clear all past session history
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-line-subtle bg-surface-raised/40">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              stop();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
}