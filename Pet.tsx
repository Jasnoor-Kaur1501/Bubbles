import React from 'react';

interface PetProps {
  mood: 'idle' | 'happy' | 'sleepy' | 'dragging';
  scale: [number, number];
  isBlinking: boolean;
}

const Pet: React.FC<PetProps> = ({ mood, scale, isBlinking }) => {
  const [sx, sy] = scale;

  return (
    <div 
      className="relative flex items-center justify-center transition-transform duration-75"
      style={{ transform: `scale(${sx}, ${sy})` }}
    >
      {/* Shadow */}
      <div className="absolute -bottom-4 w-12 h-2 bg-black/10 rounded-full blur-sm" />

      {/* Main Body */}
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 shadow-lg border-2 border-white/30 flex items-center justify-center">
        
        {/* The Bow */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-6 flex items-center justify-center">
          <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-sm">
            <path d="M50 30 L10 10 L10 50 Z" fill="#f472b6" />
            <path d="M50 30 L90 10 L90 50 Z" fill="#f472b6" />
            <circle cx="50" cy="30" r="8" fill="#ec4899" />
          </svg>
        </div>

        {/* Face */}
        <div className="relative flex flex-col items-center gap-1 mt-2">
          {/* Eyes */}
          <div className="flex gap-4">
            {isBlinking || mood === 'sleepy' ? (
              <>
                <div className="w-3 h-0.5 bg-blue-900 rounded-full" />
                <div className="w-3 h-0.5 bg-blue-900 rounded-full" />
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-blue-900 rounded-full" />
                <div className="w-2 h-2 bg-blue-900 rounded-full" />
              </>
            )}
          </div>
          
          {/* Blush */}
          <div className="flex gap-8 absolute -bottom-1">
            <div className="w-3 h-1.5 bg-pink-300/60 rounded-full blur-[1px]" />
            <div className="w-3 h-1.5 bg-pink-300/60 rounded-full blur-[1px]" />
          </div>

          {/* Mouth */}
          <div className="w-2 h-1 border-b border-blue-900/40 rounded-full mt-0.5" />
        </div>

        {/* Glossy Reflection */}
        <div className="absolute top-3 left-4 w-4 h-4 bg-white/40 rounded-full blur-[2px]" />
      </div>

      {/* Floating ZZZs if sleepy */}
      {mood === 'sleepy' && (
        <div className="absolute -top-12 -right-4 flex flex-col gap-2 animate-bounce">
          <span className="text-blue-400 text-xs font-bold opacity-70">Z</span>
          <span className="text-blue-400 text-sm font-bold opacity-50 translate-x-2">Z</span>
          <span className="text-blue-400 text-lg font-bold opacity-30 translate-x-4">Z</span>
        </div>
      )}

      {/* Happy Glow */}
      {mood === 'happy' && (
        <div className="absolute inset-0 bg-yellow-200/20 rounded-full blur-xl animate-pulse" />
      )}
    </div>
  );
};

export default Pet;
