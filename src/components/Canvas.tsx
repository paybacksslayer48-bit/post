import { useEffect, useState, RefObject } from 'react';
import { Slide, AspectRatio } from '../types';
import { SlidePreview } from './SlidePreview';

interface CanvasProps {
  slide: Slide;
  aspectRatio: AspectRatio;
  carouselRef: RefObject<HTMLDivElement | null>;
  slides: Slide[];
  activeSlideId: string;
}

export function Canvas({ slide, aspectRatio, carouselRef, slides, activeSlideId }: CanvasProps) {
  const [scale, setScale] = useState(1);

  const getDimensions = () => {
    switch (aspectRatio) {
      case '1:1': return { width: 1080, height: 1080 };
      case '4:5': return { width: 1080, height: 1350 };
      case '9:16': return { width: 1080, height: 1920 };
    }
  };

  const { width, height } = getDimensions();

  useEffect(() => {
    const updateScale = () => {
      if (!carouselRef.current) return;
      const container = carouselRef.current.parentElement;
      if (!container) return;

      const padding = window.innerWidth < 768 ? 32 : 64; // 16px padding on all sides for mobile, 32px for desktop
      const availableWidth = container.clientWidth - padding;
      const availableHeight = container.clientHeight - padding;

      const scaleX = availableWidth / width;
      const scaleY = availableHeight / height;
      
      setScale(Math.min(scaleX, scaleY, 1)); // Don't scale up beyond 1
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [width, height, carouselRef]);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Visible Active Slide */}
      <div 
        ref={carouselRef}
        className="shadow-[32px_32px_0px_0px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out origin-center"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
        }}
      >
        <SlidePreview slide={slide} aspectRatio={aspectRatio} id={`slide-${slide.id}`} />
      </div>

      {/* Hidden Slides for Export */}
      <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none -z-10">
        {slides.map((s) => (
          s.id !== activeSlideId && (
            <div 
              key={s.id}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              <SlidePreview slide={s} aspectRatio={aspectRatio} id={`slide-${s.id}`} />
            </div>
          )
        ))}
      </div>
    </div>
  );
}
