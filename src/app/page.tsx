"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Settings, History } from "lucide-react";
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
import { motion } from "framer-motion";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  const [transcription, setTranscription] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("id-ID");
  const [activeTab, setActiveTab] = useState("record");

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
    setActiveTab("result");
  };

  const handleNewRecording = () => {
    setTranscription("");
    setActiveTab("record");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-background text-foreground">
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
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
              />
            </TabsContent>

            <TabsContent value="result" className="space-y-4">
              <div className="min-h-[200px] p-4 rounded-lg border border-border overflow-y-auto">
                {transcription ? (
                  <p className="text-sm">{transcription}</p>
                ) : (
                  <p className="text-sm text-muted-foreground text-center italic">
                    Your transcription will appear here after recording
                  </p>
                )}
              </div>

              <TranscriptionActions
                transcriptionText={transcription}
                onNewRecording={handleNewRecording}
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
  );
}
