import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Settings, Save, RotateCcw, Timer, Zap, Clock } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const TimerSettings = ({ settings, onSettingsChange, isCompact = false }) => {
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

  const handlePresetSelect = (preset) => {
    setLocalSettings({
      ...localSettings,
      focusTime: preset.focusTime,
      shortBreakTime: preset.shortBreakTime,
      longBreakTime: preset.longBreakTime,
      dailyTarget: preset.dailyTarget
    });
    
    // Auto-apply preset
    onSettingsChange({
      ...localSettings,
      focusTime: preset.focusTime,
      shortBreakTime: preset.shortBreakTime,
      longBreakTime: preset.longBreakTime,
      dailyTarget: preset.dailyTarget
    });
    
    toast({
      title: `${preset.name} Preset Applied`,
      description: `${preset.focusTime}min focus, ${preset.dailyTarget} sessions daily target`,
    });
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setShowAdvanced(false);
    toast({
      title: "Custom Settings Saved",
      description: "Your timer preferences have been updated.",
    });
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
      preset.focusTime === settings.focusTime &&
      preset.shortBreakTime === settings.shortBreakTime &&
      preset.longBreakTime === settings.longBreakTime &&
      preset.dailyTarget === settings.dailyTarget
    );
  };

  const currentPreset = getCurrentPreset();

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center text-lg">
            <Settings className="w-5 h-5 mr-2 text-orange-500" />
            Timer Settings
          </CardTitle>
          {currentPreset && (
            <Badge variant="outline" className="border-orange-500 text-orange-400">
              {currentPreset.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Preset Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-300">Quick Presets</Label>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset) => {
              const Icon = preset.icon;
              const isActive = currentPreset?.name === preset.name;
              
              return (
                <Button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  variant={isActive ? "default" : "outline"}
                  className={`flex flex-col items-center space-y-1 h-auto p-3 ${
                    isActive 
                      ? "bg-orange-600 hover:bg-orange-700 border-orange-500" 
                      : "border-gray-600 hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{preset.name}</span>
                  <span className="text-xs opacity-70">{preset.focusTime}m</span>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator className="bg-gray-600" />

        {/* Custom Settings Toggle */}
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-gray-300">Custom Settings</Label>
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="ghost"
            size="sm"
            className="text-orange-400 hover:text-orange-300"
          >
            {showAdvanced ? "Hide" : "Show"}
          </Button>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
            {/* Timer Intervals */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="focus-time" className="text-xs text-gray-400">
                  Focus (min)
                </Label>
                <Input
                  id="focus-time"
                  type="number"
                  value={localSettings.focusTime}
                  onChange={(e) => handleInputChange('focusTime', e.target.value)}
                  min="1"
                  max="120"
                  className="bg-gray-700 border-gray-600 text-white text-center"
                />
              </div>
              
              <div>
                <Label htmlFor="short-break" className="text-xs text-gray-400">
                  Short Break (min)
                </Label>
                <Input
                  id="short-break"
                  type="number"
                  value={localSettings.shortBreakTime}
                  onChange={(e) => handleInputChange('shortBreakTime', e.target.value)}
                  min="1"
                  max="60"
                  className="bg-gray-700 border-gray-600 text-white text-center"
                />
              </div>
              
              <div>
                <Label htmlFor="long-break" className="text-xs text-gray-400">
                  Long Break (min)
                </Label>
                <Input
                  id="long-break"
                  type="number"
                  value={localSettings.longBreakTime}
                  onChange={(e) => handleInputChange('longBreakTime', e.target.value)}
                  min="1"
                  max="120"
                  className="bg-gray-700 border-gray-600 text-white text-center"
                />
              </div>
            </div>

            {/* Daily Target */}
            <div>
              <Label htmlFor="daily-target" className="text-xs text-gray-400">
                Daily Target (Sessions)
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
              <div className="text-xs text-gray-500 mt-1">
                = {Math.floor(localSettings.dailyTarget * localSettings.focusTime / 60)}h {(localSettings.dailyTarget * localSettings.focusTime) % 60}m focus time
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="border-gray-600 hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimerSettings;