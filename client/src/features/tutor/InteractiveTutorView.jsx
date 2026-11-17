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
} from 'lucide-react';

export function InteractiveTutorView({ currentSession, onSaveSession, profile, onStartNew }) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(currentSession?.response || null);
  const [imagePreview, setImagePreview] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Tap the mic and speak your curious question!');
  const responseEndRef = useRef(null);

  const { speak, stop, isSpeaking } = useSpeechOutput();

  const handleVoiceResult = (transcriptText) => {
    setInputText(transcriptText);
  };

  const { isListening, transcript, audioLevel, error: voiceError, startListening, stopListening } = useVoiceInput({
    onResult: handleVoiceResult,
    language: profile?.language || 'en-US',
  });

  // Keep state synced with currentSession
  useEffect(() => {
    if (currentSession) {
      setResponse(currentSession.response);
      setInputText(currentSession.query || '');
      // If session has greeting and autoSpeak is on, we don't necessarily re-speak unless requested
    } else {
      setResponse(null);
      setInputText('');
      setImagePreview(null);
    }
  }, [currentSession]);

  // Update status message
  useEffect(() => {
    if (loading) {
      setStatusMessage('CurioForge is thinking & preparing your interactive lab...');
    } else if (isListening) {
      setStatusMessage('Listening to your voice... Speak now!');
    } else if (isSpeaking) {
      setStatusMessage('Tutor is speaking aloud...');
    } else if (response) {
      setStatusMessage('Ready for your next follow-up question!');
    } else {
      setStatusMessage('Tap the mic and speak your curious question!');
    }
  }, [loading, isListening, isSpeaking, response]);

  // Handle submit to AI tutor
  const handleSubmit = async (overrideText) => {
    const textToSend = (overrideText || inputText || transcript).trim();
    if (!textToSend && !imagePreview) return;

    if (isListening) {
      stopListening();
    }
    stop();
    setLoading(true);

    try {
      const payload = {
        gradeBand: profile?.gradeBand || 'primary',
        studentText: textToSend,
        language: profile?.language || 'en-US',
        imageBase64: imagePreview ? imagePreview.split(',')[1] : null,
      };

      const res = await apiClient.interactWithTutor(payload);
      setResponse(res);

      // Extract a crisp "What we learned" summary
      const whatWeLearned = res.stemConcepts?.[0]?.simpleWhy || res.explanation?.slice(0, 100) || 'Explored fascinating science concepts!';

      // Auto-save session
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

      // Auto-speak tutor answer out loud if enabled
      if (profile?.autoSpeak !== false) {
        const textToSpeak = `${res.speechGreeting} ${res.explanation}`;
        speak(textToSpeak, {
          lang: profile?.language || 'en-US',
          rate: profile?.speechRate || 1.0,
          pitch: profile?.speechPitch || 1.1,
        });
      }

      // Scroll smoothly to response
      setTimeout(() => {
        responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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
      if (inputText.trim()) {
        handleSubmit(inputText);
      }
    } else {
      stop();
      startListening();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const quickIdeas = [
    { title: '🌋 Baking Soda Volcano', query: 'How do baking soda and vinegar react to erupt like a volcano?' },
    { title: '🌱 Thirsty Plants', query: 'How do plants drink water and know when soil is dry?' },
    { title: '⚡ Lemon Battery', query: 'Can we make electricity using a lemon or pencil graphite?' },
    { title: '🚀 Balloon Rocket', query: 'How does a balloon push air backwards to fly forwards?' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Welcoming Top Hero */}
      {!response && (
        <div className="text-center space-y-2 py-4 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-accent-500/15 text-accent-300 border border-accent-500/30 rounded-full text-xs font-semibold mb-1 shadow-glow">
            <span className="text-base">{profile?.avatar || '🚀'}</span>
            <span>Welcome, {profile?.nickname || 'Curious Explorer'}!</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-ink-primary tracking-tight">
            What are you curious about today?
          </h1>
          <p className="text-sm text-ink-secondary max-w-md mx-auto leading-relaxed">
            Tap the big glowing mic and simply talk! The tutor explains in real time with fun interactive labs.
          </p>
        </div>
      )}

      {/* Main Real-Time Voice Stage */}
      <Card className="p-6 bg-surface/90 border-primary-500/40 shadow-elevated relative overflow-hidden">
        {/* Pulsing ambient glow when listening */}
        {isListening && (
          <div className="absolute inset-0 bg-primary-500/10 pointer-events-none animate-pulse rounded-2xl" />
        )}

        <div className="flex flex-col items-center justify-center space-y-4 py-2">
          {/* Big Interactive Mic Button */}
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <div
                  className="absolute rounded-full bg-primary-500/20 animate-ping"
                  style={{
                    width: `${90 + audioLevel * 0.8}px`,
                    height: `${90 + audioLevel * 0.8}px`,
                  }}
                />
                <div
                  className="absolute rounded-full bg-accent-500/30 transition-all duration-75"
                  style={{
                    width: `${80 + audioLevel * 0.5}px`,
                    height: `${80 + audioLevel * 0.5}px`,
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
                  <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Tap to Send</span>
                </>
              ) : (
                <>
                  <Mic className="w-10 h-10" />
                  <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Tap to Talk</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time reactive audio waveform bars when listening */}
          {isListening && (
            <div className="flex items-center gap-1.5 h-8">
              {[40, 70, 90, 60, 85, 100, 75, 45, 80, 50].map((h, i) => {
                const heightVal = Math.max(8, Math.min(32, (audioLevel * h) / 80));
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
              className={`text-xs font-semibold px-3 py-1 rounded-full border inline-block transition-colors ${
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

          {/* Live Transcript Bubble */}
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

        {/* Input Bar & Fallback Controls */}
        <div className="mt-4 pt-4 border-t border-line-subtle space-y-3">
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Materials preview"
                className="w-24 h-24 object-cover rounded-xl border border-primary-400 shadow-md"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md hover:scale-110"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <label
              className="p-2.5 bg-surface-raised hover:bg-surface border border-line-strong rounded-xl text-ink-secondary hover:text-ink-primary cursor-pointer transition-all flex items-center justify-center"
              title="Snap photo of materials"
            >
              <Camera className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            <input
              type="text"
              placeholder="Or type what you are curious about..."
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
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-ink-muted flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                <span>Or pick a fun experiment to ask right now:</span>
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
          {/* Main Tutor Explanation & Audio Card */}
          <Card className="p-6 bg-surface border-primary-500/50 shadow-glow relative space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                  {profile?.avatar || '🚀'}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-ink-primary text-base font-display">
                      Your CurioForge Buddy
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
                    speak(`${response.speechGreeting} ${response.explanation}`, {
                      lang: profile?.language || 'en-US',
                      rate: profile?.speechRate || 1.0,
                      pitch: profile?.speechPitch || 1.1,
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

            {/* "What We Learned" Key Concept Box */}
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

            {/* Concept Badges */}
            {response.stemConcepts?.length > 0 && (
              <div className="pt-2 border-t border-line-subtle flex flex-wrap gap-2">
                {response.stemConcepts.map((concept, idx) => (
                  <Badge key={idx} tone="purple" icon={<Sparkles className="w-3 h-3" />}>
                    {concept.name}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Interactive Simulation Living Canvas */}
          <InteractiveCanvas
            type={response.interactiveSimulationType || 'volcano_reaction'}
            title={response.simulationParameters?.title || 'Interactive Living Lab'}
            promptQuestion={response.simulationParameters?.promptQuestion}
          />

          {/* Household Hands-on Activity */}
          {response.householdActivity && (
            <Card className="p-6 border-success/30 bg-surface/90 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-line-subtle pb-3">
                <ShieldCheck className="w-6 h-6 text-success" />
                <div>
                  <h3 className="font-bold text-base text-ink-primary font-display">
                    {response.householdActivity.title}
                  </h3>
                  <p className="text-xs text-ink-muted">Safe, zero-cost experiment you can make at home!</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-2">
                  Materials Needed (Ordinary Household Items):
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

              <div>
                <h4 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-2">
                  Easy Step-by-Step Instructions:
                </h4>
                <div className="space-y-2.5">
                  {response.householdActivity.steps.map((st, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-ink-primary">
                      <span className="w-6 h-6 rounded-full bg-primary-600/30 text-primary-400 font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-inner">
                        {idx + 1}
                      </span>
                      <p className="pt-0.5 leading-relaxed font-medium">{st}</p>
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
            </Card>
          )}

          {/* Follow-up question & Action to keep talking */}
          {response.followUpAudioQuestion && (
            <Card className="p-4 bg-accent-500/10 border-accent-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-accent-400 flex-shrink-0" />
                <p className="text-xs font-medium text-ink-primary">
                  <span className="font-bold text-accent-300">Tutor's Challenge: </span>
                  {response.followUpAudioQuestion}
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(handleMicToggle, 400);
                }}
                className="whitespace-nowrap"
              >
                <Mic className="w-4 h-4 mr-1.5" />
                <span>Answer via Voice</span>
              </Button>
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