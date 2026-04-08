import React, { useState } from 'react';
import { Slide, SlideType, SlideTemplate } from '../types';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown, Image as ImageIcon, Type, Palette, Layout, Layers, Download } from 'lucide-react';
import { cn } from '../lib/utils';

interface EditorProps {
  slides: Slide[];
  activeSlideId: string;
  activeSlide: Slide;
  activeTab: 'slides' | 'content' | 'design';
  setActiveTab: (tab: 'slides' | 'content' | 'design') => void;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  updateAllSlidesInPost: (updates: Partial<Slide>) => void;
  updateMultipleSlides: (updatesFn: (slide: Slide, index: number) => Partial<Slide>) => void;
  addSlide: () => void;
  deleteSlide: (id: string) => void;
  duplicateSlide: (id: string) => void;
  reorderSlide: (id: string, direction: 'up' | 'down') => void;
  setActiveSlideId: (id: string) => void;
  importPosts: (parsedPosts: { title: string, slides: Partial<Slide>[] }[]) => void;
}

const BRAND_COLORS = ['#1a1a1a', '#e60023', '#f4f4f5', '#d4f2a3', '#ffb6c1', '#ffffff'];

const TEMPLATES_BY_TYPE: Record<SlideType, SlideTemplate[]> = {
  cover: ['cover-acid-grid', 'cover-sticker-bomb', 'cover-chaos', 'cover-retro-windows', 'title-aztec'],
  content: ['content-neo-brutal', 'content-magazine', 'content-wireframe', 'content-halftone', 'content-shapes', 'content-timeline', 'content-code-block', 'brutalist-shapes', 'text-heavy', 'minimal-centered', 'polaroid-image'],
  portfolio: ['portfolio-browser', 'portfolio-mobile', 'portfolio-bento', 'portfolio-gallery'],
  cta: ['cta-massive-button', 'cta-barcode', 'cta-halftone', 'cta-target', 'cta-warning-tape']
};

const THEME_PRESETS = [
  { name: 'Aztec B&W', template: 'title-aztec', colors: [{ bg: '#1a1a1a', text: '#ffffff' }, { bg: '#ffffff', text: '#1a1a1a' }] },
  { name: 'Acid Chaos', template: 'cover-chaos', colors: [{ bg: '#d4f2a3', text: '#1a1a1a' }, { bg: '#1a1a1a', text: '#d4f2a3' }] },
  { name: 'Sticker Bomb', template: 'cover-sticker-bomb', colors: [{ bg: '#ffb6c1', text: '#1a1a1a' }, { bg: '#ffffff', text: '#1a1a1a' }] },
  { name: 'Neo Brutal', template: 'content-neo-brutal', colors: [{ bg: '#e60023', text: '#ffffff' }, { bg: '#1a1a1a', text: '#ffffff' }] },
];

const DESIGN_PRESETS = [
  { name: 'Brutal Red', bgColor: '#e60023', textColor: '#ffffff' },
  { name: 'Acid Lime', bgColor: '#d4f2a3', textColor: '#1a1a1a' },
  { name: 'Dark Mode', bgColor: '#1a1a1a', textColor: '#f4f4f5' },
  { name: 'Clean White', bgColor: '#ffffff', textColor: '#1a1a1a' },
  { name: 'Soft Pink', bgColor: '#ffb6c1', textColor: '#1a1a1a' },
];

