import React from 'react';
import Image from 'next/image';

interface LogoIconProps {
  className?: string;
  /** Size in pixels of the visible clip area. Defaults to 28. */
  size?: number;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className, size = 28 }) => {
  // The PNG has ~20% background padding on every side.
  // Render the image at ~160% of the clip size so the logo mark fills the container.
  const imgSize = Math.round(size * 1.6);
  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-full flex-shrink-0 ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-mockup.png"
        alt="Orenda AI Logo"
        width={imgSize}
        height={imgSize}
        style={{ objectFit: 'cover', width: imgSize, height: imgSize }}
        priority
      />
    </span>
  );
};
