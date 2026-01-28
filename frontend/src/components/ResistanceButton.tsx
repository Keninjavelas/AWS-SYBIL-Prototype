import React, { useState, useRef, useEffect } from 'react';

interface Props {
  onConfirm: () => void;
  disabled: boolean;
  label: string;
}

const ResistanceButton: React.FC<Props> = ({ onConfirm, disabled, label }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHolding) {
      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            setIsHolding(false);
            onConfirm();
            return 100;
          }
          return prev + 2; // Speed of the "hold"
        });
      }, 20);
    } else {
      setProgress(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHolding, onConfirm]);

  return (
    <div className="relative w-full group">
      {/* The Progress Bar Background */}
      <div 
        className="absolute top-0 left-0 h-full bg-red-900/50 transition-all duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
      
      <button
        onMouseDown={() => !disabled && setIsHolding(true)}
        onMouseUp={() => setIsHolding(false)}
        onMouseLeave={() => setIsHolding(false)}
        disabled={disabled}
        className={`relative w-full py-4 border border-red-900/50 uppercase tracking-[0.2em] font-bold text-xs transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-950/30 active:scale-[0.99] cursor-pointer'}
          ${isHolding ? 'text-red-400 border-red-500' : 'text-slate-500'}
        `}
      >
        {isHolding ? 'AUTHORIZING BREACH...' : label}
      </button>

      {/* The "Safety" Line */}
      <div className="flex justify-between mt-1 px-1">
        <span className="text-[9px] text-red-900 uppercase">System Override</span>
        <span className="text-[9px] text-red-900 uppercase">Hold to Confirm</span>
      </div>
    </div>
  );
};

export default ResistanceButton;