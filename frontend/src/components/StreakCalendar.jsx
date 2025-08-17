import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StreakCalendar = ({ streakData }) => {
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
  
  const getDateEmoji = (date) => {
    const dateKey = formatDateKey(date);
    const dayData = streakData[dateKey];
    
    if (date.getMonth() !== currentDate.getMonth()) {
      return "";
    }
    
    if (dayData === undefined) {
      return "";
    }
    
    return dayData ? "🔥" : "😭";
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const days = getDaysInMonth(currentDate);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
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
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => (
            <div
              key={index}
              className={`
                aspect-square flex flex-col items-center justify-center text-sm
                ${date.getMonth() === currentDate.getMonth() 
                  ? "text-white" 
                  : "text-gray-600"
                }
                ${isToday(date) 
                  ? "bg-orange-600 rounded-lg" 
                  : "hover:bg-gray-700 rounded-lg"
                }
                transition-colors cursor-pointer
              `}
            >
              <div className="text-xs">
                {date.getDate()}
              </div>
              <div className="text-lg leading-none">
                {getDateEmoji(date)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <span className="text-lg">🔥</span>
            <span>Goal achieved</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-lg">😭</span>
            <span>Goal missed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;