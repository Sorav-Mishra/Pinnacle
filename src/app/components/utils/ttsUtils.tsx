"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speechRate, setSpeechRate] = useState(1);
  const [showTtsSettings, setShowTtsSettings] = useState(false);

  const synth = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined") {
      synth.current = window.speechSynthesis;

      // Load available voices
      const loadVoices = () => {
        const availableVoices = synth.current?.getVoices() || [];
        setVoices(availableVoices);

        // Set default voice (prefer English)
        const englishVoice = availableVoices.find(
          (voice) => voice.lang.includes("en-IN") && voice.localService
        );
        if (englishVoice) {
          setSelectedVoice(englishVoice.name);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      };

      // Chrome loads voices asynchronously
      if (synth.current?.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices;
      }

      loadVoices();

      // Cleanup function to cancel any ongoing speech when component unmounts
      return () => {
        if (synth.current?.speaking) {
          synth.current.cancel();
        }
      };
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!synth.current) return;

      // Cancel any ongoing speech
      if (synth.current.speaking) {
        synth.current.cancel();
        setIsSpeaking(false);
        // If we're already speaking the same text, just cancel and return
        if (isSpeaking) return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Set the selected voice
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;

      // Set speech rate
      utterance.rate = speechRate;

      // Handle speech events
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synth.current.speak(utterance);
    },
    [isSpeaking, selectedVoice, speechRate, voices]
  );

  const stopSpeech = useCallback(() => {
    if (synth.current?.speaking) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleTtsSettings = () => {
    setShowTtsSettings(!showTtsSettings);
  };

  // Return component rendering functions instead of the component itself
  const renderTtsSettingsPanel = () => (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4 animate-fade-in">
      <h3 className="font-bold mb-2">Text to speech</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="voice-select"
          >
            Voice
          </label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="rate-select"
          >
            Speech Rate: {speechRate}x
          </label>
          <input
            id="rate-select"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={toggleTtsSettings}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );

  return {
    isSpeaking,
    speak,
    stopSpeech,
    showTtsSettings,
    toggleTtsSettings,
    renderTtsSettingsPanel, // Return the render function instead
  };
};

// types.ts
export type ProgressStatus = "correct" | "wrong" | "skipped";

export interface Question {
  question: string;
  options: Record<string, string>;
  correct_option: string;
  exam?: string;
  solution?: {
    explanation: string;
    incorrect_explanations?: Record<string, string>;
  };
}
