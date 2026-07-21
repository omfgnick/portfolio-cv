import { describe, it, expect } from 'vitest'
import { qrMatrix } from './qrEncoder'

/**
 * Decodifica a matriz produzida pelo encoder (lê format, remove máscara,
 * lê codewords em zig-zag, de-interleave, checa síndromes Reed-Solomon e
 * reconstrói o texto). Se o round-trip bate e as síndromes zeram, o QR é
 * válido/escaneável — um leitor conforme leria o mesmo.
 */
function decode(text: string) {
  const { size, modules } = qrMatrix(text)
  const M = modules

  const EXP = new Array<number>(512), LOG = new Array<number>(256)
  { let x = 1; for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d } for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255] }
  const gmul = (a: number, b: number) => (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]
  const FMT = [0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0]

  const bf: number[] = []
  for (let i = 0; i < 6; i++) bf[i] = M[8][i]
  bf[6] = M[8][7]; bf[7] = M[8][8]; bf[8] = M[7][8]
  for (let i = 9; i < 15; i++) bf[i] = M[14 - i][8]
  let fv = 0; for (let i = 0; i < 15; i++) fv |= (bf[i] << i)
  let mask = 0, bh = 99
  for (let k = 0; k < 8; k++) { let h = 0, x = fv ^ FMT[k]; while (x) { h += x & 1; x >>= 1 } if (h < bh) { bh = h; mask = k } }

  const res: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const mk = (r: number, c: number) => { if (r >= 0 && r < size && c >= 0 && c < size) res[r][c] = true }
  const fd = (r: number, c: number) => { for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) mk(r + i, c + j) }
  fd(0, 0); fd(0, size - 7); fd(size - 7, 0)
  for (let i = 8; i < size - 8; i++) { mk(6, i); mk(i, 6) }
  const version = (size - 17) / 4
  const AL: Record<number, number[]> = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34] }
  const ac = AL[version]
  for (const r of ac) for (const c of ac) { if ((r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6)) continue; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) mk(r + i, c + j) }
  mk(4 * version + 9, 8)
  for (let i = 0; i <= 8; i++) { res[8][i] = true; res[i][8] = true }
  for (let i = 0; i < 8; i++) res[size - 1 - i][8] = true
  for (let i = 8; i < 15; i++) res[8][size - 15 + i] = true

  const mc = (k: number, r: number, c: number): boolean => {
    switch (k) {
      case 0: return (r + c) % 2 === 0; case 1: return r % 2 === 0; case 2: return c % 3 === 0; case 3: return (r + c) % 3 === 0
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; case 5: return ((r * c) % 2) + ((r * c) % 3) === 0
      case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0; default: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
    }
  }
  const bits: number[] = []
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) { const c = right - j, up = ((right + 1) & 2) === 0, r = up ? size - 1 - vert : vert; if (!res[r][c]) bits.push(M[r][c] ^ (mc(mask, r, c) ? 1 : 0)) }
  }
  const cw: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) { let v = 0; for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j]; cw.push(v) }

  const ECC: Record<number, [number, number, number]> = { 1: [10, 1, 16], 2: [16, 1, 28], 3: [26, 1, 44], 4: [18, 2, 32], 5: [24, 2, 43], 6: [16, 4, 27] }
  const [ecPer, blocks, dataPer] = ECC[version]
  const bd: number[][] = Array.from({ length: blocks }, () => []), be: number[][] = Array.from({ length: blocks }, () => [])
  let p = 0
  for (let i = 0; i < dataPer; i++) for (let b = 0; b < blocks; b++) bd[b].push(cw[p++])
  for (let i = 0; i < ecPer; i++) for (let b = 0; b < blocks; b++) be[b].push(cw[p++])

  let synOk = true
  for (let b = 0; b < blocks; b++) {
    const full = bd[b].concat(be[b])
    for (let s = 0; s < ecPer; s++) { let acc = 0; for (const v of full) acc = gmul(acc, EXP[s]) ^ v; if (acc !== 0) synOk = false }
  }
  const stream = bd.flat()
  const sb: number[] = []; for (const v of stream) for (let i = 7; i >= 0; i--) sb.push((v >> i) & 1)
  let bi = 0; const rd = (n: number) => { let v = 0; for (let i = 0; i < n; i++) v = (v << 1) | sb[bi++]; return v }
  rd(4); const len = rd(8); const by: number[] = []; for (let i = 0; i < len; i++) by.push(rd(8))
  return { text: new TextDecoder().decode(new Uint8Array(by)), synOk, formatErr: bh }
}

describe('qrEncoder', () => {
  it('produz um QR válido que decodifica de volta ao texto original', () => {
    const url = 'https://www.linkedin.com/in/nicolasmesquita/'
    const d = decode(url)
    expect(d.text).toBe(url)
    expect(d.synOk).toBe(true)
    expect(d.formatErr).toBe(0)
  })

  it('round-trip para textos de tamanhos variados (versões 1..6)', () => {
    for (const s of ['a', 'NOC', 'https://github.com/omfgnick', 'x'.repeat(90)]) {
      const d = decode(s)
      expect(d.text).toBe(s)
      expect(d.synOk).toBe(true)
    }
  })
})
