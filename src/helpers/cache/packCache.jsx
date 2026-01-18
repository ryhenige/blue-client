// Cache for entire packs
const packCache = new Map()

// Memory management: limit cache size
const MAX_PACK_CACHE_SIZE = 50

function cleanPackCache() {
  if (packCache.size > MAX_PACK_CACHE_SIZE) {
    const firstKey = packCache.keys().next().value
    packCache.delete(firstKey)
  }
}

/**
 * Get cached pack data
 */
export function getCachedPack(packName) {
  return packCache.get(packName)
}

/**
 * Set cached pack data
 */
export function setCachedPack(packName, packData) {
  cleanPackCache()
  packCache.set(packName, packData)
}

/**
 * Check if pack is cached
 */
export function hasCachedPack(packName) {
  return packCache.has(packName)
}

/**
 * Clear all pack cache
 */
export function clearPackCache() {
  packCache.clear()
}

/**
 * Get cache size
 */
export function getPackCacheSize() {
  return packCache.size
}

/**
 * Load pack with caching
 */
export async function loadPackWithCache(packName, loadFunction) {
  if (packCache.has(packName)) {
    return packCache.get(packName)
  }

  const packData = await loadFunction()
  setCachedPack(packName, packData)
  return packData
}
