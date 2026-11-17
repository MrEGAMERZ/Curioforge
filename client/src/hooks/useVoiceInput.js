import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Robust Voice Input Hook for CurioForge
 * - Direct MediaRecorder audio capture (100% reliable in Electron & browsers)
 * - Live audio level frequency analysis for reactive waveforms
 * - Web Speech API progressive enhancement (doesn't crash or abort on network errors)
 * - Auto-encodes recorded audio into base64 for Gemini 2.0 Multimodal Audio
 */
export function useVoiceInput({ onResult, onAudioReady, language = 'en-US' } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Initialize Web Speech Recognition if available (as optional text enhancer)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript;
          }
          if (fullTranscript.trim()) {
            setTranscript(fullTranscript);
            if (onResult) {
              onResult(fullTranscript);
            }
          }
        };

        recognition.onerror = (event) => {
          // In Electron, speech recognition might error with 'network' or 'not-allowed'.
          // We intentionally do NOT stop recording here because MediaRecorder is still capturing!
          console.log('[SpeechRecognition notice]:', event.error);
        };

        recognition.onend = () => {
          // Do nothing; MediaRecorder controls listening lifecycle
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition setup failed:', e);
      }
    }
  }, [language, onResult]);

  // Audio level analyzer using Web Audio API
  const setupAudioAnalysis = (stream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn('Audio analyzer error:', err);
    }
  };

  const cleanupAudio = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
  };

  const startListening = useCallback(async () => {
    setTranscript('');
    setError(null);
    audioChunksRef.current = [];

    try {
      // 1. Request microphone access
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone not supported on this device/browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // 2. Start reactive waveform analyzer
      setupAudioAnalysis(stream);

      // 3. Start MediaRecorder (native audio recording)
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setIsListening(true);

      // 4. Optionally trigger SpeechRecognition for text preview
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = language;
          recognitionRef.current.start();
        } catch (_) {}
      }
    } catch (err) {
      console.error('Failed to start microphone:', err);
      setError(err.message || 'Microphone access denied');
      setIsListening(false);
      cleanupAudio();
    }
  }, [language]);

  const stopListening = useCallback(() => {
    setIsListening(false);

    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }

    // Stop MediaRecorder and build audio payload
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (audioBlob.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result;
            if (onAudioReady) {
              onAudioReady({
                audioBlob,
                audioBase64: base64Data,
                mimeType,
                transcript,
              });
            }
          };
          reader.readAsDataURL(audioBlob);
        }
        cleanupAudio();
      };

      try {
        recorder.stop();
      } catch (_) {
        cleanupAudio();
      }
    } else {
      cleanupAudio();
    }
  }, [onAudioReady, transcript]);

  return {
    isListening,
    transcript,
    audioLevel,
    error,
    startListening,
    stopListening,
  };
}