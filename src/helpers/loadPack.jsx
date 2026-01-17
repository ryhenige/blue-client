import {
  Assets,
  Texture,
  Rectangle,
  TextureStyle
} from "pixi.js"

// Pixi v8 global pixel-art scaling
TextureStyle.defaultOptions.scaleMode = 'nearest'

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
 * Load an entire pack of character assets
 * Returns: {
 *   "pants-1": { animations: { "pants-1-idle-s": { frames: [...] } } },
 *   "pants-2": { animations: { "pants-2-idle-s": { frames: [...] } } }
 * }
 */
export default async function loadPack(packName, packAssets) {
  if (packCache.has(packName)) {
    return packCache.get(packName)
  }

  const promise = (async () => {
    const packData = {}
    
    // Load all assets in the pack in parallel
    const assetPromises = packAssets.map(async (asset) => {
      try {
        const response = await fetch(asset.url)
        if (!response.ok) {
          throw new Error(`Failed to fetch ${asset.url}: ${response.status}`)
        }

        const data = await response.json()
        const imageUrl = asset.url.replace(/[^/]+$/, data.meta.image)
        
        // Load the texture
        const texture = await Assets.load(imageUrl)
        if (texture?.source) {
          texture.source.style.scaleMode = 'nearest'
        }

        const source = texture.source

        // Build frames
        const frames = Object.values(data.frames).map((f) => ({
          rect: new Rectangle(f.frame.x, f.frame.y, f.frame.w, f.frame.h),
          duration: f.duration ?? 100
        }))

        frames.sort((a, b) => (a.rect.y - b.rect.y) || (a.rect.x - b.rect.x))

        const textures = frames.map((f) => new Texture({ source, frame: f.rect }))
        const timedFrames = textures.map((t, i) => ({
          texture: t,
          time: frames[i].duration
        }))

        // Build animations
        const animations = {}
        for (const tag of data.meta.frameTags ?? []) {
          animations[tag.name] = {
            frames: timedFrames.slice(tag.from, tag.to + 1)
          }
        }

        return {
          id: asset.id,
          animations
        }
      } catch (e) {
        console.error(`Failed to load ${asset.url}:`, e)
        return null
      }
    })

    const results = await Promise.all(assetPromises)
    
    // Convert to lookup object
    results.forEach(result => {
      if (result) {
        packData[result.id] = result
      }
    })

    return packData
  })()

  packCache.set(packName, promise)
  cleanPackCache()
  return promise
}

// Preload multiple packs
export async function preloadPacks(packConfigs) {
  const promises = packConfigs.map(({ packName, assets }) => 
    loadPack(packName, assets)
  )
  return Promise.all(promises)
}

// Clear pack cache
export function clearPackCache() {
  packCache.clear()
}
