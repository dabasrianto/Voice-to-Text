"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Copy, Share2, Save, Edit, Mic } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faShare,
  faSave,
  faEdit,
  faMicrophone,
  faClipboard,
  faShareAlt,
  faBookmark,
  faPencilAlt,
  faMicrophoneAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";

interface TranscriptionActionsProps {
  transcriptionText?: string;
  recordingTitle?: string;
  onCopy?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onEdit?: (text: string) => void;
  onNewRecording?: () => void;
  textSize?: string;
  useCustomIcons?: boolean;
  iconColor?: string;
}

const TranscriptionActions = ({
  transcriptionText = "",
  recordingTitle = "",
  onCopy = () => {},
  onShare = () => {},
  onSave = () => {},
  onEdit = () => {},
  onNewRecording = () => {},
  textSize = "text-md",
  useCustomIcons = false,
  iconColor = "text-white",
}: TranscriptionActionsProps) => {
  const [editedText, setEditedText] = useState(transcriptionText);
  const [editedTitle, setEditedTitle] = useState(recordingTitle);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [isCopySuccess, setIsCopySuccess] = useState(false);

  const handleCopy = () => {
    if (transcriptionText) {
      navigator.clipboard.writeText(transcriptionText);
      setIsCopySuccess(true);
      setTimeout(() => setIsCopySuccess(false), 2000);
      onCopy();
    }
  };

  const handleShare = () => {
    if (navigator.share && transcriptionText) {
      navigator
        .share({
          title: recordingTitle || "Voice Transcription",
          text: transcriptionText,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
          // Fallback for browsers that don't support Web Share API
          navigator.clipboard.writeText(transcriptionText);
          alert(
            "Sharing not supported on this browser. Text has been copied to clipboard instead.",
          );
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(transcriptionText);
      alert(
        "Sharing not supported on this browser. Text has been copied to clipboard instead.",
      );
    }
    onShare();
  };

  // Function to save transcription to localStorage
  const handleSave = () => {
    if (transcriptionText && transcriptionText.trim() !== "") {
      const savedTranscriptions = JSON.parse(
        localStorage.getItem("savedTranscriptions") || "[]",
      );
      const newTranscription = {
        id: Date.now().toString(),
        text: transcriptionText,
        title: recordingTitle || `Recording ${new Date().toLocaleString()}`,
        date: new Date().toISOString().split("T")[0],
        language: navigator.language || "en-US",
        duration: "N/A", // In a real app, you would track the actual duration
      };

      savedTranscriptions.push(newTranscription);
      localStorage.setItem(
        "savedTranscriptions",
        JSON.stringify(savedTranscriptions),
      );

      setIsSaveSuccess(true);
      setTimeout(() => setIsSaveSuccess(false), 2000);
      onSave();
    } else {
      alert("Cannot save empty transcription");
    }
  };

  const handleEditSubmit = () => {
    onEdit(editedText);
    // Update the title in the parent component if needed
    // This would require extending the onEdit function to accept a title parameter
    setIsEditDialogOpen(false);
  };

  const handleEditOpen = () => {
    setEditedText(transcriptionText);
    setEditedTitle(recordingTitle);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="w-full max-w-[350px] bg-background rounded-xl p-4 shadow-lg">
      <div className="flex flex-wrap justify-center gap-3">
        <TooltipProvider>
          <Tooltip open={isCopySuccess ? true : undefined}>
            <TooltipTrigger asChild>
              <Button
                onClick={handleCopy}
                disabled={!transcriptionText}
                variant="outline"
                className="flex-1 min-w-[80px] bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300"
              >
                {useCustomIcons ? (
                  <FontAwesomeIcon
                    icon={faCopy}
                    className={`h-5 w-5 mr-2 ${iconColor}`}
                  />
                ) : (
                  <Copy className="h-5 w-5 mr-2" />
                )}
                Copy
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isCopySuccess ? "Copied!" : "Copy to clipboard"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleShare}
                disabled={!transcriptionText}
                variant="outline"
                className="flex-1 min-w-[80px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300"
              >
                {useCustomIcons ? (
                  <FontAwesomeIcon
                    icon={faShare}
                    className={`h-5 w-5 mr-2 ${iconColor}`}
                  />
                ) : (
                  <Share2 className="h-5 w-5 mr-2" />
                )}
                Share
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share transcription</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip open={isSaveSuccess ? true : undefined}>
            <TooltipTrigger asChild>
              <Button
                onClick={handleSave}
                disabled={!transcriptionText}
                variant="outline"
                className="flex-1 min-w-[80px] bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 hover:bg-gradient-to-br hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300"
              >
                {useCustomIcons ? (
                  <FontAwesomeIcon
                    icon={faSave}
                    className={`h-5 w-5 mr-2 ${iconColor}`}
                  />
                ) : (
                  <Save className="h-5 w-5 mr-2" />
                )}
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isSaveSuccess ? "Saved!" : "Save transcription"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleEditOpen}
              disabled={!transcriptionText}
              variant="outline"
              className="flex-1 min-w-[80px] bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20 hover:bg-gradient-to-br hover:from-amber-500/20 hover:to-yellow-500/20 transition-all duration-300"
            >
              {useCustomIcons ? (
                <FontAwesomeIcon
                  icon={faEdit}
                  className={`h-5 w-5 mr-2 ${iconColor}`}
                />
              ) : (
                <Edit className="h-5 w-5 mr-2" />
              )}
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Transcription</DialogTitle>
              <DialogDescription>
                Make changes to your transcription below.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-4">
              <label htmlFor="title" className="text-sm font-medium block mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter recording title"
                className="w-full p-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className={`min-h-[200px] ${textSize}`}
            />
            <DialogFooter>
              <Button
                onClick={() => setIsEditDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onNewRecording}
                variant="outline"
                className="flex-1 min-w-[80px] bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20 hover:bg-gradient-to-br hover:from-pink-500/20 hover:to-rose-500/20 transition-all duration-300"
              >
                {useCustomIcons ? (
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className={`h-5 w-5 mr-2 ${iconColor}`}
                  />
                ) : (
                  <Mic className="h-5 w-5 mr-2" />
                )}
                New
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start new recording</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TranscriptionActions;
