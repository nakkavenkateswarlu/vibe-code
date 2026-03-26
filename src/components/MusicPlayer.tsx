import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'ERR_0x1A (AI_GEN)', artist: 'CYBER_SNAKE', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'NULL_POINTER (AI_GEN)', artist: 'SYNTH_BOT', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'SYS_OVERRIDE (AI_GEN)', artist: 'NEON_GRID', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const playNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const playPrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  return (
    <div className="border-4 border-[#FF00FF] bg-black p-6 relative flex flex-col w-full font-mono">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none shadow-[inset_0_0_30px_rgba(255,0,255,0.2)]" />
      
      <audio ref={audioRef} src={currentTrack.src} onTimeUpdate={handleTimeUpdate} onEnded={playNext} />

      <div className="text-[#00FFFF] text-sm mb-2 uppercase border-b border-[#00FFFF] pb-1">
        AUDIO_SUBSYSTEM_v2.0
      </div>

      <div className="my-6">
        <h3 className="text-xl md:text-2xl text-[#FF00FF] uppercase truncate glitch" data-text={currentTrack.title}>
          {currentTrack.title}
        </h3>
        <p className="text-[#00FFFF] text-lg mt-1 uppercase">
          &gt; {currentTrack.artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 border-2 border-[#00FFFF] mb-6 relative bg-[#002222]">
        <div 
          className="h-full bg-[#FF00FF] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center gap-4">
        <button onClick={playPrev} className="px-4 py-2 border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors">
          [ &lt;&lt; ]
        </button>
        <button onClick={togglePlay} className={`flex-1 px-4 py-2 border-2 ${isPlaying ? 'border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF]' : 'border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF]'} hover:text-black transition-colors text-xl`}>
          {isPlaying ? '[ PAUSE ]' : '[ PLAY ]'}
        </button>
        <button onClick={playNext} className="px-4 py-2 border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors">
          [ &gt;&gt; ]
        </button>
      </div>
      
      {/* Visualizer fake */}
      <div className="mt-6 flex gap-1 h-8 items-end opacity-50">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="flex-1 bg-[#00FFFF]"
            style={{
              height: isPlaying ? `${Math.random() * 100}%` : '10%',
              transition: 'height 0.1s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
