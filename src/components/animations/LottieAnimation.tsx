"use client";

import React, { useEffect, useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

interface LottieAnimationProps {
  isRecording?: boolean;
  audioLevel?: number;
  isPaused?: boolean;
}

const LottieAnimation = ({
  isRecording = false,
  audioLevel = 0.5,
  isPaused = false,
}: LottieAnimationProps) => {
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    if (isRecording && !isPaused && playerRef.current) {
      playerRef.current.play();
    } else if (playerRef.current) {
      playerRef.current.pause();
    }
  }, [isRecording, isPaused]);

  useEffect(() => {
    // Adjust animation speed based on audio level
    if (playerRef.current) {
      const speed = 0.5 + audioLevel;
      playerRef.current.setPlayerSpeed(speed);
    }
  }, [audioLevel]);

  if (!isRecording || isPaused) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Player
        ref={playerRef}
        autoplay={isRecording && !isPaused}
        loop
        src="https://assets5.lottiefiles.com/packages/lf20_UgZWvP.json"
        style={{ height: "100%", width: "100%" }}
        background="transparent"
      />
    </div>
  );
};

export default LottieAnimation;
