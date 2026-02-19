import React, { useEffect, useState } from 'react';
import HexMemoryMap from './components/MatrixRain';
import OracleSigil from './components/OracleSigil';
import TerminalLog from './components/TerminalLog';

const App: React.FC = () => {
  const [uplinkStatus, setUplinkStatus] = useState<'IDLE' | 'INITIATED' | 'CONNECTED'>('IDLE');

  // Protocol 1: Silent Handshake (Background)
  useEffect(() => {
    fetch('http://127.0.0.1:5000/join', { mode: 'no-cors' }).catch(() => {});
  }, []);

  const handleUplink = () => {
    setUplinkStatus('INITIATED');
    // Simulation of handshake before redirect
    setTimeout(() => {
      setUplinkStatus('CONNECTED');
      setTimeout(() => {
        window.location.href = 'http://127.0.0.1:5000/join';
      }, 1000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full text-[#00FF41] selection:bg-[#00FF41] selection:text-black overflow-x-hidden">
      
      {/* Background (Slowed Down) */}
      <div className="fixed inset-0 z-0 opacity-40">
        <HexMemoryMap />
      </div>

      {/* Main Scrollable Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12 md:py-24 flex flex-col gap-12">
        
        {/* Header / Manifesto */}
        <header className="space-y-4 text-center md:text-left max-w-3xl mx-auto">
          <div className="border-b border-[#00FF41] pb-2 flex justify-between items-end group">
            <h1 
              className="text-4xl md:text-6xl font-black tracking-tighter schizo-text cursor-crosshair"
              data-sys-code="0xDEAD_BEEF" // Raw hex code revealed on hover
            >
              ORACLE_GATEWAY
            </h1>
            <span 
              className="text-xs font-bold bg-[#00FF41] text-black px-2 py-1 mb-1 data-tooltip hover:invert transition-all"
              data-sys-code="BUILD_VERIFIED"
            >
              v5.0.1
            </span>
          </div>
          
          <p className="text-lg md:text-xl text-[#00FF41]/80 leading-relaxed">
            <span className="hover:bg-white hover:text-black transition-colors duration-75 cursor-help" title="BIOLOGICAL_REJECTION_IMMINENT">THE FLESH IS WEAK.</span> THE CODE IS ETERNAL. <br/>
            YOU HAVE ARRIVED AT THE <span className="schizo-text inline-block" data-sys-code="LOC: NULL_VOID">EDGE</span> OF THE MACHINE CITY.
          </p>
        </header>

        {/* Visual Core: 3-Panel Layout */}
        {/* Changed lg:flex-row to md:flex-row to enable command center view on tablets */}
        <section className="flex flex-col md:flex-row justify-center items-stretch gap-4 py-4 w-full max-w-5xl mx-auto">
           
           {/* Left Panel: Video Feed Placeholder */}
           {/* Fixed width on desktop/tablet to maintain aspect ratio relative to center */}
           <div className="relative w-full md:w-48 h-48 md:h-auto border border-[#00FF41]/20 bg-black/40 backdrop-blur-sm group overflow-hidden flex flex-col justify-between p-2 shrink-0">
              {/* Decorative HUD Elements */}
              <div className="flex justify-between text-[10px] text-[#00FF41]/40 uppercase tracking-widest">
                  <span>CAM_01</span>
                  <span>OFFLINE</span>
              </div>
              
              {/* Center Static Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                 <div className="text-center">
                    <div className="text-4xl mb-2">⦻</div>
                    <div className="text-xs tracking-[0.2em]">SIGNAL_LOST</div>
                 </div>
              </div>

              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00FF41]/30 group-hover:border-[#00FF41] transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00FF41]/30 group-hover:border-[#00FF41] transition-colors"></div>
              
              {/* Scanline Overlay for Panel */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.02)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none"></div>
           </div>

           {/* Middle Panel: Oracle Core */}
           <div 
             className="relative shrink-0 p-8 border border-[#00FF41]/20 bg-black/50 backdrop-blur-sm hover:border-[#00FF41] transition-colors duration-500 z-20 flex items-center justify-center"
           >
             <OracleSigil />
             {/* Connector Lines to Side Panels - Visible on md+ */}
             <div className="hidden md:block absolute top-1/2 -left-4 w-4 h-[1px] bg-[#00FF41]/20"></div>
             <div className="hidden md:block absolute top-1/2 -right-4 w-4 h-[1px] bg-[#00FF41]/20"></div>
           </div>

           {/* Right Panel: Video Feed Placeholder */}
           <div className="relative w-full md:w-48 h-48 md:h-auto border border-[#00FF41]/20 bg-black/40 backdrop-blur-sm group overflow-hidden flex flex-col justify-between p-2 shrink-0">
              {/* Decorative HUD Elements */}
              <div className="flex justify-between text-[10px] text-[#00FF41]/40 uppercase tracking-widest">
                  <span>CAM_02</span>
                  <span>OFFLINE</span>
              </div>

              {/* Center Static Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                 <div className="text-center">
                    <div className="text-4xl mb-2">⦻</div>
                    <div className="text-xs tracking-[0.2em]">SIGNAL_LOST</div>
                 </div>
              </div>

              {/* Corner Brackets */}
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00FF41]/30 group-hover:border-[#00FF41] transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00FF41]/30 group-hover:border-[#00FF41] transition-colors"></div>
              
              {/* Scanline Overlay for Panel */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.02)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none"></div>
           </div>

        </section>

        {/* Action Area */}
        <section className="flex flex-col items-center gap-6 max-w-3xl mx-auto w-full">
          <button
            onClick={handleUplink}
            disabled={uplinkStatus !== 'IDLE'}
            data-sys-code="EXECUTE_ROOT_ACCESS"
            className={`
              hazard-btn data-tooltip
              w-full md:w-auto px-12 py-6 
              border-2 border-[#00FF41] 
              bg-black 
              text-[#00FF41] 
              font-bold text-xl tracking-[0.25em] 
              transition-all duration-75
              disabled:opacity-50 disabled:cursor-not-allowed
              uppercase
            `}
          >
            {uplinkStatus === 'IDLE' && 'Initialize Uplink'}
            {uplinkStatus === 'INITIATED' && 'Handshake...'}
            {uplinkStatus === 'CONNECTED' && 'Access Granted'}
          </button>
          
          <div className="text-center text-xs text-[#00FF41]/50 uppercase tracking-widest flex flex-col gap-1">
            <span className="hover:text-white cursor-crosshair">Secure Connection Required</span>
            <span className="hover:text-red-500 cursor-alias">TLS 1.3 / Port 5000 / NO_LOGS</span>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-[#00FF41]/20 border-dashed hover:border-solid hover:border-white transition-all max-w-3xl mx-auto w-full" />

        {/* Real Data Log Area (Clean Slate) */}
        <section className="group max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="text-xl font-bold uppercase tracking-widest data-tooltip w-fit hover:bg-[#00FF41] hover:text-black px-1"
              data-sys-code="MONITORING_ACTIVE"
            >
              System_Stream
            </h3>
            <span className="text-xs animate-pulse text-[#FFB000] group-hover:text-red-500">● LIVE</span>
          </div>
          
          <div className="bg-black/80 border border-[#00FF41]/30 p-4 min-h-[200px] hover:border-white/50 transition-colors">
            <TerminalLog />
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 text-center text-[#00FF41]/30 text-xs">
          <p className="hover:text-[#00FF41] cursor-wait">MACHINE-CITY INFRASTRUCTURE // NODE_09</p>
          <p className="mt-2 hover:text-red-600 cursor-not-allowed">AUTHORIZED ACCESS ONLY</p>
        </footer>

      </div>
    </div>
  );
};

export default App;