const GEMINI_PROMPT = `Role: World-class Direct-Response Copywriter. Persona: Blunt, funny, slightly aggressive tech consultant. No corporate fluff.
Task: Create a BUNDLE of 10 Instagram carousel posts (5 slides each) for my studio 'Abacus Mates'.
Goal: Convince entrepreneurs their outdated websites are losing money, and sell my $1000 Turnkey service.

Guidelines:
- 60-80 words max per slide. Short, punchy sentences.
- Tone: "Bar-talk expertise." Sarcastic, grounded.
- Formats: Mix it up. Use "Myth vs Fact", "Step-by-Step", "Harsh Truths", "Case Studies", "Common Mistakes".

OUTPUT FORMAT (CRITICAL):
You MUST output exactly in this format. NO markdown outside, no intro/outro.

---POST---
TITLE: [Post 1 Topic/Name]
---SLIDE---
TYPE: cover
TITLE: [Slide Title]
SUBTITLE: [Slide Subtitle]
BODY: [Slide Body]
---SLIDE---
TYPE: content
TITLE: [Slide Title]
SUBTITLE: [Slide Subtitle]
BODY: [Slide Body]
(Continue for 5 slides, last is cta)

---POST---
TITLE: [Post 2 Topic/Name]
---SLIDE---
...

(Generate exactly 10 posts following this structure)`;

