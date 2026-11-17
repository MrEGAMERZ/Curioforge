import React, { useState, useEffect } from 'react';
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
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Flame,
} from 'lucide-react';

export function InteractiveTutorView() {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [gradeBand, setGradeBand] = useState('primary');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { speak, stop, isSpeaking } = useSpeechOutput();

  const handleVoiceResult = (transcript) => {
    setInputText(transcript);
  };

  const { isListening, startListening, stopListening, hasSpeechSupport } = useVoiceInput({
    onResult: handleVoiceResult,
    language: selectedLanguage,
  });

  // Handle user query submission
  const handleSubmit = async (overrideText) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim() && !imagePreview) return;

    setLoading(true);
    stop(); // stop any current speech

    try {
      const payload = {
        gradeBand,
        studentText: textToSend,
        language: selectedLanguage,
        imageBase64: imagePreview ? imagePreview.split(',')[1] : null,
      };

      const res = await apiClient.interactWithTutor(payload);
      setResponse(res);

      // Speak greeting and short explanation aloud
      const textToSpeak = `${res.speechGreeting} ${res.explanation}`;
      speak(textToSpeak, {
        lang: selectedLanguage,
        rate: 1.02,
        pitch: 1.15, // Friendly energetic mentor pitch
      });
    } catch (err) {
      alert(`Error from tutor: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Image upload handling
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Friendly Hero Banner */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-500/15 text-accent-400 border border-accent-500/30 rounded-full text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multilingual Voice & Interactive STEM Companion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-ink-primary tracking-tight">
          Hey Buddy! What are we exploring today?
        </h1>
        <p className="text-sm text-ink-secondary max-w-lg mx-auto">
          Tap the big microphone and ask anything in your own language — or snap a picture of materials on your table!
        </p>
      </div>

      {/* Voice & Input Hub */}
      <Card className="p-6 bg-surface/90 border-primary-500/30 shadow-elevated relative overflow-hidden">
        {/* Glowing aura when listening */}
        {isListening && (
          <div className="absolute inset-0 bg-primary-500/10 pointer-events-none animate-pulse rounded-xl" />
        )}

        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          {/* Big Floating Microphone Button */}
          <div className="relative">
            {isListening && (
              <div className="absolute -inset-4 rounded-full bg-primary-500/20 animate-voice-pulse" />
            )}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-elevated transition-all duration-200 active:scale-95 ${
                isListening
                  ? 'bg-danger text-white shadow-[0_0_35px_rgba(248,113,113,0.5)]'
                  : 'bg-gradient-to-tr from-primary-600 to-accent-500 hover:from-primary-500 hover:to-accent-400 text-white shadow-glow'
              }`}
            >
              {isListening ? (
                <MicOff className="w-9 h-9 animate-bounce" />
              ) : (
                <Mic className="w-9 h-9" />
              )}
            </button>
          </div>

          <p className="text-xs font-medium text-ink-muted">
            {isListening ? 'Listening to your voice... (tap to finish)' : 'Tap mic to talk'}
          </p>

          {/* Language and Grade Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-surface-raised border border-line-subtle rounded-lg px-3 py-1.5 text-xs text-ink-primary focus:outline-none focus:border-primary-400"
            >
              <option value="en-US">🗣️ English (US)</option>
              <option value="en-IN">🗣️ English (India)</option>
              <option value="hi-IN">🗣️ Hindi (हिन्दी)</option>
              <option value="es-ES">🗣️ Spanish (Español)</option>
              <option value="fr-FR">🗣️ French (Français)</option>
            </select>

            <select
              value={gradeBand}
              onChange={(e) => setGradeBand(e.target.value)}
              className="bg-surface-raised border border-line-subtle rounded-lg px-3 py-1.5 text-xs text-ink-primary focus:outline-none focus:border-primary-400"
            >
              <option value="primary">🎒 Primary School (Ages 6–10)</option>
              <option value="6-8">📚 Middle School (Grades 6–8)</option>
              <option value="9-10">🔬 High School (Grades 9–10)</option>
            </select>
          </div>
        </div>

        {/* Text Input & Camera fallback */}
        <div className="mt-4 pt-4 border-t border-line-subtle space-y-3">
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Materials preview"
                className="w-24 h-24 object-cover rounded-lg border border-primary-400"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <label className="p-2.5 bg-surface-raised hover:bg-surface border border-line-strong rounded-lg text-ink-secondary hover:text-ink-primary cursor-pointer transition-all flex items-center justify-center">
              <Camera className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            <input
              type="text"
              placeholder="Or type what you're curious about..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="flex-1 bg-surface-raised border border-line-subtle rounded-lg px-4 py-2 text-sm text-ink-primary focus:outline-none focus:border-primary-400"
            />

            <Button onClick={() => handleSubmit()} loading={loading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Idea Chips for Kids */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-ink-muted">Try asking:</span>
            {[
              'How do baking soda and vinegar react?',
              'Can we make a battery with lemon or pencils?',
              'How do farmers know when soil is thirsty?',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setInputText(chip);
                  handleSubmit(chip);
                }}
                className="text-xs px-2.5 py-1 bg-surface-raised hover:bg-surface border border-line-subtle rounded-md text-ink-secondary hover:text-ink-primary transition-all text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Response Card with Interactive Canvas & Household Steps */}
      {response && (
        <div className="space-y-6 animate-fadeIn">
          {/* Tutor Voice Card */}
          <Card className="p-5 bg-surface border-primary-500/40 shadow-glow relative">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                    CF
                  </div>
                  <h3 className="font-semibold text-ink-primary text-base">Your CurioForge Buddy</h3>
                </div>
                <p className="text-sm text-ink-primary leading-relaxed font-medium">
                  {response.speechGreeting}
                </p>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  {response.explanation}
                </p>
              </div>

              {/* Audio Readback Button */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stop();
                  } else {
                    speak(`${response.speechGreeting} ${response.explanation}`, { lang: selectedLanguage });
                  }
                }}
                className="p-3 bg-surface-raised hover:bg-surface border border-line-strong rounded-full text-primary-400 hover:text-white transition-all shadow-md"
                title={isSpeaking ? 'Stop voice' : 'Listen again'}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5 text-danger" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Detected STEM Concepts */}
            {response.stemConcepts?.length > 0 && (
              <div className="mt-4 pt-3 border-t border-line-subtle flex flex-wrap gap-2">
                {response.stemConcepts.map((concept, idx) => (
                  <Badge key={idx} tone="purple" icon={<Sparkles className="w-3 h-3" />}>
                    {concept.name}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Interactive Living Canvas */}
          <InteractiveCanvas
            type={response.interactiveSimulationType || 'volcano_reaction'}
            title={response.simulationParameters?.title || 'Interactive Living Canvas'}
            promptQuestion={response.simulationParameters?.promptQuestion}
          />

          {/* Household Hands-On Activity */}
          {response.householdActivity && (
            <Card className="p-5 border-success/30 bg-surface/90 space-y-4">
              <div className="flex items-center gap-2 border-b border-line-subtle pb-3">
                <ShieldCheck className="w-5 h-5 text-success" />
                <h3 className="font-semibold text-base text-ink-primary">
                  {response.householdActivity.title} (Make it at Home!)
                </h3>
              </div>

              {/* Materials List */}
              <div>
                <h4 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
                  Materials You Need (Zero-Cost Household Items):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {response.householdActivity.materials.map((m, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 bg-surface-raised border border-line-subtle rounded-md text-ink-primary font-medium"
                    >
                      📦 {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <h4 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
                  Step-by-Step Guide:
                </h4>
                <div className="space-y-2">
                  {response.householdActivity.steps.map((st, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-ink-primary">
                      <span className="w-5 h-5 rounded-full bg-primary-600/30 text-primary-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <p className="pt-0.5 leading-relaxed">{st}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Alert */}
              {response.householdActivity.safetyTip && (
                <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-xs text-warning flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{response.householdActivity.safetyTip}</span>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
