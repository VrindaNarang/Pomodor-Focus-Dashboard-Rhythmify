import React, { useState, useEffect } from "react";
import PomodoroTimer from "./PomodoroTimer";
import ProgressBar from "./ProgressBar";
import StreakCalendar from "./StreakCalendar";
import DailyTasks from "./DailyTasks";
import DashboardHeader from "./DashboardHeader";
import DashboardNav from "./DashboardNav";
import { mockData } from "../utils/mockData";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [timerSettings, setTimerSettings] = useState(() => {
    const saved = localStorage.getItem('rhythmify-timer-settings');
    return saved ? JSON.parse(saved) : mockData.defaultSettings;
  });
  
  const [currentSession, setCurrentSession] = useState(mockData.currentSession);
  
  const [dailyProgress, setDailyProgress] = useState(() => {
    const saved = localStorage.getItem('rhythmify-daily-progress');
    return saved ? JSON.parse(saved) : mockData.dailyProgress;
  });
  
  const [streakData, setStreakData] = useState(() => {
    const saved = localStorage.getItem('rhythmify-streak-data');
    return saved ? JSON.parse(saved) : mockData.streakData;
  });
  
  const [dailyTasks, setDailyTasks] = useState(() => {
    const savedTasks = localStorage.getItem('rhythmify-daily-tasks');
    return savedTasks ? JSON.parse(savedTasks) : mockData.dailyTasks;
  });

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rhythmify-timer-settings', JSON.stringify(timerSettings));
  }, [timerSettings]);

  useEffect(() => {
    localStorage.setItem('rhythmify-daily-progress', JSON.stringify(dailyProgress));
  }, [dailyProgress]);

  useEffect(() => {
    localStorage.setItem('rhythmify-streak-data', JSON.stringify(streakData));
  }, [streakData]);

  useEffect(() => {
    localStorage.setItem('rhythmify-daily-tasks', JSON.stringify(dailyTasks));
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
    <motion.div 
      className="min-h-screen bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Dashboard Navigation */}
        <DashboardNav />
        
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <DashboardHeader />
        </motion.div>
        
        {/* Progress Stats Bar */}
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ProgressBar 
            dailyProgress={dailyProgress} 
            timerSettings={timerSettings}
            streakEligible={streakEligible}
            totalTasks={dailyTasks.length}
          />
        </motion.div>
        
        {/* Main Dashboard Grid - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Daily Tasks */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <DailyTasks 
              tasks={dailyTasks}
              onTaskToggle={handleTaskToggle}
              onTaskAdd={handleTaskAdd}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
              onTaskReorder={handleTaskReorder}
            />
          </motion.div>
          
          {/* Center Column - Timer */}
          <motion.div 
            className="lg:col-span-1 flex flex-col items-center justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
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
          </motion.div>
          
          {/* Right Column - Calendar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <StreakCalendar 
              streakData={streakData} 
              dailyProgress={dailyProgress}
              timerSettings={timerSettings}
              completedTasks={completedTasks}
              totalTasks={dailyTasks.length}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;