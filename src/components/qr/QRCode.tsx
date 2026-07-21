import { useEffect, useRef } from 'react'
import { drawQR } from './qrEncoder'

/** Renderiza um QR real e escaneável num <canvas> (sempre preto-no-branco). */
export default function QRCode({ text, size = 130, className }: { text: string; size?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => { if (ref.current) drawQR(ref.current, text, size) }, [text, size])
  return <canvas ref={ref} width={size} height={size} className={className} style={{ width: size, height: size }} aria-hidden="true" />
}
