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
    if (typeof window !== "undefined") {
      synth.current = window.speechSynthesis;

      const loadVoices = () => {
        const availableVoices = synth.current?.getVoices() || [];
        setVoices(availableVoices);

        const englishVoice = availableVoices.find(
          (voice) => voice.lang.includes("en-IN") && voice.localService
        );
        if (englishVoice) {
          setSelectedVoice(englishVoice.name);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      };

      if (synth.current?.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices;
      }

      loadVoices();

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

      if (synth.current.speaking) {
        synth.current.cancel();
        setIsSpeaking(false);
        if (isSpeaking) return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
      utterance.rate = speechRate;

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

  const renderTtsSettingsPanel = () => (
    <div className="p-4 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg mb-4 animate-fade-in">
      <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-100">
        Text to speech
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
            htmlFor="voice-select"
          >
            Voice
          </label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm dark:bg-blue-700 dark:hover:bg-blue-800"
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
    renderTtsSettingsPanel,
  };
};
