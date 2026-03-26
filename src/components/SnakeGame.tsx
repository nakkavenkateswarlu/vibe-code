import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const TILE_COUNT = 20; // 20x20 grid
const GAME_SPEED = 100;

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START');
  const [shake, setShake] = useState(false);

  const snake = useRef([{ x: 10, y: 10 }]);
  const food = useRef({ x: 5, y: 5 });
  const direction = useRef({ x: 0, y: -1 });
  const nextDirection = useRef({ x: 0, y: -1 });
  const lastRenderTime = useRef(0);
  const requestRef = useRef<number>();

  const resetGame = () => {
    snake.current = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    direction.current = { x: 0, y: -1 };
    nextDirection.current = { x: 0, y: -1 };
    food.current = { x: Math.floor(Math.random() * TILE_COUNT), y: Math.floor(Math.random() * TILE_COUNT) };
    setScore(0);
    setGameState('PLAYING');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }
      switch (e.key) {
        case 'ArrowUp': case 'w': if (direction.current.y !== 1) nextDirection.current = { x: 0, y: -1 }; break;
        case 'ArrowDown': case 's': if (direction.current.y !== -1) nextDirection.current = { x: 0, y: 1 }; break;
        case 'ArrowLeft': case 'a': if (direction.current.x !== 1) nextDirection.current = { x: -1, y: 0 }; break;
        case 'ArrowRight': case 'd': if (direction.current.x !== -1) nextDirection.current = { x: 1, y: 0 }; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const gameLoop = (currentTime: number) => {
    requestRef.current = requestAnimationFrame(gameLoop);
    const secondsSinceLastRender = (currentTime - lastRenderTime.current);
    if (secondsSinceLastRender < GAME_SPEED) return;
    lastRenderTime.current = currentTime;

    if (gameState === 'PLAYING') {
      update();
    }
    draw();
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  const update = () => {
    direction.current = nextDirection.current;
    const head = { x: snake.current[0].x + direction.current.x, y: snake.current[0].y + direction.current.y };

    // Wall collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      triggerGameOver();
      return;
    }
    // Self collision
    if (snake.current.some(segment => segment.x === head.x && segment.y === head.y)) {
      triggerGameOver();
      return;
    }

    snake.current.unshift(head);

    // Food collision
    if (head.x === food.current.x && head.y === food.current.y) {
      setScore(s => {
        const newScore = s + 10;
        setHighScore(hs => Math.max(hs, newScore));
        return newScore;
      });
      // Glitch effect on eat
      const canvas = canvasRef.current;
      if (canvas) canvas.style.filter = 'invert(1) hue-rotate(180deg)';
      setTimeout(() => { if (canvas) canvas.style.filter = 'none'; }, 50);

      food.current = { x: Math.floor(Math.random() * TILE_COUNT), y: Math.floor(Math.random() * TILE_COUNT) };
    } else {
      snake.current.pop();
    }
  };

  const triggerGameOver = () => {
    setGameState('GAME_OVER');
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Glitchy)
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.2;
    for (let i = 0; i <= TILE_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(canvas.width, i * GRID_SIZE);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Draw Food
    ctx.fillStyle = '#FF00FF';
    ctx.shadowColor = '#FF00FF';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.current.x * GRID_SIZE, food.current.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
    ctx.shadowBlur = 0;

    // Draw Snake
    snake.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#FFFFFF' : '#00FFFF';
      if (index === 0) {
         ctx.shadowColor = '#00FFFF';
         ctx.shadowBlur = 15;
      } else {
         ctx.shadowBlur = 0;
      }
      // Glitch offset occasionally
      const offset = (Math.random() > 0.95) ? (Math.random() * 4 - 2) : 0;
      ctx.fillRect(segment.x * GRID_SIZE + offset, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
    });
    ctx.shadowBlur = 0;
  };

  return (
    <div className={`flex flex-col items-start border-4 border-[#00FFFF] bg-black p-4 relative ${shake ? 'animate-[tear-anim_0.1s_infinite]' : ''}`}>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none shadow-[inset_0_0_50px_rgba(0,255,255,0.2)]" />
      
      <div className="w-full flex justify-between font-mono text-xl mb-4 border-b-2 border-[#FF00FF] pb-2">
        <div className="text-[#00FFFF] uppercase">SCORE:{score.toString().padStart(4, '0')}</div>
        <div className="text-[#FF00FF] uppercase">HIGH:{highScore.toString().padStart(4, '0')}</div>
      </div>

      <div className="relative w-full aspect-square bg-black border-2 border-[#00FFFF] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * TILE_COUNT}
          height={GRID_SIZE * TILE_COUNT}
          className="w-full h-full object-contain"
        />
        
        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center z-10">
            <h2 className="text-3xl md:text-4xl font-mono text-[#FF00FF] mb-4 glitch" data-text={gameState === 'START' ? 'SYSTEM_READY' : 'FATAL_ERROR'}>
              {gameState === 'START' ? 'SYSTEM_READY' : 'FATAL_ERROR'}
            </h2>
            <button 
              onClick={resetGame}
              className="mt-4 px-6 py-2 border-2 border-[#00FFFF] text-[#00FFFF] font-mono text-xl hover:bg-[#00FFFF] hover:text-black transition-colors uppercase animate-pulse"
            >
              [ EXECUTE ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
