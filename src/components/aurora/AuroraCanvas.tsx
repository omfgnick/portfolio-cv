import { useEffect, useRef } from 'react'

/**
 * Fundo "Aurora Viva" — shader WebGL (fbm) fluindo na paleta da marca
 * (esmeralda → ciano → violeta sobre tinta noir).
 *
 * Guardas de performance/acessibilidade:
 *  - pausa quando o canvas sai da viewport (IntersectionObserver) ou a aba esconde;
 *  - devicePixelRatio limitado a 1.5 + contexto `low-power`;
 *  - prefers-reduced-motion → renderiza UM frame estático e para;
 *  - WebGL indisponível (GPU bloqueada/antiga) → fallback em CSS gradient;
 *  - cleanup completo no unmount (rAF + observers + loseContext).
 *
 * `variant="static"`: nem tenta WebGL — só o gradiente CSS.
 */
const FRAG = `precision highp float;uniform vec2 r;uniform float t;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.04;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r; vec2 q=vec2(uv.x*r.x/r.y,uv.y);
  float a=fbm(q*1.5+vec2(t*.045,t*.028));
  float b=fbm(q*2.1-vec2(t*.034,t*.05)+a*1.3);
  float c=fbm(q*1.1+vec2(-t*.025,t*.04)+b*.8);
  vec3 col=vec3(.02,.008,.045);
  col=mix(col,vec3(.62,.05,.30),smoothstep(.42,.88,a)*.66);
  col=mix(col,vec3(.0,.55,.72),smoothstep(.52,.95,b)*.42);
  col=mix(col,vec3(.44,.10,.78),smoothstep(.58,.92,c)*.30);
  col=mix(col,vec3(.92,.86,.05),smoothstep(.82,.99,a*b*2.1)*.16);
  float vig=smoothstep(1.45,.18,length(uv-vec2(.5,.42)));
  gl_FragColor=vec4(col*vig,1.);
}`

const CSS_FALLBACK: React.CSSProperties = {
  background:
    'radial-gradient(60% 50% at 18% 8%, rgba(255,42,109,.32), transparent 65%),' +
    'radial-gradient(50% 45% at 82% 16%, rgba(0,229,255,.20), transparent 65%),' +
    'radial-gradient(55% 50% at 50% 55%, rgba(176,38,255,.16), transparent 65%),' +
    '#08040f',
}

export default function AuroraCanvas({ variant = 'full', className, style }: {
  variant?: 'full' | 'static'
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const failedRef = useRef(false)

  useEffect(() => {
    if (variant === 'static') return
    const cv = ref.current
    const gl = cv?.getContext('webgl', { antialias: false, depth: false, stencil: false, powerPreference: 'low-power' })
    if (!cv || !gl) { failedRef.current = true; return }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { failedRef.current = true; return }
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uR = gl.getUniformLocation(prog, 'r'), uT = gl.getUniformLocation(prog, 't')

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.round(cv.clientWidth * dpr), h = Math.round(cv.clientHeight * dpr)
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h) }
    }
    const draw = (t: number) => {
      fit()
      gl.uniform2f(uR, cv.width, cv.height)
      gl.uniform1f(uT, t)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    if (reduced) { draw(12); return }

    let visible = true, raf = 0
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting })
    io.observe(cv)
    const t0 = performance.now()
    const frame = (now: number) => {
      if (visible && !document.hidden) draw((now - t0) / 1000)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [variant])

  if (variant === 'static') {
    return <div aria-hidden="true" className={className} style={{ ...CSS_FALLBACK, ...style }} />
  }
  return (
    <canvas ref={ref} aria-hidden="true" className={className}
      style={{ ...(failedRef.current ? CSS_FALLBACK : null), ...style }} />
  )
}
