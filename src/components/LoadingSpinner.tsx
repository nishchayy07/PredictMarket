import React from 'react';
import { TrendingUp } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin mb-4">
        <TrendingUp className="h-8 w-8 text-blue-500" />
      </div>
      <div className="text-slate-400">Loading...</div>
    </div>
  );
};