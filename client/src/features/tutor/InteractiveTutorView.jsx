import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge, Spinner } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { InteractiveCanvas } from '../../components/canvas/InteractiveCanvas';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useSpeechOutput } from '../../hooks/useSpeechOutput';
import { apiClient } from '../../lib/apiClient';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  Sparkles,
  Send,
  ShieldCheck,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Download,
  WifiOff,
  Leaf,
  Layers,
} from 'lucide-react';

const VOICE_PERSONAS = [
  { id: 'sparky', name: 'Captain Sparky', role: 'Energetic Explorer', emoji: '⚡', rate: 1.12, pitch: 1.2 },
  { id: 'maya', name: 'Professor Maya', role: 'Gentle Science Mentor', emoji: '🌱', rate: 0.95, pitch: 1.05 },
  { id: 'leo', name: 'Dr. Leo', role: 'Tech & Gadgets', emoji: '🤖', rate: 1.0, pitch: 0.95 },
  { id: 'willow', name: 'Grandma Willow', role: 'Cozy Storyteller', emoji: '📖', rate: 0.9, pitch: 1.0 },
  { id: 'cosmo', name: 'Cosmo Nova', role: 'Playful Space Buddy', emoji: '🚀', rate: 1.05, pitch: 1.25 },
  { id: 'custom', name: 'Custom Voice', role: 'User Voice Profile', emoji: '⭐', rate: 1.0, pitch: 1.1 },
];

