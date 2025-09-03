// Enhanced aesthetic mapping system for Gen Z vibes with cosine similarity
import { cosineSimilarity, normalizeVector } from './vector-utils'

// Comprehensive Gen Z aesthetic database with detailed tags
export interface AestheticProfile {
  name: string
  description: string
  keywords: string[]
  colors: string[]
  emotions: string[]
  brands: string[]
  celebrities: string[]
  music_genres: string[]
  visual_elements: string[]
  lifestyle: string[]
  fashion: string[]
  confidence_threshold: number
}

export const GEN_Z_AESTHETICS: Record<string, AestheticProfile> = {
  'girlblogger': {
    name: 'Girlblogger',
    description: 'Nostalgic feminine internet culture aesthetic',
    keywords: ['girlblogger', 'tumblr girl', 'lana del rey', 'coquette', 'dollette', 'nymphet', 'soft grunge', 'indie girl'],
    colors: ['beige', 'cream', 'soft pink', 'brown', 'vintage', 'sepia', 'muted'],
    emotions: ['melancholy', 'romantic', 'nostalgic', 'dreamy', 'vulnerable', 'introspective'],
    brands: ['brandy melville', 'urban outfitters', 'american apparel', 'thrifted'],
    celebrities: ['lana del rey', 'alexa demie', 'lily rose depp', 'dua lipa'],
    music_genres: ['indie pop', 'dream pop', 'bedroom pop', 'folk', 'alternative'],
    visual_elements: ['film photography', 'polaroids', 'flowers', 'books', 'coffee', 'vintage cars', 'cigarettes'],
    lifestyle: ['reading', 'journaling', 'thrifting', 'coffee shops', 'vintage shopping'],
    fashion: ['slip dresses', 'cardigans', 'mary janes', 'tights', 'vintage band tees', 'mini skirts'],
    confidence_threshold: 0.7
  },
  
  'indie_sleaze': {
    name: 'Indie Sleaze',
    description: '2000s-2010s alternative party culture revival',
    keywords: ['indie sleaze', 'indiesleaze', 'hipster', 'party', 'flash photography', 'american apparel', 'cigarettes'],
    colors: ['neon', 'flash white', 'black', 'metallic', 'harsh lighting', 'high contrast'],
    emotions: ['rebellious', 'hedonistic', 'carefree', 'edgy', 'confident'],
    brands: ['american apparel', 'doc martens', 'converse', 'vintage band merch'],
    celebrities: ['the strokes', 'yeah yeah yeahs', 'alexa chung', 'chloe sevigny'],
    music_genres: ['indie rock', 'garage rock', 'post-punk', 'alternative', 'electroclash'],
    visual_elements: ['flash photography', 'party scenes', 'cigarettes', 'alcohol', 'urban nightlife', 'leather jackets'],
    lifestyle: ['nightlife', 'concerts', 'house parties', 'art galleries', 'underground venues'],
    fashion: ['skinny jeans', 'leather jackets', 'band tees', 'boots', 'dark eyeliner', 'messy hair'],
    confidence_threshold: 0.75
  },
  
  'y2k_revival': {
    name: 'Y2K Revival',
    description: 'Futuristic 2000s technology aesthetic',
    keywords: ['y2k', 'cyber', 'futuristic', '2000s', 'tech', 'metallic', 'holographic', 'digital'],
    colors: ['metallic silver', 'electric blue', 'hot pink', 'lime green', 'holographic', 'chrome'],
    emotions: ['optimistic', 'futuristic', 'energetic', 'bold', 'confident'],
    brands: ['adidas', 'nike', 'apple', 'sony', 'tech brands'],
    celebrities: ['britney spears', 'christina aguilera', 'destiny\'s child', 'eminem'],
    music_genres: ['pop', 'hip hop', 'electronic', 'dance', 'r&b'],
    visual_elements: ['chrome', 'holograms', 'tech gadgets', 'CD-ROMs', 'digital screens', 'matrix code'],
    lifestyle: ['tech enthusiasm', 'gaming', 'early internet culture', 'digital art'],
    fashion: ['metallic clothing', 'platform shoes', 'cargo pants', 'bucket hats', 'chunky jewelry'],
    confidence_threshold: 0.8
  },
  
  'dark_academia': {
    name: 'Dark Academia',
    description: 'Gothic scholarly aesthetic with classical elements',
    keywords: ['dark academia', 'academia', 'scholarly', 'gothic', 'classical', 'library', 'books', 'university'],
    colors: ['dark brown', 'black', 'burgundy', 'forest green', 'gold', 'ivory', 'sepia'],
    emotions: ['intellectual', 'mysterious', 'contemplative', 'melancholic', 'sophisticated'],
    brands: ['thrifted', 'vintage', 'ralph lauren', 'brooks brothers'],
    celebrities: ['timothée chalamet', 'anya taylor-joy', 'dev patel', 'saoirse ronan'],
    music_genres: ['classical', 'indie folk', 'chamber music', 'ambient', 'post-rock'],
    visual_elements: ['old books', 'libraries', 'gothic architecture', 'candles', 'manuscripts', 'vintage maps'],
    lifestyle: ['reading', 'writing', 'studying', 'museums', 'classical music', 'poetry'],
    fashion: ['tweed jackets', 'turtlenecks', 'oxford shoes', 'wool coats', 'vintage glasses', 'pleated skirts'],
    confidence_threshold: 0.7
  },
  
  'cottagecore': {
    name: 'Cottagecore',
    description: 'Romanticized rural and domestic lifestyle',
    keywords: ['cottagecore', 'cottage', 'rural', 'countryside', 'pastoral', 'fairytale', 'mushrooms', 'bread'],
    colors: ['earth tones', 'sage green', 'cream', 'brown', 'muted pastels', 'natural'],
    emotions: ['peaceful', 'wholesome', 'nostalgic', 'cozy', 'nurturing'],
    brands: ['handmade', 'local crafts', 'vintage', 'natural brands'],
    celebrities: ['taylor swift folklore era', 'emma watson', 'saoirse ronan'],
    music_genres: ['folk', 'indie folk', 'acoustic', 'traditional', 'chamber pop'],
    visual_elements: ['flowers', 'gardens', 'baking', 'knitting', 'farms', 'forests', 'vintage kitchens'],
    lifestyle: ['gardening', 'baking', 'crafting', 'reading', 'nature walks', 'sustainable living'],
    fashion: ['linen dresses', 'cardigans', 'floral prints', 'aprons', 'mary janes', 'straw hats'],
    confidence_threshold: 0.75
  },
  
  'coquette': {
    name: 'Coquette',
    description: 'Hyperfeminine romantic aesthetic',
    keywords: ['coquette', 'coquetteaesthetic', 'dollette', 'feminine', 'romantic', 'bows', 'lace', 'pink'],
    colors: ['soft pink', 'white', 'cream', 'baby blue', 'lavender', 'pearl', 'pastel'],
    emotions: ['romantic', 'innocent', 'playful', 'delicate', 'dreamy'],
    brands: ['dior', 'chanel', 'brandy melville', 'reformation'],
    celebrities: ['lily rose depp', 'elle fanning', 'lana del rey', 'sofia coppola'],
    music_genres: ['chamber pop', 'dream pop', 'classical', 'french chanson'],
    visual_elements: ['bows', 'ribbons', 'lace', 'flowers', 'pearls', 'vintage dolls', 'ballet'],
    lifestyle: ['ballet', 'poetry', 'vintage shopping', 'tea parties', 'classical arts'],
    fashion: ['mini skirts', 'bows', 'ballet flats', 'cardigans', 'pearl jewelry', 'vintage lingerie'],
    confidence_threshold: 0.8
  },
  
  'coastal_grandmother': {
    name: 'Coastal Grandmother',
    description: 'Relaxed coastal luxury lifestyle',
    keywords: ['coastal grandmother', 'coastal', 'linen', 'neutral', 'beige', 'nancy meyers', 'hamptons'],
    colors: ['beige', 'cream', 'white', 'sage green', 'soft blue', 'natural linen', 'sandy'],
    emotions: ['relaxed', 'sophisticated', 'calm', 'luxurious', 'timeless'],
    brands: ['everlane', 'eileen fisher', 'pottery barn', 'williams sonoma'],
    celebrities: ['nancy meyers', 'ina garten', 'gwyneth paltrow', 'reese witherspoon'],
    music_genres: ['folk', 'singer-songwriter', 'soft rock', 'classical'],
    visual_elements: ['linen', 'natural textures', 'coastal views', 'white kitchens', 'fresh flowers'],
    lifestyle: ['cooking', 'reading', 'gardening', 'hosting', 'beach walks', 'quality time'],
    fashion: ['linen shirts', 'wide-leg pants', 'cashmere', 'neutral tones', 'minimal jewelry'],
    confidence_threshold: 0.7
  },
  
  'clean_girl': {
    name: 'Clean Girl',
    description: 'Minimalist natural beauty aesthetic',
    keywords: ['clean girl', 'minimal', 'natural', 'glowing skin', 'effortless', 'dewy', 'wellness'],
    colors: ['natural skin tones', 'clear', 'white', 'nude', 'minimal color palette'],
    emotions: ['confident', 'natural', 'effortless', 'healthy', 'minimalist'],
    brands: ['glossier', 'drunk elephant', 'the ordinary', 'rare beauty'],
    celebrities: ['hailey bieber', 'zendaya', 'lizzo', 'alicia keys'],
    music_genres: ['r&b', 'neo-soul', 'minimal electronic', 'indie pop'],
    visual_elements: ['natural lighting', 'minimal makeup', 'healthy skin', 'simple styling'],
    lifestyle: ['skincare routine', 'wellness', 'minimal lifestyle', 'self-care', 'fitness'],
    fashion: ['minimal jewelry', 'neutral clothing', 'quality basics', 'comfortable fits'],
    confidence_threshold: 0.75
  },
  
  'cyber_fairy': {
    name: 'Cyber Fairy',
    description: 'Digital fantasy with ethereal tech elements',
    keywords: ['cyber fairy', 'digital fairy', 'tech fairy', 'cyberpunk', 'ethereal', 'holographic', 'futuristic'],
    colors: ['holographic', 'electric purple', 'neon pink', 'cyber blue', 'metallic', 'iridescent'],
    emotions: ['otherworldly', 'futuristic', 'mystical', 'bold', 'creative'],
    brands: ['chrome hearts', 'rick owens', 'balenciaga', 'comme des garcons'],
    celebrities: ['grimes', 'arca', 'bjork', 'fka twigs'],
    music_genres: ['electronic', 'hyperpop', 'experimental', 'ambient', 'techno'],
    visual_elements: ['holograms', 'digital art', 'LED lights', 'crystals', 'tech accessories'],
    lifestyle: ['digital art', 'gaming', 'experimental fashion', 'electronic music'],
    fashion: ['metallic fabrics', 'LED accessories', 'platform boots', 'holographic materials'],
    confidence_threshold: 0.8
  },
  
  'kidcore': {
    name: 'Kidcore',
    description: 'Nostalgic childhood memories aesthetic',
    keywords: ['kidcore', 'nostalgic', 'childhood', 'rainbow', 'colorful', 'toys', 'playful', '90s kids'],
    colors: ['bright rainbow', 'primary colors', 'neon', 'plastic colors', 'saturated'],
    emotions: ['nostalgic', 'playful', 'innocent', 'joyful', 'carefree'],
    brands: ['lisa frank', 'sanrio', 'disney', 'nickelodeon', 'cartoon network'],
    celebrities: ['melanie martinez', 'rico nasty', 'clairo', 'boy pablo'],
    music_genres: ['hyperpop', 'bubblegum pop', 'electronic', 'indie pop'],
    visual_elements: ['toys', 'stickers', 'cartoons', 'candy', 'playground equipment'],
    lifestyle: ['collecting', 'gaming', 'cartoon watching', 'craft projects'],
    fashion: ['colorful clothing', 'hair clips', 'platform shoes', 'graphic tees', 'fun accessories'],
    confidence_threshold: 0.75
  },
  
  'old_money': {
    name: 'Old Money',
    description: 'Understated luxury and generational wealth aesthetic',
    keywords: ['old money', 'quiet luxury', 'preppy', 'understated', 'timeless', 'ivy league', 'heritage'],
    colors: ['navy', 'cream', 'forest green', 'burgundy', 'camel', 'white', 'neutral'],
    emotions: ['sophisticated', 'timeless', 'refined', 'confident', 'understated'],
    brands: ['ralph lauren', 'brooks brothers', 'hermès', 'loro piana', 'brunello cucinelli'],
    celebrities: ['kate middleton', 'charlotte casiraghi', 'caroline kennedy'],
    music_genres: ['classical', 'jazz', 'folk', 'traditional'],
    visual_elements: ['equestrian', 'sailing', 'country clubs', 'libraries', 'antiques'],
    lifestyle: ['equestrian sports', 'sailing', 'country clubs', 'art collecting', 'philanthropy'],
    fashion: ['blazers', 'pearls', 'loafers', 'cashmere', 'silk scarves', 'quality fabrics'],
    confidence_threshold: 0.7
  }
}

// Enhanced API-specific tag mappings
export interface APITagMapping {
  spotify: {
    genres: string[]
    moods: string[]
    artists: string[]
    search_terms: string[]
    audio_features: {
      energy: number
      valence: number
      danceability: number
      acousticness: number
    }
  }
  tumblr: {
    primary_tags: string[]
    secondary_tags: string[]
    related_hashtags: string[]
    blog_types: string[]
  }
  tmdb: {
    genres: number[]
    keywords: string[]
    year_ranges: { min: number; max: number }[]
    countries: string[]
    vote_threshold: number
  }
}

export const AESTHETIC_API_MAPPINGS: Record<string, APITagMapping> = {
  'girlblogger': {
    spotify: {
      genres: ['indie-pop', 'dream-pop', 'bedroom-pop', 'folk', 'alternative', 'indie-folk'],
      moods: ['melancholy', 'dreamy', 'romantic', 'nostalgic', 'introspective'],
      artists: ['lana del rey', 'mitski', 'phoebe bridgers', 'clairo', 'boygenius', 'beach house'],
      search_terms: ['sad girl', 'indie girl', 'tumblr music', 'soft grunge', 'coquette playlist'],
      audio_features: { energy: 0.4, valence: 0.4, danceability: 0.3, acousticness: 0.6 }
    },
    tumblr: {
      primary_tags: ['girlblogger', 'coquette', 'dollette', 'lana del rey', 'soft grunge'],
      secondary_tags: ['indie girl', 'tumblr girl', 'nymphet', 'vintage', 'melancholy'],
      related_hashtags: ['girlblogger aesthetic', 'coquetteaesthetic', 'lanadelreyaesthetic'],
      blog_types: ['aesthetic', 'vintage', 'indie', 'photography', 'poetry']
    },
    tmdb: {
      genres: [18, 10749, 35], // Drama, Romance, Comedy
      keywords: ['coming of age', 'female protagonist', 'indie film', 'sofia coppola', 'teenage'],
      year_ranges: [{ min: 1995, max: 2024 }],
      countries: ['US', 'FR', 'GB'],
      vote_threshold: 6.0
    }
  },
  
  'indie_sleaze': {
    spotify: {
      genres: ['indie-rock', 'garage-rock', 'post-punk', 'alternative-rock', 'electroclash'],
      moods: ['rebellious', 'edgy', 'party', 'underground', 'raw'],
      artists: ['the strokes', 'yeah yeah yeahs', 'interpol', 'lcd soundsystem', 'arctic monkeys'],
      search_terms: ['indie sleaze', 'garage rock revival', '2000s indie', 'hipster music'],
      audio_features: { energy: 0.7, valence: 0.5, danceability: 0.6, acousticness: 0.2 }
    },
    tumblr: {
      primary_tags: ['indie sleaze', 'indiesleaze', 'hipster', 'party', 'flash photography'],
      secondary_tags: ['american apparel', '2000s', 'cigarettes', 'alternative', 'underground'],
      related_hashtags: ['indiesleazeaesthetic', 'hipsteraesthetic', 'partyphotography'],
      blog_types: ['party', 'music', 'photography', 'alternative', 'indie']
    },
    tmdb: {
      genres: [18, 35, 80], // Drama, Comedy, Crime
      keywords: ['indie', 'underground', 'party', 'music scene', 'urban', 'alternative'],
      year_ranges: [{ min: 2000, max: 2015 }],
      countries: ['US', 'GB'],
      vote_threshold: 6.5
    }
  },
  
  'y2k_revival': {
    spotify: {
      genres: ['pop', 'electronic', 'dance-pop', 'hyperpop', 'breakbeat'],
      moods: ['energetic', 'futuristic', 'nostalgic', 'optimistic', 'cyber'],
      artists: ['britney spears', 'dua lipa', 'charli xcx', '100 gecs', 'bladee'],
      search_terms: ['y2k', 'cyber pop', 'futuristic pop', '2000s revival', 'tech pop'],
      audio_features: { energy: 0.8, valence: 0.7, danceability: 0.8, acousticness: 0.1 }
    },
    tumblr: {
      primary_tags: ['y2k', 'cyber', 'futuristic', '2000s', 'tech aesthetic'],
      secondary_tags: ['metallic', 'holographic', 'digital', 'matrix', 'chrome'],
      related_hashtags: ['y2kaesthetic', 'cyberaesthetic', 'futristicaesthetic'],
      blog_types: ['tech', 'aesthetic', 'cyber', 'futuristic', 'digital art']
    },
    tmdb: {
      genres: [878, 28, 53], // Sci-Fi, Action, Thriller
      keywords: ['technology', 'cyber', 'future', 'digital', 'matrix', 'virtual reality'],
      year_ranges: [{ min: 1995, max: 2005 }, { min: 2015, max: 2024 }],
      countries: ['US', 'JP'],
      vote_threshold: 6.0
    }
  },
  
  'cyber_fairy': {
    spotify: {
      genres: ['electronic', 'hyperpop', 'experimental', 'ambient', 'techno', 'synthwave'],
      moods: ['ethereal', 'futuristic', 'mystical', 'energetic', 'otherworldly'],
      artists: ['grimes', 'arca', 'bjork', 'fka twigs', 'sophie', 'iglooghost'],
      search_terms: ['cyber', 'digital', 'ethereal electronic', 'hyperpop', 'experimental'],
      audio_features: { energy: 0.7, valence: 0.6, danceability: 0.5, acousticness: 0.2 }
    },
    tumblr: {
      primary_tags: ['cyber fairy', 'digital fairy', 'cyberpunk', 'holographic', 'tech aesthetic'],
      secondary_tags: ['ethereal', 'futuristic', 'neon', 'digital art', 'LED lights'],
      related_hashtags: ['cyberfairyaesthetic', 'digitalfairy', 'cyberpunkaesthetic'],
      blog_types: ['digital art', 'cyberpunk', 'tech', 'futuristic', 'experimental']
    },
    tmdb: {
      genres: [878, 28, 14], // Sci-Fi, Action, Fantasy
      keywords: ['cyberpunk', 'digital', 'virtual reality', 'technology', 'futuristic', 'artificial intelligence'],
      year_ranges: [{ min: 2010, max: 2024 }],
      countries: ['US', 'JP', 'KR'],
      vote_threshold: 6.5
    }
  }
  // ... continuing with other aesthetics
}

