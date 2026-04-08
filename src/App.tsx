/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Slide, AspectRatio, Post } from './types';
import { Canvas } from './components/Canvas';
import { Editor } from './components/Editor';
import { SlidePreview } from './components/SlidePreview';
import { Download, FolderDown, ChevronDown, Plus, Trash2, Archive } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const DEFAULT_SLIDE: Omit<Slide, 'id'> = {
  slideType: 'cover',
  title: 'ABACUS MATES',
  subtitle: 'WE BUILD WEBSITES THAT SELL',
  body: 'Stop losing customers to boring design. It is time to stand out.',
  image: null,
  template: 'cover-acid-grid',
  titleSize: 72,
  bodySize: 32,
  textColor: '#1a1a1a',
  bgColor: '#d4f2a3',
};

export default function App() {
  const [posts, setPosts] = useState<Post[]>([
    { id: crypto.randomUUID(), title: 'Post 1', slides: [{ ...DEFAULT_SLIDE, id: crypto.randomUUID() }] }
  ]);
  const [activePostId, setActivePostId] = useState<string>(posts[0].id);
  const [activeSlideId, setActiveSlideId] = useState<string>(posts[0].slides[0].id);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5');
  const [activeTab, setActiveTab] = useState<'slides' | 'content' | 'design'>('content');
  const [isExporting, setIsExporting] = useState(false);
  const [showPostDropdown, setShowPostDropdown] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  const activePost = posts.find((p) => p.id === activePostId) || posts[0];
  const slides = activePost.slides;
  const activeSlide = slides.find((s) => s.id === activeSlideId) || slides[0];

  // Ensure activeSlideId is valid when switching posts
  useEffect(() => {
    if (!slides.find(s => s.id === activeSlideId)) {
      setActiveSlideId(slides[0].id);
    }
  }, [activePostId, slides, activeSlideId]);

  const updatePost = (id: string, updates: Partial<Post>) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addPost = () => {
    const newPost: Post = {
      id: crypto.randomUUID(),
      title: `Post ${posts.length + 1}`,
      slides: [{ ...DEFAULT_SLIDE, id: crypto.randomUUID() }]
    };
    setPosts([...posts, newPost]);
    setActivePostId(newPost.id);
    setActiveSlideId(newPost.slides[0].id);
    setShowPostDropdown(false);
  };

  const deletePost = (id: string) => {
    if (posts.length <= 1) return;
    const newPosts = posts.filter(p => p.id !== id);
    setPosts(newPosts);
    if (activePostId === id) {
      setActivePostId(newPosts[0].id);
    }
  };

  const updateSlide = (id: string, updates: Partial<Slide>) => {
    const newSlides = slides.map((s) => (s.id === id ? { ...s, ...updates } : s));
    updatePost(activePostId, { slides: newSlides });
  };

  const updateAllSlidesInPost = (updates: Partial<Slide>) => {
    const newSlides = slides.map((s) => ({ ...s, ...updates }));
    updatePost(activePostId, { slides: newSlides });
  };

  const updateMultipleSlides = (updatesFn: (slide: Slide, index: number) => Partial<Slide>) => {
    const newSlides = slides.map((s, i) => ({ ...s, ...updatesFn(s, i) }));
    updatePost(activePostId, { slides: newSlides });
  };

  const addSlide = () => {
    const newSlide = { ...DEFAULT_SLIDE, id: crypto.randomUUID() };
    updatePost(activePostId, { slides: [...slides, newSlide] });
    setActiveSlideId(newSlide.id);
  };

  const duplicateSlide = (id: string) => {
    const slideToCopy = slides.find((s) => s.id === id);
    if (!slideToCopy) return;
    const newSlide = { ...slideToCopy, id: crypto.randomUUID() };
    const index = slides.findIndex((s) => s.id === id);
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    updatePost(activePostId, { slides: newSlides });
    setActiveSlideId(newSlide.id);
  };

  const deleteSlide = (id: string) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((s) => s.id !== id);
    updatePost(activePostId, { slides: newSlides });
    if (activeSlideId === id) {
      setActiveSlideId(newSlides[0].id);
    }
  };

  const reorderSlide = (id: string, direction: 'up' | 'down') => {
    const index = slides.findIndex((s) => s.id === id);
    if (direction === 'up' && index > 0) {
      const newSlides = [...slides];
      [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
      updatePost(activePostId, { slides: newSlides });
    } else if (direction === 'down' && index < slides.length - 1) {
      const newSlides = [...slides];
      [newSlides[index + 1], newSlides[index]] = [newSlides[index], newSlides[index + 1]];
      updatePost(activePostId, { slides: newSlides });
    }
  };

  const importPosts = (parsedPosts: { title: string, slides: Partial<Slide>[] }[]) => {
    if (parsedPosts.length === 0) return;
    
    const newPosts: Post[] = parsedPosts.map((p, i) => ({
      id: crypto.randomUUID(),
      title: p.title || `Imported Post ${i + 1}`,
      slides: p.slides.map(s => ({
        ...DEFAULT_SLIDE,
        id: crypto.randomUUID(),
        ...s
      }))
    }));

    setPosts(newPosts);
    setActivePostId(newPosts[0].id);
    setActiveSlideId(newPosts[0].slides[0].id);
  };

  const handleExportCurrent = async () => {
    if (!carouselRef.current) return;
    setIsExporting(true);
    try {
      const node = document.getElementById(`slide-${activeSlideId}`);
      if (!node) throw new Error('Slide node not found');
      
      const dataUrl = await htmlToImage.toPng(node, {
        pixelRatio: 3,
        quality: 1,
      });
      saveAs(dataUrl, `slide-${activeSlideId}.png`);
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed. See console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = async () => {
    if (!carouselRef.current) return;
    setIsExporting(true);
    try {
      const zip = new JSZip();
      
      // We need to render slides that might not be in the DOM.
      // The Canvas component currently renders all slides for the active post hidden.
      // To export ALL posts, we'd need them all rendered. 
      // For now, let's export the current post's slides.
      
      const postFolder = zip.folder(activePost.title.replace(/[^a-z0-9]/gi, '_').toLowerCase());
      if (!postFolder) throw new Error('Could not create folder');

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const node = document.getElementById(`slide-${slide.id}`);
        if (!node) continue;
        
        const dataUrl = await htmlToImage.toPng(node, {
          pixelRatio: 3,
          quality: 1,
        });
        
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        postFolder.file(`slide-${i + 1}.png`, base64Data, { base64: true });
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${activePost.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-export.zip`);
    } catch (err) {
      console.error('Export all failed', err);
      alert('Export failed. See console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportBundle = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      
      for (const post of posts) {
        const postFolderName = post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || `post_${post.id}`;
        const postFolder = zip.folder(postFolderName);
        if (!postFolder) continue;

        for (let i = 0; i < post.slides.length; i++) {
          const slide = post.slides[i];
          const node = document.getElementById(`bundle-slide-${post.id}-${slide.id}`);
          if (!node) continue;
          
          // Temporarily make it visible for html-to-image to work properly
          const originalStyle = node.style.cssText;
          node.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 9999; opacity: 1; pointer-events: none;';
          
          const dataUrl = await htmlToImage.toPng(node, {
            pixelRatio: 3,
            quality: 1,
          });
          
          node.style.cssText = originalStyle;
          
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
          postFolder.file(`slide-${i + 1}.png`, base64Data, { base64: true });
        }
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'abacus-mates-bundle.zip');
    } catch (err) {
      console.error('Export bundle failed', err);
      alert('Export bundle failed. See console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-brand-light text-brand-dark selection:bg-brand-lime selection:text-brand-dark">
      {/* LEFT PANEL: CANVAS */}
      <div className="w-full md:flex-1 flex flex-col relative border-b-4 md:border-b-0 md:border-r-4 border-brand-dark h-[55vh] md:h-screen sticky top-0 z-30 md:z-10 bg-brand-light">
        <header className="border-b-4 border-brand-dark flex flex-wrap items-center justify-between p-3 md:px-6 md:h-16 bg-white z-20 gap-2 md:gap-0">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase hidden lg:block">Abacus Mates <span className="text-brand-red">Gen</span></h1>
            
            <div className="relative">
              <button 
                onClick={() => setShowPostDropdown(!showPostDropdown)}
                className="flex items-center gap-2 border-2 border-brand-dark px-3 py-1.5 font-bold text-sm bg-brand-light hover:bg-brand-lime transition-colors"
              >
                {activePost.title} <ChevronDown size={16} />
              </button>
              
              {showPostDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border-4 border-brand-dark shadow-[4px_4px_0px_0px_#1a1a1a] z-50">
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {posts.map(post => (
                      <div 
                        key={post.id}
                        className={`flex items-center justify-between p-2 border-b-2 border-brand-dark last:border-b-0 cursor-pointer hover:bg-brand-light ${activePostId === post.id ? 'bg-brand-pink' : ''}`}
                        onClick={() => {
                          setActivePostId(post.id);
                          setShowPostDropdown(false);
                        }}
                      >
                        <span className="font-bold truncate">{post.title}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePost(post.id);
                          }}
                          disabled={posts.length === 1}
                          className="p-1 hover:text-brand-red disabled:opacity-30"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={addPost}
                    className="w-full p-2 bg-brand-dark text-white font-bold uppercase text-sm hover:bg-brand-red transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> New Post
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex border-2 border-brand-dark font-bold text-xs md:text-sm bg-brand-light">
              {(['1:1', '4:5', '9:16'] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2 py-1 md:px-3 border-r-2 border-brand-dark last:border-r-0 transition-colors ${
                    aspectRatio === ratio ? 'bg-brand-dark text-white' : 'hover:bg-brand-lime'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleExportCurrent}
                disabled={isExporting}
                className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-white border-2 border-brand-dark font-bold uppercase text-xs md:text-sm hover:bg-brand-pink transition-colors shadow-[2px_2px_0px_0px_#1a1a1a] md:shadow-[4px_4px_0px_0px_#1a1a1a] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden sm:inline">Current</span>
              </button>
              <button 
                onClick={handleExportAll}
                disabled={isExporting}
                className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-brand-lime border-2 border-brand-dark font-bold uppercase text-xs md:text-sm hover:bg-brand-red hover:text-white transition-colors shadow-[2px_2px_0px_0px_#1a1a1a] md:shadow-[4px_4px_0px_0px_#1a1a1a] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FolderDown size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden sm:inline">Export Post</span>
                <span className="sm:hidden">ZIP</span>
              </button>
              <button 
                onClick={handleExportBundle}
                disabled={isExporting}
                className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-brand-dark text-white border-2 border-brand-dark font-bold uppercase text-xs md:text-sm hover:bg-brand-red transition-colors shadow-[2px_2px_0px_0px_#1a1a1a] md:shadow-[4px_4px_0px_0px_#1a1a1a] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Archive size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden sm:inline">Export Bundle</span>
                <span className="sm:hidden">ALL</span>
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px] relative z-10">
          <Canvas 
            slide={activeSlide} 
            aspectRatio={aspectRatio} 
            carouselRef={carouselRef}
            slides={slides}
            activeSlideId={activeSlideId}
          />
          
          {/* Hidden container for ALL posts to allow bundle export */}
          <div className="absolute top-0 left-0 opacity-0 pointer-events-none -z-20">
            {posts.map(post => (
              <div key={`export-post-${post.id}`}>
                {post.slides.map(s => (
                  <div key={`export-slide-${post.id}-${s.id}`} id={`bundle-slide-${post.id}-${s.id}`}>
                    <SlidePreview slide={s} aspectRatio={aspectRatio} id={`bundle-slide-inner-${post.id}-${s.id}`} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* RIGHT PANEL: EDITOR */}
      <div className="w-full md:w-[400px] flex flex-col bg-white z-20 shadow-[-8px_0px_0px_0px_rgba(0,0,0,0.05)] md:h-screen shrink-0 relative">
        <Editor 
          slides={slides}
          activeSlideId={activeSlideId}
          activeSlide={activeSlide}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          updateSlide={updateSlide}
          updateAllSlidesInPost={updateAllSlidesInPost}
          updateMultipleSlides={updateMultipleSlides}
          addSlide={addSlide}
          deleteSlide={deleteSlide}
          duplicateSlide={duplicateSlide}
          reorderSlide={reorderSlide}
          setActiveSlideId={setActiveSlideId}
          importPosts={importPosts}
        />
      </div>
    </div>
  );
}
