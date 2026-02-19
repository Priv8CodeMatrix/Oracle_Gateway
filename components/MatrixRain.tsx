import React, { useEffect, useRef } from 'react';

const HexMemoryMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mutable state variables to handle resize updates
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let numCells = 0;
    
    // Configuration
    const fontSize = 14;
    const spacing = 20; 
    
    // Data arrays
    let grid: string[] = [];
    let life: Float32Array = new Float32Array(0);

    // Initialization function
    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      cols = Math.ceil(width / spacing);
      rows = Math.ceil(height / spacing);
      numCells = cols * rows;

      // Reset arrays
      grid = new Array(numCells);
      life = new Float32Array(numCells);

      for (let i = 0; i < numCells; i++) {
        grid[i] = Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');
        // Start mostly empty/dormant for less initial noise
        life[i] = 0;
      }
    };

    // Initial setup
    init();

    let animationFrameId: number;

    const draw = () => {
      // Clear background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);
      
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < numCells; i++) {
        // 1. Organic Decay
        if (life[i] > 0) {
          life[i] -= 0.01; // Slower decay (was 0.02) for smoother, ghostlier fading
        }

        // 2. Random Ignition
        // Significantly reduced probability (0.003 -> 0.0005)
        // This ensures fewer characters flicker simultaneously.
        if (Math.random() < 0.0005) {
           grid[i] = Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');
           life[i] = 1.0; 
        }

        // 3. Render
        // Optimization: Skip rendering if completely invisible
        // Base opacity is 0.02, so we always render unless hidden.
        
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * spacing + 10;
        const y = row * spacing + 15;

        // Visual Tuning:
        // Base opacity: 0.02 (Very subtle background grid)
        // Active opacity max add: 0.5 (Was 0.85) -> Total max opacity ~0.52
        const opacity = 0.02 + (Math.max(0, life[i]) * 0.5);

        ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
        ctx.fillText(grid[i], x, y);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default HexMemoryMap;