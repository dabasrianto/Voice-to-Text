"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Settings, History } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RecordingInterface from "@/components/RecordingInterface";
import TranscriptionActions from "@/components/TranscriptionActions";
import SettingsModal from "@/components/SettingsModal";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Providers } from "@/components/providers";

export default function Home() {
  const { theme } = useTheme();
  const [transcription, setTranscription] = useState("");
  const [recordingTitle, setRecordingTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("id-ID");
  const [activeTab, setActiveTab] = useState("record");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [animationType, setAnimationType] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("animationType") || "wave";
    }
    return "wave";
  });
  const [textSize, setTextSize] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("textSize") || "text-md";
    }
    return "text-md";
  });
  const [useCustomIcons, setUseCustomIcons] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("useCustomIcons") === "true";
    }
    return false;
  });
  const [iconColor, setIconColor] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("iconColor") || "text-white";
    }
    return "text-white";
  });

  const handleTranscriptionComplete = (text: string, title?: string) => {
    setTranscription(text);
    setRecordingTitle(title || "");
    setActiveTab("result");
  };

  const handleNewRecording = () => {
    setTranscription("");
    setActiveTab("record");
  };

  const handleAnimationChange = (newAnimationType: string) => {
    setAnimationType(newAnimationType);
  };

  const handleTextSizeChange = (newTextSize: string) => {
    setTextSize(newTextSize);
  };

  const handleUseCustomIconsChange = (newUseCustomIcons: boolean) => {
    setUseCustomIcons(newUseCustomIcons);
  };

  const handleIconColorChange = (newIconColor: string) => {
    setIconColor(newIconColor);
  };

  return (
    <Providers>
      <main className="flex min-h-screen flex-col items-center p-4 text-foreground">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <motion.h1
              className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Voice to Text
            </motion.h1>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 flex items-center justify-center">
                <ThemeSwitcher />
              </div>
              <Button variant="ghost" size="icon" asChild>
                <a href="/saved">
                  <History className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onAnimationChange={handleAnimationChange}
                onTextSizeChange={handleTextSizeChange}
                onUseCustomIconsChange={handleUseCustomIconsChange}
                onIconColorChange={handleIconColorChange}
              />
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-6">
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id-ID">🇮🇩 Indonesian</SelectItem>
                <SelectItem value="ar-SA">🇸🇦 Arabic</SelectItem>
                <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                <SelectItem value="zh-CN">🇨🇳 Chinese</SelectItem>
                <SelectItem value="ja-JP">🇯🇵 Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main Card */}
          <Card className="p-6 rounded-xl shadow-lg bg-card border-border">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="record">Record</TabsTrigger>
                <TabsTrigger value="result">Result</TabsTrigger>
              </TabsList>

              <TabsContent value="record" className="space-y-4">
                <RecordingInterface
                  onTranscriptionComplete={handleTranscriptionComplete}
                  defaultLanguage={selectedLanguage}
                  animationType={animationType}
                  textSize={textSize}
                />
              </TabsContent>

              <TabsContent value="result" className="space-y-4">
                <div className="min-h-[200px] p-4 rounded-lg border border-border overflow-y-auto">
                  {transcription ? (
                    <p className={`${textSize}`}>{transcription}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center italic">
                      Your transcription will appear here after recording
                    </p>
                  )}
                </div>

                <TranscriptionActions
                  transcriptionText={transcription}
                  recordingTitle={recordingTitle}
                  onNewRecording={handleNewRecording}
                  textSize={textSize}
                  useCustomIcons={useCustomIcons}
                  iconColor={iconColor}
                />
              </TabsContent>
            </Tabs>
          </Card>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Premium Voice-to-Text Converter</p>
            <p className="mt-1">Tap the microphone to start recording</p>
          </div>
        </div>
      </main>
    </Providers>
  );
}
