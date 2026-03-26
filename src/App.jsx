import React from 'react';
import Quiz from './quiz_pensee_critique';
import { ShaderBackground } from './ShaderBackground';
import './index.css';

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white font-sans">
      <ShaderBackground />
      {/* Subtle overlay to guarantee text legibility */}
      <div className="fixed inset-0 bg-black/20 pointer-events-none z-0" />
      
      <div className="relative z-10 w-full min-h-screen flex flex-col pt-8 pb-16 px-4">
        {/* Simple minimal header */}
        <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-8 bg-black/10 backdrop-blur-md border-b border-white/5 z-50">
          <div className="text-sm font-bold tracking-[0.2em] text-fuchsia-400">QUIZ/MASTER</div>
          <div className="text-xs text-white/50 tracking-wider hidden sm:block">A SOFT SKILLS EXPERIENCE</div>
        </header>

        <main className="flex-1 flex items-center justify-center mt-12">
          <Quiz />
        </main>
      </div>
    </div>
  );
}

export default App;
