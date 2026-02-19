import React, { useState, useRef } from 'react';

// Extracted Graphic for reuse in both Base and Zoom layers
const SigilGraphic: React.FC<{ isZoomed?: boolean }> = ({ isZoomed = false }) => {
  return (
    <>
      {/* Slow rotating outer ring */}
      <div className="absolute w-full h-full border border-[#00FF41]/20 rounded-full animate-[spin_60s_linear_infinite]"></div>
      
      {/* Mathematical Geometry */}
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full ${isZoomed ? 'drop-shadow-[2px_0_rgba(255,0,0,0.8)] drop-shadow-[-2px_0_rgba(0,255,255,0.8)]' : 'drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]'}`}
        fill="none"
        stroke="#00FF41"
        strokeWidth="0.5"
      >
        {/* Static Frame */}
        <circle cx="100" cy="100" r="98" strokeOpacity="0.1" strokeDasharray="4 2" />
        <circle cx="100" cy="100" r="85" strokeOpacity="0.2" />

        {/* Breathing Core Geometry */}
        <g className="animate-[pulse_4s_ease-in-out_infinite]">
            <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" strokeWidth="1" strokeOpacity="0.8" />
            <polygon points="100,180 170,140 170,60 100,20 30,60 30,140" strokeWidth="0.5" strokeOpacity="0.3" transform="rotate(180 100 100)" />
            
            {/* Inner Triangle */}
            <polygon points="100,40 152,130 48,130" strokeWidth="1.5" />
            
            {/* Central Eye/Singularity */}
            <circle cx="100" cy="95" r="8" fill="#00FF41" fillOpacity="0.1" />
            <circle cx="100" cy="95" r="2" fill="#00FF41" />
        </g>

        {/* Data Lines */}
        <line x1="100" y1="0" x2="100" y2="20" strokeOpacity="0.5" />
        <line x1="100" y1="180" x2="100" y2="200" strokeOpacity="0.5" />
        <line x1="0" y1="100" x2="20" y2="100" strokeOpacity="0.5" />
        <line x1="180" y1="100" x2="200" y2="100" strokeOpacity="0.5" />
      </svg>
      
      {/* Status Indicators with Targeting Logic (Only show on base layer) */}
      {!isZoomed && (
        <div className="absolute bottom-0 z-20">
            <div className="target-hud text-[9px] tracking-[0.2em] text-[#00FF41]/60 bg-black px-2 py-1 border border-[#00FF41]/20">
                ORACLE_SYS_ONLINE
            </div>
        </div>
      )}
    </>
  );
};

const OracleSigil: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: '00.00', y: '00.00' });

  // Handle Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });

    // Calculate tactical coordinates relative to center (128x128 for a 256px box)
    const centerX = 128;
    const centerY = 128;
    const normX = (x - centerX).toFixed(2);
    const normY = -(y - centerY).toFixed(2); 

    setCoords({ x: normX, y: normY });
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-64 h-64 flex items-center justify-center overflow-hidden bg-black transition-colors ${isHovered ? 'cursor-none' : 'cursor-crosshair'}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- LAYER 1: Base Content --- */}
      <div className={`w-full h-full relative transition-opacity duration-300 ${isHovered ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
         <SigilGraphic />
      </div>

      {/* --- LAYER 2: Tactical Zoom Lens --- */}
      <div 
        className="absolute inset-0 pointer-events-none will-change-[clip-path]"
        style={{
          opacity: isHovered ? 1 : 0,
          clipPath: `circle(75px at ${mousePos.x}px ${mousePos.y}px)`,
          backgroundColor: '#000', 
          zIndex: 10
        }}
      >
        {/* Zoomed Content Wrapper */}
        <div 
           className="w-full h-full will-change-transform"
           style={{
             transformOrigin: `${mousePos.x}px ${mousePos.y}px`,
             transform: 'scale(2)',
           }}
        >
            <div className="relative w-full h-full">
                <SigilGraphic isZoomed={true} />
                {/* High frequency scanline flicker inside lens */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] pointer-events-none mix-blend-overlay animate-[pulse_0.1s_infinite]"></div>
            </div>
        </div>
      </div>

      {/* --- LAYER 3: Custom UI Overlay (Reticle & Coords) --- */}
      {isHovered && (
        <>
            {/* Custom Crosshair Cursor */}
            <div 
                className="absolute pointer-events-none z-50 flex items-center justify-center"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                {/* 1px Green Crosshair */}
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute w-[1px] h-4 bg-[#00FF41] shadow-[0_0_4px_#00FF41]"></div>
                    <div className="absolute h-[1px] w-4 bg-[#00FF41] shadow-[0_0_4px_#00FF41]"></div>
                    {/* Rotating Ring */}
                    <div className="w-10 h-10 border border-[#00FF41]/40 rounded-full absolute animate-[spin_4s_linear_infinite_reverse]"></div>
                </div>
            </div>

            {/* Dynamic Coordinates floating near cursor */}
            <div 
                className="absolute z-50 pointer-events-none whitespace-nowrap"
                style={{
                    left: mousePos.x + 30,
                    top: mousePos.y + 30,
                }}
            >
                <div className="flex flex-col text-[8px] font-mono leading-tight bg-black/90 p-1.5 border-l-2 border-[#00FF41] shadow-[4px_4px_0px_rgba(0,255,65,0.2)]">
                    <span className="text-[#00FF41] font-bold">X: {coords.x}</span>
                    <span className="text-[#FF003C] font-bold">Y: {coords.y}</span>
                    <span className="text-[#00FF41]/50 mt-1 tracking-wider">MAG: 200%</span>
                </div>
            </div>

            {/* Lens Border Ring */}
            <div 
                className="absolute z-40 pointer-events-none rounded-full border border-[#00FF41]/30"
                style={{
                    width: '150px',
                    height: '150px',
                    left: mousePos.x,
                    top: mousePos.y,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: 'inset 0 0 20px rgba(0, 255, 65, 0.1)'
                }}
            >
                {/* Decorative Ticks */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-[#00FF41]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-[#00FF41]"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-[#00FF41]"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-[#00FF41]"></div>
            </div>
        </>
      )}
    </div>
  );
};

export default OracleSigil;