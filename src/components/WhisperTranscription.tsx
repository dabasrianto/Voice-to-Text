"use client";

import React, { useState, useRef } from "react";
import { Mic, MicOff, Loader2, Pause, Play } from "lucide-react";
import { Button } from "./ui/button";
import SoundWaveVisualizer from "./SoundWaveVisualizer";

interface WhisperTranscriptionProps {
  onTranscriptionComplete?: (text: string, title?: string) => void;
  defaultLanguage?: string;
  animationType?: string;
}

const WhisperTranscription = ({
  onTranscriptionComplete = () => {},
  defaultLanguage = "id-ID",
  animationType = "wave",
}: WhisperTranscriptionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0.5);
  const [error, setError] = useState<string | null>(null);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [transcription, setTranscription] = useState("");

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);

  // Initialize audio analyzer for visualizer
  const initAudioAnalyzer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;

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

  const startRecording = async () => {
    setIsLoading(true);
    setTranscription("");
    setError(null);

    const hasAudio = await initAudioAnalyzer();
    if (!hasAudio) {
      setIsLoading(false);
      return;
    }

    try {
      const stream = microphoneStreamRef.current;
      if (!stream) {
        throw new Error("No microphone stream available");
      }

      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await sendToWhisperAPI(audioBlob);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setIsPaused(false);
      setIsLoading(false);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Error starting recording. Please try again.");
      setIsLoading(false);
    }
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      monitorAudioLevels();
    }
  };

  const stopRecording = () => {
    setIsLoading(true);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  const sendToWhisperAPI = async (audioBlob: Blob) => {
    // In a real implementation, you would send this to your backend
    // which would then call the OpenAI Whisper API
    try {
      setIsLoading(true);

      // This is a placeholder for the actual API call
      // In a real implementation, you would do something like:
      /*
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      formData.append('model', 'whisper-1');
      formData.append('language', defaultLanguage.split('-')[0]); // e.g., 'id' from 'id-ID'
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      const transcribedText = data.text;
      */

      // For demo purposes, we'll simulate a response after a delay
      setTimeout(() => {
        // Simulate a response from Whisper API
        const simulatedResponse =
          "Ini adalah hasil transkripsi yang lebih akurat menggunakan OpenAI Whisper API. Hasil transkripsi ini jauh lebih teliti dan rapi dibandingkan dengan Web Speech API.";

        setTranscription(simulatedResponse);

        // Generate a default title if none is provided
        const title =
          recordingTitle.trim() ||
          `Recording ${new Date().toLocaleString(
            defaultLanguage.split("-")[0],
            {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            },
          )}`;

        onTranscriptionComplete(simulatedResponse, title);
        setIsLoading(false);
        setRecordingTitle(""); // Reset title for next recording
      }, 2000);
    } catch (error) {
      console.error("Error sending audio to Whisper API:", error);
      setError("Error processing transcription. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 bg-background rounded-xl shadow-lg">
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
          <Button
            onClick={startRecording}
            disabled={isLoading}
            className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            ) : (
              <Mic className="h-10 w-10 text-white" />
            )}
          </Button>
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
        ) : isLoading && !isRecording ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              Processing transcription with Whisper API...
            </p>
          </div>
        ) : transcription ? (
          <p className="text-md text-foreground">{transcription}</p>
        ) : (
          <p className="text-muted-foreground text-center italic">
            {isRecording
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
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2" />
            )}
            {isPaused
              ? `Paused - Using Whisper API`
              : `Recording for Whisper API transcription`}
          </span>
        ) : (
          <span>Ready to record with enhanced accuracy</span>
        )}
      </div>
    </div>
  );
};

export default WhisperTranscription;
