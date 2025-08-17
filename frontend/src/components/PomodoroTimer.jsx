import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Settings } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import TimerSettingsModal from "./TimerSettingsModal";

const PomodoroTimer = ({ settings, currentSession, onSettingsChange, onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState("focus"); // focus, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const intervalRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          const totalTime = sessionType === "focus" ? settings.focusTime * 60 :
                           sessionType === "shortBreak" ? settings.shortBreakTime * 60 :
                           settings.longBreakTime * 60;
          setProgress(((totalTime - newTime) / totalTime) * 100);
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, sessionType, settings]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }
  }, [timeLeft, isRunning]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    // Play completion sound
    if (soundEnabled) {
      playCompletionSound();
    }
    
    // Visual celebration
    celebrateCompletion();
    
    if (sessionType === "focus") {
      setSessionsCompleted(prev => prev + 1);
      onSessionComplete({
        type: "focus",
        duration: settings.focusTime,
        timestamp: new Date()
      });
      
      toast({
        title: "🍅 Focus Session Complete!",
        description: "Excellent work! Time for a well-deserved break.",
      });
      
      // Auto-switch to break
      const isLongBreak = (sessionsCompleted + 1) % 4 === 0;
      const nextSessionType = isLongBreak ? "longBreak" : "shortBreak";
      setSessionType(nextSessionType);
      setTimeLeft(isLongBreak ? settings.longBreakTime * 60 : settings.shortBreakTime * 60);
    } else {
      toast({
        title: "☕ Break Complete!",
        description: "Refreshed and ready for another focus session?",
      });
      
      setSessionType("focus");
      setTimeLeft(settings.focusTime * 60);
    }
    
    setProgress(0);
  };

  const playCompletionSound = () => {
    // Mock implementation - will be replaced with actual audio
    console.log("🔔 Timer completion sound played!");
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  const celebrateCompletion = () => {
    // Add visual celebration effect
    const timer = document.querySelector('.timer-container');
    if (timer) {
      timer.classList.add('celebration');
      setTimeout(() => {
        timer.classList.remove('celebration');
      }, 1000);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setProgress(0);
    const totalTime = sessionType === "focus" ? settings.focusTime * 60 :
                     sessionType === "shortBreak" ? settings.shortBreakTime * 60 :
                     settings.longBreakTime * 60;
    setTimeLeft(totalTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getSessionData = () => {
    switch (sessionType) {
      case "focus":
        return {
          label: "Focus Time",
          color: "text-orange-500",
          bgColor: "from-orange-500 to-orange-600",
          borderColor: "border-orange-500/30"
        };
      case "shortBreak":
        return {
          label: "Short Break",
          color: "text-green-500",
          bgColor: "from-green-500 to-green-600",
          borderColor: "border-green-500/30"
        };
      case "longBreak":
        return {
          label: "Long Break",
          color: "text-blue-500",
          bgColor: "from-blue-500 to-blue-600",
          borderColor: "border-blue-500/30"
        };
      default:
        return {
          label: "Focus Time",
          color: "text-orange-500",
          bgColor: "from-orange-500 to-orange-600",
          borderColor: "border-orange-500/30"
        };
    }
  };

  const getCurrentPreset = () => {
    const presets = [
      { name: "Standard", focusTime: 25, shortBreakTime: 5, longBreakTime: 15, dailyTarget: 8 },
      { name: "Deep Work", focusTime: 50, shortBreakTime: 10, longBreakTime: 30, dailyTarget: 6 },
      { name: "Quick Sprint", focusTime: 15, shortBreakTime: 3, longBreakTime: 10, dailyTarget: 12 }
    ];
    
    return presets.find(preset => 
      preset.focusTime === settings.focusTime &&
      preset.shortBreakTime === settings.shortBreakTime &&
      preset.longBreakTime === settings.longBreakTime &&
      preset.dailyTarget === settings.dailyTarget
    );
  };

  const sessionData = getSessionData();
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const currentPreset = getCurrentPreset();

  return (
    <>
      <Card className={`timer-container relative p-8 bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-2xl transition-all duration-300 ${sessionData.borderColor}`}>
        {/* Settings Gear Icon */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={() => setShowSettingsModal(true)}
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-6">
          {/* Session Type & Status */}
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className={`${sessionData.color} border-current px-3 py-1`}>
                {sessionData.label}
              </Badge>
              
              {currentPreset && (
                <Badge variant="outline" className="border-orange-500 text-orange-400">
                  {currentPreset.name}
                </Badge>
              )}
              
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white w-8 h-8 p-0"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          {/* Circular Timer */}
          <div className="relative w-80 h-80">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-700"
              />
              
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className={sessionData.color}
                style={{
                  transition: "stroke-dashoffset 1s linear",
                  filter: "drop-shadow(0 0 8px currentColor)"
                }}
              />
              
              {/* Accent notches at cardinal points */}
              {[0, 90, 180, 270].map((angle, index) => (
                <circle
                  key={angle}
                  cx={50 + 42 * Math.cos((angle * Math.PI) / 180)}
                  cy={50 + 42 * Math.sin((angle * Math.PI) / 180)}
                  r="2"
                  fill="currentColor"
                  className={`${sessionData.color} opacity-60`}
                />
              ))}
              
              {/* Hour markers */}
              {Array.from({ length: 12 }, (_, i) => i * 30).map((angle) => (
                <circle
                  key={angle}
                  cx={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                  cy={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                  r="1"
                  fill="currentColor"
                  className="text-gray-600"
                />
              ))}
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-black text-white mb-2 font-mono tracking-tight">
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg text-gray-400 mb-2 font-medium">
                Session {sessionsCompleted + 1}
              </div>
              {progress > 0 && (
                <div className={`text-sm ${sessionData.color} font-medium`}>
                  {Math.round(progress)}% Complete
                </div>
              )}
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleTimer}
              size="lg"
              className={`px-8 py-3 bg-gradient-to-r ${sessionData.bgColor} hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-6 h-6 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 mr-2" />
                  Start
                </>
              )}
            </Button>
            
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="border-gray-600 hover:bg-gray-700 px-6 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
          
          {/* Session Progress Indicator */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < sessionsCompleted
                    ? `bg-gradient-to-r ${sessionData.bgColor} shadow-md`
                    : "bg-gray-600"
                }`}
              />
            ))}
            <span className="text-sm text-gray-400 ml-2">
              {sessionsCompleted}/4 cycles
            </span>
          </div>
        </div>
        
        <style jsx>{`
          .timer-container.celebration {
            animation: celebration 1s ease-in-out;
          }
          
          @keyframes celebration {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </Card>

      {/* Settings Modal */}
      <TimerSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </>
  );
};

export default PomodoroTimer;