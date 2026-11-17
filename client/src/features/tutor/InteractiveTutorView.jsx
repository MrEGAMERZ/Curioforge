import React, { useState, useEffect, useRef } from 'react';
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
  Send,
  ShieldCheck,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  WifiOff,
  Layers,
  FlaskConical,
  Sparkles,
  BookOpen,
  Play,
  Pause,
  ChevronLeft,
} from 'lucide-react';

const VOICE_PERSONAS = [
  {
    id: 'linus',
    name: 'Linus',
    role: 'Tech Mentor',
    emoji: '🛠️',
    previewUrl: './voices/linus_preview.mp3',
    voiceSample: './voices/linus_tech_mentor.mp3',
    rate: 1.14,
    pitch: 1.08,
    color: 'bg-orange-100 text-orange-600 border-orange-200',
    activeColor: 'bg-orange-500 text-white border-orange-500',
  },
  {
    id: 'sparky',
    name: 'Sparky',
    role: 'Explorer',
    emoji: '⚡',
    rate: 1.12,
    pitch: 1.2,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    activeColor: 'bg-yellow-500 text-white border-yellow-500',
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Mentor',
    emoji: '🌱',
    rate: 0.95,
    pitch: 1.05,
    color: 'bg-green-100 text-green-600 border-green-200',
    activeColor: 'bg-green-500 text-white border-green-500',
  },
  {
    id: 'leo',
    name: 'Dr. Leo',
    role: 'Gadgets',
    emoji: '🤖',
    rate: 1.0,
    pitch: 0.95,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    activeColor: 'bg-blue-500 text-white border-blue-500',
  },
  {
    id: 'willow',
    name: 'Willow',
    role: 'Storyteller',
    emoji: '📖',
    rate: 0.9,
    pitch: 1.0,
    color: 'bg-pink-100 text-pink-600 border-pink-200',
    activeColor: 'bg-pink-500 text-white border-pink-500',
  },
  {
    id: 'cosmo',
    name: 'Cosmo',
    role: 'Space Buddy',
    emoji: '🚀',
    rate: 1.05,
    pitch: 1.25,
    color: 'bg-purple-100 text-purple-600 border-purple-200',
    activeColor: 'bg-purple-500 text-white border-purple-500',
  },
];

// Render explanation text with keyword highlights
function HighlightedText({ text }) {
  if (!text) return null;
  const keywords = {
    acid: 'acid',
    base: 'base',
    'carbon dioxide': 'gas',
    co2: 'gas',
    enzyme: 'base',
    oxygen: 'gas',
    hydrogen: 'acid',
    molecule: 'base',
    atom: 'base',
  };

  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let found = false;
    for (const [kw, type] of Object.entries(keywords)) {
      const idx = remaining.toLowerCase().indexOf(kw);
      if (idx === 0) {
        parts.push(
          <span key={key++} className={`keyword-chip ${type}`}>
            {remaining.slice(0, kw.length)}
          </span>
        );
        remaining = remaining.slice(kw.length);
        found = true;
        break;
      }
      if (idx > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
        remaining = remaining.slice(idx);
        found = true;
        break;
      }
    }
    if (!found) {
      parts.push(<span key={key++}>{remaining}</span>);
      remaining = '';
    }
  }

  return <>{parts}</>;
}

