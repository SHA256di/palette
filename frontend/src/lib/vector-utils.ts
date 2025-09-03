// Vector mathematics utilities for cosine similarity calculations

export function dotProduct(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length')
  }
  return vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
}

export function magnitude(vector: number[]): number {
  return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = dotProduct(vecA, vecB)
  const magA = magnitude(vecA)
  const magB = magnitude(vecB)
  
  if (magA === 0 || magB === 0) {
    return 0
  }
  
  return dot / (magA * magB)
}

export function normalizeVector(vector: number[]): number[] {
  const mag = magnitude(vector)
  if (mag === 0) return vector.map(() => 0)
  return vector.map(val => val / mag)
}

export function euclideanDistance(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length')
  }
  return Math.sqrt(vecA.reduce((sum, a, i) => sum + (a - vecB[i]) ** 2, 0))
}

// TF-IDF calculation for text similarity
export function calculateTfIdf(documents: string[][]): number[][] {
  const allTerms = [...new Set(documents.flat())]
  const documentCount = documents.length
  
  // Calculate IDF for each term
  const idf = allTerms.map(term => {
    const docsContainingTerm = documents.filter(doc => doc.includes(term)).length
    return Math.log(documentCount / docsContainingTerm)
  })
  
  // Calculate TF-IDF for each document
  return documents.map(doc => {
    const termFreq = allTerms.map(term => 
      doc.filter(t => t === term).length / doc.length
    )
    return termFreq.map((tf, i) => tf * idf[i])
  })
}

// Weighted cosine similarity with term importance
export function weightedCosineSimilarity(
  vecA: number[], 
  vecB: number[], 
  weights: number[]
): number {
  if (vecA.length !== vecB.length || vecA.length !== weights.length) {
    throw new Error('All vectors must have the same length')
  }
  
  const weightedA = vecA.map((val, i) => val * weights[i])
  const weightedB = vecB.map((val, i) => val * weights[i])
  
  return cosineSimilarity(weightedA, weightedB)
}