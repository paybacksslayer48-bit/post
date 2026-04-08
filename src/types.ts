export type SlideType = 'cover' | 'content' | 'portfolio' | 'cta';

export type SlideTemplate = 
  // Cover
  | 'cover-acid-grid'
  | 'cover-sticker-bomb'
  | 'cover-chaos'
  | 'cover-retro-windows'
  | 'title-aztec'
  // Content
  | 'content-neo-brutal'
  | 'content-magazine'
  | 'content-wireframe'
  | 'content-halftone'
  | 'content-shapes'
  | 'content-timeline'
  | 'content-code-block'
  | 'brutalist-shapes'
  | 'text-heavy'
  | 'minimal-centered'
  | 'polaroid-image'
  // Portfolio
  | 'portfolio-browser'
  | 'portfolio-mobile'
  | 'portfolio-bento'
  | 'portfolio-gallery'
  // CTA
  | 'cta-massive-button'
  | 'cta-barcode'
  | 'cta-halftone'
  | 'cta-target'
  | 'cta-warning-tape';

export type AspectRatio = '1:1' | '4:5' | '9:16';

export interface Slide {
  id: string;
  slideType: SlideType;
  title: string;
  subtitle: string;
  body: string;
  image: string | null;
  template: SlideTemplate;
  titleSize: number;
  bodySize: number;
  textColor: string;
  bgColor: string;
}

export interface Post {
  id: string;
  title: string;
  slides: Slide[];
}
