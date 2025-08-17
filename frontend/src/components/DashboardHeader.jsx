import React from "react";
import { Flame, Zap } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="text-center py-8">
      <div className="flex items-center justify-center space-x-3 mb-2">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
          <Flame className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-black bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
          FocusFlame
        </h1>
        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
          <Zap className="w-8 h-8 text-white" />
        </div>
      </div>
      <p className="text-xl text-gray-400 font-medium tracking-wide">
        Productivity Dashboard
      </p>
      <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg"></div>
    </div>
  );
};

export default DashboardHeader;