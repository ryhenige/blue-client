// Global tileset cache to avoid re-loading tilesets
const tilesetCache = new Map()
import loadTileset from "helpers/loaders/loadTileset"

export async function loadTilesetWithCache(url) {
  // Return cached tileset if available
  if (tilesetCache.has(url)) {
    return tilesetCache.get(url)
  }

  // Load and cache the tileset using the actual loadTileset function
  const tileset = await loadTileset(url)
  tilesetCache.set(url, tileset)
  
  return tileset
}

export function clearTilesetCache() {
  tilesetCache.clear()
}

export function getCacheSize() {
  return tilesetCache.size
}