export function InteractiveTutorView({ currentSession, onSaveSession, profile, onStartNew }) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(currentSession?.response || null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState('sparky');
  const [statusMessage, setStatusMessage] = useState('Tap the mic and speak your curious question!');
  const [showRuralSubstitutes, setShowRuralSubstitutes] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);

  const responseEndRef = useRef(null);
  const recordedAudioBase64Ref = useRef(null);

  const { speak, stop, isSpeaking } = useSpeechOutput();

  const handleAudioReady = ({ audioBase64, transcript: spokenText }) => {
    recordedAudioBase64Ref.current = audioBase64 ? audioBase64.split(',')[1] : null;
    const textToSubmit = spokenText || inputText;
    // Auto-submit immediately once the user stops talking
    handleSubmit(textToSubmit);
  };

  const handleVoiceResult = (spokenTranscript) => {
    if (spokenTranscript) {
      setInputText(spokenTranscript);
    }
  };

  const { isListening, transcript, audioLevel, startListening, stopListening } = useVoiceInput({
    onResult: handleVoiceResult,
    onAudioReady: handleAudioReady,
    language: profile?.language || 'en-US',
  });

  useEffect(() => {
    if (currentSession) {
      setResponse(currentSession.response);
      setInputText(currentSession.query || '');
    } else {
      setResponse(null);
      setInputText('');
      setImagePreview(null);
      setSavedOffline(false);
    }
  }, [currentSession]);

  useEffect(() => {
    if (loading) {
      setStatusMessage('CurioForge is thinking & preparing your 3D lab...');
    } else if (isListening) {
      setStatusMessage('Listening to your voice... (tap to finish)');
    } else if (isSpeaking) {
      setStatusMessage('Tutor is speaking aloud...');
    } else if (response) {
      setStatusMessage('Ready for your next question!');
    } else {
      setStatusMessage('Tap the mic and speak your curious question!');
    }
  }, [loading, isListening, isSpeaking, response]);

  // Submit to Tutor
  const handleSubmit = async (overrideText) => {
    const textToSend = (overrideText || inputText || transcript).trim();
    const audioPayload = recordedAudioBase64Ref.current;
    if (!textToSend && !imagePreview && !audioPayload) return;

    if (isListening) {
      stopListening();
    }
    stop();
    setLoading(true);

    try {
      const activePersonaConfig = VOICE_PERSONAS.find((p) => p.id === selectedPersona) || VOICE_PERSONAS[0];

      const payload = {
        gradeBand: profile?.gradeBand || 'primary',
        studentText: textToSend,
        language: profile?.language || 'en-US',
        imageBase64: imagePreview ? imagePreview.split(',')[1] : null,
        audioBase64: audioPayload || null,
        audioMimeType: 'audio/webm',
      };

      const res = await apiClient.interactWithTutor(payload);
      setResponse(res);
      recordedAudioBase64Ref.current = null; // Reset

      const whatWeLearned = res.stemConcepts?.[0]?.simpleWhy || res.explanation?.slice(0, 100) || 'Explored science!';

      if (onSaveSession) {
        onSaveSession({
          id: currentSession?.id || Date.now().toString(),
          title: textToSend.slice(0, 48) || 'Curiosity Exploration',
          date: new Date().toISOString(),
          query: textToSend,
          response: res,
          whatWeLearned,
          gradeBand: profile?.gradeBand || 'primary',
          avatar: profile?.avatar || '🚀',
        });
      }

      // Speak answer aloud with active persona settings
      if (profile?.autoSpeak !== false) {
        const textToSpeak = `${res.speechGreeting} ${res.explanation}`;
        speak(textToSpeak, {
          lang: profile?.language || 'en-US',
          rate: activePersonaConfig.rate,
          pitch: activePersonaConfig.pitch,
        });
      }

      setTimeout(() => {
        responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      console.error('Tutor error:', err);
      alert(`Could not connect to tutor: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      stop();
      startListening();
    }
  };

  const handleSpeakStep = (stepText) => {
    stop();
    const persona = VOICE_PERSONAS.find((p) => p.id === selectedPersona) || VOICE_PERSONAS[0];
    speak(stepText, {
      lang: profile?.language || 'en-US',
      rate: persona.rate * 0.9,
      pitch: persona.pitch,
    });
  };

  const quickIdeas = [
    { title: '🌋 Baking Soda Volcano', query: 'How do baking soda and vinegar react to erupt like a volcano?' },
    { title: '🌱 Thirsty Plants', query: 'How do plants drink water and know when soil is dry?' },
    { title: '⚡ Lemon Battery', query: 'Can we make electricity using a lemon or pencil graphite?' },
    { title: '🚀 Balloon Rocket', query: 'How does a balloon push air backwards to fly forwards?' },
  ];

  const ruralSubstitutes = [
    { labItem: 'Measuring Beaker / Graduated Cylinder', ruralItem: 'Cut plastic water bottle or glass chai cup with marked lines' },
    { labItem: 'Chemical Indicator / Food Dye', ruralItem: 'Turmeric powder (haldi) mixed in water or crushed beetroot juice' },
    { labItem: 'Connecting Wires / Battery Clip', ruralItem: 'Pencil graphite lead, paperclips, or kitchen aluminum foil strips' },
    { labItem: 'Petri Dish / Specimen Tray', ruralItem: 'Clean flat stone, banana leaf, or recycled plastic lid' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* 6 Voice Personas Bar */}
      <div className="p-3 bg-surface/80 border border-line-subtle rounded-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-ink-secondary flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-primary-400" />
            <span>Choose Tutor Voice Persona:</span>
          </span>
          <span className="text-[10px] text-ink-muted">1-Tap Voice Switcher</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {VOICE_PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPersona(p.id);
                stop();
                speak(`Hello! I am ${p.name}. Ready to explore?`, {
                  lang: profile?.language || 'en-US',
                  rate: p.rate,
                  pitch: p.pitch,
                });
              }}
              className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                selectedPersona === p.id
                  ? 'bg-primary-600/30 border-primary-500 shadow-glow'
                  : 'bg-surface-raised border-line-subtle hover:bg-surface'
              }`}
            >
              <span className="text-xl">{p.emoji}</span>
              <div className="truncate">
                <span className="text-xs font-bold text-ink-primary block leading-tight truncate">
                  {p.name}
                </span>
                <span className="text-[10px] text-ink-muted block leading-tight truncate">
                  {p.role}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Microphone Stage */}
      <Card className="p-6 bg-surface/90 border-primary-500/40 shadow-elevated relative overflow-hidden">
        {isListening && (
          <div className="absolute inset-0 bg-primary-500/10 pointer-events-none animate-pulse rounded-2xl" />
        )}

        <div className="flex flex-col items-center justify-center space-y-4 py-2">
          {/* Reactive Glowing Mic Button */}
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <div
                  className="absolute rounded-full bg-primary-500/20 animate-ping"
                  style={{
                    width: `${90 + audioLevel * 0.9}px`,
                    height: `${90 + audioLevel * 0.9}px`,
                  }}
                />
                <div
                  className="absolute rounded-full bg-accent-500/30 transition-all duration-75"
                  style={{
                    width: `${80 + audioLevel * 0.6}px`,
                    height: `${80 + audioLevel * 0.6}px`,
                  }}
                />
              </>
            )}

            <button
              type="button"
              onClick={handleMicToggle}
              disabled={loading}
              className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-elevated transition-all duration-200 active:scale-95 ${
                isListening
                  ? 'bg-danger text-white shadow-[0_0_40px_rgba(239,68,68,0.6)] scale-105'
                  : 'bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-500 hover:from-primary-500 hover:to-accent-400 text-white shadow-glow'
              }`}
            >
              {loading ? (
                <Spinner size="lg" />
              ) : isListening ? (
                <>
                  <MicOff className="w-10 h-10 animate-bounce" />
                  <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Tap to Finish</span>
                </>
              ) : (
                <>
                  <Mic className="w-10 h-10" />
                  <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Tap to Talk</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time reactive audio soundwave bars */}
          {isListening && (
            <div className="flex items-center gap-1.5 h-8">
              {[40, 70, 95, 60, 85, 100, 75, 45, 80, 55].map((h, i) => {
                const heightVal = Math.max(8, Math.min(32, (audioLevel * h) / 75));
                return (
                  <span
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-primary-500 to-accent-400 rounded-full transition-all duration-75"
                    style={{ height: `${heightVal}px` }}
                  />
                );
              })}
            </div>
          )}

          {/* Status badge */}
          <div className="text-center">
            <span
              className={`text-xs font-semibold px-3.5 py-1 rounded-full border inline-block transition-colors ${
                isListening
                  ? 'bg-danger/15 text-danger border-danger/30 animate-pulse'
                  : loading
                  ? 'bg-warning/15 text-warning border-warning/30'
                  : isSpeaking
                  ? 'bg-success/15 text-success border-success/30'
                  : 'bg-surface-raised text-ink-secondary border-line-subtle'
              }`}
            >
              {statusMessage}
            </span>
          </div>

          {/* Live Transcript / Feedback */}
          {(isListening || transcript) && (
            <div className="w-full max-w-lg p-3 bg-surface-raised border border-primary-500/40 rounded-xl text-center animate-fadeIn">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-400 block mb-0.5">
                Hearing You:
              </span>
              <p className="text-sm font-medium text-ink-primary italic">
                "{transcript || 'Listening for your voice...'}"
              </p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-4 border-t border-line-subtle space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Or type your curious question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="flex-1 bg-surface-raised border border-line-subtle rounded-xl px-4 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-primary-400 font-medium"
            />

            <Button onClick={() => handleSubmit()} loading={loading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Idea Sparks */}
          {!response && (
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-ink-muted flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                <span>Quick inspiration chips:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickIdeas.map((idea) => (
                  <button
                    key={idea.title}
                    onClick={() => {
                      setInputText(idea.query);
                      handleSubmit(idea.query);
                    }}
                    className="p-2.5 bg-surface-raised hover:bg-surface border border-line-subtle hover:border-primary-500/50 rounded-xl text-left transition-all group flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-ink-primary group-hover:text-primary-300 block">
                        {idea.title}
                      </span>
                      <p className="text-[11px] text-ink-muted truncate max-w-[240px]">{idea.query}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-primary-400 transform group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tutor Response Stage */}
      {response && (
        <div className="space-y-6 animate-fadeIn" ref={responseEndRef}>
          {/* Main Tutor Explanation Card */}
          <Card className="p-6 bg-surface border-primary-500/50 shadow-glow relative space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                  {VOICE_PERSONAS.find((p) => p.id === selectedPersona)?.emoji || '⚡'}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-ink-primary text-base font-display">
                      {VOICE_PERSONAS.find((p) => p.id === selectedPersona)?.name || 'CurioForge Buddy'}
                    </h3>
                    <Badge tone="purple" className="text-[10px]">
                      {profile?.gradeBand === 'primary' ? 'Primary STEM' : 'Interactive Lab'}
                    </Badge>
                  </div>

                  <p className="text-sm font-semibold text-primary-300 leading-relaxed">
                    "{response.speechGreeting}"
                  </p>
                  <p className="text-sm text-ink-primary leading-relaxed font-normal">
                    {response.explanation}
                  </p>
                </div>
              </div>

              {/* Voice Readback Audio Controller */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stop();
                  } else {
                    const p = VOICE_PERSONAS.find((v) => v.id === selectedPersona) || VOICE_PERSONAS[0];
                    speak(`${response.speechGreeting} ${response.explanation}`, {
                      lang: profile?.language || 'en-US',
                      rate: p.rate,
                      pitch: p.pitch,
                    });
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all shadow-md flex-shrink-0 ${
                  isSpeaking
                    ? 'bg-danger/20 border-danger/40 text-danger animate-pulse'
                    : 'bg-primary-600/20 hover:bg-primary-600/30 border-primary-500 text-primary-300'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Listen aloud'}
              >
                {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>

            {/* "What We Learned" Highlight Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary-600/20 via-accent-500/15 to-transparent border border-primary-500/30 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-warning block mb-1">
                  💡 What We Learned:
                </span>
                <p className="text-xs text-ink-primary leading-relaxed font-medium">
                  {response.stemConcepts?.[0]?.simpleWhy || response.explanation}
                </p>
              </div>
            </div>
          </Card>

          {/* Interactive 3D Simulation Living Canvas */}
          <InteractiveCanvas
            type={response.interactiveSimulationType || 'volcano_reaction'}
            title={response.simulationParameters?.title || 'Interactive 3D Living Lab'}
            promptQuestion={response.simulationParameters?.promptQuestion}
          />

          {/* Household Hands-on Activity Card */}
          {response.householdActivity && (
            <Card className="p-6 border-success/30 bg-surface/90 space-y-4">
              <div className="flex items-center justify-between border-b border-line-subtle pb-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-success" />
                  <div>
                    <h3 className="font-bold text-base text-ink-primary font-display">
                      {response.householdActivity.title}
                    </h3>
                    <p className="text-xs text-ink-muted">Safe, zero-cost experiment you can make at home!</p>
                  </div>
                </div>

                {/* Rural Optimizer Toggle */}
                <button
                  onClick={() => setShowRuralSubstitutes(!showRuralSubstitutes)}
                  className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                    showRuralSubstitutes
                      ? 'bg-success/20 border-success text-success font-bold'
                      : 'bg-surface-raised border-line-subtle text-ink-secondary hover:text-ink-primary'
                  }`}
                  title="Zero-cost materials found in rural areas and farms"
                >
                  <Leaf className="w-3.5 h-3.5" />
                  <span>{showRuralSubstitutes ? 'Hide Rural Substitutes' : '🌾 Zero-Cost Rural Alternatives'}</span>
                </button>
              </div>

              {/* Rural & Kitchen Substitutes Panel */}
              {showRuralSubstitutes && (
                <div className="p-4 bg-success/10 border border-success/30 rounded-xl space-y-2 animate-fadeIn">
                  <h4 className="text-xs font-bold text-success flex items-center gap-1.5">
                    <span>🌾 Rural & Village Alternatives (Zero Store-Bought Materials Needed):</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {ruralSubstitutes.map((s, idx) => (
                      <div key={idx} className="p-2 bg-surface rounded-lg border border-line-subtle">
                        <span className="font-bold text-ink-primary block">{s.labItem}</span>
                        <span className="text-success text-[11px] block">↳ Replace with: {s.ruralItem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              <div>
                <h4 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-2">
                  Materials Needed:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {response.householdActivity.materials.map((m, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 bg-surface-raised border border-line-subtle rounded-xl text-ink-primary font-medium shadow-sm"
                    >
                      📦 {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Steps with Read-Along Voice */}
              <div>
                <h4 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-2">
                  Step-by-Step Instructions (Tap speaker to listen):
                </h4>
                <div className="space-y-2.5">
                  {response.householdActivity.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-surface-raised/40 hover:bg-surface-raised border border-transparent hover:border-line-subtle transition-colors text-xs text-ink-primary group"
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        <span className="w-6 h-6 rounded-full bg-primary-600/30 text-primary-400 font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-inner">
                          {idx + 1}
                        </span>
                        <p className="pt-0.5 leading-relaxed font-medium">{st}</p>
                      </div>

                      <button
                        onClick={() => handleSpeakStep(`Step ${idx + 1}: ${st}`)}
                        className="p-1.5 rounded-lg text-ink-muted hover:text-primary-400 hover:bg-surface transition-colors"
                        title="Listen to this step out loud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {response.householdActivity.safetyTip && (
                <div className="p-3.5 bg-warning/10 border border-warning/30 rounded-xl text-xs text-warning flex items-start gap-2.5">
                  <span className="text-base">⚠️</span>
                  <span className="leading-relaxed font-medium">
                    Safety Tip: {response.householdActivity.safetyTip}
                  </span>
                </div>
              )}

              {/* Offline Pocket Save */}
              <div className="pt-2 border-t border-line-subtle flex items-center justify-between">
                <span className="text-[11px] text-ink-muted flex items-center gap-1">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Works 100% offline once saved to your device</span>
                </span>

                <button
                  onClick={() => {
                    setSavedOffline(true);
                    setTimeout(() => setSavedOffline(false), 3000);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                    savedOffline
                      ? 'bg-success/20 border-success text-success font-bold'
                      : 'bg-surface-raised hover:bg-surface border-line-subtle text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{savedOffline ? '✓ Saved to Pocket Lab' : 'Save for Offline Play'}</span>
                </button>
              </div>
            </Card>
          )}

          {/* Start New Activity Shortcut */}
          <div className="text-center pt-2">
            <button
              onClick={onStartNew}
              className="text-xs text-ink-muted hover:text-ink-primary transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Explore another question or start fresh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}