import React from 'react';

const Daisy = ({ delay, scale, positionClass, index }) => {
  return (
    <div 
      className={`absolute transition-transform duration-1000 ease-in-out ${positionClass}`} 
      style={{ animationDelay: `${delay}s`, transform: `scale(${scale})` }}
    >
      <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-white bg-opacity-70 shadow-md">
        <div className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
        <div className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        <div className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
        <div className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-4 h-4 md:w-6 md:h-6 rounded-full bg-yellow-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-inner"></div>
      </div>
      <div className="absolute w-0.5 h-12 md:h-16 bg-green-500 top-full left-1/2 transform -translate-x-1/2 z-[-1] rounded-b-full"></div>
    </div>
  );
};

export default Daisy;