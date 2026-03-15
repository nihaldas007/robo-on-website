"use client";

import { memo } from "react";

const CircuitBackground = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit-pattern" x="0" y="0" width="500" height="500" patternUnits="userSpaceOnUse">
            {/* Elegant, ultra-minimalist background trace without pads */}
            <path d="M 0 100 L 150 100 L 250 200 L 500 200" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M 300 150 L 350 200 L 350 500" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" className="text-primary" />
        
        {/* Large stylized trace mapping from the user's reference image for the left side */}
        <g className="text-primary" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Main sweeping trace */}
          <path d="M -50 400 L 150 400 L 300 250 L 800 250" />
          
          {/* Secondary smaller trace branch - no pads */}
          <path d="M -20 500 L 250 500 L 450 300" />
        </g>
        
        {/* Fades out the background towards the center to avoid text collision */}
        <defs>
          <radialGradient id="fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--background)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--background)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
});

CircuitBackground.displayName = "CircuitBackground";
export default CircuitBackground;
