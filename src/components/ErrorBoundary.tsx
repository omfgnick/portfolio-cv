import { Component, type ErrorInfo, type ReactNode } from 'react'

/** Impede que um erro em qualquer componente deixe a página inteira em branco. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('UI error:', error, info.componentStack) }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center',
          background: '#04110d', color: '#e6fff5', fontFamily: 'ui-monospace, monospace',
        }}>
          <div style={{ maxWidth: 460 }}>
            <div style={{ fontSize: 40, color: '#35f0b0', fontWeight: 800 }}>× ERR</div>
            <h1 style={{ fontSize: 18, margin: '10px 0 8px' }}>Algo quebrou nesta sessão.</h1>
            <p style={{ opacity: 0.7, fontSize: 13, lineHeight: 1.6 }}>
              Um erro inesperado interrompeu a renderização. Recarregue a página para tentar de novo.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                marginTop: 18, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                color: '#04121a', background: 'linear-gradient(135deg,#35f0b0,#22e0c8)', border: 0, padding: '11px 18px',
              }}
            >
              Recarregar / Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
