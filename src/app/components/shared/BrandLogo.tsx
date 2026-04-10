import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-48 h-48',
  };

  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden bg-white shadow-sm transition-transform hover:scale-105 active:scale-95 ${sizeMap[size]} ${className}`}>
      {/* 
        Note: Save the Civic Setu logo image you provided to:
        /src/assets/logo.png 
      */}
      <img 
        src="/logo.png" 
        alt="Civic Setu Logo"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if image not found yet
          const target = e.target as HTMLImageElement;
          target.src = 'https://ui-avatars.com/api/?name=Civic+Setu&background=E8821C&color=fff';
        }}
      />
    </div>
  );
}
