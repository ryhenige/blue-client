import loadPack, { preloadPacks } from './loadPack'
import config from 'constants/packs/characters.json'

class PackManager {
  constructor() {
    this.loadedPacks = new Map()
    this.assetLookup = new Map() // asset.id -> { packName, assetData }
    this.buildLookup()
  }

  // Build fast lookup table for assets
  buildLookup() {
    Object.entries(config.assets).forEach(([slot, assets]) => {
      assets.forEach(asset => {
        this.assetLookup.set(asset.id, {
          slot,
          packName: asset.pack,
          url: asset.url
        })
      })
    })
  }

  // Load a specific pack
  async loadPack(packName) {
    if (!this.loadedPacks.has(packName)) {
      const packAssets = this.getPackAssets(packName)
      const data = await loadPack(packName, packAssets)
      this.loadedPacks.set(packName, data)
    }
    return this.loadedPacks.get(packName)
  }

  // Get animations for a specific asset
  getAnimations(assetId) {
    for (const packData of this.loadedPacks.values()) {
      if (packData[assetId]) {
        return packData[assetId].animations
      }
    }
    return {}
  }

  // Load packs needed for a selection
  async loadSelection(selection) {
    const requiredPacks = new Set()
    const assetIds = []

    // Determine which packs are needed
    config.slots.forEach((slot, index) => {
      const chosen = selection?.[index]
      if (chosen) {
        const assets = config.assets[slot] || []
        const asset = assets[chosen - 1]
        if (asset) {
          assetIds.push(asset.id)
          requiredPacks.add(asset.pack)
        }
      }
    })

    // Load required packs
    const packPromises = Array.from(requiredPacks).map(packName => {
      if (!this.loadedPacks.has(packName)) {
        const packAssets = this.getPackAssets(packName)
        return loadPack(packName, packAssets).then(data => {
          this.loadedPacks.set(packName, data)
          return data
        })
      }
      return Promise.resolve(this.loadedPacks.get(packName))
    })

    await Promise.all(packPromises)

    // Extract animations for the specific selection
    const animations = {}
    config.slots.forEach((slot, index) => {
      const chosen = selection?.[index]
      if (chosen) {
        const assets = config.assets[slot] || []
        const asset = assets[chosen - 1]
        if (asset) {
          const packData = this.loadedPacks.get(asset.pack)
          if (packData && packData[asset.id]) {
            animations[slot] = packData[asset.id].animations
          }
        }
      }
    })

    return animations
  }

  // Get all assets in a pack
  getPackAssets(packName) {
    const packAssets = []
    Object.values(config.assets).flat().forEach(asset => {
      if (asset.pack === packName) {
        packAssets.push(asset)
      }
    })
    return packAssets
  }

  // Preload all packs (for startup)
  async preloadAllPacks() {
    const allPackNames = new Set()
    Object.values(config.assets).flat().forEach(asset => {
      allPackNames.add(asset.pack)
    })

    const packConfigs = Array.from(allPackNames).map(packName => ({
      packName,
      assets: this.getPackAssets(packName)
    }))

    return preloadPacks(packConfigs)
  }

  // Get resolved character data
  getResolvedAssets(selection) {
    const resolved = {}
    config.slots.forEach((slot, i) => {
      const items = config.assets[slot] || []
      const chosen = selection?.[i]
      resolved[slot] = chosen ? items[chosen - 1] ?? null : null
    })
    return resolved
  }

  // Clear all cached data
  clearCache() {
    this.loadedPacks.clear()
  }
}

// Export singleton instance
export const packManager = new PackManager()
export default packManager
