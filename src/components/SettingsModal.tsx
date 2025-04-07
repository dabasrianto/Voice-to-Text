"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnimationChange?: (animationType: string) => void;
  onTextSizeChange?: (textSize: string) => void;
  onUseCustomIconsChange?: (useCustomIcons: boolean) => void;
  onIconColorChange?: (iconColor: string) => void;
}

const backgroundColors = [
  { name: "Default", value: "bg-background" },
  { name: "Subtle Purple", value: "bg-purple-50 dark:bg-purple-950" },
  { name: "Subtle Blue", value: "bg-blue-50 dark:bg-blue-950" },
  { name: "Subtle Green", value: "bg-green-50 dark:bg-green-950" },
  { name: "Subtle Yellow", value: "bg-yellow-50 dark:bg-yellow-950" },
];

const animationTypes = [
  { name: "Wave", value: "wave" },
  { name: "Circle", value: "circle" },
  { name: "Pulse", value: "pulse" },
  { name: "Lottie", value: "lottie" },
  { name: "Sound Bars", value: "lottie1" },
  { name: "Equalizer", value: "lottie2" },
  { name: "Waveform", value: "lottie3" },
  { name: "Audio Spectrum", value: "lottie4" },
  { name: "Circular Wave", value: "lottie5" },
  { name: "Frequency", value: "lottie6" },
  { name: "Particles", value: "lottie7" },
  { name: "Ripple", value: "lottie8" },
  { name: "Bounce", value: "lottie9" },
  { name: "Glow", value: "lottie10" },
];

const textSizes = [
  { name: "Small", value: "text-sm" },
  { name: "Medium", value: "text-md" },
  { name: "Large", value: "text-lg" },
  { name: "Extra Large", value: "text-xl" },
  { name: "2XL", value: "text-2xl" },
];

const iconColors = [
  { name: "Default", value: "text-white" },
  { name: "Blue", value: "text-blue-500" },
  { name: "Purple", value: "text-purple-500" },
  { name: "Green", value: "text-green-500" },
  { name: "Red", value: "text-red-500" },
  { name: "Yellow", value: "text-yellow-500" },
  { name: "Pink", value: "text-pink-500" },
];

