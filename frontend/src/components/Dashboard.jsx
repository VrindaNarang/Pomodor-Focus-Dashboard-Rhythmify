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
  const [dailyTasks, setDailyTasks] = useState(() => {
    // Load tasks from localStorage or use default
    const savedTasks = localStorage.getItem('focusflame-daily-tasks');
    return savedTasks ? JSON.parse(savedTasks) : mockData.dailyTasks;
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('focusflame-daily-tasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  const completedTasks = dailyTasks.filter(task => task.completed).length;
  const allTasksComplete = completedTasks === dailyTasks.length;
  const goalReached = dailyProgress.completedSessions >= timerSettings.dailyTarget;
  const streakEligible = allTasksComplete && goalReached;

  const handleTaskToggle = (taskId) => {
    setDailyTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleTaskAdd = (newTask) => {
    const task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      category: newTask.category || "Custom",
      completed: false
    };
    setDailyTasks(prev => [...prev, task]);
  };

  const handleTaskEdit = (taskId, updatedTask) => {
    setDailyTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, title: updatedTask.title, category: updatedTask.category }
          : task
      )
    );
  };

  const handleTaskDelete = (taskId) => {
    setDailyTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleTaskReorder = (fromIndex, toIndex) => {
    setDailyTasks(prev => {
      const newTasks = [...prev];
      const [removed] = newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, removed);
      return newTasks;
    });
  };

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
            totalTasks={dailyTasks.length}
          />
        </div>
        
        {/* Main Dashboard Grid - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Daily Tasks */}
          <div className="lg:col-span-1">
            <DailyTasks 
              tasks={dailyTasks}
              onTaskToggle={handleTaskToggle}
              onTaskAdd={handleTaskAdd}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
              onTaskReorder={handleTaskReorder}
            />
          </div>
          
          {/* Center Column - Timer */}
          <div className="lg:col-span-1 flex flex-col items-center justify-start">
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
          <div className="lg:col-span-1">
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