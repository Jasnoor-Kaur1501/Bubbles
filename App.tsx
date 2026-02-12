
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Pet from './components/Pet';
import Sparkle from './components/Sparkle';
import { sounds } from './services/SoundService';

type Mood = 'idle' | 'happy' | 'sleepy' | 'dragging';

const App: React.FC = () => {
  // Target position (mouse)
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // Current position (pet)
  const [petPos, setPetPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const petInternalPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  
  const [mood, setMood] = useState<Mood>('idle');
  const [isBlinking, setIsBlinking] = useState(false);
  const [scale, setScale] = useState<[number, number]>([1, 1]);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const isDragging = useRef(false);
  const lastMouseMove = useRef(Date.now());
  const idlePlayTriggered = useRef(false);

  // Physics params - Adjusted for smoother movement
  const velocity = useRef({ x: 0, y: 0 });
  const spring = 0.04; // Lower spring for less jumpiness
  const friction = 0.88; // Slightly higher friction for more control

  // Animation Loop
  useEffect(() => {
    let frameId: number;

    const update = () => {
      const now = Date.now();
      const dx = targetPos.current.x - petInternalPos.current.x;
      const dy = targetPos.current.y - petInternalPos.current.y;

      // Distance for mood checks
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Physics logic
      if (isDragging.current) {
        // Snap closer during drag
        petInternalPos.current.x += dx * 0.4;
        petInternalPos.current.y += dy * 0.4;
      } else {
        // Easing follow logic
        const ax = dx * spring;
        const ay = dy * spring;
        velocity.current.x += ax;
        velocity.current.y += ay;
        velocity.current.x *= friction;
        velocity.current.y *= friction;

        petInternalPos.current.x += velocity.current.x;
        petInternalPos.current.y += velocity.current.y;
      }

      setPetPos({ x: petInternalPos.current.x, y: petInternalPos.current.y });

      // State handling
      if (!isDragging.current) {
        if (now - lastMouseMove.current > 4000) {
          if (mood !== 'sleepy') {
            setMood('sleepy');
            if (!idlePlayTriggered.current) {
              sounds.playSleepy();
              idlePlayTriggered.current = true;
            }
          }
        } else if (dist < 40 && dist > 5) {
          if (mood !== 'happy') {
            setMood('happy');
            sounds.playHover();
          }
        } else if (dist > 150) {
          setMood('idle');
          idlePlayTriggered.current = false;
        } else {
           // Small buffer to prevent flickering
           if (mood === 'sleepy') setMood('idle');
        }
      }

      // Dynamic scale based on velocity
      if (!isDragging.current) {
        const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
        const stretch = Math.min(speed / 100, 0.2);
        setScale([1 + stretch, 1 - stretch]);
      }

      frameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(frameId);
  }, [mood]);

  // Blink logic
  useEffect(() => {
    const blinkLoop = setInterval(() => {
      if (mood !== 'sleepy') {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(blinkLoop);
  }, [mood]);

  // Mouse Handlers
  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    lastMouseMove.current = Date.now();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    targetPos.current = { x, y };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    setMood('dragging');
    setScale([1.2, 0.8]);
    sounds.playDrag();
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging.current) {
      isDragging.current = false;
      setScale([0.8, 1.2]); // Bounce back squash
      sounds.playPop();
      setTimeout(() => setScale([1, 1]), 150);
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    sounds.playClick();
    const id = Date.now();
    setSparkles(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== id));
    }, 1000);
  }, []);

  return (
    <div 
      className="fixed inset-0 w-full h-full touch-none select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
      onClick={handleClick}
    >
      {/* Title */}
      <div className="absolute top-8 left-8">
        <h1 className="text-blue-400/60 font-serif text-2xl italic tracking-widest">Bubbles</h1>
      </div>

      {/* Sparkles */}
      {sparkles.map(s => (
        <Sparkle key={s.id} x={s.x} y={s.y} />
      ))}

      {/* The Pet Container */}
      <div 
        className="absolute pointer-events-none"
        style={{ 
          left: petPos.x, 
          top: petPos.y,
          transform: 'translate(-50%, -50%)',
          transition: isDragging.current ? 'none' : 'transform 0.1s linear'
        }}
      >
        <Pet mood={mood} scale={scale} isBlinking={isBlinking} />
      </div>

      {/* Custom Cursor Circle (Decorative) */}
      <div 
        className="fixed w-4 h-4 border-2 border-blue-200/50 rounded-full pointer-events-none transition-transform duration-200"
        style={{ 
          left: targetPos.current.x, 
          top: targetPos.current.y,
          transform: 'translate(-50%, -50%) scale(1.5)'
        }}
      />
    </div>
  );
};

export default App;