export function InteractiveTutorView({ currentSession, onSaveSession, profile, onStartNew, isSoundOn }) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(currentSession?.response || null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState('sparky');
  const [show3D, setShow3D] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [messages, setMessages] = useState(() => {
    if (currentSession?.query && currentSession?.response) {
      return [
        { role: 'user', text: currentSession.query, id: 'initial-user' },
        { role: 'ai', response: currentSession.response, id: 'initial-ai' },
      ];
    }
    return [];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recordedAudioBase64Ref = useRef(null);
  const fileInputRef = useRef(null);

  const { speak, stop, isSpeaking } = useSpeechOutput();

  // Check for pending query from HomeView
  useEffect(() => {
    if (window._pendingQuery) {
      const q = window._pendingQuery;
      window._pendingQuery = null;
      setInputText(q);
      setTimeout(() => handleSubmit(q), 100);
    }
  }, []);

  useEffect(() => {
    if (currentSession) {
      setResponse(currentSession.response);
      if (currentSession.query && currentSession.response) {
        setMessages([
          { role: 'user', text: currentSession.query, id: 'restored-user' },
          { role: 'ai', response: currentSession.response, id: 'restored-ai' },
        ]);
      }
    } else {
      setResponse(null);
      setMessages([]);
      setInputText('');
      setImagePreview(null);
    }
  }, [currentSession]);

  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages, loading]);

  const handleAudioReady = ({ audioBase64, transcript: spokenText }) => {
    recordedAudioBase64Ref.current = audioBase64 ? audioBase64.split(',')[1] : null;
    const textToSubmit = spokenText || inputText;
    if (textToSubmit?.trim()) handleSubmit(textToSubmit);
  };

  const handleVoiceResult = (spokenTranscript) => {
    if (spokenTranscript) setInputText(spokenTranscript);
  };

  const { isListening, transcript, audioLevel, startListening, stopListening } = useVoiceInput({
    onResult: handleVoiceResult,
    onAudioReady: handleAudioReady,
    language: profile?.language || 'en-US',
  });

  const handleSubmit = async (overrideText) => {
    const textToSend = (overrideText || inputText || transcript).trim();
    const audioPayload = recordedAudioBase64Ref.current;
    if (!textToSend && !imagePreview && !audioPayload) return;

    if (isListening) stopListening();
    stop();
    setLoading(true);

    const userMsg = { role: 'user', text: textToSend || '[Voice message]', id: Date.now().toString() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    try {
      const activePersona = VOICE_PERSONAS.find((p) => p.id === selectedPersona) || VOICE_PERSONAS[1];

      const payload = {
        gradeBand: profile?.gradeBand || 'primary',
        studentText: textToSend,
        language: profile?.language || 'en-US',
        imageBase64: imagePreview ? imagePreview.split(',')[1] : null,
        audioBase64: audioPayload || null,
        audioMimeType: 'audio/webm',
      };

      const res = await apiClient.interactWithTutor(payload);
      recordedAudioBase64Ref.current = null;

      const aiMsg = { role: 'ai', response: res, id: (Date.now() + 1).toString() };
      setMessages((prev) => [...prev, aiMsg]);
      setResponse(res);

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

      if (isSoundOn !== false && profile?.autoSpeak !== false) {
        const textToSpeak = `${res.speechGreeting || ''} ${res.explanation || ''}`.trim();
        setIsPlayingVoice(true);
        speak(textToSpeak, {
          lang: profile?.language || 'en-US',
          rate: activePersona.rate,
          pitch: activePersona.pitch,
        });
        setTimeout(() => setIsPlayingVoice(false), 3000);
      }
    } catch (err) {
      console.error('Tutor error:', err);
      const errorMsg = {
        role: 'ai',
        response: {
          explanation: `I couldn't connect to the AI right now. Please check your internet connection and try again. (${err.message})`,
          speechGreeting: 'Oops!',
          stemConcepts: [],
        },
        id: (Date.now() + 1).toString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
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

  const handleImageCapture = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleQuickAction = (action) => {
    const actionMap = {
      '3d': `Show me a 3D simulation of what we just discussed`,
      'more': `What else works in a similar way to this?`,
      'steps': `Give me step-by-step instructions I can follow at home`,
    };
    handleSubmit(actionMap[action] || action);
  };

  const activePersona = VOICE_PERSONAS.find((p) => p.id === selectedPersona) || VOICE_PERSONAS[1];
  const isActive = isListening || loading;

  return (
    <div className="h-full flex flex-col bg-white">

      {/* ── Curio Guide status bar ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-curio-border bg-curio-bg">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-curio-blue animate-pulse' : 'bg-curio-green'}`} />
          <span className="text-sm font-medium text-curio-text">Curio Guide</span>
          <span className="text-curio-border">•</span>
          <span className="text-sm text-curio-text-secondary">
            {loading ? 'Thinking...' : isListening ? 'Listening to you...' : isSpeaking ? 'Speaking...' : 'Listening & ready to help'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Voice speed indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-curio-bg-alt border border-curio-border rounded-full">
            <Volume2 className="w-3.5 h-3.5 text-curio-text-muted" />
            <span className="text-xs font-medium text-curio-text-secondary">{activePersona.rate}x voice</span>
          </div>
          {/* Persona switcher */}
          <div className="flex items-center gap-1">
            {VOICE_PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPersona(p.id);
                  stop();
                  if (p.previewUrl) {
                    const audio = new Audio(p.previewUrl);
                    audio.play().catch(() => {
                      speak(`Hi! I'm ${p.name}. Let's explore!`, {
                        lang: profile?.language || 'en-US',
                        rate: p.rate,
                        pitch: p.pitch,
                      });
                    });
                  } else {
                    speak(`Hi! I'm ${p.name}. Let's explore!`, {
                      lang: profile?.language || 'en-US',
                      rate: p.rate,
                      pitch: p.pitch,
                    });
                  }
                }}
                title={`${p.name} — ${p.role}`}
                className={`w-7 h-7 rounded-full border text-sm transition-all hover:scale-110 ${
                  selectedPersona === p.id ? 'ring-2 ring-curio-blue ring-offset-1 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {p.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Session date header ── */}
      {messages.length > 0 && (
        <div className="text-center py-2">
          <span className="inline-block text-xs text-curio-text-muted bg-curio-bg-alt px-3 py-1 rounded-full border border-curio-border">
            Today • Science Exploration: {messages[0]?.text?.slice(0, 40) || 'Learning Session'}
          </span>
        </div>
      )}

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

        {/* Empty state */}
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-curio-blue-light flex items-center justify-center mb-4">
              <span className="text-3xl">{activePersona.emoji}</span>
            </div>
            <h3 className="text-xl font-bold text-curio-text mb-2">
              Hi! I'm {activePersona.name} 👋
            </h3>
            <p className="text-curio-text-secondary max-w-sm mb-6">
              Ask me anything about science, nature, or how the world works. Tap the mic or type below!
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-sm">
              {[
                { q: 'Why do volcanoes erupt?', e: '🌋' },
                { q: 'How do plants make food?', e: '🌱' },
                { q: 'What makes rainbows?', e: '🌈' },
                { q: 'How do birds fly?', e: '🦅' },
              ].map((idea) => (
                <button
                  key={idea.q}
                  onClick={() => handleSubmit(idea.q)}
                  className="flex items-center gap-2 px-3 py-2.5 bg-curio-bg-alt border border-curio-border rounded-xl text-left hover:border-curio-blue hover:bg-curio-blue-light transition-all group"
                >
                  <span>{idea.e}</span>
                  <span className="text-xs text-curio-text-secondary group-hover:text-curio-blue">{idea.q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg) => (
          <div key={msg.id} className="msg-animate">
            {msg.role === 'user' ? (
              /* User bubble — right aligned */
              <div className="flex items-end justify-end gap-3">
                <div className="max-w-[70%]">
                  <div className="bg-curio-bg-alt border border-curio-border rounded-2xl rounded-br-sm px-4 py-3">
                    <p className="text-base text-curio-text leading-relaxed">{msg.text}</p>
                  </div>
                  <p className="text-[11px] text-curio-text-muted text-right mt-1 mr-1">
                    {profile.nickname} • Voice transcription
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-curio-blue flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {profile.nickname?.[0]?.toUpperCase() || 'L'}
                </div>
              </div>
            ) : (
              /* AI response bubble — left side, full width card */
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-curio-blue flex items-center justify-center flex-shrink-0 mt-1">
                  <Volume2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 max-w-[85%]">
                  {/* Voice player bar */}
                  {!msg.isError && (
                    <div className="flex items-center justify-between bg-white border border-curio-border rounded-2xl px-4 py-3 mb-3 shadow-card">
                      <div>
                        <p className="text-sm font-semibold text-curio-text">Listen with Curio Voice</p>
                        <p className="text-xs text-curio-text-muted">
                          ~{Math.ceil(((msg.response?.explanation?.length || 100) / 150))} seconds • Friendly tempo
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Animated wave bars */}
                        {(isPlayingVoice || isSpeaking) ? (
                          <div className="flex items-end gap-0.5 h-5">
                            <div className="wave-bar" />
                            <div className="wave-bar" />
                            <div className="wave-bar" />
                            <div className="wave-bar" />
                            <div className="wave-bar" />
                          </div>
                        ) : (
                          <div className="flex items-end gap-0.5 h-5">
                            {[4, 8, 12, 8, 4].map((h, i) => (
                              <div key={i} className="w-0.5 rounded-full bg-curio-text-muted opacity-30" style={{ height: `${h}px` }} />
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            if (isSpeaking) {
                              stop();
                            } else {
                              const text = `${msg.response?.speechGreeting || ''} ${msg.response?.explanation || ''}`.trim();
                              speak(text, {
                                lang: profile?.language || 'en-US',
                                rate: activePersona.rate,
                                pitch: activePersona.pitch,
                              });
                            }
                          }}
                          className="w-8 h-8 rounded-full bg-curio-blue flex items-center justify-center hover:bg-curio-blue-hover transition-colors"
                        >
                          {isSpeaking
                            ? <Pause className="w-3.5 h-3.5 text-white" />
                            : <Play className="w-3.5 h-3.5 text-white" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Explanation text */}
                  <div className="bg-white rounded-2xl border border-curio-border p-4 shadow-card">
                    {msg.response?.speechGreeting && (
                      <p className="text-base text-curio-text leading-relaxed mb-2 font-medium">
                        {msg.response.speechGreeting}
                      </p>
                    )}
                    <p className="text-base text-curio-text leading-relaxed">
                      <HighlightedText text={msg.response?.explanation || msg.response?.speechGreeting} />
                    </p>

                    {/* Fun Science Secret card */}
                    {msg.response?.householdActivity && (
                      <div className="fun-fact-card rounded-xl p-3.5 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span>💡</span>
                          <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Fun Science Secret</span>
                        </div>
                        <p className="text-sm text-curio-text leading-relaxed">
                          {msg.response.householdActivity.title}: {msg.response.householdActivity.steps?.[0] || ''}
                        </p>
                      </div>
                    )}

                    {/* STEM concepts */}
                    {msg.response?.stemConcepts?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.response.stemConcepts.map((concept, i) => (
                          <div key={i} className="flex items-start gap-2 p-2.5 bg-curio-bg-alt rounded-xl">
                            <CheckCircle2 className="w-4 h-4 text-curio-green flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-bold text-curio-text">{concept.name}</span>
                              <span className="text-xs text-curio-text-secondary"> — {concept.simpleWhy}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick action chips */}
                    {!msg.isError && (
                      <div className="mt-4">
                        <p className="text-xs text-curio-text-muted mb-2">Tap to keep exploring:</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => { setShow3D(true); handleQuickAction('3d'); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs font-medium text-purple-700 hover:bg-purple-100 transition-colors"
                          >
                            <FlaskConical className="w-3.5 h-3.5" />
                            Try it in 3D simulator
                          </button>
                          <button
                            onClick={() => handleQuickAction('more')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full text-xs font-medium text-yellow-700 hover:bg-yellow-100 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            What else fizzes?
                          </button>
                          <button
                            onClick={() => handleQuickAction('steps')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            Show me the steps
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3 msg-animate">
            <div className="w-9 h-9 rounded-full bg-curio-blue flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-curio-border rounded-2xl px-4 py-3 shadow-card">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-curio-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-curio-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-curio-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-curio-text-muted">Curio is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── 3D Lab (collapsible) ── */}
      {show3D && response?.interactiveSimulationType && (
        <div className="border-t border-curio-border">
          <div className="flex items-center justify-between px-4 py-2 bg-curio-bg-alt">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-curio-blue" />
              <span className="text-sm font-medium text-curio-text">3D Lab Simulation</span>
            </div>
            <button onClick={() => setShow3D(false)} className="text-xs text-curio-text-muted hover:text-curio-text">
              Close ✕
            </button>
          </div>
          <div className="h-48">
            <InteractiveCanvas simulationType={response.interactiveSimulationType} parameters={response.simulationParameters} />
          </div>
        </div>
      )}

      {/* ── Bottom input bar ── */}
      <div className="border-t border-curio-border bg-white px-4 py-3">
        {/* Image preview */}
        {imagePreview && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-curio-bg-alt rounded-xl border border-curio-border">
            <img src={imagePreview} alt="capture" className="h-10 w-10 object-cover rounded-lg" />
            <span className="text-xs text-curio-text-secondary">Image attached</span>
            <button onClick={() => setImagePreview(null)} className="ml-auto text-curio-text-muted hover:text-curio-red text-xs">Remove</button>
          </div>
        )}

        {/* Listening indicator */}
        {isListening && (
          <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-curio-blue-light border border-curio-blue/30 rounded-full w-fit">
            <div className="flex items-end gap-0.5 h-4">
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
            </div>
            <span className="text-xs text-curio-blue font-medium">
              {transcript || 'Listening... speak now'}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 bg-curio-bg-alt rounded-2xl border border-curio-border px-3 py-2 focus-within:border-curio-blue focus-within:bg-white transition-all">
          {/* Camera button */}
          <button
            onClick={handleImageCapture}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-curio-text-muted hover:text-curio-text hover:bg-curio-bg transition-colors flex-shrink-0"
            title="Attach image"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={isListening ? transcript : inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
            placeholder="Ask anything about science or experiments..."
            disabled={isListening || loading}
            className="flex-1 bg-transparent text-sm text-curio-text placeholder-curio-text-muted outline-none py-1"
          />

          {/* Send button */}
          {(inputText || isListening) && (
            <button
              onClick={() => handleSubmit()}
              className="w-8 h-8 rounded-full bg-curio-bg flex items-center justify-center border border-curio-border hover:bg-curio-bg-alt transition-colors flex-shrink-0"
              title="Send"
            >
              <Send className="w-4 h-4 text-curio-text-secondary" />
            </button>
          )}

          {/* Mic button — blue circle, the star of the show */}
          <button
            onClick={handleMicToggle}
            disabled={loading}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
              isListening
                ? 'bg-curio-red text-white animate-voice-pulse shadow-mic-active'
                : 'bg-curio-blue text-white hover:bg-curio-blue-hover shadow-sm hover:shadow-md active:scale-95'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        {/* Footer safety badge */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-curio-green" />
          <span className="text-[11px] text-curio-text-muted">Kid-Safe Privacy Mode Active</span>
          <span className="text-curio-text-muted">•</span>
          <span className="text-[11px] text-curio-text-muted">No external links</span>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
