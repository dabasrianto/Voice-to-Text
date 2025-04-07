"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Trash2, Edit, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useTheme } from "next-themes";

interface Transcription {
  id: string;
  text: string;
  title?: string;
  date: string;
  language: string;
  duration: string;
}

export default function SavedTranscriptionsPage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedTranscriptions, setSavedTranscriptions] = useState<
    Transcription[]
  >([]);
  const [editingTranscription, setEditingTranscription] =
    useState<Transcription | null>(null);
  const [editedText, setEditedText] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Load saved transcriptions from localStorage
  useEffect(() => {
    const loadSavedTranscriptions = () => {
      try {
        const saved = localStorage.getItem("savedTranscriptions");
        if (saved) {
          setSavedTranscriptions(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error loading saved transcriptions:", error);
      }
    };

    loadSavedTranscriptions();
  }, []);

  const handleDeleteTranscription = (id: string) => {
    const updatedTranscriptions = savedTranscriptions.filter(
      (item) => item.id !== id,
    );
    setSavedTranscriptions(updatedTranscriptions);
    localStorage.setItem(
      "savedTranscriptions",
      JSON.stringify(updatedTranscriptions),
    );
  };

  const handleEditTranscription = (transcription: Transcription) => {
    setEditingTranscription(transcription);
    setEditedText(transcription.text);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingTranscription) {
      const updatedTranscriptions = savedTranscriptions.map((item) =>
        item.id === editingTranscription.id
          ? { ...item, text: editedText, title: editingTranscription.title }
          : item,
      );
      setSavedTranscriptions(updatedTranscriptions);
      localStorage.setItem(
        "savedTranscriptions",
        JSON.stringify(updatedTranscriptions),
      );
      setIsEditDialogOpen(false);
    }
  };

  const handleShareTranscription = (text: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Voice Transcription",
          text: text,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
          navigator.clipboard.writeText(text);
          alert(
            "Sharing not supported on this browser. Text has been copied to clipboard instead.",
          );
        });
    } else {
      navigator.clipboard.writeText(text);
      alert(
        "Sharing not supported on this browser. Text has been copied to clipboard instead.",
      );
    }
  };

  const filteredTranscriptions = searchQuery
    ? savedTranscriptions.filter(
        (item) =>
          item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.language.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : savedTranscriptions;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Saved Transcriptions</h1>
        <div className="w-10"></div> {/* Empty div for alignment */}
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search transcriptions..."
          className="pl-10 bg-card border-input rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Transcription list */}
      <ScrollArea className="flex-grow">
        {filteredTranscriptions.length > 0 ? (
          <div className="space-y-4">
            {filteredTranscriptions.map((transcription) => (
              <Card
                key={transcription.id}
                className="bg-card border-border overflow-hidden"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col space-y-1 w-full">
                      <div className="font-medium text-sm">
                        {transcription.title ||
                          `Recording ${transcription.date}`}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="bg-purple-900/30 text-purple-300 border-purple-700 dark:bg-purple-950/50 dark:text-purple-200"
                        >
                          {transcription.language}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {transcription.date}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {transcription.duration}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                        onClick={() => handleEditTranscription(transcription)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                        onClick={() =>
                          handleShareTranscription(transcription.text)
                        }
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-accent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Transcription
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this
                              transcription? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() =>
                                handleDeleteTranscription(transcription.id)
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <p className="text-sm line-clamp-3">{transcription.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <p className="mb-2">
              {searchQuery
                ? "No matching transcriptions found"
                : "No saved transcriptions yet"}
            </p>
            {!searchQuery && (
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-purple-700 text-purple-400 hover:bg-purple-900/20"
                >
                  Start Recording
                </Button>
              </Link>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transcription</DialogTitle>
            <DialogDescription>
              Make changes to your transcription below.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4">
            <label
              htmlFor="edit-title"
              className="text-sm font-medium block mb-2"
            >
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={editingTranscription?.title || ""}
              onChange={(e) =>
                setEditingTranscription((prev) =>
                  prev ? { ...prev, title: e.target.value } : null,
                )
              }
              placeholder="Enter recording title"
              className="w-full p-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="min-h-[200px]"
          />
          <DialogFooter>
            <Button
              onClick={() => setIsEditDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
