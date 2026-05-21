import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Zap, Volume2, ShieldCheck, Sliders, ChevronRight, Award } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Home = () => {
  const [activeMatrix, setActiveMatrix] = useState('cyan');
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [audioFreq, setAudioFreq] = useState('Creamy Linear');

  const triggerSoundFeedback = (profile) => {
    setAudioFreq(profile);
    setSoundPlaying(true);
    // Simulating audio frequency synthesizer sound
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play a retro-synthesized mechanical "thock" sound
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (profile === 'Creamy Linear') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else if (profile === 'Clicky Tactile') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      
      // Add a higher click sound
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(1200, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(900, audioCtx.currentTime + 0.01);
      gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);
      osc2.start();
      osc2.stop(audioCtx.currentTime + 0.03);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } else { // Silent Silent
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    }

    setTimeout(() => {
      setSoundPlaying(false);
    }, 200);
  };

  const getMatrixShadow = () => {
    switch (activeMatrix) {
      case 'cyan': return 'shadow-[0_0_30px_rgba(0,240,255,0.25)] border-cyber-cyan/50';
      case 'magenta': return 'shadow-[0_0_30px_rgba(255,0,127,0.25)] border-cyber-magenta/50';
      case 'purple': return 'shadow-[0_0_30px_rgba(157,78,221,0.25)] border-cyber-purple/50';
      case 'yellow': return 'shadow-[0_0_30px_rgba(254,254,0,0.25)] border-cyber-yellow/50';
      default: return '';
    }
  };

  return (
    <div className="space-y-24">
      {/* 1. Hero Showcase Section */}
      <section className="relative min-h-[75vh] flex flex-col justify-center items-center py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-left relative z-10">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-cyan/15 border border-cyber-cyan/30 rounded-full text-xs font-display tracking-widest text-cyber-cyan">
              <Zap className="h-3 w-3 animate-pulse" />
              SYSTEM PROTOCOL INITIALIZED
            </div>

            {/* Glitch & Glow Heading */}
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl leading-tight tracking-wider uppercase text-slate-100">
              UPGRADE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta animate-flicker">
                TACTILE INTERFACE
              </span>
            </h1>

            <p className="text-slate-400 text-base md:text-lg max-w-xl font-sans leading-relaxed">
              CyberKeys engineers ultra-low-latency mechanical decks with integrated acoustic resonators and hot-swappable custom logic arrays. Built for net-runners.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/products">
                <Button variant="primary" className="py-3 px-8 text-base">
                  ACQUIRE CORE HARDWARE <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <a href="#telemetry">
                <Button variant="outline" className="py-3 px-8 text-base">
                  TELEMETRY DATA
                </Button>
              </a>
            </div>

            {/* Spec Matrix mini panel */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-900 pt-6 mt-8">
              <div>
                <div className="font-display text-2xl font-extrabold text-cyber-cyan">0.12ms</div>
                <div className="text-slate-500 text-xs font-display tracking-widest uppercase">LATENCY SPEED</div>
              </div>
              <div>
                <div className="font-display text-2xl font-extrabold text-cyber-magenta">1000Hz</div>
                <div className="text-slate-500 text-xs font-display tracking-widest uppercase">POLLING RATE</div>
              </div>
              <div>
                <div className="font-display text-2xl font-extrabold text-cyber-purple">80%</div>
                <div className="text-slate-500 text-xs font-display tracking-widest uppercase">GASKET FLEX</div>
              </div>
            </div>

          </div>

          {/* Hero Right Product Render */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Visual background rings */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full border border-cyber-cyan/10 animate-pulse pointer-events-none" />
            <div className="absolute w-[20rem] sm:w-[28rem] h-[20rem] sm:h-[28rem] rounded-full border border-cyber-magenta/5 pointer-events-none" />
            
            {/* Glow backing */}
            <div className={`absolute w-64 h-64 rounded-full bg-cyber-${activeMatrix}/5 blur-3xl transition-all duration-700 pointer-events-none`} />

            {/* Render Showcase Container */}
            <div className={`relative bg-cyber-dark/40 border-2 rounded-2xl p-3 sm:p-5 transition-all duration-700 overflow-hidden ${getMatrixShadow()}`}>
              
              {/* Product Image */}
              <img 
                src="/cyberpunk_keyboard_hero.png" 
                alt="Cyberpunk Mechanical Keyboard" 
                className="w-full max-w-lg h-auto object-cover rounded-xl relative z-10 transition-transform duration-500 hover:scale-102"
              />

              {/* Decorative Tech Overlay Tags */}
              <div className="absolute top-4 left-4 bg-cyber-bg/90 backdrop-blur border border-slate-800 rounded px-2.5 py-1 text-[10px] font-display tracking-widest text-slate-400 z-20">
                SERIAL: CK-75-PRO
              </div>
              
              <div className="absolute bottom-4 right-4 bg-cyber-bg/90 backdrop-blur border border-slate-800 rounded px-2.5 py-1 text-[10px] font-display tracking-widest text-cyber-cyan z-20 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                ONLINE
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Swappable Matrix Color Switcher Demonstration */}
      <section id="telemetry" className="relative scroll-mt-24">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-widest uppercase">
            MATRIX DECK CUSTOMIZATION
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Choose your signature colorway array to configure the keyboard's reactive underglow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card 
            title="NEON CYAN ARRAY" 
            glowColor="cyan" 
            tag="Matrix 01"
            className={`cursor-pointer ${activeMatrix === 'cyan' ? 'ring-2 ring-cyber-cyan' : ''}`}
            onClick={() => setActiveMatrix('cyan')}
          >
            <div className="space-y-4">
              <p className="text-slate-400 text-xs">Optically calibrated lightwave arrays offering sharp high-voltage sky-blue aesthetic.</p>
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                <span className="text-slate-500">Wavelength</span>
                <span className="text-cyber-cyan font-mono">480nm</span>
              </div>
            </div>
          </Card>

          <Card 
            title="MAGENTA SHOCK" 
            glowColor="magenta" 
            tag="Matrix 02"
            className={`cursor-pointer ${activeMatrix === 'magenta' ? 'ring-2 ring-cyber-magenta' : ''}`}
            onClick={() => setActiveMatrix('magenta')}
          >
            <div className="space-y-4">
              <p className="text-slate-400 text-xs">High-frequency hyper-pink luminescence designed for visual impact and contrast.</p>
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                <span className="text-slate-500">Wavelength</span>
                <span className="text-cyber-magenta font-mono">620nm</span>
              </div>
            </div>
          </Card>

          <Card 
            title="PURPLE VOID" 
            glowColor="purple" 
            tag="Matrix 03"
            className={`cursor-pointer ${activeMatrix === 'purple' ? 'ring-2 ring-cyber-purple' : ''}`}
            onClick={() => setActiveMatrix('purple')}
          >
            <div className="space-y-4">
              <p className="text-slate-400 text-xs">Deep space stellar emissions presenting soft neon-violet tones for low light comfort.</p>
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                <span className="text-slate-500">Wavelength</span>
                <span className="text-cyber-purple font-mono">405nm</span>
              </div>
            </div>
          </Card>

          <Card 
            title="GOLD HARVEST" 
            glowColor="cyan" 
            tag="Matrix 04"
            className={`cursor-pointer border-cyber-yellow/20 hover:border-cyber-yellow/70 ${activeMatrix === 'yellow' ? 'ring-2 ring-cyber-yellow border-cyber-yellow/80' : ''}`}
            onClick={() => setActiveMatrix('yellow')}
          >
            <div className="space-y-4">
              <p className="text-slate-400 text-xs">Cybernetic utility gold matrix highlighting critical keys for high-accuracy operations.</p>
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                <span className="text-slate-500 font-mono">Wavelength</span>
                <span className="text-cyber-yellow font-mono">580nm</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Switch Resonator Sound Testing Panel */}
      <section className="relative bg-cyber-dark/40 border border-slate-900 rounded-2xl p-8 sm:p-12 overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-cyber-cyan/5 blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-magenta/15 border border-cyber-magenta/30 rounded-full text-xs font-display tracking-widest text-cyber-magenta">
              <Volume2 className="h-3.5 w-3.5" />
              ACOUSTIC TELEMETRY
            </div>
            
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-widest uppercase">
              SOUND PROFILE SYNTHESIZER
            </h2>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Test the acoustics of our key switches. Our cases feature custom foam and solid brass structures to achieve optimized, low-frequency sound dampening profiles.
            </p>

            <div className="flex flex-col gap-3 font-display">
              <button 
                onClick={() => triggerSoundFeedback('Creamy Linear')}
                className={`flex items-center justify-between px-5 py-3 border rounded text-left transition-all ${audioFreq === 'Creamy Linear' ? 'border-cyber-cyan bg-cyber-cyan/5 text-cyber-cyan shadow-[0_0_12px_rgba(0,240,255,0.2)]' : 'border-slate-800 hover:border-slate-700 text-slate-300'}`}
              >
                <div>
                  <div className="font-bold tracking-widest">CREAMY LINEAR</div>
                  <div className="text-[10px] text-slate-500 font-mono">55g Operating Force | Smooth & Deep "Thock"</div>
                </div>
                <Volume2 className="h-4 w-4 opacity-70" />
              </button>

              <button 
                onClick={() => triggerSoundFeedback('Clicky Tactile')}
                className={`flex items-center justify-between px-5 py-3 border rounded text-left transition-all ${audioFreq === 'Clicky Tactile' ? 'border-cyber-magenta bg-cyber-magenta/5 text-cyber-magenta shadow-[0_0_12px_rgba(255,0,127,0.2)]' : 'border-slate-800 hover:border-slate-700 text-slate-300'}`}
              >
                <div>
                  <div className="font-bold tracking-widest">CLICKY TACTILE</div>
                  <div className="text-[10px] text-slate-500 font-mono">60g Operating Force | High-Pitch Laser "Click"</div>
                </div>
                <Volume2 className="h-4 w-4 opacity-70" />
              </button>

              <button 
                onClick={() => triggerSoundFeedback('Silent Silent')}
                className={`flex items-center justify-between px-5 py-3 border rounded text-left transition-all ${audioFreq === 'Silent Silent' ? 'border-cyber-purple bg-cyber-purple/5 text-cyber-purple shadow-[0_0_12px_rgba(157,78,221,0.2)]' : 'border-slate-800 hover:border-slate-700 text-slate-300'}`}
              >
                <div>
                  <div className="font-bold tracking-widest">SILENT LINEAR</div>
                  <div className="text-[10px] text-slate-500 font-mono">40g Operating Force | Low-Decibel Muffled Profile</div>
                </div>
                <Volume2 className="h-4 w-4 opacity-70" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-6">
            {/* Visualizer graphic */}
            <div className="w-full bg-cyber-bg/90 border border-slate-900 rounded-xl p-8 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none" />
              
              <div className="flex items-end justify-center gap-1.5 h-24 mb-4">
                {[...Array(16)].map((_, i) => {
                  const baseHeight = 10 + (Math.sin(i * 0.4) * 20) + (Math.cos(i * 0.6) * 10);
                  const activeHeight = soundPlaying 
                    ? baseHeight * 2 
                    : baseHeight;
                  return (
                    <div 
                      key={i} 
                      style={{ height: `${Math.max(6, Math.min(90, activeHeight))}%` }}
                      className={`w-2.5 rounded-t-sm transition-all duration-150 ${soundPlaying ? 'bg-cyber-cyan shadow-[0_0_8px_#00f0ff]' : 'bg-slate-800'}`}
                    />
                  );
                })}
              </div>

              <div className="font-display tracking-widest text-xs text-slate-500 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${soundPlaying ? 'bg-cyber-cyan animate-ping' : 'bg-slate-700'}`} />
                ANALYZING: <span className="font-mono text-slate-300">{audioFreq.toUpperCase()} FREQUENCY</span>
              </div>
            </div>
            
            <Button 
              variant={audioFreq === 'Clicky Tactile' ? 'secondary' : audioFreq === 'Silent Linear' ? 'outline' : 'primary'}
              onClick={() => triggerSoundFeedback(audioFreq)}
              className="px-12 py-3"
            >
              TRIGGER MECHANICAL ACTUATION
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3 p-6 border border-slate-900/60 rounded-xl bg-cyber-dark/20 text-left">
          <div className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/20 w-fit rounded-lg mb-2">
            <Cpu className="h-6 w-6 text-cyber-cyan" />
          </div>
          <h3 className="font-display font-bold text-lg uppercase tracking-wider text-slate-100">Programmable Gasket Layer</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Modify any keybinding or macro sequence directly in firmware. Zero software installations needed— VIA-compatible out of the box.
          </p>
        </div>

        <div className="space-y-3 p-6 border border-slate-900/60 rounded-xl bg-cyber-dark/20 text-left">
          <div className="p-3 bg-cyber-magenta/10 border border-cyber-magenta/20 w-fit rounded-lg mb-2">
            <Zap className="h-6 w-6 text-cyber-magenta" />
          </div>
          <h3 className="font-display font-bold text-lg uppercase tracking-wider text-slate-100">Superconducting USB-C</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Direct physical link interfaces with isolated gold trace shielding. Delivers pure microsecond response capabilities.
          </p>
        </div>

        <div className="space-y-3 p-6 border border-slate-900/60 rounded-xl bg-cyber-dark/20 text-left">
          <div className="p-3 bg-cyber-purple/10 border border-cyber-purple/20 w-fit rounded-lg mb-2">
            <Sliders className="h-6 w-6 text-cyber-purple" />
          </div>
          <h3 className="font-display font-bold text-lg uppercase tracking-wider text-slate-100">Hot-Swappable Module</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Solderless sockets allow instant socket exchanges. Custom calibrate the sound, feel, and acoustics of every switch.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
