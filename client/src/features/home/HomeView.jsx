import React, { useState } from 'react';
import { Mic, ChevronLeft, Clock, ChevronRight } from 'lucide-react';

// Experiment card data — safe household science
const EXPERIMENTS = [
  {
    id: 'fizzy-volcano',
    category: 'Chemistry',
    categoryColor: 'bg-red-100 text-red-600',
    emoji: '🌋',
    bgGradient: 'from-orange-50 to-red-50',
    imageBg: '#FFF0E8',
    title: 'The Fizzy Volcano',
    subtitle: 'Kitchen Chemistry • 3 quick steps',
    description: 'Combine baking soda, citrus squeeze, and natural red beet juice to witness carbon dioxide foam erupt!',
    time: '10 min',
    difficulty: 'Easy & Safe',
    difficultyColor: 'text-curio-green',
    dotColor: 'bg-curio-green',
    emoji2: '🧪',
  },
  {
    id: 'rainbow-shadows',
    category: 'Optics',
    categoryColor: 'bg-purple-100 text-purple-600',
    emoji: '🌈',
    bgGradient: 'from-purple-50 to-blue-50',
    imageBg: '#F4EAFF',
    title: 'Rainbow Shadows',
    subtitle: 'Light & Color • 4 steps',
    description: 'Use three colored flashlight beams to make shadows appear in magical secondary colors like cyan and yellow.',
    time: '15 min',
    difficulty: 'Flashlight Needed',
    difficultyColor: 'text-purple-500',
    dotColor: 'bg-purple-400',
    emoji2: '🔦',
  },
  {
    id: 'magnet-track',
    category: 'Physics',
    categoryColor: 'bg-green-100 text-green-600',
    emoji: '🔮',
    bgGradient: 'from-green-50 to-teal-50',
    imageBg: '#E8F9EE',
    title: 'Magic Magnet Track',
    subtitle: 'Forces & Motion • 3 steps',
    description: 'Build an invisible repelling tunnel with everyday bar magnets to propel a toy train without touching it.',
    time: '12 min',
    difficulty: 'Repulsion Lab',
    difficultyColor: 'text-teal-600',
    dotColor: 'bg-teal-400',
    emoji2: '🧲',
  },
];

const SUGGESTIONS = [
  { emoji: '✨', text: 'Deep sea glow' },
  { emoji: '☀️', text: 'Blue sky science' },
  { emoji: '🐜', text: 'Super ant forces' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HomeView({ profile, sessions, onStartChat, onResumeSession }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (text) => {
    const q = text || inputValue;
    if (!q.trim()) return;
    onStartChat(q.trim());
    setInputValue('');
  };

  const lastSession = sessions?.[0];
  const gradeText = profile.gradeNumber
    ? `Grade ${profile.gradeNumber} Ready`
    : 'Primary Ready';

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* ── Status badge ── */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-curio-bg-alt rounded-full border border-curio-border">
            <div className="w-2 h-2 rounded-full bg-curio-green animate-pulse" />
            <span className="text-xs font-medium text-curio-text-secondary">
              Studio Explorer • {gradeText}
            </span>
          </div>
        </div>

        {/* ── Greeting headline ── */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-curio-text tracking-tight leading-tight mb-2">
            {getGreeting()}, {profile.nickname || 'Explorer'}
          </h1>
          <p className="text-lg text-curio-text-secondary">What would you like to explore today?</p>
        </div>

        {/* ── Search / Ask bar ── */}
        <div className="relative mb-4">
          <div className="flex items-center bg-white border border-curio-border rounded-2xl shadow-card px-4 py-3 gap-3 focus-within:border-curio-blue focus-within:shadow-blue-glow transition-all">
            <ChevronLeft className="w-5 h-5 text-curio-blue flex-shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Why do volcanoes erupt? Or tap the mic..."
              className="flex-1 text-base text-curio-text placeholder-curio-text-muted bg-transparent outline-none"
            />
            <button
              onClick={() => onStartChat('')}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-curio-blue flex items-center justify-center hover:bg-curio-blue-hover transition-colors shadow-sm"
              title="Start voice conversation"
            >
              <Mic className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* ── Suggestion chips ── */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          <span className="text-sm text-curio-text-muted">Try asking:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              onClick={() => handleSubmit(s.text)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-curio-bg-alt border border-curio-border rounded-full text-sm text-curio-text-secondary hover:border-curio-blue hover:text-curio-blue hover:bg-curio-blue-light transition-all"
            >
              <span>{s.emoji}</span>
              {s.text}
            </button>
          ))}
        </div>

        {/* ── Today's experiments section ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold text-curio-text-muted uppercase tracking-widest">Today's Hands-On Discovery</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-curio-orange" />
              <span className="text-xs text-curio-text-muted">3 quick experiments</span>
            </div>
          </div>
          <button className="flex items-center gap-1 text-sm text-curio-blue font-medium hover:underline">
            See all 24 projects <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── Experiment cards grid ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {EXPERIMENTS.map((exp) => (
            <div
              key={exp.id}
              className="experiment-card rounded-2xl bg-white border border-curio-border overflow-hidden cursor-pointer"
              onClick={() => handleSubmit(`Tell me about the ${exp.title} experiment`)}
            >
              {/* Card image area */}
              <div
                className={`h-36 flex items-center justify-center relative bg-gradient-to-br ${exp.bgGradient}`}
                style={{ background: exp.imageBg }}
              >
                <span className="text-6xl">{exp.emoji}</span>
                {/* Category badge */}
                <span className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${exp.categoryColor}`}>
                  {exp.emoji2} {exp.category}
                </span>
                {/* Time badge */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[11px] text-white bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  {exp.time}
                </div>
              </div>

              {/* Card body */}
              <div className="p-3.5">
                <p className="text-[11px] text-curio-text-muted mb-1">{exp.subtitle}</p>
                <h3 className="text-base font-bold text-curio-text leading-tight mb-1.5">{exp.title}</h3>
                <p className="text-xs text-curio-text-secondary line-clamp-3 leading-relaxed mb-3">
                  {exp.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${exp.dotColor}`} />
                    <span className={`text-xs font-medium ${exp.difficultyColor}`}>{exp.difficulty}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSubmit(`Tell me about the ${exp.title} experiment`); }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-curio-blue text-white text-xs font-semibold rounded-full hover:bg-curio-blue-hover transition-colors"
                  >
                    Start <span>›</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Resume banner (if previous session) ── */}
        {lastSession && (
          <div className="flex items-center justify-between p-4 bg-curio-bg-alt border border-curio-border rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-curio-blue-light flex items-center justify-center">
                <span className="text-lg">{lastSession.avatar || '📖'}</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-curio-text-muted uppercase tracking-wider mb-0.5">Pick up where you left off</p>
                <p className="text-sm font-semibold text-curio-text">{lastSession.title || lastSession.query}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-curio-text-muted">
                <Mic className="w-3.5 h-3.5" />
                Voice: {profile.speechRate}x
              </div>
              <button
                onClick={() => onResumeSession(lastSession)}
                className="flex items-center gap-1.5 px-4 py-2 border border-curio-border rounded-xl text-sm font-medium hover:bg-white transition-colors"
              >
                Resume →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