// Cosine similarity functions for tag matching
export function calculateAestheticSimilarity(
  imageClipTags: string[],
  aesthetic: AestheticProfile
): number {
  const allAestheticTags = [
    ...aesthetic.keywords,
    ...aesthetic.colors,
    ...aesthetic.emotions,
    ...aesthetic.visual_elements,
    ...aesthetic.lifestyle,
    ...aesthetic.fashion
  ]
  
  // Create tag frequency vectors
  const allUniqueTags = [...new Set([...imageClipTags, ...allAestheticTags])]
  
  const imageVector = allUniqueTags.map(tag => 
    imageClipTags.filter(clipTag => 
      clipTag.toLowerCase().includes(tag.toLowerCase()) || 
      tag.toLowerCase().includes(clipTag.toLowerCase())
    ).length
  )
  
  const aestheticVector = allUniqueTags.map(tag =>
    allAestheticTags.filter(aestheticTag =>
      aestheticTag.toLowerCase().includes(tag.toLowerCase()) ||
      tag.toLowerCase().includes(aestheticTag.toLowerCase())
    ).length
  )
  
  return cosineSimilarity(normalizeVector(imageVector), normalizeVector(aestheticVector))
}

// Enhanced aesthetic detection with confidence scoring
export function detectAestheticsFromImage(
  clipTags: string[],
  minConfidence: number = 0.6
): Array<{ aesthetic: string; confidence: number; profile: AestheticProfile }> {
  const results: Array<{ aesthetic: string; confidence: number; profile: AestheticProfile }> = []
  
  Object.entries(GEN_Z_AESTHETICS).forEach(([key, profile]) => {
    const confidence = calculateAestheticSimilarity(clipTags, profile)
    
    if (confidence >= Math.max(minConfidence, profile.confidence_threshold)) {
      results.push({
        aesthetic: key,
        confidence,
        profile
      })
    }
  })
  
  // Sort by confidence descending
  return results.sort((a, b) => b.confidence - a.confidence)
}

// Get API-specific mappings for detected aesthetics
export function getAPITagsForAesthetics(
  detectedAesthetics: Array<{ aesthetic: string; confidence: number }>
): {
  spotify: APITagMapping['spotify']
  tumblr: APITagMapping['tumblr'] 
  tmdb: APITagMapping['tmdb']
} {
  const weightedSpotify: any = { genres: [], moods: [], artists: [], search_terms: [], audio_features: { energy: 0, valence: 0, danceability: 0, acousticness: 0 } }
  const weightedTumblr: any = { primary_tags: [], secondary_tags: [], related_hashtags: [], blog_types: [] }
  const weightedTmdb: any = { genres: [], keywords: [], year_ranges: [], countries: [], vote_threshold: 6.0 }
  
  let totalWeight = 0
  
  detectedAesthetics.forEach(({ aesthetic, confidence }) => {
    const mapping = AESTHETIC_API_MAPPINGS[aesthetic]
    if (!mapping) return
    
    totalWeight += confidence
    
    // Weighted aggregation for each API
    Object.keys(mapping.spotify).forEach(key => {
      if (key === 'audio_features') {
        Object.keys(mapping.spotify.audio_features).forEach(feature => {
          (weightedSpotify.audio_features as any)[feature] += (mapping.spotify.audio_features as any)[feature] * confidence
        })
      } else {
        (weightedSpotify as any)[key].push(...(mapping.spotify as any)[key].map((tag: string) => ({ tag, weight: confidence })))
      }
    })
    
    Object.keys(mapping.tumblr).forEach(key => {
      (weightedTumblr as any)[key].push(...(mapping.tumblr as any)[key].map((tag: string) => ({ tag, weight: confidence })))
    })
    
    Object.keys(mapping.tmdb).forEach(key => {
      if (key === 'vote_threshold') {
        weightedTmdb.vote_threshold = Math.max(weightedTmdb.vote_threshold, mapping.tmdb.vote_threshold)
      } else {
        (weightedTmdb as any)[key].push(...(mapping.tmdb as any)[key].map((item: any) => ({ item, weight: confidence })))
      }
    })
  })
  
  // Normalize and finalize results
  if (totalWeight > 0) {
    Object.keys(weightedSpotify.audio_features).forEach(feature => {
      weightedSpotify.audio_features[feature] /= totalWeight
    })
  }
  
  // Deduplicate and sort by weight
  const deduplicateAndSort = (items: Array<{ tag?: string; item?: any; weight: number }>) => {
    const grouped = items.reduce((acc: any, curr: any) => {
      const key = curr.tag || curr.item
      if (!acc[key]) acc[key] = 0
      acc[key] += curr.weight
      return acc
    }, {})
    
    return Object.entries(grouped)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .map(([key]) => key)
      .slice(0, 10) // Top 10 results
  }
  
  return {
    spotify: {
      genres: deduplicateAndSort(weightedSpotify.genres),
      moods: deduplicateAndSort(weightedSpotify.moods),
      artists: deduplicateAndSort(weightedSpotify.artists),
      search_terms: deduplicateAndSort(weightedSpotify.search_terms),
      audio_features: weightedSpotify.audio_features
    },
    tumblr: {
      primary_tags: deduplicateAndSort(weightedTumblr.primary_tags),
      secondary_tags: deduplicateAndSort(weightedTumblr.secondary_tags),
      related_hashtags: deduplicateAndSort(weightedTumblr.related_hashtags),
      blog_types: deduplicateAndSort(weightedTumblr.blog_types)
    },
    tmdb: {
      genres: deduplicateAndSort(weightedTmdb.genres).map(g => parseInt(g)).filter(g => !isNaN(g)),
      keywords: deduplicateAndSort(weightedTmdb.keywords),
      year_ranges: weightedTmdb.year_ranges.map(({ item }: any) => item),
      countries: deduplicateAndSort(weightedTmdb.countries),
      vote_threshold: weightedTmdb.vote_threshold
    }
  }
}

// NSFW content filtering - focused on explicit content, not clothing/skin visibility
export const NSFW_KEYWORDS = [
  'nsfw', 'porn', 'sex', 'xxx', 'explicit', 
  'erotic', 'sexual', 'fetish', 'kink', 'bdsm',
  'orgasm', 'masturbat', 'dildo', 'vibrator',
  'hardcore', 'gangbang', 'threesome', 'orgy'
  // Removed: 'adult', 'nude', 'naked', 'topless', 'shirtless', 'underwear', 'panties', 'bra', 'thong', 'cleavage', 'provocative', 'seductive'
  // These terms can be overly broad and may create bias against normal content or different cultural expressions
]

export function filterNSFWContent(tags: string[], content: string = ''): boolean {
  const allText = [...tags, content].join(' ').toLowerCase()
  return !NSFW_KEYWORDS.some(keyword => allText.includes(keyword))
}

// Quality filtering for different content types
export function filterLowQuality(
  item: any,
  type: 'spotify' | 'tumblr' | 'tmdb',
  minThreshold: number = 0.3
): boolean {
  switch (type) {
    case 'spotify':
      return item.popularity >= 30 && item.explicit !== true
    case 'tumblr':
      return item.photos?.[0]?.original_size?.width >= 400 &&
             item.photos?.[0]?.original_size?.height >= 400 &&
             !item.photos?.[0]?.original_size?.url?.toLowerCase().includes('.gif')
    case 'tmdb':
      return item.vote_average >= 5.0 && 
             item.vote_count >= 100 &&
             item.poster_path &&
             !item.adult
    default:
      return true
  }
}

// Product filtering for wishlist layouts - identifies images likely to contain products/objects
export const PRODUCT_INDICATORS = [
  // Fashion & accessories  
  'bag', 'handbag', 'purse', 'backpack', 'tote', 'clutch', 'satchel',
  'shoes', 'boots', 'sneakers', 'heels', 'sandals', 'flats',
  'jewelry', 'necklace', 'earrings', 'bracelet', 'ring', 'watch',
  'dress', 'outfit', 'clothing', 'jacket', 'coat', 'sweater',
  
  // Beauty & skincare
  'makeup', 'lipstick', 'perfume', 'fragrance', 'skincare', 'cosmetics',
  'nail polish', 'mascara', 'foundation', 'blush', 'eyeshadow',
  
  // Tech & lifestyle objects
  'phone', 'laptop', 'headphones', 'camera', 'gadget', 'tech',
  'book', 'diary', 'journal', 'notebook', 'planner',
  'candle', 'home decor', 'mug', 'cup', 'bottle', 'tumbler',
  
  // Luxury & collectibles
  'luxury', 'designer', 'vintage', 'collectible', 'antique',
  'crystal', 'ceramic', 'glass', 'metal', 'wood',
  
  // Art objects & decorative items
  'sculpture', 'figurine', 'vase', 'ornament', 'decoration',
  'mirror', 'frame', 'artwork', 'poster', 'print',
  
  // Product photography & shopping terms
  'flatlay', 'product', 'haul', 'wishlist', 'shopping', 'aesthetic',
  'object', 'item', 'thing', 'stuff', 'collection'
]

// Additional Tumblr tags specifically for product-focused searches
export const PRODUCT_FOCUSED_TAGS = [
  'wishlist', 'haul', 'shopping', 'flatlay', 'product photography',
  'aesthetic objects', 'things', 'stuff', 'collection', 'items',
  'girly things', 'cute things', 'pretty things', 'objects',
  'shopping aesthetic', 'product aesthetic', 'flatlay aesthetic'
]

export const NON_PRODUCT_INDICATORS = [
  // Landscapes & environments
  'landscape', 'mountain', 'ocean', 'beach', 'forest', 'sky', 'sunset', 'sunrise',
  'nature', 'outdoor', 'scenery', 'wilderness', 'field', 'desert',
  
  // Abstract & artistic (non-object)
  'abstract', 'pattern', 'texture', 'gradient', 'background', 'wallpaper',
  'geometric', 'minimal', 'color study', 'digital art', 'illustration',
  
  // People-focused (unless it's about their products)
  'portrait', 'selfie', 'group photo', 'candid', 'lifestyle photo',
  'street photography', 'documentary', 'photojournalism',
  
  // Architecture (unless it's home decor)
  'building', 'architecture', 'cityscape', 'urban', 'street',
  'interior design', 'room', 'space' // (these could be product contexts though)
]

export function filterForProducts(item: any, tags: string[] = [], strict: boolean = false): boolean {
  // Combine all available text from the item
  const allText = [
    ...tags,
    item.caption || '',
    item.summary || '',
    item.alt_text || '',
    ...(item.tags || [])
  ].join(' ').toLowerCase()
  
  // Count product vs non-product indicators
  const productScore = PRODUCT_INDICATORS.reduce((score, indicator) => {
    return score + (allText.includes(indicator) ? 1 : 0)
  }, 0)
  
  const nonProductScore = NON_PRODUCT_INDICATORS.reduce((score, indicator) => {
    return score + (allText.includes(indicator) ? 1 : 0)
  }, 0)
  
  // Strict mode for wishlist layout - be more aggressive about filtering
  if (strict) {
    // Immediately reject if any landscape/abstract indicators
    if (nonProductScore > 0) {
      return false
    }
    
    // In strict mode, only accept if we have clear product indicators
    return productScore > 0
  }
  
  // Regular mode (for other layouts)
  // If we have clear product indicators and fewer non-product indicators, it's likely a product
  if (productScore > 0 && productScore > nonProductScore) {
    return true
  }
  
  // If no clear indicators either way, we'll be more permissive for aesthetic images
  // since they might contain products without explicit tagging
  if (productScore === 0 && nonProductScore === 0) {
    return true // Let through for manual curation
  }
  
  // If we have more non-product indicators, filter out
  return productScore >= nonProductScore
}

// Get enhanced search terms for product-focused layouts like wishlist
export function getProductFocusedSearchTerms(originalVibe: string): string[] {
  const baseTerms = [originalVibe]
  
  // Add product-focused variations
  const productTerms = [
    `${originalVibe} wishlist`,
    `${originalVibe} objects`,
    `${originalVibe} things`,
    `${originalVibe} aesthetic items`,
    `${originalVibe} flatlay`,
    'wishlist',
    'aesthetic objects',
    'girly things',
    'cute objects',
    'shopping aesthetic',
    'flatlay'
  ]
  
  return [...baseTerms, ...productTerms]
}