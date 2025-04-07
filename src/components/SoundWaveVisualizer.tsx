"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import WaveAnimation from "./animations/WaveAnimation";
import CircleAnimation from "./animations/CircleAnimation";
import PulseAnimation from "./animations/PulseAnimation";
import LottieAnimation from "./animations/LottieAnimation";
import LottieAnimation1 from "./animations/LottieAnimation1";
import LottieAnimation2 from "./animations/LottieAnimation2";
import LottieAnimation3 from "./animations/LottieAnimation3";
import LottieAnimation4 from "./animations/LottieAnimation4";
import LottieAnimation5 from "./animations/LottieAnimation5";
import LottieAnimation6 from "./animations/LottieAnimation6";
import LottieAnimation7 from "./animations/LottieAnimation7";
import LottieAnimation8 from "./animations/LottieAnimation8";
import LottieAnimation9 from "./animations/LottieAnimation9";
import LottieAnimation10 from "./animations/LottieAnimation10";

interface SoundWaveVisualizerProps {
  isRecording?: boolean;
  audioLevel?: number;
  isPaused?: boolean;
  animationType?: string;
}

const SoundWaveVisualizer = ({
  isRecording = false,
  audioLevel = 0.5,
  isPaused = false,
  animationType = "wave",
}: SoundWaveVisualizerProps) => {
  // Get animation type from localStorage if not provided
  const [currentAnimationType, setCurrentAnimationType] =
    useState(animationType);

  useEffect(() => {
    // Update animation type if prop changes
    setCurrentAnimationType(animationType);
  }, [animationType]);

  useEffect(() => {
    // If no animation type is provided, try to get it from localStorage
    if (typeof window !== "undefined" && !animationType) {
      const savedAnimationType = localStorage.getItem("animationType");
      if (savedAnimationType) {
        setCurrentAnimationType(savedAnimationType);
      }
    }
  }, [animationType]);

  const renderAnimation = () => {
    if (!isRecording || isPaused) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-gray-400 text-sm">
            Tap the microphone to start recording
          </p>
        </div>
      );
    }

    // Only keep the sound-reactive animations
    switch (currentAnimationType) {
      case "circle":
        return (
          <CircleAnimation
            isRecording={isRecording}
            audioLevel={audioLevel}
            isPaused={isPaused}
          />
        );
      case "pulse":
        return (
          <PulseAnimation
            isRecording={isRecording}
            audioLevel={audioLevel}
            isPaused={isPaused}
          />
        );
      case "wave":
      default:
        return (
          <WaveAnimation
            isRecording={isRecording}
            audioLevel={audioLevel}
            isPaused={isPaused}
          />
        );
    }
  };

  return (
    <div className="w-full h-20 flex items-center justify-center bg-black rounded-lg p-4">
      <div className="w-full h-full flex items-center justify-center">
        {renderAnimation()}
      </div>
    </div>
  );
};

export default SoundWaveVisualizer;
