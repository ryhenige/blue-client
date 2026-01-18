// tilesetLoader.js
import { Assets, Texture, Rectangle, TextureStyle } from "pixi.js"

// Pixi v8 global pixel-art scaling
TextureStyle.defaultOptions.scaleMode = "nearest"

/**
 * Loads an Aseprite JSON (frames array) + its PNG and returns:
 * {
 *   textures: Texture[],     // textures[tileId]
 *   tileW: number,
 *   tileH: number,
 *   cols: number,
 *   rows: number,
 *   imageUrl: string
 * }
 */
export default async function loadTileset(jsonUrl) {
  const res = await fetch(jsonUrl)
  if (!res.ok) throw new Error(`Failed to fetch ${jsonUrl}: ${res.status}`)
  const data = await res.json()

  // Aseprite JSON points to the image file name in meta.image
  const imageUrl = jsonUrl.replace(/[^/]+$/, data.meta.image)

  // Load the PNG
  const tex = await Assets.load(imageUrl)

  // Pixi v8: ensure nearest on the actual source as well
  if (tex?.source) tex.source.style.scaleMode = "nearest"
  const source = tex.source

  // IMPORTANT: your JSON is frames: [ ... ] not an object
  const frames = data.frames

  // Sort in reading order so tileId 0..n maps left->right, top->bottom
  const sorted = [...frames].sort((a, b) => (a.frame.y - b.frame.y) || (a.frame.x - b.frame.x))

  const textures = sorted.map((f) => {
    const r = new Rectangle(f.frame.x, f.frame.y, f.frame.w, f.frame.h)
    return new Texture({ source, frame: r })
  })

  // assume consistent tile size
  const tileW = sorted[0]?.frame?.w ?? 64
  const tileH = sorted[0]?.frame?.h ?? 64

  const sheetW = data.meta.size.w
  const sheetH = data.meta.size.h
  const cols = Math.floor(sheetW / tileW)
  const rows = Math.floor(sheetH / tileH)

  return { textures, tileW, tileH, cols, rows, imageUrl }
}
