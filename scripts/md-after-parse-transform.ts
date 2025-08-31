// /plugins/afterParse.ts
import * as fs from 'node:fs'
import * as path from 'node:path'
import probe from 'probe-image-size'
import fetch from 'node-fetch'
import imageSize from 'image-size'
import type { FileAfterParseHook, ParsedContentFile } from '@nuxt/content'
import type { MinimarkElement, MinimarkNode, MinimarkTree } from 'minimark'
import { textContent } from 'minimark'
import Jimp from 'jimp'
// import { ColorActionName } from '@jimp/plugin-color'

interface ParsedContextWithMinimark extends FileAfterParseHook {
  content: ParsedContentFile & {
    body?: MinimarkTree
  }
}

type ImgLikeNode = ['img' | 'im', MinimarkElement[1] & { src: string }, ...MinimarkNode[]]

const imageDataCache = new Map<string, { width: number; height: number; localPath?: string; palette?: string[] }>()

const publicDir = path.join(process.cwd(), 'public')
// Use the same environment variable as Nuxt config
const imagekitBaseEnv = process.env.IMAGEKIT_URL_ENDPOINT
// Fallback for external repo testing (can be removed later)
const publicRemoteBaseEnv = process.env.PUBLIC_ASSETS_BASE

export async function ContentAfterParseTransform(ctx: ParsedContextWithMinimark) {
  const { content } = ctx
  if (!content.body || content.body.type !== 'minimark') return
  content.body.value = await Promise.all(content.body.value.map(transformNode))
}

async function transformNode(node: MinimarkNode): Promise<MinimarkNode> {
  if (!Array.isArray(node)) return node
  // if(node[0] === 'img-caption') {
  //   console.log(`img-caption: `, JSON.stringify(node, null, 2))
  // }
  const imgLike = imgLikeNode(node)
    if (imgLike) {
    const [_, attrs, ...children] = imgLike
    const imageData = await getImageData(attrs.src, 4)
    const aspectRatio = imageData ? imageData.width / imageData.height : undefined
    let paletteVars: string | undefined
    if (imageData?.palette && imageData.palette.length === 16) {
      paletteVars = imageData.palette.map((hex, i) => `--c${i}:${hex}`).join(';')
    }
    const captionStr = attrs.caption || attrs.title || ''
    const captionNodes = (children.length === 0 && captionStr)
      ? [captionStr as MinimarkNode]
      : children
    const title = attrs.title || attrs.caption || textContent(imgLike)
    return [
      'ContentImage',
      {
        ...attrs,
        src: imageData?.localPath || attrs.src,
        width: imageData?.width,
        height: imageData?.height,
        aspectRatio,
        title,
        ...(paletteVars ? { style: paletteVars } : {}),
      },
      ...captionNodes
    ]
  }
  const [tag, attrs, ...children] = node
  const newChildren = await Promise.all(children.map(transformNode))
  return [tag, attrs, ...newChildren]
}

async function getImageData(src: string, grid: 3 | 4 = 4): Promise<{ width: number; height: number; localPath?: string; palette?: string[] } | undefined> {
  if (!src) return undefined
  if (imageDataCache.has(src)) return imageDataCache.get(src)
  const resolved = await resolveImageUrl(src)
  if (!resolved) return undefined
  try {
    const img = await Jimp.read(resolved.resolvedUrl)
    const width = img.getWidth()
    const height = img.getHeight()
    // Apply image enhancements for better palette colors before resizing
    try {
      img.normalize()
        .brightness(0.1)     // Brighten slightly to avoid dark palettes
        .contrast(0.15)      // Increase contrast for more vibrant colors
    } catch {
      // Optional processing, continue if it fails
    }
    // Resize directly on the original image (no clone needed)
    img.resize(grid, grid, Jimp.RESIZE_HERMITE)
    const palette: string[] = []
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const int = img.getPixelColor(x, y)
        const { r, g, b } = Jimp.intToRGBA(int)
        palette.push(rgbToHex(r, g, b))
      }
    }
    const result = {
      width,
      height,
      localPath: resolved.localPath,
      palette
    }
    imageDataCache.set(src, result)
    return result
  } catch (e) {
    console.warn('⚠️ Could not process image with Jimp:', src, e)
    // Fallback: try to get dimensions only using lightweight methods
    try {
      if (fs.existsSync(resolved.resolvedUrl)) {
        const dim = imageSize(resolved.resolvedUrl)
        if (dim?.width && dim?.height) {
          const result = {
            width: dim.width,
            height: dim.height,
            localPath: resolved.localPath
          }
          imageDataCache.set(src, result)
          return result
        }
      } else {
        // For remote URLs, use probe
        const res = await probe(resolved.resolvedUrl, { timeout: 3000 })
        if (res?.width && res?.height) {
          const result = {
            width: res.width,
            height: res.height,
            localPath: resolved.localPath
          }
          imageDataCache.set(src, result)
          return result
        }
      }
    } catch (fallbackError) {
      console.warn('⚠️ Fallback dimension detection also failed:', src, fallbackError)
    }
  }
  return undefined
}

