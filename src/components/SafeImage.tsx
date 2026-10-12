import React, { useState } from 'react';
import { Sprout } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Farm produce',
  fallbackTitle,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50/50 text-stone-600 select-none ${containerClassName}`}
      >
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mb-1 shrink-0">
          <Sprout className="w-4 h-4" />
        </div>
        <span className="text-[10px] sm:text-xs font-semibold text-center line-clamp-2 px-1 text-stone-700">
          {fallbackTitle || alt}
        </span>
        <span className="text-[9px] text-emerald-700 font-medium">Farm Direct</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-100 animate-pulse flex items-center justify-center">
          <Sprout className="w-5 h-5 text-stone-300" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        {...props}
      />
    </div>
  );
};
