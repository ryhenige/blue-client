import loadPack, { preloadPacks } from 'helpers/loaders/loadPack'

import characterConfig from 'constants/registry/characters.json'

const getConfig = (type) => {
  const configs = {
    characters: characterConfig
  }
  return configs[type]
}

class PackManager {
  constructor(type) {
    this.type = type
    this.config = getConfig(type)
    this.loadedPacks = new Map()
    this.assetLookup = new Map() // asset.id -> { packName, assetData }
    this.buildLookup()
  }

  // Build fast lookup table for assets
  buildLookup() {
    Object.entries(this.config.assets).forEach(([slot, assets]) => {
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
    this.config.order.forEach((slot, index) => {
      const chosen = selection?.[index]
      if (chosen) {
        const assets = this.config.assets[slot] || []
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
    this.config.order.forEach((slot, index) => {
      const chosen = selection?.[index]
      if (chosen) {
        const assets = this.config.assets[slot] || []
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
    Object.values(this.config.assets).flat().forEach(asset => {
      if (asset.pack === packName) {
        packAssets.push(asset)
      }
    })
    return packAssets
  }

  // Preload all packs (for startup)
  async preloadAllPacks() {
    const allPackNames = new Set()
    Object.values(this.config.assets).flat().forEach(asset => {
      allPackNames.add(asset.pack)
    })

    const packConfigs = Array.from(allPackNames).map(packName => ({
      packName,
      assets: this.getPackAssets(packName)
    }))

    return preloadPacks(packConfigs)
  }

  // Get resolved data
  getResolvedAssets(selection) {
    const resolved = {}
    this.config.order.forEach((asset, i) => {
      const items = this.config.assets[asset] || []
      const chosen = selection?.[i]
      resolved[asset] = chosen ? items[chosen - 1] ?? null : null
    })
    return resolved
  }

  // Clear all cached data
  clearCache() {
    this.loadedPacks.clear()
  }
}

// Export factory function to create dynamic instances
export const createPackManager = (type) => new PackManager(type)

// Export singleton instances for common types
export const characterPackManager = new PackManager('characters')
