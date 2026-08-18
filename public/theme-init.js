/* Aplica o tema salvo antes do render (evita flash). Externo por causa da CSP. */
try {
  var t = localStorage.getItem('nm_theme');
  document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
} catch (e) { /* noop */ }
