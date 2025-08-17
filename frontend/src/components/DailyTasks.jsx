import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { CheckSquare, Target } from "lucide-react";

const DailyTasks = ({ tasks, onTaskToggle }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = (completedTasks / tasks.length) * 100;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-green-500" />
            <CardTitle className="text-white">Complete Daily Tasks</CardTitle>
          </div>
          <div className="text-sm text-gray-400">
            {completedTasks}/{tasks.length}
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`
              flex items-center space-x-3 p-3 rounded-lg transition-colors
              ${task.completed 
                ? "bg-green-900/20 border border-green-800" 
                : "bg-gray-700/50 hover:bg-gray-700"
              }
            `}
          >
            <Checkbox
              id={task.id}
              checked={task.completed}
              onCheckedChange={() => onTaskToggle(task.id)}
              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            <label
              htmlFor={task.id}
              className={`
                flex-1 text-sm cursor-pointer transition-colors
                ${task.completed 
                  ? "text-green-400 line-through" 
                  : "text-gray-200 hover:text-white"
                }
              `}
            >
              {task.title}
            </label>
            <div className="text-xs text-gray-500">
              {task.category}
            </div>
          </div>
        ))}
        
        {/* Completion Message */}
        {completedTasks === tasks.length && (
          <div className="text-center p-4 bg-green-900/20 border border-green-800 rounded-lg">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-green-400 font-medium">
              All tasks completed! 🎉
            </div>
            <div className="text-xs text-green-600 mt-1">
              Your streak will count when Pomodoro goal is also met
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyTasks;