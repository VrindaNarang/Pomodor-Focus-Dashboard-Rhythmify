import React from "react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Flame, Clock, Target, Trophy, CheckCircle } from "lucide-react";

const ProgressBar = ({ dailyProgress, timerSettings, streakEligible, totalTasks }) => {
  const targetSessions = timerSettings.dailyTarget;
  const completedSessions = dailyProgress.completedSessions;
  const progressPercentage = Math.min((completedSessions / targetSessions) * 100, 100);
  const studyHours = Math.floor(dailyProgress.totalStudyTime / 60);
  const studyMinutes = dailyProgress.totalStudyTime % 60;
  
  const targetHours = Math.floor((targetSessions * timerSettings.focusTime) / 60);
  const targetMinutes = (targetSessions * timerSettings.focusTime) % 60;

  return (
    <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Current Streak */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/20">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-3xl font-black text-white mb-1">
              {dailyProgress.currentStreak}
            </div>
            <div className="text-sm text-orange-300 font-medium">Day Streak 🔥</div>
          </div>
        </div>
        
        {/* Total Study Time */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-3xl font-black text-white mb-1">
              {studyHours}h {studyMinutes}m
            </div>
            <div className="text-sm text-blue-300 font-medium">Today's Focus ⏰</div>
          </div>
        </div>
        
        {/* Daily Sessions Progress */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <div className="text-3xl font-black text-white">
                {completedSessions}/{targetSessions}
              </div>
              <div className="text-sm text-green-300 font-medium">Sessions 🎯</div>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
          </div>
        </div>
        
        {/* Streak Eligibility Status */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
          <div className={`p-3 rounded-xl shadow-lg ${
            streakEligible 
              ? "bg-gradient-to-br from-purple-500 to-purple-600" 
              : "bg-gradient-to-br from-gray-600 to-gray-700"
          }`}>
            {streakEligible ? (
              <Trophy className="w-6 h-6 text-white" />
            ) : (
              <CheckCircle className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <div className={`text-2xl font-black mb-1 ${
              streakEligible ? "text-purple-300" : "text-gray-400"
            }`}>
              {streakEligible ? "ELIGIBLE" : "IN PROGRESS"}
            </div>
            <div className={`text-sm font-medium ${
              streakEligible ? "text-purple-400" : "text-gray-500"
            }`}>
              Today's Streak {streakEligible ? "🏆" : "⏳"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Summary */}
      <div className="mt-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
        <div className="text-center text-sm text-gray-300">
          <span className="font-medium">Daily Target:</span> {targetHours}h {targetMinutes}m focus time & all {totalTasks} daily tasks
          {streakEligible && <span className="ml-2 text-green-400 font-bold">✅ Achieved!</span>}
        </div>
      </div>
    </Card>
  );
};

export default ProgressBar;