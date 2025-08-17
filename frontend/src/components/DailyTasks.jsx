import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CheckSquare, Target, Sparkles, Trophy, Plus, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const DailyTasks = ({ tasks, onTaskToggle, onTaskAdd, onTaskEdit, onTaskDelete, onTaskReorder }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Custom");
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  const allTasksComplete = completedTasks === tasks.length && tasks.length > 0;
  
  const { toast } = useToast();

  const categories = [
    { name: "Learning", icon: "🧠", color: "text-blue-400 border-blue-500/30" },
    { name: "Health", icon: "🧘", color: "text-green-400 border-green-500/30" },
    { name: "Fitness", icon: "💪", color: "text-red-400 border-red-500/30" },
    { name: "Mindfulness", icon: "🕯️", color: "text-purple-400 border-purple-500/30" },
    { name: "Nutrition", icon: "🥗", color: "text-yellow-400 border-yellow-500/30" },
    { name: "Routine", icon: "⏰", color: "text-orange-400 border-orange-500/30" },
    { name: "Custom", icon: "📝", color: "text-gray-400 border-gray-500/30" }
  ];

  const getCategoryData = (categoryName) => {
    return categories.find(cat => cat.name === categoryName) || categories[categories.length - 1];
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a task title.",
        variant: "destructive"
      });
      return;
    }

    onTaskAdd({
      title: newTaskTitle.trim(),
      category: newTaskCategory
    });

    setNewTaskTitle("");
    setNewTaskCategory("Custom");
    setShowAddDialog(false);
    
    toast({
      title: "Task Added",
      description: `"${newTaskTitle}" has been added to your daily tasks.`,
    });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskCategory(task.category);
  };

  const handleUpdateTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a task title.",
        variant: "destructive"
      });
      return;
    }

    onTaskEdit(editingTask.id, {
      title: newTaskTitle.trim(),
      category: newTaskCategory
    });

    setEditingTask(null);
    setNewTaskTitle("");
    setNewTaskCategory("Custom");
    
    toast({
      title: "Task Updated",
      description: `Task has been updated successfully.`,
    });
  };

  const handleDeleteTask = (task) => {
    onTaskDelete(task.id);
    toast({
      title: "Task Deleted",
      description: `"${task.title}" has been removed from your daily tasks.`,
    });
  };

  const handleMoveTask = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < tasks.length) {
      onTaskReorder(index, newIndex);
    }
  };

  const resetAddDialog = () => {
    setNewTaskTitle("");
    setNewTaskCategory("Custom");
    setShowAddDialog(false);
  };

  const resetEditDialog = () => {
    setEditingTask(null);
    setNewTaskTitle("");
    setNewTaskCategory("Custom");
  };

  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-2xl h-full">
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
              <Button
                onClick={() => setShowAddDialog(true)}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          {/* Progress Overview */}
          {tasks.length > 0 && (
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
          )}
        </CardHeader>
        
        <CardContent className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">No daily tasks yet.</p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Task
              </Button>
            </div>
          ) : (
            <>
              {tasks.map((task, index) => {
                const categoryData = getCategoryData(task.category);
                
                return (
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
                            className={`text-xs ${categoryData.color} ${
                              task.completed ? "opacity-75" : ""
                            }`}
                          >
                            {categoryData.icon} {task.category}
                          </Badge>
                          
                          {task.completed ? (
                            <div className="flex items-center space-x-1 text-green-400">
                              <Sparkles className="w-3 h-3" />
                              <span className="text-xs font-medium">Done!</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* Reorder buttons */}
                              <Button
                                onClick={() => handleMoveTask(index, 'up')}
                                disabled={index === 0}
                                size="sm"
                                variant="ghost"
                                className="w-6 h-6 p-0 text-gray-400 hover:text-white disabled:opacity-30"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => handleMoveTask(index, 'down')}
                                disabled={index === tasks.length - 1}
                                size="sm"
                                variant="ghost"
                                className="w-6 h-6 p-0 text-gray-400 hover:text-white disabled:opacity-30"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </Button>
                              {/* Edit button */}
                              <Button
                                onClick={() => handleEditTask(task)}
                                size="sm"
                                variant="ghost"
                                className="w-6 h-6 p-0 text-blue-400 hover:text-blue-300"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              {/* Delete button */}
                              <Button
                                onClick={() => handleDeleteTask(task)}
                                size="sm"
                                variant="ghost"
                                className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-orange-500" />
              <span>Add New Daily Task</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="task-title" className="text-sm font-medium text-gray-300">
                Task Title
              </Label>
              <Input
                id="task-title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="bg-gray-700 border-gray-600 text-white mt-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTask();
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="task-category" className="text-sm font-medium text-gray-300">
                Category
              </Label>
              <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map(category => (
                    <SelectItem key={category.name} value={category.name}>
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              onClick={resetAddDialog}
              variant="outline"
              className="border-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTask}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5 text-blue-500" />
              <span>Edit Daily Task</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-task-title" className="text-sm font-medium text-gray-300">
                Task Title
              </Label>
              <Input
                id="edit-task-title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="bg-gray-700 border-gray-600 text-white mt-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateTask();
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-task-category" className="text-sm font-medium text-gray-300">
                Category
              </Label>
              <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map(category => (
                    <SelectItem key={category.name} value={category.name}>
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              onClick={resetEditDialog}
              variant="outline"
              className="border-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTask}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Update Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DailyTasks;