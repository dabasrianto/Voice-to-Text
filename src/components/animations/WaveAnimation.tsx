"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface WaveAnimationProps {
  isRecording?: boolean;
  audioLevel?: number;
  isPaused?: boolean;
}

const WaveAnimation = ({
  isRecording = false,
  audioLevel = 0.5,
  isPaused = false,
}: WaveAnimationProps) => {
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
    <div className="w-full h-full flex items-end justify-center space-x-1">
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
  );
};

export default WaveAnimation;