async function resolveImageUrl(src: string): Promise<{ localPath?: string; resolvedUrl: string } | undefined> {
  if (!src) return undefined
  let rel = stripQuery(src)
  try {
    if (isHttpUrl(rel)) {
      const fileName = path.basename(new URL(rel).pathname) || 'image'
      const localPath = path.join(publicDir, 'external', fileName)
      if (!fs.existsSync(localPath)) {
        try {
          await downloadExternalImage(rel, localPath)
        } catch (e) {
          console.warn(`⚠️ Could not download external image: ${rel}`, e)
        }
      }
      if (fs.existsSync(localPath)) {
        return { localPath: `/external/${fileName}`, resolvedUrl: localPath }
      }
      // Fallback to original URL if download failed
      return { resolvedUrl: rel }
    } else {
      // Handle local file paths (from Nuxt Studio uploads or manual additions)
      rel = rel.startsWith('/') ? rel.slice(1) : rel
      const abs = path.join(publicDir, rel)

      // Priority 1: Check if file exists locally (Nuxt Studio uploads or manual files)
      if (fs.existsSync(abs)) {
        return { resolvedUrl: abs, localPath: `/${rel}` }
      }

      // Priority 2: Try downloading from ImageKit (for external repo images during development)
      if (imagekitBaseEnv && !imagekitBaseEnv.includes('dureika')) {
        // Only try ImageKit download if it's not our main endpoint
        try {
          const fileName = path.basename(rel)
          const localPath = path.join(publicDir, 'external', fileName)
          const imageKitUrl = `${imagekitBaseEnv}/${rel}`

          if (!fs.existsSync(localPath)) {
            console.log(`📥 Downloading from ImageKit: ${imageKitUrl}`)
            await downloadExternalImage(imageKitUrl, localPath)
            if (fs.existsSync(localPath)) {
              return { resolvedUrl: localPath, localPath: `/external/${fileName}` }
            }
          } else {
            return { resolvedUrl: localPath, localPath: `/external/${fileName}` }
          }
        } catch (e) {
          console.warn(`⚠️ Could not download from ImageKit: ${rel}`, e)
        }
      }

      // Priority 3: Use ImageKit URL for optimization (during build/production)
      if (imagekitBaseEnv) {
        const url = `${imagekitBaseEnv}/${rel}`
        return { resolvedUrl: url }
      }

      // Priority 4: Fallback to remote public assets
      if (publicRemoteBaseEnv) {
        const base = publicRemoteBaseEnv.endsWith('/') ? publicRemoteBaseEnv.slice(0, -1) : publicRemoteBaseEnv
        const url = `${base}/${rel}`
        return { resolvedUrl: url }
      }
    }
  } catch (err) {
    console.warn(`⚠️ Could not resolve image URL: ${src}`, err)
  }
  return undefined
}

async function downloadExternalImage(url: string, targetPath: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download: ${url}`)
  const buffer = await res.arrayBuffer()
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
  fs.writeFileSync(targetPath, Buffer.from(buffer))
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => v.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

type ImgCaptionNode = [
  'img-caption',
  MinimarkElement[1],
  ['template', { 'v-slot:img': string }, MinimarkNode],
  ['template', { 'v-slot:caption': string }, MinimarkNode]
]

function imgLikeNode(node: MinimarkNode): ImgLikeNode | null {
  if (!Array.isArray(node)) return null
  const [tag, attrs = {}, ...children] = node
  if ((tag === 'img') && attrs.src) {
    return node as ImgLikeNode
  }
  if (tag === 'img-caption') {
    return convertImgCaptionToImgLike(node as ImgCaptionNode)
  }
  if (tag === 'p' && children?.length === 1) {
    const imgLikeChild = imgLikeNode(children[0] as MinimarkNode)
    if (imgLikeChild) return imgLikeChild
  }
  return null
}

function findImgInNode(node: MinimarkNode): ImgLikeNode | null {
  if (!Array.isArray(node)) return null
  const [tag, attrs = {}, ...children] = node
  if ((tag === 'img') && attrs.src) {
    return node as ImgLikeNode
  }
  for (const child of children) {
    const imgChild = findImgInNode(child)
    if (imgChild) return imgChild
  }
  return null
}

function convertImgCaptionToImgLike(node: ImgCaptionNode): ImgLikeNode | null {
  if (!Array.isArray(node) || node[0] !== 'img-caption') return null
  const [_, attrs = {}, ...children] = node

  const slots = children.reduce<{ img?: ImgLikeNode | null; caption?: MinimarkNode }>((acc, child) => {
    if (Array.isArray(child) && child[0] === 'template') {
      const slotName = Object.keys(child[1] || {})[0]
      if (slotName === 'v-slot:img') {
        acc.img = findImgInNode(child[2])
      } else if (slotName === 'v-slot:caption') {
        acc.caption = child[2]
      }
    }
    return acc
  }, { })

  if (!slots.img) return null
  const [_tag, imgAttrs] = slots.img
  const src = imgAttrs?.src
  if (!src) return null

  // Handle caption content safely - extract content from p element or use directly
  const captionNodes: MinimarkNode[] = []
  if (slots.caption) {
    if (Array.isArray(slots.caption)) {
      const [tag, _attrs, ...captionChildren] = slots.caption as MinimarkNode[]
      if (tag === 'p' && captionChildren.length > 0) {
        captionNodes.push(...captionChildren)
      } else {
        // If it's not a p element, use the whole array as caption
        captionNodes.push(slots.caption as MinimarkNode)
      }
    } else {
      // If it's a string or other node, use it directly
      captionNodes.push(slots.caption as MinimarkNode)
    }
  }

  return [
    'img',
    { ...attrs, src } as MinimarkElement[1] & { src: string },
    ...captionNodes
  ] as ImgLikeNode
}

function stripQuery(url: string) {
  return url.replace(/\?.*$/, '')
}

function isHttpUrl(url: string) {
  return /^https?:\/\//i.test(url)
}
