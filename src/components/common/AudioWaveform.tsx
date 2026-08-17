import React from 'react';

interface AudioWaveformProps {
  className?: string;
  active?: boolean;
  bars?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  className = '',
  active = true,
  bars = 5
}) => {
  const delays = ['0s', '0.2s', '0.4s', '0.1s', '0.3s', '0.5s', '0.25s'];

  return (
    <div className={`flex items-end gap-[3px] h-5 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full bg-gradient-to-t from-[#D4820A] to-[#F2A93C] ${
            active ? `animate-eq-${(i % 5) + 1}` : 'h-1.5 opacity-40'
          }`}
          style={{
            animationDelay: delays[i % delays.length],
            minHeight: '4px'
          }}
        />
      ))}
    </div>
  );
};
