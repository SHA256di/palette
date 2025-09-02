export interface LayoutSlot {
  type: 'product' | 'music' | 'film' | 'visual' | 'quote' | 'text'
  source: string
  caption?: string
  title?: string
  subtitle?: string
  originalImage?: boolean // Whether this is the user's original product image
}

export interface LayoutProps {
  vibe: string
  originalImage?: string | null
  originalImageName?: string
  films?: any[]
  albums?: any[]
  aestheticImages?: any[]
  quotes?: any[]
}

export interface WishlistLayoutProps extends LayoutProps {
  slots?: LayoutSlot[]
}

export interface PerfumeLayoutProps extends LayoutProps {
  topNotes?: LayoutSlot[]
  middleNotes?: LayoutSlot[]
  baseNotes?: LayoutSlot[]
}

export interface CollageLayoutProps extends LayoutProps {
  slots?: LayoutSlot[]
  heroSlot?: LayoutSlot
}