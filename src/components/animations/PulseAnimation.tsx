"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface PulseAnimationProps {
  isRecording?: boolean;
  audioLevel?: number;
  isPaused?: boolean;
}

const PulseAnimation = ({
  isRecording = false,
  audioLevel = 0.5,
  isPaused = false,
}: PulseAnimationProps) => {
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

  // Number of rings based on audio level
  const rings = [1, 2, 3, 4, 5];

  return (
    <div className="w-full h-full flex items-center justify-center">
      {rings.map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border-2 border-purple-500"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{
            scale: [0, 1 + audioLevel * 0.5],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: ring * 0.3,
            ease: "easeOut",
          }}
          style={{ width: "50%", height: "50%" }}
        />
      ))}
      <motion.div
        className="rounded-full bg-gradient-to-r from-purple-500 to-blue-400"
        animate={{
          scale: [1, 1.1 * audioLevel, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width: "20%", height: "20%" }}
      />
    </div>
  );
};

export default PulseAnimation;
