
import React, { useEffect, useState } from 'react';

interface SparkleProps {
  x: number;
  y: number;
}

const Sparkle: React.FC<SparkleProps> = ({ x, y }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-ping"
          style={{
            transform: `rotate(${i * 60}deg) translateY(-20px)`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

export default Sparkle;
