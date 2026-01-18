

export const TILE_SIZE = 64
export const MAP_WIDTH = 20 // tiles
export const MAP_HEIGHT = 16 // tiles

export const getChunkPosition = (chunkId) => {
    const [x, y] = chunkId.split(',').map(Number)
    
    // Use standard chunk size for all chunks
    const chunkWidth = MAP_WIDTH * TILE_SIZE
    const chunkHeight = MAP_HEIGHT * TILE_SIZE
    
    return { x: x * chunkWidth, y: y * chunkHeight }
}