import React, { useEffect, useRef, useState } from 'react';
import { Slide, AspectRatio } from '../types';
import { Play, Square } from 'lucide-react';
import { saveAs } from 'file-saver';

interface VideoPreviewProps {
  slides: Slide[];
  aspectRatio: AspectRatio;
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, isStroke = false) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for(let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      if (isStroke) {
        ctx.strokeText(line.trim(), x, currentY);
      }
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (isStroke) {
    ctx.strokeText(line.trim(), x, currentY);
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

export function VideoPreview({ slides, aspectRatio }: VideoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState(1);

  const SLIDE_DURATION = 2500; // 2.5 seconds per slide
  const TOTAL_DURATION = slides.length * SLIDE_DURATION;

  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Dimensions
  const getDimensions = () => {
    switch (aspectRatio) {
      case '1:1': return { width: 1080, height: 1080 };
      case '4:5': return { width: 1080, height: 1350 };
      case '9:16': return { width: 1080, height: 1920 };
    }
  };
  const { width, height } = getDimensions();

  // Scale to fit container
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const padding = window.innerWidth < 768 ? 32 : 64;
      const availableWidth = containerRef.current.clientWidth - padding;
      const availableHeight = containerRef.current.clientHeight - padding;
      const scaleX = availableWidth / width;
      const scaleY = availableHeight / height;
      setScale(Math.min(scaleX, scaleY, 1));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [width, height]);

  useEffect(() => {
    const handleStartExport = () => {
      startRecording();
    };
    document.addEventListener('start-video-export', handleStartExport);
    return () => document.removeEventListener('start-video-export', handleStartExport);
  }, [slides, aspectRatio]);

  // Drawing Logic
  const drawFrame = (time: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const currentSlideIndex = Math.min(
      Math.floor(time / SLIDE_DURATION),
      slides.length - 1
    );
    const slide = slides[currentSlideIndex];
    const slideProgress = (time % SLIDE_DURATION) / SLIDE_DURATION;

    // --- RENDER LOGIC ---
    // 1. Background
    ctx.fillStyle = slide.bgColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Grid
    ctx.strokeStyle = slide.textColor;
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i += 60) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }
    for (let i = 0; i < height; i += 60) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // 3. Transform (Zoom in)
    const globalScale = 1 + (slideProgress * 0.1);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(globalScale, globalScale);
    ctx.translate(-width / 2, -height / 2);

    // 4. Text Animations
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
    const introProgress = Math.min(slideProgress / 0.15, 1);
    const yOffset = (1 - easeOut(introProgress)) * 100;
    ctx.globalAlpha = introProgress;

    let currentY = height / 2 - 200 + yOffset;

    if (slide.title) {
      ctx.font = `900 ${slide.titleSize * 1.5}px "Space Grotesk", "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Shadow
      ctx.fillStyle = slide.textColor;
      ctx.globalAlpha = introProgress * 0.3;
      drawText(ctx, slide.title.toUpperCase(), width / 2 + 12, currentY + 12, width * 0.8, slide.titleSize * 1.6);

      // Main
      ctx.globalAlpha = introProgress;
      ctx.fillStyle = slide.bgColor === '#1a1a1a' ? '#ffffff' : '#ffffff';
      ctx.strokeStyle = slide.textColor;
      ctx.lineWidth = 12;
      currentY = drawText(ctx, slide.title.toUpperCase(), width / 2, currentY, width * 0.8, slide.titleSize * 1.6, true);
    }

    if (slide.subtitle) {
      currentY += 60;
      ctx.font = `800 ${slide.bodySize * 1.5}px "Space Grotesk", "Inter", sans-serif`;
      const subWidth = ctx.measureText(slide.subtitle.toUpperCase()).width;
      ctx.fillStyle = slide.textColor;
      ctx.fillRect(width / 2 - subWidth / 2 - 30, currentY - slide.bodySize * 1.5, subWidth + 60, slide.bodySize * 2 + 10);
      ctx.fillStyle = slide.bgColor;
      ctx.fillText(slide.subtitle.toUpperCase(), width / 2, currentY - slide.bodySize * 0.3);
      currentY += 60;
    }

    if (slide.body) {
      currentY += 60;
      ctx.font = `600 ${slide.bodySize * 1.5}px "Inter", sans-serif`;
      ctx.fillStyle = slide.textColor;
      drawText(ctx, slide.body, width / 2, currentY, width * 0.8, slide.bodySize * 2);
    }

    ctx.restore();

    // 5. Transition Effect
    if (slideProgress > 0.9) {
      const flashProgress = (slideProgress - 0.9) / 0.1;
      ctx.fillStyle = slide.textColor;
      ctx.fillRect(0, height - (height * flashProgress), width, height * flashProgress);
    }
  };

  // Animation Loop
  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    let elapsed = timestamp - startTimeRef.current;

    if (elapsed >= TOTAL_DURATION) {
      if (isRecording) {
        stopRecording();
        return;
      }
      // Loop playback
      startTimeRef.current = timestamp;
      elapsed = 0;
    }

    setProgress(elapsed / TOTAL_DURATION);
    drawFrame(elapsed);

    if (isPlaying || isRecording) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isPlaying || isRecording) {
      startTimeRef.current = performance.now() - (progress * TOTAL_DURATION);
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // Draw static frame
      drawFrame(progress * TOTAL_DURATION);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, isRecording, slides, aspectRatio]);

  // Recording Logic
  const startRecording = () => {
    if (!canvasRef.current) return;
    setIsRecording(true);
    setIsPlaying(false);
    setProgress(0);
    startTimeRef.current = 0;
    chunksRef.current = [];

    const stream = canvasRef.current.captureStream(30); // 30 FPS
    const options = { mimeType: 'video/webm;codecs=vp9' };
    
    try {
      mediaRecorderRef.current = new MediaRecorder(stream, options);
    } catch (e) {
      // Fallback
      mediaRecorderRef.current = new MediaRecorder(stream);
    }

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      saveAs(blob, 'abacus-kinetic-video.webm');
      setIsRecording(false);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    const handleStartExport = () => startRecording();
    document.addEventListener('start-video-export', handleStartExport);
    return () => document.removeEventListener('start-video-export', handleStartExport);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 flex flex-col items-center justify-center p-4">
      <div 
        className="relative shadow-[32px_32px_0px_0px_rgba(0,0,0,0.1)] border-8 border-brand-dark bg-white overflow-hidden"
        style={{
          width: width * scale,
          height: height * scale,
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full h-full"
        />
        
        {/* Recording Overlay */}
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-brand-red text-white px-4 py-2 font-black uppercase border-4 border-brand-dark animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" /> Recording...
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="mt-8 flex items-center gap-4 bg-white border-4 border-brand-dark p-2 shadow-[8px_8px_0px_0px_#1a1a1a]">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={isRecording}
          className="w-12 h-12 flex items-center justify-center bg-brand-lime border-4 border-brand-dark hover:bg-brand-pink transition-colors disabled:opacity-50"
        >
          {isPlaying ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        
        <div className="w-64 h-4 bg-brand-light border-2 border-brand-dark relative">
          <div 
            className="absolute top-0 left-0 h-full bg-brand-red transition-all duration-75"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="font-mono font-bold text-sm">
          {Math.floor((progress * TOTAL_DURATION) / 1000)}s / {TOTAL_DURATION / 1000}s
        </span>
      </div>
    </div>
  );
}
