import React from "react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Flame, Clock, Target } from "lucide-react";

const ProgressBar = ({ dailyProgress, timerSettings }) => {
  const targetSessions = timerSettings.dailyTarget;
  const completedSessions = dailyProgress.completedSessions;
  const progressPercentage = (completedSessions / targetSessions) * 100;
  const studyHours = Math.floor(dailyProgress.totalStudyTime / 60);
  const studyMinutes = dailyProgress.totalStudyTime % 60;

  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Streak */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-600 rounded-full">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {dailyProgress.currentStreak}
            </div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
        </div>
        
        {/* Total Study Time */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-full">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {studyHours}h {studyMinutes}m
            </div>
            <div className="text-sm text-gray-400">Today's Focus</div>
          </div>
        </div>
        
        {/* Daily Goal Progress */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-600 rounded-full">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <div className="text-2xl font-bold text-white">
                {completedSessions}/{targetSessions}
              </div>
              <div className="text-sm text-gray-400">Sessions</div>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressBar;