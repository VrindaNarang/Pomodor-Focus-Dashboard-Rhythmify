import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Settings, Save, RotateCcw } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const TimerSettings = ({ settings, onSettingsChange, isOpen, onToggle }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const { toast } = useToast();

  const handleSave = () => {
    onSettingsChange(localSettings);
    onToggle();
    toast({
      title: "Settings Saved",
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

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        className="mt-4 border-gray-600 hover:bg-gray-700"
      >
        <Settings className="w-4 h-4 mr-2" />
        Timer Settings
      </Button>
    );
  }

  return (
    <Card className="mt-6 bg-gray-800 border-gray-700 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Timer Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Intervals */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-300">Timer Intervals</Label>
          
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
                className="bg-gray-700 border-gray-600 text-white"
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
                className="bg-gray-700 border-gray-600 text-white"
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
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-gray-600" />

        {/* Daily Target */}
        <div className="space-y-2">
          <Label htmlFor="daily-target" className="text-sm font-medium text-gray-300">
            Daily Target (Sessions)
          </Label>
          <Input
            id="daily-target"
            type="number"
            value={localSettings.dailyTarget}
            onChange={(e) => handleInputChange('dailyTarget', e.target.value)}
            min="1"
            max="20"
            className="bg-gray-700 border-gray-600 text-white"
          />
          <div className="text-xs text-gray-400">
            Equals {Math.floor(localSettings.dailyTarget * localSettings.focusTime / 60)}h {(localSettings.dailyTarget * localSettings.focusTime) % 60}m of focus time
          </div>
        </div>

        <Separator className="bg-gray-600" />

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleSave}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-gray-600 hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onToggle}
            variant="outline"
            className="border-gray-600 hover:bg-gray-700"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerSettings;