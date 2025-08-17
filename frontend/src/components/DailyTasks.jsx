import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { CheckSquare, Target, Sparkles, Trophy } from "lucide-react";

const DailyTasks = ({ tasks, onTaskToggle }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = (completedTasks / tasks.length) * 100;
  const allTasksComplete = completedTasks === tasks.length;

  const getCategoryIcon = (category) => {
    const icons = {
      "Learning": "🧠",
      "Health": "🧘",
      "Fitness": "💪",
      "Mindfulness": "🕯️",
      "Nutrition": "🥗",
      "Routine": "⏰"
    };
    return icons[category] || "📝";
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Learning": "text-blue-400 border-blue-500/30",
      "Health": "text-green-400 border-green-500/30",
      "Fitness": "text-red-400 border-red-500/30",
      "Mindfulness": "text-purple-400 border-purple-500/30",
      "Nutrition": "text-yellow-400 border-yellow-500/30",
      "Routine": "text-orange-400 border-orange-500/30"
    };
    return colors[category] || "text-gray-400 border-gray-500/30";
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-green-500" />
            <CardTitle className="text-white">Complete Daily Tasks</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`${
              allTasksComplete 
                ? "border-green-500 text-green-400" 
                : "border-gray-500 text-gray-400"
            }`}>
              {completedTasks}/{tasks.length}
            </Badge>
          </div>
        </div>
        
        {/* Progress Overview */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Daily Progress</span>
            <span className={`font-medium ${
              allTasksComplete ? "text-green-400" : "text-orange-400"
            }`}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`
              group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]
              ${task.completed 
                ? "bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/30 shadow-lg" 
                : "bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/30"
              }
            `}
          >
            {/* Completion Animation Overlay */}
            {task.completed && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-transparent animate-pulse"></div>
            )}
            
            <div className="relative p-4 flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => onTaskToggle(task.id)}
                  className={`
                    transition-all duration-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600
                    ${task.completed ? "shadow-lg shadow-green-500/25" : ""}
                  `}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={task.id}
                  className={`
                    block text-sm font-medium cursor-pointer transition-all duration-300
                    ${task.completed 
                      ? "text-green-200 line-through" 
                      : "text-gray-100 hover:text-white"
                    }
                  `}
                >
                  {task.title}
                </label>
                
                <div className="mt-2 flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getCategoryColor(task.category)} ${
                      task.completed ? "opacity-75" : ""
                    }`}
                  >
                    {getCategoryIcon(task.category)} {task.category}
                  </Badge>
                  
                  {task.completed && (
                    <div className="flex items-center space-x-1 text-green-400">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-xs font-medium">Done!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Completion Celebration */}
        {allTasksComplete && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl text-center relative overflow-hidden">
            {/* Celebration background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-4 text-2xl animate-bounce">⭐</div>
              <div className="absolute top-4 right-6 text-xl animate-pulse">✨</div>
              <div className="absolute bottom-4 left-8 text-lg animate-bounce delay-100">🎉</div>
              <div className="absolute bottom-2 right-4 text-xl animate-pulse delay-200">🏆</div>
            </div>
            
            <div className="relative">
              <Trophy className="w-12 h-12 text-green-400 mx-auto mb-3 animate-pulse" />
              <h3 className="text-xl font-bold text-green-300 mb-2">
                All Tasks Completed! 🎉
              </h3>
              <p className="text-sm text-green-400 mb-3">
                Outstanding work! You've completed all daily habits.
              </p>
              <Badge className="bg-green-600 hover:bg-green-700 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                Streak Eligible ✨
              </Badge>
              <p className="text-xs text-green-500 mt-2">
                Complete your Pomodoro target to secure today's streak!
              </p>
            </div>
          </div>
        )}
        
        {/* Progress Encouragement */}
        {!allTasksComplete && completedTasks > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-500/20">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-sm text-orange-300 font-medium">
                  Great progress! {tasks.length - completedTasks} tasks remaining.
                </p>
                <p className="text-xs text-orange-400/80 mt-1">
                  Keep going to unlock today's streak! 🔥
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyTasks;