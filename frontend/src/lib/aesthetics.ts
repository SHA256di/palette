export interface Aesthetic {
  id: string
  name: string
  description: string
  keywords: string[]
  colors: string[]
  examples: string[]
}

export const AESTHETICS: Aesthetic[] = [
  {
    id: 'pink-pilates-princess',
    name: 'Pink Pilates Princess',
    description: 'Pastel pink activewear, pilates studios, smoothies, skincare, candles, wellness, soft feminine gym vibes',
    keywords: [
      'pink yoga mat', 'white sneakers', 'green smoothie', 'silver necklace', 
      'pilates', 'wellness', 'activewear', 'skincare routine', 'candles', 
      'pastel pink', 'gym aesthetic', 'healthy lifestyle'
    ],
    colors: ['#FFB6C1', '#FFC0CB', '#FFFFFF', '#F5F5F5', '#E6E6FA'],
    examples: ['pink yoga mat', 'white sneakers', 'green smoothie', 'silver necklace']
  },
  {
    id: 'coquette',
    name: 'Coquette',
    description: 'Lace dresses, bows, pearls, floral perfume, romantic details, ballet flats, vintage romance mood',
    keywords: [
      'white lace dress', 'pearl necklace', 'pink ribbon', 'Dior perfume',
      'bows', 'romantic', 'vintage romance', 'ballet flats', 'floral',
      'feminine', 'delicate', 'romantic details'
    ],
    colors: ['#FFFFFF', '#FFB6C1', '#F8F8FF', '#FFF0F5', '#E6E6FA'],
    examples: ['white lace dress', 'pearl necklace', 'pink ribbon', 'Dior perfume']
  },
  {
    id: 'clean-girl',
    name: 'Clean Girl',
    description: 'Minimalism, slick hair, gold hoops, white tank top, neutral makeup, skincare routines, iced coffee',
    keywords: [
      'gold hoop earrings', 'iced latte', 'slick bun', 'white tank',
      'minimalism', 'clean makeup', 'skincare', 'neutral tones',
      'simple jewelry', 'effortless style', 'natural beauty'
    ],
    colors: ['#FFFFFF', '#F5F5DC', '#FFD700', '#F0F0F0', '#FFFAF0'],
    examples: ['gold hoop earrings', 'iced latte', 'slick bun', 'white tank']
  },
  {
    id: 'dark-academia',
    name: 'Dark Academia',
    description: 'Tweed blazers, candles, books, vintage libraries, typewriters, black coffee, moody lighting',
    keywords: [
      'leather satchel', 'candle', 'stack of books', 'fountain pen',
      'tweed blazer', 'vintage library', 'typewriter', 'black coffee',
      'moody lighting', 'academic', 'scholarly', 'vintage'
    ],
    colors: ['#8B4513', '#654321', '#2F1B14', '#1C1C1C', '#F5E6D3'],
    examples: ['leather satchel', 'candle', 'stack of books', 'fountain pen']
  },
  {
    id: 'y2k',
    name: 'Y2K',
    description: 'Bold colors, shiny makeup, crop tops, rhinestones, flip phones, chunky sneakers, early 2000s energy',
    keywords: [
      'flip phone', 'rhinestone bag', 'blue eyeshadow', 'butterfly clip',
      'chunky sneakers', 'crop tops', 'bold colors', 'shiny makeup',
      'early 2000s', 'metallic', 'futuristic', 'cyber'
    ],
    colors: ['#FF69B4', '#00FFFF', '#FF1493', '#7B68EE', '#C0C0C0'],
    examples: ['flip phone', 'rhinestone bag', 'blue eyeshadow', 'butterfly clip']
  }
]

export function getAestheticById(id: string): Aesthetic | undefined {
  return AESTHETICS.find(aesthetic => aesthetic.id === id)
}

export function getAestheticByName(name: string): Aesthetic | undefined {
  return AESTHETICS.find(aesthetic => aesthetic.name.toLowerCase() === name.toLowerCase())
}
