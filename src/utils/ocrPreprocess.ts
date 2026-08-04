const MIN_EDGE = 1600

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }
    img.src = url
  })
}

function drawScaled(img: HTMLImageElement): HTMLCanvasElement {
  const scale = Math.max(1, MIN_EDGE / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法处理图片')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas
}

/** 灰度 + 对比度拉伸，提升文字与背景分离度 */
function enhanceContrast(source: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法处理图片')

  ctx.drawImage(source, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = imageData

  const grays: number[] = []
  let min = 255
  let max = 0

  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    grays.push(gray)
    min = Math.min(min, gray)
    max = Math.max(max, gray)
  }

  const range = max - min || 1
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const stretched = ((grays[j] - min) / range) * 255
    data[i] = stretched
    data[i + 1] = stretched
    data[i + 2] = stretched
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

function invertCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法处理图片')

  ctx.drawImage(source, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = imageData

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]
    data[i + 1] = 255 - data[i + 1]
    data[i + 2] = 255 - data[i + 2]
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

export async function preprocessImageForOcr(file: File): Promise<{
  normal: HTMLCanvasElement
  inverted: HTMLCanvasElement
}> {
  const img = await loadImageFromFile(file)
  const scaled = drawScaled(img)
  const enhanced = enhanceContrast(scaled)
  return {
    normal: enhanced,
    inverted: invertCanvas(enhanced),
  }
}

export function hasCjk(text: string): boolean {
  return /[\u3400-\u9fff]/.test(text)
}
