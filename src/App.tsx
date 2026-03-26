import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00FFFF] flex flex-col items-start justify-start p-4 md:p-8 font-sans relative">
      <div className="static-noise" />
      <div className="scanline" />

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 z-10 relative">
        <header className="text-left mb-4 w-full border-l-8 border-[#FF00FF] pl-6">
          <h1 className="text-4xl md:text-6xl font-mono uppercase glitch" data-text="NEON_SNAKE.EXE">
            NEON_SNAKE.EXE
          </h1>
          <p className="text-[#00FFFF] mt-4 tracking-[0.2em] uppercase text-sm md:text-lg font-mono">
            &gt; INITIALIZING GLITCH PROTOCOL...
          </p>
        </header>
        
        <main className="flex-1 flex flex-col lg:flex-row gap-8 items-start justify-center w-full">
          <div className="flex-1 w-full max-w-2xl">
            <SnakeGame />
          </div>
          <div className="w-full lg:w-96 shrink-0">
            <MusicPlayer />
          </div>
        </main>
      </div>
    </div>
  );
}
