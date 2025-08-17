import React, { useState, useEffect } from "react";
import PomodoroTimer from "./PomodoroTimer";
import ProgressBar from "./ProgressBar";
import StreakCalendar from "./StreakCalendar";
import DailyTasks from "./DailyTasks";
import TimerSettings from "./TimerSettings";
import { mockData } from "../utils/mockData";

const Dashboard = () => {
  const [timerSettings, setTimerSettings] = useState(mockData.defaultSettings);
  const [currentSession, setCurrentSession] = useState(mockData.currentSession);
  const [dailyProgress, setDailyProgress] = useState(mockData.dailyProgress);
  const [streakData, setStreakData] = useState(mockData.streakData);
  const [dailyTasks, setDailyTasks] = useState(mockData.dailyTasks);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar 
          dailyProgress={dailyProgress} 
          timerSettings={timerSettings}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-1">
            <StreakCalendar streakData={streakData} />
          </div>
          
          {/* Center Column - Timer */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <PomodoroTimer 
              settings={timerSettings}
              currentSession={currentSession}
              onSessionComplete={(sessionData) => {
                setDailyProgress(prev => ({
                  ...prev,
                  completedSessions: prev.completedSessions + 1,
                  totalStudyTime: prev.totalStudyTime + sessionData.duration
                }));
              }}
            />
            
            <TimerSettings 
              settings={timerSettings}
              onSettingsChange={setTimerSettings}
              isOpen={showSettings}
              onToggle={() => setShowSettings(!showSettings)}
            />
          </div>
          
          {/* Right Column - Daily Tasks */}
          <div className="lg:col-span-1">
            <DailyTasks 
              tasks={dailyTasks}
              onTaskToggle={(taskId) => {
                setDailyTasks(prev => 
                  prev.map(task => 
                    task.id === taskId 
                      ? { ...task, completed: !task.completed }
                      : task
                  )
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;