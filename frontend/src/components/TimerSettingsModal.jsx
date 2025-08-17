import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Settings, Save, RotateCcw, Timer, Zap, Clock, X } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const TimerSettingsModal = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const presets = [
    {
      name: "Standard",
      icon: Timer,
      focusTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      dailyTarget: 8
    },
    {
      name: "Deep Work",
      icon: Zap,
      focusTime: 50,
      shortBreakTime: 10,
      longBreakTime: 30,
      dailyTarget: 6
    },
    {
      name: "Quick Sprint",
      icon: Clock,
      focusTime: 15,
      shortBreakTime: 3,
      longBreakTime: 10,
      dailyTarget: 12
    }
  ];

  // Update local settings when modal opens or settings prop changes
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handlePresetSelect = (preset) => {
    const newSettings = {
      ...localSettings,
      focusTime: preset.focusTime,
      shortBreakTime: preset.shortBreakTime,
      longBreakTime: preset.longBreakTime,
      dailyTarget: preset.dailyTarget
    };
    
    setLocalSettings(newSettings);
    
    // Auto-apply preset and close modal
    onSettingsChange(newSettings);
    onClose();
    
    toast({
      title: `${preset.name} Preset Applied`,
      description: `${preset.focusTime}min focus, ${preset.dailyTarget} sessions daily target`,
    });
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
    toast({
      title: "Custom Settings Saved",
      description: "Your timer preferences have been updated.",
    });
  };

  const handleCancel = () => {
    setLocalSettings(settings); // Reset to original settings
    setShowAdvanced(false);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      focusTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      dailyTarget: 8,
      soundEnabled: true,
      autoStartBreaks: true,
      autoStartPomodoros: false
    };
    setLocalSettings(defaultSettings);
  };

  const handleInputChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }));
  };

  const getCurrentPreset = () => {
    return presets.find(preset => 
      preset.focusTime === localSettings.focusTime &&
      preset.shortBreakTime === localSettings.shortBreakTime &&
      preset.longBreakTime === localSettings.longBreakTime &&
      preset.dailyTarget === localSettings.dailyTarget
    );
  };

  const currentPreset = getCurrentPreset();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-6 h-6 text-orange-500" />
              <DialogTitle className="text-xl font-bold text-white">
                Timer Settings
              </DialogTitle>
            </div>
            {currentPreset && (
              <Badge variant="outline" className="border-orange-500 text-orange-400">
                {currentPreset.name}
              </Badge>
            )}
          </div>
          <DialogDescription className="text-gray-400">
            Customize your Pomodoro timer intervals and daily targets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Preset Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-medium text-gray-200">Quick Presets</Label>
            <div className="grid grid-cols-3 gap-4">
              {presets.map((preset) => {
                const Icon = preset.icon;
                const isActive = currentPreset?.name === preset.name;
                
                return (
                  <Button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset)}
                    variant={isActive ? "default" : "outline"}
                    className={`flex flex-col items-center space-y-2 h-auto p-4 transition-all duration-200 ${
                      isActive 
                        ? "bg-orange-600 hover:bg-orange-700 border-orange-500 shadow-lg scale-105" 
                        : "border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs opacity-70">{preset.focusTime}min focus</div>
                      <div className="text-xs opacity-70">{preset.dailyTarget} sessions/day</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* Custom Settings Toggle */}
          <div className="flex justify-between items-center">
            <Label className="text-lg font-medium text-gray-200">Custom Settings</Label>
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="ghost"
              size="sm"
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
              {showAdvanced ? "Hide" : "Show"} Custom
            </Button>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="space-y-6 p-6 bg-gray-700/30 rounded-xl border border-gray-600/30">
              {/* Timer Intervals */}
              <div className="space-y-4">
                <Label className="text-base font-medium text-gray-300">Timer Intervals</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="focus-time" className="text-sm text-gray-400">
                      Focus Time (min)
                    </Label>
                    <Input
                      id="focus-time"
                      type="number"
                      value={localSettings.focusTime}
                      onChange={(e) => handleInputChange('focusTime', e.target.value)}
                      min="1"
                      max="120"
                      className="bg-gray-700 border-gray-600 text-white text-center mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="short-break" className="text-sm text-gray-400">
                      Short Break (min)
                    </Label>
                    <Input
                      id="short-break"
                      type="number"
                      value={localSettings.shortBreakTime}
                      onChange={(e) => handleInputChange('shortBreakTime', e.target.value)}
                      min="1"
                      max="60"
                      className="bg-gray-700 border-gray-600 text-white text-center mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="long-break" className="text-sm text-gray-400">
                      Long Break (min)
                    </Label>
                    <Input
                      id="long-break"
                      type="number"
                      value={localSettings.longBreakTime}
                      onChange={(e) => handleInputChange('longBreakTime', e.target.value)}
                      min="1"
                      max="120"
                      className="bg-gray-700 border-gray-600 text-white text-center mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-600" />

              {/* Daily Target */}
              <div className="space-y-2">
                <Label htmlFor="daily-target" className="text-base font-medium text-gray-300">
                  Daily Target
                </Label>
                <Input
                  id="daily-target"
                  type="number"
                  value={localSettings.dailyTarget}
                  onChange={(e) => handleInputChange('dailyTarget', e.target.value)}
                  min="1"
                  max="20"
                  className="bg-gray-700 border-gray-600 text-white text-center"
                />
                <div className="text-sm text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                  <strong>Target:</strong> {localSettings.dailyTarget} sessions = {Math.floor(localSettings.dailyTarget * localSettings.focusTime / 60)}h {(localSettings.dailyTarget * localSettings.focusTime) % 60}m focus time
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-600 hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-600 hover:bg-gray-700 px-6"
              >
                Cancel
              </Button>
              
              {showAdvanced && (
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 px-6"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Custom
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimerSettingsModal;