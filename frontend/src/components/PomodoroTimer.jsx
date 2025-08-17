import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Play, Pause, RotateCcw, Settings, Volume2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const PomodoroTimer = ({ settings, currentSession, onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState("focus"); // focus, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [progress, setProgress] = useState(0);
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
    
    // Play completion sound (mock for now)
    playCompletionSound();
    
    if (sessionType === "focus") {
      setSessionsCompleted(prev => prev + 1);
      onSessionComplete({
        type: "focus",
        duration: settings.focusTime,
        timestamp: new Date()
      });
      
      toast({
        title: "🍅 Focus Session Complete!",
        description: "Great work! Time for a break.",
      });
      
      // Auto-switch to break
      const isLongBreak = (sessionsCompleted + 1) % 4 === 0;
      const nextSessionType = isLongBreak ? "longBreak" : "shortBreak";
      setSessionType(nextSessionType);
      setTimeLeft(isLongBreak ? settings.longBreakTime * 60 : settings.shortBreakTime * 60);
    } else {
      toast({
        title: "☕ Break Complete!",
        description: "Ready for another focus session?",
      });
      
      setSessionType("focus");
      setTimeLeft(settings.focusTime * 60);
    }
    
    setProgress(0);
  };

  const playCompletionSound = () => {
    // Mock implementation - will be replaced with actual audio
    console.log("🔔 Timer completion sound played!");
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

  const getSessionColor = () => {
    switch (sessionType) {
      case "focus":
        return "text-orange-500";
      case "shortBreak":
        return "text-green-500";
      case "longBreak":
        return "text-blue-500";
      default:
        return "text-orange-500";
    }
  };

  const getSessionLabel = () => {
    switch (sessionType) {
      case "focus":
        return "Focus Time";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
      default:
        return "Focus Time";
    }
  };

  return (
    <Card className="p-8 bg-gray-800 border-gray-700 text-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Session Type */}
        <div className={`text-lg font-medium ${getSessionColor()}`}>
          {getSessionLabel()}
        </div>
        
        {/* Circular Timer */}
        <div className="relative w-64 h-64">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
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
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={sessionType === "focus" ? "text-orange-500" : 
                        sessionType === "shortBreak" ? "text-green-500" : 
                        "text-blue-500"}
              style={{
                transition: "stroke-dashoffset 1s linear"
              }}
            />
            
            {/* Accent notches */}
            {[0, 90, 180, 270].map((angle) => (
              <circle
                key={angle}
                cx={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                cy={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                r="2"
                fill="currentColor"
                className="text-gray-500"
              />
            ))}
          </svg>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-white mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-400">
              Session {sessionsCompleted + 1}
            </div>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex space-x-4">
          <Button
            onClick={toggleTimer}
            size="lg"
            className={`${sessionType === "focus" ? "bg-orange-600 hover:bg-orange-700" : 
                       sessionType === "shortBreak" ? "bg-green-600 hover:bg-green-700" : 
                       "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="border-gray-600 hover:bg-gray-700"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PomodoroTimer;