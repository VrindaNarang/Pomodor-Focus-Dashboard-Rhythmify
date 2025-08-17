// Mock data for frontend-only functionality
// This will be replaced with actual backend data later

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

export const mockData = {
  // Default timer settings
  defaultSettings: {
    focusTime: 25, // minutes
    shortBreakTime: 5, // minutes
    longBreakTime: 15, // minutes
    dailyTarget: 8, // sessions
    soundEnabled: true,
    autoStartBreaks: true,
    autoStartPomodoros: false
  },

  // Current session data
  currentSession: {
    type: "focus", // focus, shortBreak, longBreak
    timeLeft: 1500, // seconds (25 minutes)
    isRunning: false,
    progress: 0 // percentage
  },

  // Daily progress tracking
  dailyProgress: {
    completedSessions: 0, // Starts at 0, will increment during use
    totalStudyTime: 0, // minutes, starts at 0
    currentStreak: 7, // Mock streak of 7 days
    tasksCompleted: 0,
    dailyGoalMet: false
  },

  // Streak calendar data (date -> boolean)
  // true = goal achieved (🔥), false = goal missed (😭), undefined = no data
  streakData: {
    // This week - mixed results
    [today.toISOString().split('T')[0]]: undefined, // Today - in progress
    [yesterday.toISOString().split('T')[0]]: true, // Yesterday - achieved
    [twoDaysAgo.toISOString().split('T')[0]]: true, // Day before - achieved
    
    // Previous week - good streak
    ['2025-01-20']: true,
    ['2025-01-19']: true,
    ['2025-01-18']: false, // One missed day
    ['2025-01-17']: true,
    ['2025-01-16']: true,
    ['2025-01-15']: true,
    ['2025-01-14']: true,
    
    // Earlier dates
    ['2025-01-13']: false,
    ['2025-01-12']: true,
    ['2025-01-11']: true,
    ['2025-01-10']: false,
    ['2025-01-09']: true,
    ['2025-01-08']: true,
    ['2025-01-07']: true,
    ['2025-01-06']: false,
    ['2025-01-05']: true,
    ['2025-01-04']: true,
    ['2025-01-03']: true,
    ['2025-01-02']: false,
    ['2025-01-01']: true,
  },

  // Daily tasks checklist
  dailyTasks: [
    {
      id: "dsa",
      title: "Do 3 hours DSA (including updating profiles, GitHub, and Leetcode)",
      category: "Learning",
      completed: false
    },
    {
      id: "yoga",
      title: "Yoga",
      category: "Health",
      completed: false
    },
    {
      id: "cardio",
      title: "10k Steps + Cardio",
      category: "Fitness",
      completed: false
    },
    {
      id: "meditation",
      title: "Meditation",
      category: "Mindfulness",
      completed: false
    },
    {
      id: "healthy-eating",
      title: "Eat Healthy",
      category: "Nutrition",
      completed: false
    },
    {
      id: "wake-early",
      title: "Wake up Early",
      category: "Routine",
      completed: false
    }
  ]
};