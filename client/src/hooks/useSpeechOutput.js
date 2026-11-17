import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechOutput() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          setVoices(available);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      // Chrome/macOS sometimes needs a slight timeout to populate voices
      const timer = setTimeout(updateVoices, 250);
      return () => clearTimeout(timer);
    }
  }, []);

  const speak = useCallback((text, { lang = 'en-US', rate = 1.0, pitch = 1.1 } = {}) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Cancel any prior utterances

    if (!text || text.trim() === '') return;

    // Clean markdown asterisks, hashtags or brackets for clean pronunciation
    const cleanText = text
      .replace(/[*#_~`]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = Math.max(0.7, Math.min(1.5, rate));
    utterance.pitch = Math.max(0.7, Math.min(1.5, pitch));

    // Try finding the best voice for the chosen language
    if (voices.length > 0) {
      const langPrefix = lang.slice(0, 2).toLowerCase();
      // Look for natural or enhanced voice first
      const naturalVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(langPrefix) &&
          (v.name.includes('Natural') ||
            v.name.includes('Enhanced') ||
            v.name.includes('Premium') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Rishi') ||
            v.name.includes('Karen'))
      );

      const anyLangVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      } else if (anyLangVoice) {
        utterance.voice = anyLangVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    voices,
    hasSpeechSynthesis: typeof window !== 'undefined' && 'speechSynthesis' in window,
  };
}