export function Editor({
  slides,
  activeSlideId,
  activeSlide,
  activeTab,
  setActiveTab,
  updateSlide,
  updateAllSlidesInPost,
  updateMultipleSlides,
  addSlide,
  deleteSlide,
  duplicateSlide,
  reorderSlide,
  setActiveSlideId,
  importPosts,
}: EditorProps) {
  
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [applyToAll, setApplyToAll] = useState(false);

  const handleImport = () => {
    const postBlocks = importText.split('---POST---').filter(b => b.trim().length > 0);
    
    const parsedPosts = postBlocks.map(postBlock => {
      const titleMatch = postBlock.match(/TITLE:\s*(.*)/i);
      const postTitle = titleMatch ? titleMatch[1].trim() : 'Imported Post';
      
      const slideBlocks = postBlock.split('---SLIDE---').filter(b => b.trim().length > 0 && !b.trim().startsWith('TITLE:'));
      
      const parsedSlides = slideBlocks.map(block => {
        const typeMatch = block.match(/TYPE:\s*(.*)/i);
        const sTitleMatch = block.match(/TITLE:\s*(.*)/i);
        const subtitleMatch = block.match(/SUBTITLE:\s*(.*)/i);
        const bodyMatch = block.match(/BODY:([\s\S]*?)(?=---|$)/i);

        let slideType = (typeMatch?.[1]?.trim().toLowerCase() || 'content') as SlideType;
        if (!['cover', 'content', 'portfolio', 'cta'].includes(slideType)) slideType = 'content';

        return {
          slideType,
          title: sTitleMatch?.[1]?.trim() || '',
          subtitle: subtitleMatch?.[1]?.trim() || '',
          body: bodyMatch?.[1]?.trim() || '',
          template: TEMPLATES_BY_TYPE[slideType][0]
        };
      });
      
      return { title: postTitle, slides: parsedSlides };
    }).filter(p => p.slides.length > 0);

    if (parsedPosts.length > 0) {
      importPosts(parsedPosts);
      setShowImport(false);
      setImportText('');
    } else {
      alert('Could not parse any posts. Make sure to use the ---POST--- and ---SLIDE--- format.');
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateSlide(activeSlideId, { image: url });
    }
  };

  const handleTypeChange = (type: SlideType) => {
    updateSlide(activeSlideId, { 
      slideType: type,
      template: TEMPLATES_BY_TYPE[type][0] // Auto-switch to first template of new type
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b-4 border-brand-dark overflow-x-auto">
        <button
          onClick={() => setActiveTab('slides')}
          className={cn(
            "flex-1 py-4 px-2 font-bold uppercase tracking-wider border-r-4 border-brand-dark transition-colors whitespace-nowrap",
            activeTab === 'slides' ? "bg-brand-dark text-white" : "bg-brand-light hover:bg-brand-lime"
          )}
        >
          Slides ({slides.length})
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={cn(
            "flex-1 py-4 px-2 font-bold uppercase tracking-wider border-r-4 border-brand-dark transition-colors whitespace-nowrap",
            activeTab === 'content' ? "bg-brand-dark text-white" : "bg-brand-light hover:bg-brand-lime"
          )}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={cn(
            "flex-1 py-4 px-2 font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
            activeTab === 'design' ? "bg-brand-dark text-white" : "bg-brand-light hover:bg-brand-lime"
          )}
        >
          Design
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        
        {/* SLIDES TAB */}
        {activeTab === 'slides' && (
          <div className="flex flex-col gap-4">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={cn(
                  "border-4 p-4 cursor-pointer transition-all",
                  activeSlideId === slide.id 
                    ? "border-brand-red bg-brand-pink shadow-[4px_4px_0px_0px_#e60023]" 
                    : "border-brand-dark bg-white hover:shadow-[4px_4px_0px_0px_#1a1a1a]"
                )}
                onClick={() => setActiveSlideId(slide.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-xl">#{index + 1}</span>
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); reorderSlide(slide.id, 'up'); }} className="p-1 hover:bg-brand-dark hover:text-white border-2 border-transparent hover:border-brand-dark"><ArrowUp size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); reorderSlide(slide.id, 'down'); }} className="p-1 hover:bg-brand-dark hover:text-white border-2 border-transparent hover:border-brand-dark"><ArrowDown size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); duplicateSlide(slide.id); }} className="p-1 hover:bg-brand-dark hover:text-white border-2 border-transparent hover:border-brand-dark"><Copy size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteSlide(slide.id); }} disabled={slides.length === 1} className="p-1 hover:bg-brand-red hover:text-white border-2 border-transparent hover:border-brand-red disabled:opacity-30"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] uppercase font-black bg-brand-dark text-white px-2 py-0.5">{slide.slideType}</span>
                  <div className="text-sm font-bold truncate">{slide.title || 'Untitled Slide'}</div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={addSlide}
              className="mt-4 flex items-center justify-center gap-2 border-4 border-dashed border-brand-dark p-6 font-black uppercase hover:bg-brand-lime hover:border-solid transition-all"
            >
              <Plus size={24} /> Add Slide
            </button>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(GEMINI_PROMPT).then(() => {
                  window.open('https://gemini.google.com/app', '_blank');
                });
              }}
              className="mt-4 flex items-center justify-center gap-2 border-4 border-brand-dark bg-brand-pink text-brand-dark p-4 font-black uppercase hover:bg-brand-dark hover:text-white transition-all shadow-[4px_4px_0px_0px_#1a1a1a]"
            >
              <Copy size={20} /> Generate Copy (Gemini)
            </button>

            <div className="mt-4 border-4 border-brand-dark p-4 bg-brand-light">
              <button 
                onClick={() => setShowImport(!showImport)}
                className="w-full flex items-center justify-center gap-2 font-black uppercase hover:text-brand-red transition-colors"
              >
                <Download size={20} className={showImport ? "rotate-180 transition-transform" : "transition-transform"} /> 
                {showImport ? "Hide Import" : "Import Generated Posts"}
              </button>
              
              {showImport && (
                <div className="mt-4 flex flex-col gap-2">
                  <textarea 
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Paste the Gemini output here (separated by ---POST--- and ---SLIDE---)..."
                    className="w-full h-40 border-4 border-brand-dark p-2 font-mono text-sm resize-y focus:outline-none focus:bg-white"
                  />
                  <button 
                    onClick={handleImport}
                    className="w-full bg-brand-lime border-4 border-brand-dark p-2 font-black uppercase hover:bg-brand-dark hover:text-white transition-colors"
                  >
                    Parse & Generate Posts
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-black uppercase text-sm tracking-widest"><Type size={16} /> Title</label>
              <textarea 
                value={activeSlide.title}
                onChange={(e) => updateSlide(activeSlideId, { title: e.target.value })}
                className="w-full border-4 border-brand-dark p-3 font-bold bg-brand-light focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#1a1a1a] transition-all resize-none h-24"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-black uppercase text-sm tracking-widest"><Type size={16} /> Subtitle</label>
              <input 
                type="text"
                value={activeSlide.subtitle}
                onChange={(e) => updateSlide(activeSlideId, { subtitle: e.target.value })}
                className="w-full border-4 border-brand-dark p-3 font-bold bg-brand-light focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#1a1a1a] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-black uppercase text-sm tracking-widest"><Type size={16} /> Body Text</label>
              <textarea 
                value={activeSlide.body}
                onChange={(e) => updateSlide(activeSlideId, { body: e.target.value })}
                className="w-full border-4 border-brand-dark p-3 font-bold bg-brand-light focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#1a1a1a] transition-all resize-y h-32"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 font-black uppercase text-sm tracking-widest"><ImageIcon size={16} /> Image</label>
              {activeSlide.image ? (
                <div className="relative border-4 border-brand-dark p-2 bg-brand-light">
                  <img src={activeSlide.image} alt="Preview" className="w-full h-40 object-cover border-2 border-brand-dark" />
                  <button 
                    onClick={() => updateSlide(activeSlideId, { image: null })}
                    className="absolute top-4 right-4 bg-brand-red text-white p-2 border-2 border-brand-dark hover:scale-110 transition-transform"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-4 border-dashed border-brand-dark p-8 bg-brand-light hover:bg-brand-lime cursor-pointer transition-colors">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="font-bold uppercase">Upload Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>
        )}

        {/* DESIGN TAB */}
        {activeTab === 'design' && (
          <div className="flex flex-col gap-8">
            
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-black uppercase text-sm tracking-widest"><Layers size={16} /> Slide Type</label>
              <div className="flex border-4 border-brand-dark overflow-x-auto custom-scrollbar">
                {(['cover', 'content', 'portfolio', 'cta'] as SlideType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={cn(
                      "flex-1 py-2 px-1 font-bold text-[10px] sm:text-xs uppercase text-center transition-all border-r-4 border-brand-dark last:border-r-0 whitespace-nowrap",
                      activeSlide.slideType === type 
                        ? "bg-brand-dark text-white" 
                        : "bg-white hover:bg-brand-lime"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t-4 border-brand-dark">
              <label className="flex items-center gap-2 font-black uppercase text-sm tracking-widest"><Layout size={16} /> Template</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEMPLATES_BY_TYPE[activeSlide.slideType].map((template) => (
                  <button
                    key={template}
                    onClick={() => updateSlide(activeSlideId, { template })}
                    className={cn(
                      "p-3 border-4 font-bold text-xs uppercase text-center transition-all",
                      activeSlide.template === template 
                        ? "border-brand-dark bg-brand-dark text-white shadow-[4px_4px_0px_0px_#e60023]" 
                        : "border-brand-dark bg-white hover:bg-brand-light"
                    )}
                  >
                    {template.replace(activeSlide.slideType + '-', '').replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t-4 border-brand-dark">
              <label className="flex items-center gap-2 font-black uppercase text-sm tracking-widest"><Layers size={16} /> Post Themes</label>
              <p className="text-xs font-medium text-gray-600">Apply a consistent theme and alternating colors to all slides in this post.</p>
              <div className="flex flex-wrap gap-2">
                {THEME_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      updateMultipleSlides((slide, index) => {
                        const colorPair = preset.colors[index % preset.colors.length];
                        const slideType = Object.keys(TEMPLATES_BY_TYPE).find(key => TEMPLATES_BY_TYPE[key as SlideType].includes(preset.template as SlideTemplate)) as SlideType || 'content';
                        return {
                          template: preset.template as SlideTemplate,
                          bgColor: colorPair.bg,
                          textColor: colorPair.text,
                          slideType
                        };
                      });
                    }}
                    className="px-3 py-2 border-4 border-brand-dark font-bold text-xs uppercase hover:bg-brand-lime transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    updateMultipleSlides((slide) => {
                      const templates = TEMPLATES_BY_TYPE[slide.slideType];
                      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
                      return { template: randomTemplate };
                    });
                  }}
                  className="px-3 py-2 border-4 border-brand-dark bg-brand-dark text-white font-bold text-xs uppercase hover:bg-brand-red transition-colors"
                >
                  Randomize Templates
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t-4 border-brand-dark">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-black uppercase text-sm tracking-widest"><Palette size={16} /> Color Presets</label>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input type="checkbox" checked={applyToAll} onChange={e => setApplyToAll(e.target.checked)} className="w-4 h-4 accent-brand-red" />
                  Apply to entire post
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {DESIGN_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      if (applyToAll) {
                        updateAllSlidesInPost({ bgColor: preset.bgColor, textColor: preset.textColor });
                      } else {
                        updateSlide(activeSlideId, { bgColor: preset.bgColor, textColor: preset.textColor });
                      }
                    }}
                    className="px-3 py-1 border-2 border-brand-dark font-bold text-xs uppercase hover:scale-105 transition-transform"
                    style={{ backgroundColor: preset.bgColor, color: preset.textColor }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t-4 border-brand-dark">
              <label className="flex items-center gap-2 font-black uppercase text-sm tracking-widest"><Palette size={16} /> Colors</label>
              
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase">Background Color</div>
                <div className="flex flex-wrap gap-2">
                  {BRAND_COLORS.map(color => (
                    <button
                      key={`bg-${color}`}
                      onClick={() => {
                        if (applyToAll) updateAllSlidesInPost({ bgColor: color });
                        else updateSlide(activeSlideId, { bgColor: color });
                      }}
                      className={cn(
                        "w-10 h-10 border-4 transition-transform",
                        activeSlide.bgColor === color ? "border-brand-red scale-110" : "border-brand-dark hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={activeSlide.bgColor}
                    onChange={(e) => {
                      if (applyToAll) updateAllSlidesInPost({ bgColor: e.target.value });
                      else updateSlide(activeSlideId, { bgColor: e.target.value });
                    }}
                    className="w-10 h-10 border-4 border-brand-dark p-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="text-xs font-bold uppercase">Text Color</div>
                <div className="flex flex-wrap gap-2">
                  {BRAND_COLORS.map(color => (
                    <button
                      key={`text-${color}`}
                      onClick={() => {
                        if (applyToAll) updateAllSlidesInPost({ textColor: color });
                        else updateSlide(activeSlideId, { textColor: color });
                      }}
                      className={cn(
                        "w-10 h-10 border-4 transition-transform",
                        activeSlide.textColor === color ? "border-brand-red scale-110" : "border-brand-dark hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={activeSlide.textColor}
                    onChange={(e) => {
                      if (applyToAll) updateAllSlidesInPost({ textColor: e.target.value });
                      else updateSlide(activeSlideId, { textColor: e.target.value });
                    }}
                    className="w-10 h-10 border-4 border-brand-dark p-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t-4 border-brand-dark">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-black uppercase text-sm tracking-widest"><Type size={16} /> Typography Size</label>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input type="checkbox" checked={applyToAll} onChange={e => setApplyToAll(e.target.checked)} className="w-4 h-4 accent-brand-red" />
                  Apply to entire post
                </label>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>Title Size</span>
                  <span>{activeSlide.titleSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="32" 
                  max="160" 
                  value={activeSlide.titleSize}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (applyToAll) updateAllSlidesInPost({ titleSize: val });
                    else updateSlide(activeSlideId, { titleSize: val });
                  }}
                  className="w-full accent-brand-red h-2 bg-brand-dark cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>Body Size</span>
                  <span>{activeSlide.bodySize}px</span>
                </div>
                <input 
                  type="range" 
                  min="16" 
                  max="72" 
                  value={activeSlide.bodySize}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (applyToAll) updateAllSlidesInPost({ bodySize: val });
                    else updateSlide(activeSlideId, { bodySize: val });
                  }}
                  className="w-full accent-brand-red h-2 bg-brand-dark cursor-pointer"
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
