import React, { useState, useRef, useEffect } from 'react';

// Extracted Graphic for reuse
const SigilGraphic: React.FC = () => {
  return (
    <>
      {/* Slow rotating outer ring */}
      <div className="absolute w-full h-full border border-[#00FF41]/20 rounded-full animate-[spin_60s_linear_infinite] will-change-transform"></div>
      
      {/* Mathematical Geometry */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]"
        fill="none"
        stroke="#00FF41"
        strokeWidth="0.5"
      >
        {/* Static Frame */}
        <circle cx="100" cy="100" r="98" strokeOpacity="0.1" strokeDasharray="4 2" />
        <circle cx="100" cy="100" r="85" strokeOpacity="0.2" />

        {/* Breathing Core Geometry */}
        <g className="animate-[pulse_4s_ease-in-out_infinite] will-change-opacity">
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
      
      {/* Status Indicators */}
      <div className="absolute bottom-0 z-20">
          <div className="target-hud text-[9px] tracking-[0.2em] text-[#00FF41]/60 bg-black px-2 py-1 border border-[#00FF41]/20">
              ORACLE_SYS_ONLINE
          </div>
      </div>
    </>
  );
};

const OracleSigil: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: '00.00', y: '00.00' });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Handle Mouse Movement (Optimized with rAF)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Persist event values needed
    const clientX = e.clientX;
    const clientY = e.clientY;
    const rect = containerRef.current.getBoundingClientRect();

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    animationFrameRef.current = requestAnimationFrame(() => {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      setMousePos({ x, y });

      // Calculate tactical coordinates relative to center
      const centerX = 128; // Half of 256
      const centerY = 128;
      const normX = (x - centerX).toFixed(2);
      const normY = -(y - centerY).toFixed(2); 

      setCoords({ x: normX, y: normY });
    });
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
      <div className="w-full h-full relative">
         <SigilGraphic />
      </div>

      {/* --- LAYER 2: Tactical Zoom Lens (Optimized via Backdrop Filter) --- */}
      {isHovered && (
        <>
            {/* The Lens itself - No duplication, just filter */}
            <div 
                className="absolute pointer-events-none z-30 rounded-full border border-[#00FF41]/50 will-change-transform"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    width: '150px',
                    height: '150px',
                    transform: 'translate(-50%, -50%)',
                    backdropFilter: 'brightness(1.2) contrast(1.2) saturate(1.5)',
                    boxShadow: 'inset 0 0 20px rgba(0, 255, 65, 0.2), 0 0 10px rgba(0,0,0,0.5)'
                }}
            >
               {/* High frequency scanline flicker inside lens */}
               <div className="absolute inset-0 rounded-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] mix-blend-overlay animate-[pulse_0.1s_infinite]"></div>
               
               {/* Decorative Ticks on Lens */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-[#00FF41]"></div>
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-[#00FF41]"></div>
               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-[#00FF41]"></div>
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-[#00FF41]"></div>
            </div>

            {/* Custom Crosshair Cursor Center */}
            <div 
                className="absolute pointer-events-none z-50 flex items-center justify-center will-change-transform"
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
                className="absolute z-50 pointer-events-none whitespace-nowrap will-change-transform"
                style={{
                    left: mousePos.x + 40,
                    top: mousePos.y + 40,
                }}
            >
                <div className="flex flex-col text-[8px] font-mono leading-tight bg-black/90 p-1.5 border-l-2 border-[#00FF41] shadow-[4px_4px_0px_rgba(0,255,65,0.2)]">
                    <span className="text-[#00FF41] font-bold">X: {coords.x}</span>
                    <span className="text-[#FF003C] font-bold">Y: {coords.y}</span>
                    <span className="text-[#00FF41]/50 mt-1 tracking-wider">MAG: DIGITAL</span>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default OracleSigil;