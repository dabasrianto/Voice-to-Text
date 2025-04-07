"use client";

import React, { useEffect, useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

interface LottieAnimation1Props {
  isRecording?: boolean;
  audioLevel?: number;
  isPaused?: boolean;
}

const LottieAnimation1 = ({
  isRecording = false,
  audioLevel = 0.5,
  isPaused = false,
}: LottieAnimation1Props) => {
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
        src="https://assets2.lottiefiles.com/packages/lf20_jJJl6i.json"
        style={{ height: "100%", width: "100%" }}
        background="transparent"
      />
    </div>
  );
};

export default LottieAnimation1;
