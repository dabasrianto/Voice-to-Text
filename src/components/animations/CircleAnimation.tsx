"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface CircleAnimationProps {
  isRecording?: boolean;
  audioLevel?: number;
  isPaused?: boolean;
}

const CircleAnimation = ({
  isRecording = false,
  audioLevel = 0.5,
  isPaused = false,
}: CircleAnimationProps) => {
  const animationRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!isRecording || isPaused) {
    return null;
  }

  // Scale based on audio level
  const scale = 0.5 + audioLevel * 1.5;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        className="rounded-full bg-gradient-to-r from-purple-500 to-blue-400"
        initial={{ scale: 0.5, opacity: 0.7 }}
        animate={{
          scale: [scale * 0.8, scale, scale * 0.8],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width: "40%", height: "40%" }}
      />
    </div>
  );
};

export default CircleAnimation;
