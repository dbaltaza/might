// Mostra a figura de uma pessoa: a obra do artista numa moldura (tem fundo) ou a figura das palavras solta.
export default function FiguraVista({ fig, alt = '', className = '', credito = true }) {
  return (
    <div className={'figura ' + className}>
      {fig.moldura
        ? <div className="moldura"><img src={fig.src} alt={alt} /></div>
        : <img src={fig.src} alt={alt} />}
      {credito && fig.artista && <p className="credito">Arte: {fig.artista}</p>}
    </div>
  )
}
