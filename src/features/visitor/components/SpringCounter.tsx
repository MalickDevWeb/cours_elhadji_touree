import React, { useEffect, useState } from 'react';
import { animate } from 'motion/react';

interface SpringCounterProps {
  valeur: number;
  suffix?: string;
  decimals?: number;
}

export const SpringCounter: React.FC<SpringCounterProps> = ({ valeur, suffix = '', decimals = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, valeur, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(latest)
    });
    return () => controls.stop();
  }, [valeur]);

  return (
    <span>
      {displayValue.toFixed(decimals).replace('.', ',')}{suffix}
    </span>
  );
};
