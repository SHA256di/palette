interface MoodboardElement {
  id: string
  type: 'film' | 'album' | 'aesthetic'
  url: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  opacity?: number
  zIndex?: number
}

interface MoodboardLayout {
  width: number
  height: number
  elements: MoodboardElement[]
  backgroundColor: string
  style: 'grid' | 'organic' | 'scattered'
}

// Generate layout positions for moodboard elements
export function generateMoodboardLayout(
  films: any[],
  albums: any[],
  aestheticImages: any[],
  options: {
    width?: number
    height?: number
    style?: 'grid' | 'organic' | 'scattered'
    padding?: number
  } = {}
): MoodboardLayout {
  const {
    width = 1200,
    height = 800,
    style = 'organic',
    padding = 40
  } = options

  const elements: MoodboardElement[] = []
  const allItems = [
    ...films.slice(0, 4).map((film, i) => ({ ...film, type: 'film' as const, id: `film-${i}` })),
    ...albums.slice(0, 2).map((album, i) => ({ ...album, type: 'album' as const, id: `album-${i}` })),
    ...aestheticImages.slice(0, 6).map((img, i) => ({ ...img, type: 'aesthetic' as const, id: `aesthetic-${i}` }))
  ]

  switch (style) {
    case 'grid':
      return generateGridLayout(allItems, { width, height, padding })
    case 'organic':
      return generateOrganicLayout(allItems, { width, height, padding })
    case 'scattered':
      return generateScatteredLayout(allItems, { width, height, padding })
    default:
      return generateOrganicLayout(allItems, { width, height, padding })
  }
}

// Grid layout - clean and organized
function generateGridLayout(items: any[], options: any): MoodboardLayout {
  const { width, height, padding } = options
  const elements: MoodboardElement[] = []
  
  const cols = 4
  const rows = Math.ceil(items.length / cols)
  const cellWidth = (width - padding * 2) / cols
  const cellHeight = (height - padding * 2) / rows

  items.forEach((item, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    
    const elementWidth = cellWidth * 0.8
    const elementHeight = cellHeight * 0.8
    
    elements.push({
      id: item.id,
      type: item.type,
      url: getImageUrl(item),
      x: padding + col * cellWidth + (cellWidth - elementWidth) / 2,
      y: padding + row * cellHeight + (cellHeight - elementHeight) / 2,
      width: elementWidth,
      height: elementHeight,
      rotation: 0,
      opacity: 1,
      zIndex: index
    })
  })

  return {
    width,
    height,
    elements,
    backgroundColor: '#f8f9fa',
    style: 'grid'
  }
}

// Organic layout - inspired by your template.jpg
function generateOrganicLayout(items: any[], options: any): MoodboardLayout {
  const { width, height, padding } = options
  const elements: MoodboardElement[] = []
  
  // Define zones for different types of content
  const zones = [
    { x: 0.1, y: 0.1, w: 0.25, h: 0.3 }, // Top left
    { x: 0.4, y: 0.05, w: 0.2, h: 0.25 }, // Top center
    { x: 0.7, y: 0.15, w: 0.25, h: 0.35 }, // Top right
    { x: 0.05, y: 0.45, w: 0.3, h: 0.2 }, // Mid left
    { x: 0.45, y: 0.4, w: 0.25, h: 0.3 }, // Center
    { x: 0.75, y: 0.55, w: 0.2, h: 0.25 }, // Mid right
    { x: 0.15, y: 0.7, w: 0.25, h: 0.25 }, // Bottom left
    { x: 0.5, y: 0.75, w: 0.2, h: 0.2 }, // Bottom center
    { x: 0.8, y: 0.85, w: 0.15, h: 0.1 }, // Bottom right small
  ]

  items.forEach((item, index) => {
    if (index >= zones.length) return
    
    const zone = zones[index]
    const baseSize = item.type === 'film' ? 180 : item.type === 'album' ? 160 : 140
    const sizeVariation = 0.7 + Math.random() * 0.6 // 70% to 130% of base size
    
    const elementWidth = baseSize * sizeVariation
    const elementHeight = baseSize * sizeVariation
    
    // Add some randomness within the zone
    const randomX = zone.x + (Math.random() * 0.1 - 0.05)
    const randomY = zone.y + (Math.random() * 0.1 - 0.05)
    
    elements.push({
      id: item.id,
      type: item.type,
      url: getImageUrl(item),
      x: randomX * width,
      y: randomY * height,
      width: elementWidth,
      height: elementHeight,
      rotation: (Math.random() - 0.5) * 20, // -10 to +10 degrees
      opacity: 0.9 + Math.random() * 0.1,
      zIndex: index
    })
  })

  return {
    width,
    height,
    elements,
    backgroundColor: '#fefefe',
    style: 'organic'
  }
}

// Scattered layout - more chaotic, like thrown photos
function generateScatteredLayout(items: any[], options: any): MoodboardLayout {
  const { width, height, padding } = options
  const elements: MoodboardElement[] = []
  
  items.forEach((item, index) => {
    const baseSize = item.type === 'film' ? 200 : item.type === 'album' ? 160 : 120
    const sizeVariation = 0.6 + Math.random() * 0.8
    
    const elementWidth = baseSize * sizeVariation
    const elementHeight = baseSize * sizeVariation
    
    // More random positioning
    const x = padding + Math.random() * (width - elementWidth - padding * 2)
    const y = padding + Math.random() * (height - elementHeight - padding * 2)
    
    elements.push({
      id: item.id,
      type: item.type,
      url: getImageUrl(item),
      x,
      y,
      width: elementWidth,
      height: elementHeight,
      rotation: (Math.random() - 0.5) * 40, // -20 to +20 degrees
      opacity: 0.85 + Math.random() * 0.15,
      zIndex: index
    })
  })

  return {
    width,
    height,
    elements,
    backgroundColor: '#f5f5f5',
    style: 'scattered'
  }
}


// Get the appropriate image URL for each content type
function getImageUrl(item: any): string {
  switch (item.type) {
    case 'film':
      return item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : ''
    case 'album':
      return item.image || ''
    case 'aesthetic':
      return item.url || item.urls?.regular || ''
    default:
      return ''
  }
}

// Export moodboard as image data URL
export async function exportMoodboardAsImage(
  layout: MoodboardLayout,
  format: 'png' | 'jpeg' = 'png'
): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  canvas.width = layout.width
  canvas.height = layout.height
  
  // Fill background
  ctx.fillStyle = layout.backgroundColor
  ctx.fillRect(0, 0, layout.width, layout.height)
  
  // Load and draw all images
  const imagePromises = layout.elements.map(async (element) => {
    return new Promise<void>((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.save()
        
        // Apply transformations
        ctx.globalAlpha = element.opacity || 1
        ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
        ctx.rotate((element.rotation || 0) * Math.PI / 180)
        
        // Draw image
        ctx.drawImage(img, -element.width / 2, -element.height / 2, element.width, element.height)
        
        ctx.restore()
        resolve()
      }
      img.onerror = () => resolve() // Continue even if image fails to load
      img.src = element.url
    })
  })
  
  await Promise.all(imagePromises)
  
  return canvas.toDataURL(`image/${format}`, 0.9)
}