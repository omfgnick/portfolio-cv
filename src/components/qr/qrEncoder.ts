/**
 * QR code escaneável, autocontido (byte mode, ECC nível M, versões 1..6).
 * Encoder from-scratch: GF(256) Reed-Solomon + seleção de máscara por penalidade.
 * Sem dependências externas. Verificado por round-trip de decodificação.
 */
export interface QRMatrix { size: number; modules: number[][] }

export function qrMatrix(text: string): QRMatrix {
  const EXP = new Array<number>(512), LOG = new Array<number>(256)
  { let x = 1; for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d } for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255] }
  const gmul = (a: number, b: number) => (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]
  const rsGen = (n: number) => { let g = [1]; for (let i = 0; i < n; i++) { const ng = new Array<number>(g.length + 1).fill(0); for (let j = 0; j < g.length; j++) { ng[j] ^= g[j]; ng[j + 1] ^= gmul(g[j], EXP[i]) } g = ng } return g }
  const rsEC = (data: number[], n: number) => { const gen = rsGen(n); const rem = new Array<number>(n).fill(0); for (const d of data) { const f = d ^ rem[0]; rem.shift(); rem.push(0); if (f !== 0) for (let i = 0; i < n; i++) rem[i] ^= gmul(gen[i + 1], f) } return rem }

  const ECC: Record<number, [number, number, number]> = { 1: [10, 1, 16], 2: [16, 1, 28], 3: [26, 1, 44], 4: [18, 2, 32], 5: [24, 2, 43], 6: [16, 4, 27] }
  const ALIGN: Record<number, number[]> = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34] }
  const FMT = [0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0]

  const bytes = Array.from(new TextEncoder().encode(text))
  let version = 0, ecPer = 0, blocks = 0, dataPer = 0, dataCw = 0
  for (let v = 1; v <= 6; v++) { const a = ECC[v], cap = a[1] * a[2]; if (4 + 8 + 8 * bytes.length <= cap * 8) { version = v; ecPer = a[0]; blocks = a[1]; dataPer = a[2]; dataCw = cap; break } }
  if (!version) throw new Error('QR: text too long for versions 1..6')

  const bits: number[] = []
  const put = (val: number, len: number) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1) }
  put(4, 4); put(bytes.length, 8); for (const b of bytes) put(b, 8)
  const capBits = dataCw * 8
  for (let i = 0; i < 4 && bits.length < capBits; i++) bits.push(0)
  while (bits.length % 8 !== 0) bits.push(0)
  const pads = [0xec, 0x11]; let pi = 0
  while (bits.length < capBits) { put(pads[pi & 1], 8); pi++ }
  const dataBytes: number[] = []
  for (let i = 0; i < bits.length; i += 8) { let v = 0; for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j]; dataBytes.push(v) }

  const blkData: number[][] = [], blkEc: number[][] = []
  for (let b = 0; b < blocks; b++) { const chunk = dataBytes.slice(b * dataPer, (b + 1) * dataPer); blkData.push(chunk); blkEc.push(rsEC(chunk, ecPer)) }
  const finalCw: number[] = []
  for (let i = 0; i < dataPer; i++) for (let b = 0; b < blocks; b++) if (i < blkData[b].length) finalCw.push(blkData[b][i])
  for (let i = 0; i < ecPer; i++) for (let b = 0; b < blocks; b++) finalCw.push(blkEc[b][i])
  const dataBits: number[] = []
  for (const cw of finalCw) for (let i = 7; i >= 0; i--) dataBits.push((cw >> i) & 1)

  const size = 17 + 4 * version
  const m: (number | null)[][] = Array.from({ length: size }, () => new Array<number | null>(size).fill(null))
  const res: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const set = (r: number, c: number, v: boolean) => { if (r < 0 || r >= size || c < 0 || c >= size) return; m[r][c] = v ? 1 : 0; res[r][c] = true }
  const finder = (r: number, c: number) => { for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) { const inRing = ((i >= 0 && i <= 6) && (j === 0 || j === 6)) || ((j >= 0 && j <= 6) && (i === 0 || i === 6)); const inCore = (i >= 2 && i <= 4 && j >= 2 && j <= 4); set(r + i, c + j, inRing || inCore) } }
  finder(0, 0); finder(0, size - 7); finder(size - 7, 0)
  for (let i = 8; i < size - 8; i++) { const v = (i % 2 === 0); if (m[6][i] === null) set(6, i, v); if (m[i][6] === null) set(i, 6, v) }
  const ac = ALIGN[version]
  for (const r of ac) for (const c of ac) { if ((r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6)) continue; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) set(r + i, c + j, Math.max(Math.abs(i), Math.abs(j)) !== 1) }
  set(4 * version + 9, 8, true)
  for (let i = 0; i <= 8; i++) { res[8][i] = true; res[i][8] = true }
  for (let i = 0; i < 8; i++) res[size - 1 - i][8] = true
  for (let i = 8; i < 15; i++) res[8][size - 15 + i] = true

  let idx = 0
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) { const cc = right - j, up = ((right + 1) & 2) === 0, row = up ? size - 1 - vert : vert; if (!res[row][cc]) { m[row][cc] = (idx < dataBits.length) ? dataBits[idx] : 0; idx++ } }
  }

  const maskCond = (k: number, r: number, c: number): boolean => {
    switch (k) {
      case 0: return (r + c) % 2 === 0
      case 1: return r % 2 === 0
      case 2: return c % 3 === 0
      case 3: return (r + c) % 3 === 0
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0
      case 5: return ((r * c) % 2) + ((r * c) % 3) === 0
      case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0
      default: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
    }
  }
  const placeFormat = (g: number[][], fmt: number) => {
    for (let i = 0; i < 6; i++) g[8][i] = (fmt >> i) & 1
    g[8][7] = (fmt >> 6) & 1; g[8][8] = (fmt >> 7) & 1; g[7][8] = (fmt >> 8) & 1
    for (let i = 9; i < 15; i++) g[14 - i][8] = (fmt >> i) & 1
    for (let i = 0; i < 8; i++) g[size - 1 - i][8] = (fmt >> i) & 1
    for (let i = 8; i < 15; i++) g[8][size - 15 + i] = (fmt >> i) & 1
    g[size - 8][8] = 1
  }
  const penalty = (g: number[][]): number => {
    let p = 0
    for (let r = 0; r < size; r++) { let run = 1; for (let c = 1; c < size; c++) { if (g[r][c] === g[r][c - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p++ } else run = 1 } }
    for (let c = 0; c < size; c++) { let run = 1; for (let r = 1; r < size; r++) { if (g[r][c] === g[r - 1][c]) { run++; if (run === 5) p += 3; else if (run > 5) p++ } else run = 1 } }
    for (let r = 0; r < size - 1; r++) for (let c = 0; c < size - 1; c++) { const v = g[r][c]; if (v === g[r][c + 1] && v === g[r + 1][c] && v === g[r + 1][c + 1]) p += 3 }
    const p1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], p2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1]
    const scan = (line: number[]) => { for (let i = 0; i + 11 <= line.length; i++) { let a = true, b = true; for (let k = 0; k < 11; k++) { if (line[i + k] !== p1[k]) a = false; if (line[i + k] !== p2[k]) b = false } if (a || b) p += 40 } }
    for (let r = 0; r < size; r++) { const line: number[] = []; for (let c = 0; c < size; c++) line.push(g[r][c]); scan(line) }
    for (let c = 0; c < size; c++) { const line: number[] = []; for (let r = 0; r < size; r++) line.push(g[r][c]); scan(line) }
    let dark = 0; for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (g[r][c]) dark++
    p += Math.floor(Math.abs(dark * 100 / (size * size) - 50) / 5) * 10
    return p
  }

  let best: number[][] | null = null, bestPen = Infinity
  for (let k = 0; k < 8; k++) {
    const g: number[][] = Array.from({ length: size }, () => new Array<number>(size).fill(0))
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) g[r][c] = res[r][c] ? (m[r][c] || 0) : ((m[r][c] as number) ^ (maskCond(k, r, c) ? 1 : 0))
    placeFormat(g, FMT[k])
    const pen = penalty(g)
    if (pen < bestPen) { bestPen = pen; best = g }
  }
  return { size, modules: best! }
}

export function drawQR(canvas: HTMLCanvasElement, text: string, px = 130): void {
  let mx: QRMatrix
  try { mx = qrMatrix(text) } catch { return }
  const DPR = 2, W = px * DPR
  canvas.width = W; canvas.height = W
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const quiet = 4, total = mx.size + quiet * 2, scale = Math.floor(W / total), offset = Math.floor((W - scale * total) / 2)
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, W)
  ctx.fillStyle = '#06080a'
  for (let r = 0; r < mx.size; r++) for (let c = 0; c < mx.size; c++) if (mx.modules[r][c]) ctx.fillRect(offset + (c + quiet) * scale, offset + (r + quiet) * scale, scale, scale)
}
