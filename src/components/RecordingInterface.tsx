"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2, Pause, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import SoundWaveVisualizer from "./SoundWaveVisualizer";

interface RecordingInterfaceProps {
  isRecording?: boolean;
  onTranscriptionComplete?: (text: string, title?: string) => void;
  defaultLanguage?: string;
  animationType?: string;
  textSize?: string;
}

const RecordingInterface = ({
  isRecording: externalIsRecording,
  onTranscriptionComplete = () => {},
  defaultLanguage = "id-ID",
  animationType = "wave",
  textSize = "text-md",
}: RecordingInterfaceProps) => {
  const [isRecording, setIsRecording] = useState(externalIsRecording || false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(defaultLanguage);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [audioLevel, setAudioLevel] = useState(0.5);
  const [isWebSpeechSupported, setIsWebSpeechSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recordingTitle, setRecordingTitle] = useState("");

  // References
  const micButtonRef = useRef<HTMLButtonElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const finalTranscriptRef = useRef<string>("");

  // Check if Web Speech API is supported
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsWebSpeechSupported(false);
      setError(
        "Your browser doesn't support the Web Speech API. Try using Chrome, Edge, or Safari.",
      );
    }
  }, []);

  // Sync with external isRecording state if provided
  useEffect(() => {
    if (externalIsRecording !== undefined) {
      setIsRecording(externalIsRecording);
    }
  }, [externalIsRecording]);

  // Initialize Web Speech API
  const initSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsRecording(true);
      setIsPaused(false);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
          finalTranscriptRef.current += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Set the transcription to the accumulated final transcript plus any interim results
      setTranscription(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setError(`Error: ${event.error}. Please try again.`);
      if (event.error === "not-allowed") {
        setHasPermission(false);
      }
    };

    recognition.onend = () => {
      if (isRecording && !isPaused) {
        // If still supposed to be recording and not paused, restart recognition
        try {
          recognition.start();
        } catch (err) {
          console.error("Error restarting recognition:", err);
        }
      } else {
        setIsLoading(false);
      }
    };

    return recognition;
  };

  // Initialize audio analyzer for visualizer
  const initAudioAnalyzer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;
      setHasPermission(true);

      // Create audio context and analyzer
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Start monitoring audio levels
      monitorAudioLevels();

      return true;
    } catch (err) {
      console.error("Failed to initialize audio analyzer:", err);
      setHasPermission(false);
      setError(
        "Microphone access denied. Please enable microphone permissions.",
      );
      return false;
    }
  };

  // Monitor audio levels for visualizer
  const monitorAudioLevels = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    const updateAudioLevel = () => {
      if (!analyserRef.current || !isRecording || isPaused) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      // Calculate average volume level
      const average =
        dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      // Normalize to 0-1 range
      const normalizedLevel = Math.min(1, Math.max(0.1, average / 128));
      setAudioLevel(normalizedLevel);

      if (isRecording && !isPaused) {
        requestAnimationFrame(updateAudioLevel);
      }
    };

    requestAnimationFrame(updateAudioLevel);
  };

  // Check for microphone permission
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setHasPermission(true);
        // Stop the stream immediately since we're just checking permissions
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        setHasPermission(false);
        setError(
          "Microphone access denied. Please enable microphone permissions.",
        );
        console.error("Microphone permission denied:", err);
      }
    };

    checkMicPermission();
  }, []);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Handle language change
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  const startRecording = async () => {
    if (!isWebSpeechSupported) {
      setError(
        "Your browser doesn't support the Web Speech API. Try using Chrome, Edge, or Safari.",
      );
      return;
    }

    setIsLoading(true);
    setTranscription("");
    finalTranscriptRef.current = "";
    setError(null);

    const hasAudio = await initAudioAnalyzer();
    if (!hasAudio) {
      setIsLoading(false);
      return;
    }

    const recognition = initSpeechRecognition();
    if (!recognition) {
      setError("Failed to initialize speech recognition. Please try again.");
      setIsLoading(false);
      return;
    }

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsRecording(true);
      setIsPaused(false);
      setIsLoading(false);
    } catch (err) {
      console.error("Error starting recognition:", err);
      setError("Error starting speech recognition. Please try again.");
      setIsLoading(false);
    }
  };

  const pauseRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recognitionRef.current && isPaused) {
      try {
        recognitionRef.current.start();
        setIsPaused(false);
        monitorAudioLevels();
      } catch (err) {
        console.error("Error resuming recognition:", err);
        setError("Error resuming speech recognition. Please try again.");
      }
    }
  };

  const stopRecording = () => {
    setIsLoading(true);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);

    // Generate a default title if none is provided
    const title =
      recordingTitle.trim() ||
      `Recording ${new Date().toLocaleString(language.split("-")[0], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`;

    // Notify parent component about the completed transcription
    onTranscriptionComplete(finalTranscriptRef.current.trim(), title);
    setIsLoading(false);
    setRecordingTitle(""); // Reset title for next recording
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 bg-background rounded-xl shadow-lg">
      <div className="w-full mb-4">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id-ID">Indonesian 🇮🇩</SelectItem>
            <SelectItem value="ar-SA">Arabic 🇸🇦</SelectItem>
            <SelectItem value="en-US">English (US) 🇺🇸</SelectItem>
            <SelectItem value="zh-CN">Chinese 🇨🇳</SelectItem>
            <SelectItem value="ja-JP">Japanese 🇯🇵</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isRecording && (
        <div className="w-full mb-4">
          <input
            type="text"
            value={recordingTitle}
            onChange={(e) => setRecordingTitle(e.target.value)}
            placeholder="Enter recording title (optional)"
            className="w-full p-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      <div className="relative w-full h-32 mb-6">
        <SoundWaveVisualizer
          isRecording={isRecording}
          isPaused={isPaused}
          audioLevel={audioLevel}
          animationType={animationType}
        />
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        {!isRecording ? (
          <motion.div
            animate={{
              scale: isLoading ? 0.95 : 1,
              opacity: isLoading ? 0.7 : 1,
            }}
            className="relative"
          >
            <Button
              ref={micButtonRef}
              onClick={startRecording}
              disabled={
                isLoading || hasPermission === false || !isWebSpeechSupported
              }
              className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-10 w-10 animate-spin text-white" />
              ) : (
                <Mic className="h-10 w-10 text-white" />
              )}
            </Button>
          </motion.div>
        ) : (
          <>
            {isPaused ? (
              <Button
                onClick={resumeRecording}
                disabled={isLoading}
                className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
              >
                <Play className="h-8 w-8 text-white" />
              </Button>
            ) : (
              <Button
                onClick={pauseRecording}
                disabled={isLoading}
                className="h-16 w-16 rounded-full bg-amber-500 hover:bg-amber-600"
              >
                <Pause className="h-8 w-8 text-white" />
              </Button>
            )}
            <Button
              onClick={stopRecording}
              disabled={isLoading}
              className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
            >
              <MicOff className="h-8 w-8 text-white" />
            </Button>
          </>
        )}
      </div>

      <div className="w-full bg-card rounded-lg p-4 min-h-32 max-h-60 overflow-y-auto">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : transcription ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`${textSize} text-foreground`}
          >
            {transcription}
          </motion.p>
        ) : (
          <p className="text-muted-foreground text-center italic">
            {hasPermission === false
              ? "Microphone access denied. Please enable microphone permissions."
              : !isWebSpeechSupported
                ? "Your browser doesn't support the Web Speech API. Try using Chrome, Edge, or Safari."
                : isRecording
                  ? isPaused
                    ? "Recording paused. Press play to continue."
                    : "Listening..."
                  : "Tap the microphone button to start recording"}
          </p>
        )}
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        {isRecording ? (
          <span className="flex items-center justify-center">
            {!isPaused && (
              <motion.span
                className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
            {isPaused
              ? `Paused - ${language.split("-")[0].toUpperCase()}`
              : `Recording in ${language.split("-")[0].toUpperCase()}`}
          </span>
        ) : (
          <span>Ready to record</span>
        )}
      </div>
    </div>
  );
};

export default RecordingInterface;
