import { Slide, AspectRatio } from '../types';
import { cn } from '../lib/utils';

interface SlidePreviewProps {
  slide: Slide;
  aspectRatio: AspectRatio;
  className?: string;
  id?: string;
  key?: string | number;
}

export function SlidePreview({ slide, aspectRatio, className, id }: SlidePreviewProps) {
  const getDimensions = () => {
    switch (aspectRatio) {
      case '1:1': return { width: 1080, height: 1080 };
      case '4:5': return { width: 1080, height: 1350 };
      case '9:16': return { width: 1080, height: 1920 };
    }
  };

  const { width, height } = getDimensions();

  return (
    <div
      id={id}
      className={cn("relative overflow-hidden flex flex-col", className)}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: slide.bgColor,
        color: slide.textColor,
      }}
    >
      {/* Templates */}
      {slide.template === 'minimal-centered' && (
        <div className="flex-1 flex flex-col items-center justify-center p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at center, ${slide.textColor} 2px, transparent 2.5px)`, backgroundSize: '20px 20px' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square rounded-full border-[40px] border-current opacity-5" style={{ color: slide.textColor }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] aspect-square rounded-full border-[40px] border-current opacity-5" style={{ color: slide.textColor }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] aspect-square rounded-full border-[40px] border-current opacity-5" style={{ color: slide.textColor }} />
          
          <div className="relative z-10 flex flex-col items-center bg-white/90 backdrop-blur-sm border-8 border-current p-16 shadow-[24px_24px_0px_0px_currentColor]">
            {slide.image && (
              <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-current mb-16 shadow-[16px_16px_0px_0px_currentColor]">
                <img src={slide.image} alt="" className="w-full h-full object-cover grayscale contrast-125" />
              </div>
            )}
            <h2 className="font-black uppercase leading-none tracking-tighter mb-8" style={{ fontSize: `${slide.titleSize}px` }}>
              {slide.title}
            </h2>
            {slide.subtitle && (
              <div className="bg-current text-white px-8 py-2 mb-12" style={{ color: slide.bgColor, backgroundColor: slide.textColor }}>
                <h3 className="text-4xl font-bold uppercase tracking-widest">
                  {slide.subtitle}
                </h3>
              </div>
            )}
            <p className="font-medium leading-relaxed max-w-[90%]" style={{ fontSize: `${slide.bodySize}px` }}>
              {slide.body}
            </p>
          </div>
        </div>
      )}

      {slide.template === 'polaroid-image' && (
        <div className="flex-1 flex flex-col p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${slide.bgColor} 40px), repeating-linear-gradient(${slide.textColor}55, ${slide.textColor}55)` }} />
          <div className="absolute top-1/4 -right-12 w-48 h-48 bg-brand-pink rotate-45 opacity-40 mix-blend-multiply" />
          <div className="absolute bottom-1/4 -left-12 w-48 h-48 bg-brand-lime rounded-full opacity-40 mix-blend-multiply" />
          
          <div className="flex-1 border-8 border-current bg-white p-6 pb-24 shadow-[24px_24px_0px_0px_currentColor] flex flex-col relative z-10 rotate-1">
            {slide.image ? (
              <div className="flex-1 border-4 border-current bg-gray-100 overflow-hidden">
                <img src={slide.image} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="flex-1 border-4 border-current bg-gray-100 flex items-center justify-center">
                <span className="text-4xl font-bold opacity-20">NO IMAGE</span>
              </div>
            )}
            <div className="mt-12 flex flex-col gap-4">
              <h2 className="font-black uppercase leading-none tracking-tighter" style={{ fontSize: `${slide.titleSize}px` }}>
                {slide.title}
              </h2>
              <p className="font-medium leading-tight" style={{ fontSize: `${slide.bodySize}px` }}>
                {slide.body}
              </p>
            </div>
          </div>
        </div>
      )}

      {slide.template === 'text-heavy' && (
        <div className="flex-1 flex flex-col p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, ${slide.textColor} 40px, ${slide.textColor} 42px), repeating-linear-gradient(90deg, transparent, transparent 40px, ${slide.textColor} 40px, ${slide.textColor} 42px)` }} />
          <div className="absolute top-1/4 -right-24 w-96 h-96 bg-brand-lime rounded-full opacity-40 mix-blend-multiply blur-3xl" />
          <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-brand-pink rounded-full opacity-40 mix-blend-multiply blur-3xl" />
          
          <div className="absolute top-10 right-10 text-[300px] font-serif leading-none opacity-5 pointer-events-none" style={{ color: slide.textColor }}>"</div>
          
          <div className="relative z-10 border-b-8 border-current pb-12 mb-12 bg-white/80 backdrop-blur-sm p-8 shadow-[16px_16px_0px_0px_currentColor]">
            <h2 className="font-black uppercase leading-[0.85] tracking-tighter" style={{ fontSize: `${slide.titleSize}px` }}>
              {slide.title}
            </h2>
          </div>
          <div className="relative z-10 flex-1 columns-2 gap-12 bg-white/90 p-8 border-4 border-current shadow-[16px_16px_0px_0px_currentColor]">
            <p className="font-medium leading-snug break-inside-avoid" style={{ fontSize: `${slide.bodySize}px` }}>
              {slide.body}
            </p>
            {slide.image && (
              <div className="border-4 border-current mt-8 break-inside-avoid shadow-[8px_8px_0px_0px_currentColor]">
                <img src={slide.image} alt="" className="w-full h-auto grayscale" />
              </div>
            )}
          </div>
          {slide.subtitle && (
            <div className="relative z-10 mt-12 bg-current p-6 flex justify-between items-center shadow-[16px_16px_0px_0px_currentColor]">
              <span className="text-3xl font-bold uppercase tracking-widest" style={{ color: slide.bgColor }}>{slide.subtitle}</span>
              <span className="text-6xl font-black" style={{ color: slide.bgColor }}>***</span>
            </div>
          )}
        </div>
      )}

      {slide.template === 'title-aztec' && (
        <div className="flex-1 flex flex-col p-12 border-[24px] border-current m-8 relative">
          <div className="absolute top-0 left-0 w-16 h-16 border-b-[24px] border-r-[24px] border-current" />
          <div className="absolute top-0 right-0 w-16 h-16 border-b-[24px] border-l-[24px] border-current" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-t-[24px] border-r-[24px] border-current" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-t-[24px] border-l-[24px] border-current" />
          
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
            <h2 className="font-black uppercase leading-[0.85] tracking-tighter mb-8" style={{ fontSize: `${slide.titleSize}px` }}>
              {slide.title}
            </h2>
            {slide.subtitle && (
              <div className="bg-current px-8 py-4 mb-12">
                <h3 className="font-bold uppercase tracking-widest" style={{ color: slide.bgColor, fontSize: `${slide.bodySize}px` }}>
                  {slide.subtitle}
                </h3>
              </div>
            )}
            {slide.image && (
              <div className="w-full max-w-[80%] aspect-video border-8 border-current relative overflow-hidden shadow-[16px_16px_0px_0px_currentColor]">
                <img src={slide.image} alt="" className="w-full h-full object-cover grayscale contrast-150" />
              </div>
            )}
          </div>
        </div>
      )}

      {slide.template === 'cta-halftone' && (
        <div className="flex-1 flex flex-col items-center justify-center p-16 relative overflow-hidden" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at center, ${slide.textColor} 4px, transparent 4.5px)`, backgroundSize: '24px 24px' }} />
          
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-lime rounded-full mix-blend-multiply opacity-50 blur-xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-pink rounded-full mix-blend-multiply opacity-50 blur-xl" />

          <div className="z-10 bg-white border-8 border-current p-16 shadow-[24px_24px_0px_0px_currentColor] text-center w-full max-w-[90%] relative">
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-brand-lime border-4 border-current rounded-full" />
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-brand-pink border-4 border-current rounded-full" />
            
            <h2 className="font-black uppercase leading-[0.85] tracking-tighter mb-8" style={{ fontSize: `${slide.titleSize}px` }}>
              {slide.title}
            </h2>
            <p className="font-bold leading-snug mb-12" style={{ fontSize: `${slide.bodySize}px` }}>
              {slide.body}
            </p>
            
            <div className="inline-block bg-current text-white px-12 py-6 shadow-[12px_12px_0px_0px_currentColor] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_currentColor] transition-all cursor-pointer" style={{ color: slide.bgColor, backgroundColor: slide.textColor }}>
              <span className="font-black uppercase tracking-widest" style={{ fontSize: `${slide.bodySize * 1.5}px` }}>
                {slide.subtitle || 'ACTION'}
              </span>
            </div>
          </div>
        </div>
      )}

      {slide.template === 'brutalist-shapes' && (
        <div className="flex-1 flex flex-col p-12 relative overflow-hidden" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(45deg, ${slide.textColor} 25%, transparent 25%, transparent 75%, ${slide.textColor} 75%, ${slide.textColor}), linear-gradient(45deg, ${slide.textColor} 25%, transparent 25%, transparent 75%, ${slide.textColor} 75%, ${slide.textColor})`, backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }} />
          
          {/* Large decorative shapes */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-lime border-8 border-current rounded-full mix-blend-multiply opacity-80 shadow-[16px_16px_0px_0px_currentColor]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-pink border-8 border-current mix-blend-multiply opacity-80 shadow-[16px_16px_0px_0px_currentColor] rotate-12" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-yellow-400 border-y-8 border-current -rotate-12 mix-blend-multiply opacity-60" />

          <div className="z-10 flex-1 flex flex-col justify-center gap-12 relative">
            <div className="bg-white border-8 border-current p-8 shadow-[16px_16px_0px_0px_currentColor] self-start max-w-[80%] rotate-2 hover:rotate-0 transition-transform">
              <h2 className="font-black uppercase leading-[0.85] tracking-tighter" style={{ fontSize: `${slide.titleSize}px` }}>
                {slide.title}
              </h2>
            </div>
            
            <div className="flex gap-8 items-center">
              <div className="flex-1 bg-white border-8 border-current p-8 shadow-[16px_16px_0px_0px_currentColor] -rotate-1 hover:rotate-0 transition-transform">
                {slide.subtitle && (
                  <div className="inline-block bg-brand-lime border-4 border-current px-4 py-2 mb-6 shadow-[4px_4px_0px_0px_currentColor]">
                    <h3 className="font-black uppercase tracking-widest" style={{ fontSize: `${slide.bodySize * 1.2}px` }}>
                      {slide.subtitle}
                    </h3>
                  </div>
                )}
                <p className="font-bold leading-snug" style={{ fontSize: `${slide.bodySize}px` }}>
                  {slide.body}
                </p>
              </div>
              {slide.image && (
                <div className="w-1/3 aspect-[3/4] bg-white border-8 border-current p-4 shadow-[16px_16px_0px_0px_currentColor] rotate-3 hover:rotate-0 transition-transform">
                  <div className="w-full h-full border-4 border-current overflow-hidden">
                    <img src={slide.image} alt="" className="w-full h-full object-cover grayscale contrast-125" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {slide.template === 'content-neo-brutal' && (
        <div className="flex-1 flex flex-col p-12 relative overflow-hidden" style={{ backgroundColor: slide.bgColor }}>
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `radial-gradient(${slide.textColor} 3px, transparent 3px)`, backgroundSize: '24px 24px' }} />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-pink rounded-full opacity-50 mix-blend-multiply" />
          <div className="absolute top-1/4 -right-12 w-48 h-48 bg-brand-lime rotate-45 opacity-50 mix-blend-multiply" />
          
          <div className="absolute top-8 right-8 w-32 h-32 rounded-full border-8 border-current flex items-center justify-center rotate-12 shadow-[8px_8px_0px_0px_currentColor] z-20" style={{ backgroundColor: slide.textColor, color: slide.bgColor }}>
            <span className="font-black text-2xl text-center leading-none">NEW<br/>POST</span>
          </div>
          <div className="flex-1 border-8 border-current bg-white p-12 shadow-[24px_24px_0px_0px_currentColor] flex flex-col justify-between z-10 relative">
             {/* Crosses */}
             <div className="absolute top-4 left-4 w-8 h-8 border-t-8 border-l-8 border-current" />
             <div className="absolute bottom-4 right-4 w-8 h-8 border-b-8 border-r-8 border-current" />
             
             <div>
               {slide.subtitle && (
                 <div className="inline-block border-4 border-current px-4 py-1 font-bold tracking-widest uppercase mb-8" style={{ backgroundColor: slide.textColor, color: slide.bgColor }}>
                   {slide.subtitle}
                 </div>
               )}
               <h2 className="font-black uppercase leading-[0.85] tracking-tighter" style={{ fontSize: `${slide.titleSize}px` }}>
                 {slide.title}
               </h2>
             </div>
             
             <div className="flex gap-8 items-end mt-12">
               {slide.image && (
                 <div className="w-1/2 aspect-square border-8 border-current shadow-[12px_12px_0px_0px_currentColor] overflow-hidden">
                   <img src={slide.image} className="w-full h-full object-cover grayscale contrast-150" alt="" />
                 </div>
               )}
               <p className="flex-1 font-bold text-xl uppercase border-l-8 border-current pl-6 py-2" style={{ fontSize: `${slide.bodySize}px` }}>
                 {slide.body}
               </p>
             </div>
          </div>
        </div>
      )}

      {slide.template === 'cover-acid-grid' && (
        <div className="flex-1 flex flex-col p-8 relative overflow-hidden" style={{ backgroundColor: slide.bgColor }}>
          {/* Acid Grid */}
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `linear-gradient(${slide.textColor} 4px, transparent 4px), linear-gradient(90deg, ${slide.textColor} 4px, transparent 4px)`, backgroundSize: '64px 64px' }} />
          
          <div className="z-10 flex-1 flex flex-col items-center justify-center text-center">
            {/* Huge Starburst */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square opacity-10 animate-[spin_20s_linear_infinite]">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" />
              </svg>
            </div>
            
            <h2 className="font-black uppercase leading-[0.8] tracking-tighter mix-blend-difference text-white z-20" style={{ fontSize: `${slide.titleSize * 1.5}px` }}>
              {slide.title}
            </h2>
            
            {slide.subtitle && (
              <div className="mt-12 border-8 border-current bg-white p-6 shadow-[16px_16px_0px_0px_currentColor] rotate-[-2deg] z-20 max-w-[80%]">
                <h3 className="font-black uppercase tracking-widest" style={{ fontSize: `${slide.bodySize * 1.5}px` }}>
                  {slide.subtitle}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}

      {slide.template === 'content-magazine' && (
        <div className="flex-1 flex flex-col p-12 bg-white relative overflow-hidden" style={{ borderColor: slide.textColor }}>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${slide.textColor} 0, ${slide.textColor} 1px, transparent 1px, transparent 10px)` }} />
          
          <div className="relative z-10 border-b-8 border-current pb-6 mb-8 flex justify-between items-end">
            <h2 className="font-black uppercase leading-none tracking-tighter max-w-[70%]" style={{ fontSize: `${slide.titleSize * 0.8}px` }}>
              {slide.title}
            </h2>
            <div className="w-16 h-16 border-4 border-current rounded-full flex items-center justify-center bg-white">
              <span className="font-black text-2xl">M</span>
            </div>
          </div>
          
          <div className="relative z-10 flex-1 columns-2 gap-12">
            {/* Drop cap effect */}
            <p className="font-medium leading-snug text-justify bg-white p-4 border-4 border-transparent" style={{ fontSize: `${slide.bodySize}px` }}>
              <span className="float-left font-black leading-[0.8] mr-4 mt-2" style={{ fontSize: `${slide.bodySize * 4}px` }}>
                {slide.body.charAt(0)}
              </span>
              {slide.body.substring(1)}
            </p>
            
            {slide.image && (
              <div className="border-8 border-current mt-8 break-inside-avoid shadow-[8px_8px_0px_0px_currentColor] relative bg-white">
                <img src={slide.image} alt="" className="w-full h-auto grayscale contrast-125" />
                {/* Decorative wireframe globe */}
                <svg className="absolute -bottom-8 -right-8 w-32 h-32 opacity-50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="50" cy="50" r="48" />
                  <ellipse cx="50" cy="50" rx="20" ry="48" />
                  <ellipse cx="50" cy="50" rx="48" ry="20" />
                </svg>
              </div>
            )}
          </div>
          
          {slide.subtitle && (
            <div className="relative z-10 mt-8 bg-current p-6 text-center">
              <span className="font-bold uppercase tracking-widest" style={{ color: slide.bgColor, fontSize: `${slide.bodySize * 1.2}px` }}>
                {slide.subtitle}
              </span>
            </div>
          )}
        </div>
      )}

      {slide.template === 'cta-massive-button' && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(45deg, ${slide.textColor} 25%, transparent 25%, transparent 75%, ${slide.textColor} 75%, ${slide.textColor}), linear-gradient(45deg, ${slide.textColor} 25%, transparent 25%, transparent 75%, ${slide.textColor} 75%, ${slide.textColor})`, backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }} />
          
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center">
             <div className="w-[150%] h-[150%] border-[80px] border-current rounded-full opacity-5" />
          </div>

          <div className="relative z-10 w-full flex flex-col items-center bg-white/90 backdrop-blur-sm border-8 border-current p-16 shadow-[24px_24px_0px_0px_currentColor]">
            <h2 className="font-black uppercase leading-[0.85] tracking-tighter mb-8" style={{ fontSize: `${slide.titleSize}px` }}>
              {slide.title}
            </h2>
            <p className="font-medium leading-tight mb-16 max-w-[80%]" style={{ fontSize: `${slide.bodySize}px` }}>
              {slide.body}
            </p>

            <div className="w-full border-8 border-current py-12 px-8 shadow-[24px_24px_0px_0px_currentColor] hover:translate-x-2 hover:translate-y-2 hover:shadow-[16px_16px_0px_0px_currentColor] transition-all cursor-pointer flex items-center justify-center gap-8 relative overflow-hidden group" style={{ backgroundColor: slide.textColor, color: slide.bgColor }}>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              <span className="font-black uppercase tracking-widest relative z-10" style={{ fontSize: `${slide.bodySize * 1.5}px` }}>
                {slide.subtitle || 'CLICK HERE'}
              </span>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="relative z-10 group-hover:translate-x-4 transition-transform">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 16 16 12 12 8"></polyline>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
          </div>
        </div>
      )}

      {slide.template === 'cta-barcode' && (
        <div className="flex-1 flex flex-col p-12 bg-white relative">
          <div className="flex-1 border-8 border-current border-dashed p-12 flex flex-col justify-between relative">
            {/* Corner cutouts */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-white rounded-full border-8 border-current border-dashed" style={{ backgroundColor: slide.bgColor }} />
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-white rounded-full border-8 border-current border-dashed" style={{ backgroundColor: slide.bgColor }} />
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-white rounded-full border-8 border-current border-dashed" style={{ backgroundColor: slide.bgColor }} />
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-white rounded-full border-8 border-current border-dashed" style={{ backgroundColor: slide.bgColor }} />
            
            <div className="text-center mt-8">
              <h2 className="font-black uppercase leading-[0.85] tracking-tighter mb-8" style={{ fontSize: `${slide.titleSize}px` }}>
                {slide.title}
              </h2>
              <p className="font-medium leading-snug max-w-[80%] mx-auto" style={{ fontSize: `${slide.bodySize}px` }}>
                {slide.body}
              </p>
            </div>
            
            <div className="mt-12 pt-12 border-t-8 border-current border-dashed flex flex-col items-center">
              <div className="bg-current px-12 py-4 mb-8 w-full text-center">
                <span className="font-black uppercase tracking-widest text-3xl" style={{ color: slide.bgColor }}>
                  {slide.subtitle}
                </span>
              </div>
              {/* Fake Barcode */}
              <div className="flex gap-1 h-24 w-full justify-center items-end">
                {[1,3,2,5,1,2,4,1,6,2,1,3,2,4,1,2,5,1,3,2].map((w, i) => (
                  <div key={i} className="bg-current h-full" style={{ width: `${w * 4}px` }} />
                ))}
              </div>
              <div className="mt-2 font-mono font-bold tracking-[0.5em] text-xl">
                010010110101
              </div>
            </div>
          </div>
        </div>
      )}

      {slide.template === 'cover-sticker-bomb' && (
        <div className="flex-1 flex flex-col p-12 relative overflow-hidden" style={{ backgroundColor: slide.bgColor }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${slide.bgColor} 40px), repeating-linear-gradient(${slide.textColor}55, ${slide.textColor}55)` }} />
          
          {/* Stickers */}
          <div className="absolute top-12 left-12 w-32 h-32 bg-brand-lime rounded-full border-8 border-current flex items-center justify-center -rotate-12 shadow-[8px_8px_0px_0px_currentColor] z-20" style={{ color: slide.textColor }}>
            <span className="font-black text-3xl text-center leading-none">100%<br/>RAW</span>
          </div>
          <div className="absolute top-32 right-12 bg-white border-8 border-current p-4 rotate-12 shadow-[8px_8px_0px_0px_currentColor] z-20" style={{ color: slide.textColor }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 2L2 22h20L12 2z"/></svg>
          </div>
          <div className="absolute bottom-24 left-24 bg-brand-pink border-8 border-current p-4 -rotate-6 shadow-[8px_8px_0px_0px_currentColor] z-20" style={{ color: slide.textColor }}>
             <span className="font-black text-4xl">!!!</span>
          </div>

          <div className="z-10 flex-1 flex flex-col items-center justify-center text-center mt-16">
            <div className="bg-white border-8 border-current p-8 shadow-[16px_16px_0px_0px_currentColor] -rotate-2 relative">
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-current rounded-full" />
              <h2 className="font-black uppercase leading-[0.85] tracking-tighter" style={{ fontSize: `${slide.titleSize}px`, color: slide.textColor }}>
                {slide.title}
              </h2>
            </div>
            
            {slide.subtitle && (
              <div className="mt-12 bg-current p-4 rotate-3 shadow-[8px_8px_0px_0px_currentColor]">
                <h3 className="font-black uppercase tracking-widest" style={{ color: slide.bgColor, fontSize: `${slide.bodySize * 1.5}px` }}>
                  {slide.subtitle}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}

      {slide.template === 'content-wireframe' && (
        <div className="flex-1 flex flex-col p-12 relative bg-white" style={{ color: slide.textColor }}>
          {/* Blueprint grid */}
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${slide.textColor}20 2px, transparent 2px), linear-gradient(90deg, ${slide.textColor}20 2px, transparent 2px)`, backgroundSize: '40px 40px' }} />
          
          <div className="z-10 flex-1 border-4 border-current p-8 flex flex-col relative bg-white/90">
            {/* Corner markers */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-current" />
            <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-current" />
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-current" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-current" />
            
            <div className="flex justify-between items-start mb-12 border-b-4 border-current pb-8">
              <h2 className="font-black uppercase leading-[0.9] tracking-tighter max-w-[70%]" style={{ fontSize: `${slide.titleSize * 0.8}px` }}>
                {slide.title}
              </h2>
              <div className="font-mono font-bold text-xl border-2 border-current p-2">
                SEC_01
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-12">
              <div className="flex flex-col gap-8">
                {slide.subtitle && (
                  <div className="font-mono font-bold uppercase tracking-widest border-l-4 border-current pl-4" style={{ fontSize: `${slide.bodySize * 1.2}px` }}>
                    {slide.subtitle}
                  </div>
                )}
                <p className="font-medium leading-snug" style={{ fontSize: `${slide.bodySize}px` }}>
                  {slide.body}
                </p>
              </div>
              
              <div className="relative border-4 border-current p-4 flex flex-col bg-white">
                <div className="absolute top-0 left-0 w-full h-8 border-b-4 border-current flex items-center px-2 gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-current" />
                  <div className="w-3 h-3 rounded-full border-2 border-current" />
                  <div className="w-3 h-3 rounded-full border-2 border-current" />
                </div>
                <div className="flex-1 mt-8 relative overflow-hidden bg-gray-100 border-2 border-current">
                  {slide.image ? (
                    <img src={slide.image} alt="" className="w-full h-full object-cover mix-blend-luminosity" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-24 h-24 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {slide.template === 'cta-target' && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          {/* Target Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-[150%] aspect-square rounded-full border-[40px] border-current flex items-center justify-center" style={{ color: slide.textColor }}>
              <div className="w-[70%] aspect-square rounded-full border-[40px] border-current flex items-center justify-center">
                <div className="w-[40%] aspect-square rounded-full bg-current" />
              </div>
            </div>
          </div>
          
          <div className="z-10 w-full max-w-[90%] flex flex-col items-center text-center">
            <div className="bg-white/90 backdrop-blur-sm border-8 border-current p-12 shadow-[24px_24px_0px_0px_currentColor] mb-16 relative">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-brand-pink border-4 border-current rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-brand-lime border-4 border-current rounded-full" />
              
              <h2 className="font-black uppercase leading-[0.85] tracking-tighter mb-8" style={{ fontSize: `${slide.titleSize}px` }}>
                {slide.title}
              </h2>
              <p className="font-bold leading-snug" style={{ fontSize: `${slide.bodySize}px` }}>
                {slide.body}
              </p>
            </div>
            
            <div className="relative cursor-pointer group">
              <div className="absolute inset-0 bg-current translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6" style={{ color: slide.textColor }} />
              <div className="relative bg-brand-lime border-8 border-current px-16 py-8 flex items-center gap-6 transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
                <span className="font-black uppercase tracking-widest" style={{ fontSize: `${slide.bodySize * 1.5}px` }}>
                  {slide.subtitle || 'ACTION'}
                </span>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
      {slide.template === 'cover-chaos' && (
        <div className="flex-1 flex flex-col p-12 relative overflow-hidden" style={{ backgroundColor: slide.bgColor }}>
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(${slide.textColor} 2px, transparent 2px)`, backgroundSize: '30px 30px' }} />
          
          {/* Floating Shapes */}
          <div className="absolute top-10 left-10 w-48 h-48 border-[16px] border-current rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2" style={{ color: slide.textColor }} />
          <div className="absolute bottom-20 right-10 w-64 h-64 border-[16px] border-current opacity-50 translate-x-1/4 translate-y-1/4 rotate-45" style={{ color: slide.textColor }} />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-current opacity-20 rotate-12" style={{ color: slide.textColor }} />
          <div className="absolute bottom-1/3 right-1/3 w-0 h-0 border-l-[60px] border-l-transparent border-b-[100px] border-b-current border-r-[60px] border-r-transparent opacity-40 -rotate-12" style={{ color: slide.textColor }} />

          <div className="z-10 flex-1 flex flex-col justify-center items-center text-center relative">
            <div className="bg-white border-8 border-current p-12 shadow-[24px_24px_0px_0px_currentColor] relative" style={{ color: slide.textColor }}>
              <div className="absolute -top-8 -right-8 bg-brand-lime border-4 border-current p-4 rotate-12">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <h2 className="font-black uppercase leading-[0.85] tracking-tighter" style={{ fontSize: `${slide.titleSize * 1.2}px` }}>
                {slide.title}
              </h2>
            </div>
            {slide.subtitle && (
              <div className="mt-16 bg-current px-8 py-4 -rotate-2 shadow-[8px_8px_0px_0px_currentColor]" style={{ color: slide.textColor, backgroundColor: slide.textColor }}>
                <h3 className="font-black uppercase tracking-widest" style={{ color: slide.bgColor, fontSize: `${slide.bodySize * 1.5}px` }}>
                  {slide.subtitle}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}

      {slide.template === 'content-halftone' && (
        <div className="flex-1 flex flex-col p-16 relative" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at center, ${slide.textColor} 4px, transparent 4.5px)`, backgroundSize: '24px 24px' }} />
          
          <div className="z-10 flex-1 flex flex-col border-8 border-current bg-white/90 p-12 shadow-[16px_16px_0px_0px_currentColor] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-current opacity-10 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-pink opacity-20 rounded-tr-full" />

            <h2 className="font-black uppercase leading-[0.9] tracking-tighter mb-8 relative z-10" style={{ fontSize: `${slide.titleSize}px` }}>
              {slide.title}
            </h2>
            
            {slide.subtitle && (
              <div className="inline-block bg-current text-white px-4 py-2 font-bold uppercase tracking-widest mb-8 self-start relative z-10" style={{ fontSize: `${slide.bodySize * 1.2}px`, color: slide.bgColor, backgroundColor: slide.textColor }}>
                {slide.subtitle}
              </div>
            )}
            
            <div className="flex-1 flex gap-12 relative z-10">
              <p className="font-medium leading-snug flex-1" style={{ fontSize: `${slide.bodySize}px` }}>
                {slide.body}
              </p>
              {slide.image && (
                <div className="w-1/2 border-4 border-current bg-gray-100 relative">
                  <div className="absolute inset-0 bg-current translate-x-4 translate-y-4" />
                  <img src={slide.image} alt="" className="relative z-10 w-full h-full object-cover grayscale contrast-125" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {slide.template === 'content-shapes' && (
        <div className="flex-1 flex flex-col p-12 relative overflow-hidden" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          {/* Background Shapes */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-lime rounded-full mix-blend-multiply opacity-70 blur-xl" />
          <div className="absolute top-40 -right-20 w-80 h-80 bg-brand-pink rounded-full mix-blend-multiply opacity-70 blur-xl" />
          <div className="absolute -bottom-20 left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply opacity-70 blur-xl" />
          
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(45deg, ${slide.textColor} 25%, transparent 25%, transparent 75%, ${slide.textColor} 75%, ${slide.textColor}), linear-gradient(45deg, ${slide.textColor} 25%, transparent 25%, transparent 75%, ${slide.textColor} 75%, ${slide.textColor})`, backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }} />

          {/* Additional shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-8 border-current rounded-full opacity-20" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border-8 border-current rotate-45 opacity-20" />

          <div className="z-10 flex-1 flex flex-col justify-center gap-12">
            <div className="border-l-8 border-current pl-8 bg-white/80 backdrop-blur-sm py-4 shadow-[8px_8px_0px_0px_currentColor]">
              <h2 className="font-black uppercase leading-[0.9] tracking-tighter" style={{ fontSize: `${slide.titleSize}px` }}>
                {slide.title}
              </h2>
            </div>
            
            <div className="flex gap-12 items-center">
              {slide.image && (
                <div className="w-1/2 aspect-square rounded-full border-8 border-current overflow-hidden relative shadow-[16px_16px_0px_0px_currentColor]">
                  <img src={slide.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 flex flex-col gap-6 bg-white/90 backdrop-blur-sm border-8 border-current p-8 shadow-[16px_16px_0px_0px_currentColor]">
                {slide.subtitle && (
                  <div className="bg-current text-white px-4 py-2 self-start" style={{ color: slide.bgColor, backgroundColor: slide.textColor }}>
                    <h3 className="font-black uppercase tracking-widest" style={{ fontSize: `${slide.bodySize * 1.2}px` }}>
                      {slide.subtitle}
                    </h3>
                  </div>
                )}
                <p className="font-bold leading-snug" style={{ fontSize: `${slide.bodySize}px` }}>
                  {slide.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {slide.template === 'portfolio-browser' && (
        <div className="flex-1 flex flex-col p-12 relative" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${slide.textColor} 0, ${slide.textColor} 2px, transparent 2px, transparent 8px)` }} />
          
          <div className="z-10 mb-8 bg-white border-4 border-current p-6 shadow-[8px_8px_0px_0px_currentColor] inline-block self-start">
            <h2 className="font-black uppercase leading-none tracking-tighter" style={{ fontSize: `${slide.titleSize * 0.7}px` }}>
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="font-bold mt-2 opacity-60 uppercase tracking-widest" style={{ fontSize: `${slide.bodySize}px` }}>
                {slide.subtitle}
              </p>
            )}
          </div>

          <div className="z-10 flex-1 border-4 border-current bg-white flex flex-col shadow-[16px_16px_0px_0px_currentColor] overflow-hidden">
            {/* Browser Header */}
            <div className="h-12 border-b-4 border-current bg-gray-100 flex items-center px-4 gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-current bg-brand-red" />
              <div className="w-4 h-4 rounded-full border-2 border-current bg-yellow-400" />
              <div className="w-4 h-4 rounded-full border-2 border-current bg-brand-lime" />
              <div className="ml-4 flex-1 border-2 border-current bg-white h-6 rounded-full flex items-center px-4 opacity-50">
                <span className="text-xs font-mono font-bold">https://portfolio.work</span>
              </div>
            </div>
            {/* Browser Content */}
            <div className="flex-1 bg-gray-50 relative overflow-hidden">
              {slide.image ? (
                <img src={slide.image} alt="" className="w-full h-full object-cover object-top" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold opacity-20 text-2xl">
                  [WEBSITE SCREENSHOT]
                </div>
              )}
            </div>
          </div>
          
          {slide.body && (
            <div className="z-10 mt-8 bg-current text-white p-6 shadow-[8px_8px_0px_0px_currentColor]" style={{ backgroundColor: slide.textColor, color: slide.bgColor }}>
              <p className="font-medium leading-snug" style={{ fontSize: `${slide.bodySize}px` }}>
                {slide.body}
              </p>
            </div>
          )}
        </div>
      )}

      {slide.template === 'portfolio-mobile' && (
        <div className="flex-1 flex p-12 relative items-center justify-center gap-12" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(${slide.textColor} 2px, transparent 2px)`, backgroundSize: '20px 20px' }} />
          
          <div className="z-10 w-1/2 flex flex-col gap-8">
            <div className="bg-white border-8 border-current p-8 shadow-[12px_12px_0px_0px_currentColor]">
              <h2 className="font-black uppercase leading-[0.9] tracking-tighter" style={{ fontSize: `${slide.titleSize * 0.8}px` }}>
                {slide.title}
              </h2>
            </div>
            {slide.subtitle && (
              <div className="inline-block border-4 border-current px-4 py-2 font-bold uppercase tracking-widest bg-brand-lime shadow-[4px_4px_0px_0px_currentColor] self-start" style={{ fontSize: `${slide.bodySize * 1.2}px` }}>
                {slide.subtitle}
              </div>
            )}
            <div className="bg-white border-4 border-current p-6 shadow-[8px_8px_0px_0px_currentColor]">
              <p className="font-medium leading-snug" style={{ fontSize: `${slide.bodySize}px` }}>
                {slide.body}
              </p>
            </div>
          </div>

          <div className="z-10 w-[40%] aspect-[9/19] border-[12px] border-current rounded-[3rem] bg-white shadow-[24px_24px_0px_0px_currentColor] relative overflow-hidden flex flex-col">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-current rounded-b-xl z-20" />
            <div className="flex-1 relative bg-gray-100">
              {slide.image ? (
                <img src={slide.image} alt="" className="w-full h-full object-cover object-top" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold opacity-20 text-center p-4">
                  [MOBILE SCREENSHOT]
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {slide.template === 'portfolio-bento' && (
        <div className="flex-1 flex flex-col p-12 relative" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(${slide.textColor} 2px, transparent 2px), linear-gradient(90deg, ${slide.textColor} 2px, transparent 2px)`, backgroundSize: '40px 40px' }} />
          
          <div className="z-10 flex-1 grid grid-cols-3 grid-rows-3 gap-6">
            {/* Main Image */}
            <div className="col-span-2 row-span-2 border-8 border-current bg-white shadow-[12px_12px_0px_0px_currentColor] relative overflow-hidden">
              {slide.image ? (
                <img src={slide.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold opacity-20 text-2xl bg-gray-100">
                  [MAIN VISUAL]
                </div>
              )}
            </div>
            
            {/* Title Block */}
            <div className="col-span-1 row-span-1 border-8 border-current bg-brand-lime p-6 shadow-[8px_8px_0px_0px_currentColor] flex items-center justify-center text-center">
              <h2 className="font-black uppercase leading-[0.9] tracking-tighter" style={{ fontSize: `${slide.titleSize * 0.6}px` }}>
                {slide.title}
              </h2>
            </div>
            
            {/* Subtitle Block */}
            <div className="col-span-1 row-span-1 border-8 border-current bg-white p-6 shadow-[8px_8px_0px_0px_currentColor] flex items-center justify-center text-center">
              <h3 className="font-black uppercase tracking-widest" style={{ fontSize: `${slide.bodySize * 1.2}px` }}>
                {slide.subtitle || 'CASE STUDY'}
              </h3>
            </div>
            
            {/* Body Block */}
            <div className="col-span-3 row-span-1 border-8 border-current bg-white p-8 shadow-[12px_12px_0px_0px_currentColor] flex items-center">
              <p className="font-bold leading-snug" style={{ fontSize: `${slide.bodySize}px` }}>
                {slide.body}
              </p>
            </div>
          </div>
        </div>
      )}
      {slide.template === 'cover-retro-windows' && (
        <div className="flex-1 flex flex-col p-12 relative overflow-hidden" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(90deg, ${slide.textColor} 1px, transparent 1px), linear-gradient(${slide.textColor} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
          
          <div className="z-10 flex-1 relative">
            {/* Window 1 (Background) */}
            <div className="absolute top-10 left-10 right-20 bottom-32 border-4 border-current bg-white shadow-[8px_8px_0px_0px_currentColor] flex flex-col opacity-50">
              <div className="h-8 border-b-4 border-current bg-gray-200 flex items-center px-2 gap-2">
                <div className="flex-1 h-4 bg-current opacity-20" />
              </div>
            </div>
            
            {/* Window 2 (Main) */}
            <div className="absolute top-24 left-20 right-10 bottom-10 border-4 border-current bg-white shadow-[16px_16px_0px_0px_currentColor] flex flex-col">
              <div className="h-10 border-b-4 border-current bg-brand-dark text-white flex items-center px-4 justify-between">
                <span className="font-bold font-mono text-sm uppercase">SYSTEM_ERROR.EXE</span>
                <div className="flex gap-2">
                  <div className="w-4 h-4 border-2 border-white" />
                  <div className="w-4 h-4 border-2 border-white" />
                  <div className="w-4 h-4 border-2 border-white flex items-center justify-center text-xs font-bold">X</div>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col justify-center items-center text-center bg-gray-50">
                <div className="w-24 h-24 mb-8 bg-brand-red rounded-full flex items-center justify-center text-white border-4 border-current shadow-[4px_4px_0px_0px_currentColor]">
                  <span className="font-black text-6xl">!</span>
                </div>
                <h2 className="font-black uppercase leading-[0.9] tracking-tighter mb-6" style={{ fontSize: `${slide.titleSize * 0.8}px` }}>
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <div className="bg-brand-lime border-4 border-current px-6 py-2 shadow-[4px_4px_0px_0px_currentColor]">
                    <span className="font-bold uppercase tracking-widest" style={{ fontSize: `${slide.bodySize * 1.2}px` }}>
                      {slide.subtitle}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {slide.template === 'content-timeline' && (
        <div className="flex-1 flex flex-col p-16 relative" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 0 0, ${slide.textColor} 2px, transparent 2.5px)`, backgroundSize: '30px 30px' }} />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(-45deg, ${slide.textColor} 0, ${slide.textColor} 1px, transparent 1px, transparent 10px)` }} />
          
          <div className="z-10 mb-12 border-b-8 border-current pb-6 flex justify-between items-end bg-white/80 backdrop-blur-sm p-8 shadow-[8px_8px_0px_0px_currentColor]">
            <h2 className="font-black uppercase leading-none tracking-tighter max-w-[70%]" style={{ fontSize: `${slide.titleSize * 0.8}px` }}>
              {slide.title}
            </h2>
            <div className="font-mono font-bold text-2xl bg-current text-white px-4 py-2 shadow-[4px_4px_0px_0px_currentColor]" style={{ color: slide.bgColor, backgroundColor: slide.textColor }}>
              PROCESS
            </div>
          </div>

          <div className="z-10 flex-1 flex relative">
            {/* Timeline Line */}
            <div className="absolute top-0 bottom-0 left-8 w-8 bg-current opacity-20" />
            <div className="absolute top-0 bottom-0 left-10 w-4 bg-current" />
            
            <div className="flex-1 pl-32 flex flex-col justify-center gap-16">
              <div className="relative bg-white border-8 border-current p-8 shadow-[16px_16px_0px_0px_currentColor]">
                <div className="absolute top-1/2 -left-32 w-16 h-16 bg-brand-lime border-8 border-current rounded-full -translate-y-1/2 flex items-center justify-center font-black text-2xl z-10 shadow-[4px_4px_0px_0px_currentColor]">1</div>
                <div className="absolute top-1/2 -left-16 w-16 h-4 bg-current -translate-y-1/2" />
                {slide.subtitle && (
                  <div className="bg-current text-white px-4 py-2 mb-4 inline-block" style={{ color: slide.bgColor, backgroundColor: slide.textColor }}>
                    <h3 className="font-black uppercase tracking-widest" style={{ fontSize: `${slide.bodySize * 1.2}px` }}>
                      {slide.subtitle}
                    </h3>
                  </div>
                )}
                <p className="font-bold leading-snug" style={{ fontSize: `${slide.bodySize}px` }}>
                  {slide.body}
                </p>
              </div>
              
              {slide.image && (
                <div className="relative bg-white border-8 border-current p-4 shadow-[16px_16px_0px_0px_currentColor]">
                  <div className="absolute top-1/2 -left-32 w-16 h-16 bg-brand-pink border-8 border-current rounded-full -translate-y-1/2 flex items-center justify-center font-black text-2xl z-10 shadow-[4px_4px_0px_0px_currentColor]">2</div>
                  <div className="absolute top-1/2 -left-16 w-16 h-4 bg-current -translate-y-1/2" />
                  <div className="h-64 bg-gray-100 overflow-hidden border-4 border-current">
                    <img src={slide.image} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {slide.template === 'content-code-block' && (
        <div className="flex-1 flex flex-col p-12 relative" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="z-10 flex-1 border-8 border-current bg-brand-dark flex flex-col shadow-[16px_16px_0px_0px_currentColor] overflow-hidden">
            {/* Terminal Header */}
            <div className="h-12 border-b-4 border-current bg-gray-200 flex items-center px-4 justify-between">
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-current bg-brand-red" />
                <div className="w-4 h-4 rounded-full border-2 border-current bg-yellow-400" />
                <div className="w-4 h-4 rounded-full border-2 border-current bg-brand-lime" />
              </div>
              <span className="font-mono font-bold text-sm uppercase">terminal ~ bash</span>
              <div className="w-16" /> {/* Spacer */}
            </div>
            
            {/* Terminal Content */}
            <div className="flex-1 p-8 font-mono text-white flex flex-col gap-6 overflow-hidden relative">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #ffffff 2px, #ffffff 4px)` }} />
              
              <div>
                <span className="text-brand-lime font-bold">$</span> <span className="text-yellow-400">execute</span> <span className="text-brand-pink">--title</span>
                <h2 className="mt-2 font-black uppercase leading-none tracking-tighter text-white" style={{ fontSize: `${slide.titleSize * 0.7}px` }}>
                  {slide.title}
                </h2>
              </div>
              
              {slide.subtitle && (
                <div>
                  <span className="text-brand-lime font-bold">$</span> <span className="text-yellow-400">load</span> <span className="text-brand-pink">--subtitle</span>
                  <div className="mt-2 text-gray-300 font-bold uppercase tracking-widest" style={{ fontSize: `${slide.bodySize * 1.2}px` }}>
                    {slide.subtitle}
                  </div>
                </div>
              )}
              
              <div className="flex-1">
                <span className="text-brand-lime font-bold">$</span> <span className="text-yellow-400">cat</span> <span className="text-brand-pink">content.txt</span>
                <p className="mt-2 text-gray-300 font-medium leading-relaxed" style={{ fontSize: `${slide.bodySize}px` }}>
                  {slide.body}
                  <span className="inline-block w-3 h-6 bg-white ml-2 animate-pulse align-middle" />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {slide.template === 'portfolio-gallery' && (
        <div className="flex-1 flex flex-col p-12 relative overflow-hidden" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, ${slide.textColor} 20px)` }} />
          
          <div className="z-10 text-center mb-8 bg-white border-8 border-current p-6 shadow-[8px_8px_0px_0px_currentColor] relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-brand-pink border-4 border-current rounded-full" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-brand-lime border-4 border-current rounded-full" />
            <h2 className="font-black uppercase leading-none tracking-tighter" style={{ fontSize: `${slide.titleSize * 0.7}px` }}>
              {slide.title}
            </h2>
          </div>

          <div className="z-10 flex-1 relative">
            {/* Image 1 (Background) */}
            <div className="absolute top-0 left-0 w-2/3 h-2/3 border-8 border-current bg-white p-4 shadow-[12px_12px_0px_0px_currentColor] -rotate-6">
              <div className="w-full h-full bg-gray-200 border-4 border-current overflow-hidden">
                {slide.image ? <img src={slide.image} alt="" className="w-full h-full object-cover grayscale opacity-50" /> : <div className="w-full h-full flex items-center justify-center font-mono font-bold opacity-20">IMG_01</div>}
              </div>
            </div>
            
            {/* Image 2 (Foreground) */}
            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 border-8 border-current bg-white p-4 shadow-[16px_16px_0px_0px_currentColor] rotate-3">
              <div className="w-full h-full bg-gray-100 border-4 border-current overflow-hidden">
                {slide.image ? <img src={slide.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-mono font-bold opacity-20">IMG_02</div>}
              </div>
            </div>
            
            {/* Info Badge */}
            {slide.subtitle && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-lime border-8 border-current p-6 shadow-[12px_12px_0px_0px_currentColor] rotate-12 z-20 text-center">
                <span className="font-black uppercase tracking-widest" style={{ fontSize: `${slide.bodySize * 1.5}px` }}>
                  {slide.subtitle}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {slide.template === 'cta-warning-tape' && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden" style={{ backgroundColor: slide.bgColor, color: slide.textColor }}>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(45deg, ${slide.textColor} 25%, transparent 25%, transparent 75%, ${slide.textColor} 75%, ${slide.textColor}), linear-gradient(45deg, ${slide.textColor} 25%, transparent 25%, transparent 75%, ${slide.textColor} 75%, ${slide.textColor})`, backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} />
          
          {/* Warning Tapes */}
          <div className="absolute top-20 -left-10 w-[120%] h-16 bg-yellow-400 border-y-8 border-current rotate-3 flex items-center overflow-hidden z-20 shadow-[0_8px_0_0_rgba(0,0,0,0.2)]">
            <div className="font-black uppercase tracking-widest text-2xl whitespace-nowrap" style={{ color: '#1a1a1a' }}>
              {'WARNING • DO NOT IGNORE • '.repeat(10)}
            </div>
          </div>
          <div className="absolute bottom-20 -left-10 w-[120%] h-16 bg-yellow-400 border-y-8 border-current -rotate-3 flex items-center overflow-hidden z-20 shadow-[0_8px_0_0_rgba(0,0,0,0.2)]">
            <div className="font-black uppercase tracking-widest text-2xl whitespace-nowrap" style={{ color: '#1a1a1a' }}>
              {'TAKE ACTION • TAKE ACTION • '.repeat(10)}
            </div>
          </div>

          <div className="z-10 bg-white border-8 border-current p-12 shadow-[24px_24px_0px_0px_currentColor] text-center w-full max-w-[90%] relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-brand-red rounded-full border-8 border-current flex items-center justify-center text-white shadow-[4px_4px_0px_0px_currentColor]">
              <span className="font-black text-3xl">!</span>
            </div>
            
            <h2 className="font-black uppercase leading-[0.85] tracking-tighter mb-8 mt-4" style={{ fontSize: `${slide.titleSize}px` }}>
              {slide.title}
            </h2>
            <p className="font-bold leading-snug mb-12" style={{ fontSize: `${slide.bodySize}px` }}>
              {slide.body}
            </p>
            
            <div className="inline-block bg-brand-lime border-8 border-current px-12 py-6 shadow-[12px_12px_0px_0px_currentColor] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_currentColor] transition-all cursor-pointer">
              <span className="font-black uppercase tracking-widest" style={{ fontSize: `${slide.bodySize * 1.5}px` }}>
                {slide.subtitle || 'CLICK HERE'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