export default function SettingsModal({
  isOpen,
  onClose,
  onAnimationChange,
  onTextSizeChange,
  onUseCustomIconsChange,
  onIconColorChange,
}: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("appearance");
  const [bgColor, setBgColor] = useState("bg-background");
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

  // Apply background color to body
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Remove all background classes first
      document.body.classList.forEach((className) => {
        if (className.startsWith("bg-")) {
          document.body.classList.remove(className);
        }
      });

      // Add the selected background color class
      const colorClasses = bgColor.split(" ");
      colorClasses.forEach((colorClass) => {
        document.body.classList.add(colorClass);
      });

      // Save to localStorage
      localStorage.setItem("bgColor", bgColor);
    }
  }, [bgColor]);

  // Handle animation type change
  useEffect(() => {
    localStorage.setItem("animationType", animationType);
    if (onAnimationChange) {
      onAnimationChange(animationType);
    }
  }, [animationType, onAnimationChange]);

  // Handle text size change
  useEffect(() => {
    localStorage.setItem("textSize", textSize);
    if (onTextSizeChange) {
      onTextSizeChange(textSize);
    }
  }, [textSize, onTextSizeChange]);

  // Handle custom icons change
  useEffect(() => {
    localStorage.setItem("useCustomIcons", useCustomIcons.toString());
    if (onUseCustomIconsChange) {
      onUseCustomIconsChange(useCustomIcons);
    }
  }, [useCustomIcons, onUseCustomIconsChange]);

  // Handle icon color change
  useEffect(() => {
    localStorage.setItem("iconColor", iconColor);
    if (onIconColorChange) {
      onIconColorChange(iconColor);
    }
  }, [iconColor, onIconColorChange]);

  // Load saved background color on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBgColor = localStorage.getItem("bgColor");
      if (savedBgColor) {
        setBgColor(savedBgColor);
      }
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Settings</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="animation">Animation</TabsTrigger>
            <TabsTrigger value="text">Text & Icons</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Theme</h3>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="grid grid-cols-3 gap-2"
              >
                <div>
                  <RadioGroupItem
                    value="light"
                    id="theme-light"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="theme-light"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${theme === "light" ? "border-primary" : ""}`}
                  >
                    <div className="h-5 w-5 rounded-full bg-[#FFFFFF] border border-gray-200"></div>
                    <span className="mt-2 text-xs">Light</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="dark"
                    id="theme-dark"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="theme-dark"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${theme === "dark" ? "border-primary" : ""}`}
                  >
                    <div className="h-5 w-5 rounded-full bg-[#1F2937] border border-gray-700"></div>
                    <span className="mt-2 text-xs">Dark</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="system"
                    id="theme-system"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="theme-system"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${theme === "system" ? "border-primary" : ""}`}
                  >
                    <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FFFFFF] to-[#1F2937] border border-gray-300"></div>
                    <span className="mt-2 text-xs">System</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Background Color</h3>
              <RadioGroup
                value={bgColor}
                onValueChange={setBgColor}
                className="grid grid-cols-3 gap-2"
              >
                {backgroundColors.map((color) => (
                  <div key={color.value}>
                    <RadioGroupItem
                      value={color.value}
                      id={`bg-${color.value}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`bg-${color.value}`}
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${bgColor === color.value ? "border-primary" : ""}`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full ${color.value.split(" ")[0]}`}
                      ></div>
                      <span className="mt-2 text-xs">{color.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="animation" className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Recording Animation</h3>
              <div className="max-h-[300px] overflow-y-auto pr-2">
                <RadioGroup
                  value={animationType}
                  onValueChange={setAnimationType}
                  className="grid grid-cols-3 gap-2"
                >
                  {animationTypes.map((animation) => (
                    <div key={animation.value}>
                      <RadioGroupItem
                        value={animation.value}
                        id={`animation-${animation.value}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`animation-${animation.value}`}
                        className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${animationType === animation.value ? "border-primary" : ""}`}
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center dark:from-purple-600 dark:to-blue-500">
                          {animation.value === "wave" && (
                            <div className="flex h-5 space-x-0.5">
                              <div className="w-0.5 h-3 bg-white rounded-full" />
                              <div className="w-0.5 h-5 bg-white rounded-full" />
                              <div className="w-0.5 h-2 bg-white rounded-full" />
                              <div className="w-0.5 h-4 bg-white rounded-full" />
                            </div>
                          )}
                          {animation.value === "circle" && (
                            <div className="h-6 w-6 rounded-full border-2 border-white" />
                          )}
                          {animation.value === "pulse" && (
                            <div className="relative">
                              <div className="absolute h-8 w-8 rounded-full border border-white opacity-50" />
                              <div className="h-4 w-4 rounded-full bg-white" />
                            </div>
                          )}
                          {animation.value.startsWith("lottie") && (
                            <div className="flex h-5 space-x-0.5">
                              <div className="w-0.5 h-2 bg-white rounded-full" />
                              <div className="w-0.5 h-4 bg-white rounded-full" />
                              <div className="w-0.5 h-5 bg-white rounded-full" />
                              <div className="w-0.5 h-3 bg-white rounded-full" />
                              <div className="w-0.5 h-1 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                        <span className="mt-2 text-xs">{animation.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Text Size</h3>
              <RadioGroup
                value={textSize}
                onValueChange={setTextSize}
                className="grid grid-cols-3 gap-2"
              >
                {textSizes.map((size) => (
                  <div key={size.value}>
                    <RadioGroupItem
                      value={size.value}
                      id={`text-size-${size.value}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`text-size-${size.value}`}
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${textSize === size.value ? "border-primary" : ""}`}
                    >
                      <div className={`${size.value} font-medium`}>Aa</div>
                      <span className="mt-2 text-xs">{size.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Use FontAwesome Icons</h3>
                <Switch
                  checked={useCustomIcons}
                  onCheckedChange={setUseCustomIcons}
                  id="use-custom-icons"
                />
              </div>
            </div>

            {useCustomIcons && (
              <div className="space-y-4 mt-6">
                <h3 className="text-sm font-medium">Icon Color</h3>
                <RadioGroup
                  value={iconColor}
                  onValueChange={setIconColor}
                  className="grid grid-cols-3 gap-2"
                >
                  {iconColors.map((color) => (
                    <div key={color.value}>
                      <RadioGroupItem
                        value={color.value}
                        id={`icon-color-${color.value}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`icon-color-${color.value}`}
                        className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${iconColor === color.value ? "border-primary" : ""}`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full ${color.value.replace("text-", "bg-")}`}
                        ></div>
                        <span className="mt-2 text-xs">{color.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
