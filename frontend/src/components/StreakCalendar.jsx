import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Award } from "lucide-react";

const StreakCalendar = ({ streakData, dailyProgress, timerSettings, completedTasks, totalTasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const getDateStatus = (date) => {
    const dateKey = formatDateKey(date);
    const dayData = streakData[dateKey];
    
    if (date.getMonth() !== currentDate.getMonth()) {
      return { emoji: "", status: "out-of-month", tooltip: "" };
    }
    
    if (isToday(date)) {
      const sessionsProgress = `${dailyProgress.completedSessions}/${timerSettings.dailyTarget}`;
      const tasksProgress = `${completedTasks}/${totalTasks}`;
      const isEligible = completedTasks === totalTasks && dailyProgress.completedSessions >= timerSettings.dailyTarget;
      
      return {
        emoji: isEligible ? "🔥" : "⏳",
        status: isEligible ? "completed" : "in-progress",
        tooltip: isEligible 
          ? `Today: Completed! ${sessionsProgress} sessions, ${tasksProgress} tasks ✨`
          : `Today: In progress... ${sessionsProgress} sessions, ${tasksProgress} tasks`
      };
    }
    
    if (dayData === undefined) {
      return { emoji: "", status: "no-data", tooltip: "No data available" };
    }
    
    return {
      emoji: dayData ? "🔥" : "😭",
      status: dayData ? "completed" : "missed",
      tooltip: dayData 
        ? `Goal achieved! All tasks & sessions completed 🏆`
        : `Goal missed. Some tasks or sessions incomplete 💔`
    };
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const getCurrentStreak = () => {
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    while (true) {
      const dateKey = formatDateKey(checkDate);
      if (streakData[dateKey] === true || (isToday(checkDate) && completedTasks === totalTasks && dailyProgress.completedSessions >= timerSettings.dailyTarget)) {
        streak++;
      } else {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
      if (streak > 30) break; // Safety limit
    }
    
    return streak;
  };
  
  const days = getDaysInMonth(currentDate);
  const currentStreak = getCurrentStreak();
  const totalCompletedDays = Object.values(streakData).filter(Boolean).length;

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-white">
              Streak Calendar
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-orange-500 text-orange-400">
              {currentStreak} day streak
            </Badge>
          </div>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center justify-between mt-4">
          <h3 className="text-xl font-bold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(-1)}
              className="border-gray-600 hover:bg-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(1)}
              className="border-gray-600 hover:bg-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-500/20">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-lg font-bold text-white">{currentStreak}</div>
              <div className="text-xs text-orange-300">Current Streak</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/20">
            <Award className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-lg font-bold text-white">{totalCompletedDays}</div>
              <div className="text-xs text-purple-300">Total Wins</div>
            </div>
          </div>
        </div>
        
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <TooltipProvider>
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const { emoji, status, tooltip } = getDateStatus(date);
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        aspect-square flex flex-col items-center justify-center text-sm cursor-pointer
                        transition-all duration-200 rounded-lg relative
                        ${date.getMonth() === currentDate.getMonth() 
                          ? "text-white hover:bg-gray-600/50" 
                          : "text-gray-600"
                        }
                        ${isToday(date) 
                          ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg ring-2 ring-orange-400 ring-opacity-50" 
                          : ""
                        }
                        ${status === "completed" && !isToday(date)
                          ? "bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/30"
                          : ""
                        }
                        ${status === "missed"
                          ? "bg-gradient-to-br from-red-600/20 to-red-700/20 border border-red-500/30"
                          : ""
                        }
                      `}
                    >
                      <div className="text-xs mb-1 font-medium">
                        {date.getDate()}
                      </div>
                      <div className="text-lg leading-none">
                        {emoji}
                      </div>
                      
                      {/* Today indicator */}
                      {isToday(date) && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 border-gray-600">
                    <p className="text-sm">
                      <span className="font-medium">{date.toLocaleDateString()}</span>
                      <br />
                      {tooltip}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
        
        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <span className="text-green-400 font-medium">Goal achieved</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">😭</span>
              <span className="text-red-400 font-medium">Goal missed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⏳</span>
              <span className="text-yellow-400 font-medium">In progress (today)</span>
            </div>
            <div className="flex items-center space-x-2 col-span-1">
              <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded border ring-1 ring-orange-400 ring-opacity-50"></div>
              <span className="text-orange-400 font-medium">Today</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-400 text-center">
            Complete all 6 daily tasks + {timerSettings.dailyTarget} Pomodoro sessions to earn your daily 🔥
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;