import React, { useState, useEffect } from "react";
import PomodoroTimer from "./PomodoroTimer";
import ProgressBar from "./ProgressBar";
import StreakCalendar from "./StreakCalendar";
import DailyTasks from "./DailyTasks";
import DashboardHeader from "./DashboardHeader";
import { mockData } from "../utils/mockData";

const Dashboard = () => {
  const [timerSettings, setTimerSettings] = useState(mockData.defaultSettings);
  const [currentSession, setCurrentSession] = useState(mockData.currentSession);
  const [dailyProgress, setDailyProgress] = useState(mockData.dailyProgress);
  const [streakData, setStreakData] = useState(mockData.streakData);
  const [dailyTasks, setDailyTasks] = useState(mockData.dailyTasks);

  const completedTasks = dailyTasks.filter(task => task.completed).length;
  const allTasksComplete = completedTasks === dailyTasks.length;
  const goalReached = dailyProgress.completedSessions >= timerSettings.dailyTarget;
  const streakEligible = allTasksComplete && goalReached;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Dashboard Header */}
        <DashboardHeader />
        
        {/* Progress Stats Bar */}
        <div className="mt-6">
          <ProgressBar 
            dailyProgress={dailyProgress} 
            timerSettings={timerSettings}
            streakEligible={streakEligible}
          />
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Left Column - Daily Tasks */}
          <div className="lg:col-span-4">
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
          
          {/* Center Column - Timer */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <PomodoroTimer 
              settings={timerSettings}
              currentSession={currentSession}
              onSettingsChange={setTimerSettings}
              onSessionComplete={(sessionData) => {
                setDailyProgress(prev => ({
                  ...prev,
                  completedSessions: prev.completedSessions + 1,
                  totalStudyTime: prev.totalStudyTime + sessionData.duration
                }));
              }}
            />
          </div>
          
          {/* Right Column - Calendar */}
          <div className="lg:col-span-4">
            <StreakCalendar 
              streakData={streakData} 
              dailyProgress={dailyProgress}
              timerSettings={timerSettings}
              completedTasks={completedTasks}
              totalTasks={dailyTasks.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;