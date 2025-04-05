"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface SoundWaveVisualizerProps {
  isRecording?: boolean;
  audioLevel?: number;
  isPaused?: boolean;
}

const SoundWaveVisualizer = ({
  isRecording = false,
  audioLevel = 0.5,
  isPaused = false,
}: SoundWaveVisualizerProps) => {
  const [bars, setBars] = useState<number[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Initialize bars with random heights
    setBars(Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.2));

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isRecording || isPaused) return;

    const animateBars = () => {
      setBars((prevBars) =>
        prevBars.map(() => {
          // Use the actual audio level from the microphone
          // Add some randomness to make the visualization more dynamic
          const randomFactor = Math.random() * 0.4 + 0.6;
          return Math.min(1, Math.max(0.1, audioLevel * randomFactor));
        }),
      );
      animationRef.current = requestAnimationFrame(animateBars);
    };

    animationRef.current = requestAnimationFrame(animateBars);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, audioLevel, isPaused]);

  return (
    <div className="w-full h-20 flex items-center justify-center bg-black rounded-lg p-4">
      <div className="w-full h-full flex items-center justify-center">
        {isRecording && !isPaused ? (
          <div className="flex items-end justify-center w-full h-full space-x-1">
            {bars.map((height, index) => (
              <motion.div
                key={index}
                className="w-1.5 bg-gradient-to-t from-purple-500 to-blue-400 rounded-full"
                initial={{ height: "10%" }}
                animate={{ height: `${height * 100}%` }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-gray-400 text-sm">
              Tap the microphone to start recording
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundWaveVisualizer;
