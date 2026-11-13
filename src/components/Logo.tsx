import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  withBackground?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 40,
  className = '',
  withBackground = true,
}) => {
  return (
    <svg
      id="brand-logo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`select-none shrink-0 ${className}`}
      aria-label="JobReady AI Logo"
    >
      <defs>
        <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB319" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Optional Squircle Background Container */}
      {withBackground && (
        <rect width="512" height="512" rx="140" fill="#0C1017" />
      )}

      {/* Muted Slate Arc in upper right (milestone gauge track) */}
      <path
        d="M 336.5 127.1 A 152 152 0 0 1 402.8 216.7"
        fill="none"
        stroke="#2B3340"
        strokeWidth="34"
        strokeLinecap="round"
      />

      {/* Vibrant Golden-Amber Arc (career loop) */}
      <path
        d="M 400.6 303 A 152 152 0 1 1 303 111.4"
        fill="none"
        stroke="url(#logoGoldGrad)"
        strokeWidth="34"
        strokeLinecap="round"
      />

      {/* Dynamic Career Growth Zig-Zag Arrow Shaft */}
      <path
        d="M 204 300 L 244 264 L 272 292 L 292 248"
        fill="none"
        stroke="url(#logoGoldGrad)"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Career Acceleration Arrowhead pointing up-right */}
      <path
        d="M 314 204 L 264 228 L 290 248 L 318 262 Z"
        fill="url(#logoGoldGrad)"
        stroke="url(#logoGoldGrad)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
};
