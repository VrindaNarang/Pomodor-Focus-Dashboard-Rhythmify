import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Clock, Calendar, Target, TrendingUp } from 'lucide-react';

const AuthHero = () => {
  const features = [
    { icon: Flame, text: "Track study streaks", color: "text-orange-400" },
    { icon: TrendingUp, text: "Personalized study plans", color: "text-green-400" },
    { icon: Calendar, text: "Motivational progress calendar", color: "text-blue-400" },
    { icon: Clock, text: "Customizable Pomodoro sessions", color: "text-purple-400" }
  ];

  return (
    <div className="text-center space-y-8">
      {/* Main Logo and Branding */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="flex items-center justify-center space-x-4 mb-6"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div 
            className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-2xl"
            animate={{ 
              boxShadow: [
                "0 0 30px rgba(251, 146, 60, 0.4)", 
                "0 0 50px rgba(251, 146, 60, 0.8)", 
                "0 0 30px rgba(251, 146, 60, 0.4)"
              ] 
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Flame className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            FocusFlame
          </h1>
          <motion.div 
            className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-2xl"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          >
            <Zap className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>
        
        <motion.p 
          className="text-2xl text-gray-300 font-medium mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Track, Focus, Succeed
        </motion.p>
        
        <motion.div 
          className="h-1 w-40 mx-auto bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </motion.div>

      {/* Animated Progress Circle */}
      <motion.div 
        className="relative w-48 h-48 mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-gray-700"
          />
          
          {/* Animated progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            initial={{ strokeDashoffset: `${2 * Math.PI * 45}` }}
            animate={{ strokeDashoffset: `${2 * Math.PI * 45 * 0.25}` }}
            transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 8px rgba(251, 146, 60, 0.6))" }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div 
            className="text-4xl font-black text-white mb-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            75%
          </motion.div>
          <motion.div 
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            Focus Goal
          </motion.div>
        </div>
      </motion.div>

      {/* Feature List */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: "rgba(31, 41, 55, 0.5)",
                transition: { duration: 0.2 }
              }}
            >
              <motion.div 
                className={`p-2 rounded-lg bg-gradient-to-br ${
                  feature.color.includes('orange') ? 'from-orange-500/20 to-orange-600/20' :
                  feature.color.includes('green') ? 'from-green-500/20 to-green-600/20' :
                  feature.color.includes('blue') ? 'from-blue-500/20 to-blue-600/20' :
                  'from-purple-500/20 to-purple-600/20'
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className={`w-5 h-5 ${feature.color}`} />
              </motion.div>
              <span className="text-gray-300 font-medium">{feature.text}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom Spark Effect */}
      <motion.div 
        className="flex justify-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-orange-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default AuthHero;