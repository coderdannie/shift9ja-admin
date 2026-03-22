import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white/50 backdrop-blur-[2px]">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#F2F4F7] border-t-primary shadow-sm" />
        
        {/* Inner Pulse */}
        <div className="absolute h-8 w-8 animate-pulse rounded-full bg-primary/10" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
