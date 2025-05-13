'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { css } from '@emotion/react';
import { Progress } from '@mantine/core';

export function NavigationProgress() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Reset progress when route changes
    setProgress(0);
    setIsAnimating(true);
    
    // Simulate progress from 0 to 100
    const timer1 = setTimeout(() => setProgress(30), 50);
    const timer2 = setTimeout(() => setProgress(60), 180);
    const timer3 = setTimeout(() => setProgress(80), 300);
    const timer4 = setTimeout(() => setProgress(98), 550);
    
    // After page loads, complete progress and hide
    const timer5 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsAnimating(false), 200);
    }, 800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [pathname]); // Only depend on pathname changes, not searchParams

  const progressBarStyles = css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2000;
    height: 3px;
    opacity: ${isAnimating ? 1 : 0};
    pointer-events: none;
    transition: opacity 0.3s ease;
  `;

  return (
    <Progress
      css={progressBarStyles}
      value={progress}
      size="xs"
      radius={0}
      animated={progress < 100}
      color="indigo"
      style={{ backgroundColor: 'transparent' }}
      aria-label="Loading progress"
    />
  );
}