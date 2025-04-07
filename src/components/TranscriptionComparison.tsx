"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import RecordingInterface from "./RecordingInterface";
import WhisperTranscription from "./WhisperTranscription";
import TranscriptionActions from "./TranscriptionActions";

const TranscriptionComparison = () => {
  const [webSpeechTranscription, setWebSpeechTranscription] = useState("");
  const [webSpeechTitle, setWebSpeechTitle] = useState("");
  const [whisperTranscription, setWhisperTranscription] = useState("");
  const [whisperTitle, setWhisperTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("id-ID");
  const [animationType, setAnimationType] = useState("wave");

  const handleWebSpeechComplete = (text: string, title?: string) => {
    setWebSpeechTranscription(text);
    setWebSpeechTitle(title || "");
  };

  const handleWhisperComplete = (text: string, title?: string) => {
    setWhisperTranscription(text);
    setWhisperTitle(title || "");
  };

  const handleNewWebSpeechRecording = () => {
    setWebSpeechTranscription("");
  };

  const handleNewWhisperRecording = () => {
    setWhisperTranscription("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
        Transcription Method Comparison
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Web Speech API */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Web Speech API</h2>
          <Card className="p-6 rounded-xl shadow-lg bg-card border-border">
            <Tabs defaultValue="record" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="record">Record</TabsTrigger>
                <TabsTrigger value="result">Result</TabsTrigger>
              </TabsList>

              <TabsContent value="record" className="space-y-4">
                <RecordingInterface
                  onTranscriptionComplete={handleWebSpeechComplete}
                  defaultLanguage={selectedLanguage}
                  animationType={animationType}
                />
              </TabsContent>

              <TabsContent value="result" className="space-y-4">
                <div className="min-h-[200px] p-4 rounded-lg border border-border overflow-y-auto">
                  {webSpeechTranscription ? (
                    <p className="text-sm">{webSpeechTranscription}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center italic">
                      Your transcription will appear here after recording
                    </p>
                  )}
                </div>

                <TranscriptionActions
                  transcriptionText={webSpeechTranscription}
                  recordingTitle={webSpeechTitle}
                  onNewRecording={handleNewWebSpeechRecording}
                />
              </TabsContent>
            </Tabs>
          </Card>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Pros: Built into browsers, no API key needed</p>
            <p>Cons: Limited accuracy, fewer language options</p>
          </div>
        </div>

        {/* Whisper API */}
        <div>
          <h2 className="text-xl font-semibold mb-4">OpenAI Whisper API</h2>
          <Card className="p-6 rounded-xl shadow-lg bg-card border-border">
            <Tabs defaultValue="record" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="record">Record</TabsTrigger>
                <TabsTrigger value="result">Result</TabsTrigger>
              </TabsList>

              <TabsContent value="record" className="space-y-4">
                <WhisperTranscription
                  onTranscriptionComplete={handleWhisperComplete}
                  defaultLanguage={selectedLanguage}
                  animationType={animationType}
                />
              </TabsContent>

              <TabsContent value="result" className="space-y-4">
                <div className="min-h-[200px] p-4 rounded-lg border border-border overflow-y-auto">
                  {whisperTranscription ? (
                    <p className="text-sm">{whisperTranscription}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center italic">
                      Your transcription will appear here after recording
                    </p>
                  )}
                </div>

                <TranscriptionActions
                  transcriptionText={whisperTranscription}
                  recordingTitle={whisperTitle}
                  onNewRecording={handleNewWhisperRecording}
                />
              </TabsContent>
            </Tabs>
          </Card>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Pros: Higher accuracy, better language support</p>
            <p>Cons: Requires API key, may have usage costs</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-card rounded-xl shadow-lg border border-border">
        <h3 className="text-lg font-semibold mb-4">
          Comparison of Transcription Methods
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2">Feature</th>
              <th className="text-left p-2">Web Speech API</th>
              <th className="text-left p-2">OpenAI Whisper</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-2">Accuracy</td>
              <td className="p-2">Medium</td>
              <td className="p-2">High</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-2">Language Support</td>
              <td className="p-2">Limited (browser dependent)</td>
              <td className="p-2">Extensive (100+ languages)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-2">Cost</td>
              <td className="p-2">Free</td>
              <td className="p-2">Pay per use</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-2">Implementation</td>
              <td className="p-2">Client-side only</td>
              <td className="p-2">Requires server integration</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-2">Offline Support</td>
              <td className="p-2">Some browsers</td>
              <td className="p-2">No (API-based)</td>
            </tr>
            <tr>
              <td className="p-2">Punctuation</td>
              <td className="p-2">Limited</td>
              <td className="p-2">Excellent</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TranscriptionComparison;
