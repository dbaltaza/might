// «Escolhe o teu artista» (como o ecrã de 2015 «Choose your designer»): cada figura mantém o estilo de um só artista.
// Arte do kit MighT (CASE ASSETS 05). 'palavras' = figura gerada a partir das 3 palavras (figura/index.js).
const obra = (id, nome) => ({ id: 'obra-' + id, nome, src: `/assets/artistas/obra-${id}.webp`, tipo: 'obra' })
const avatar = (n) => ({ id: 'avatar-' + n, nome: 'Série ' + Number(n), src: `/assets/artistas/avatar-${n}.webp`, tipo: 'avatar' })

export const ARTISTAS = [
  { id: 'palavras', nome: 'As tuas palavras', tipo: 'palavras' },
  obra('diogo-machado', 'Diogo Machado'),
  obra('pop-art', 'Pop Art'),
  obra('retro-mandala', 'Retro Mandala'),
  obra('mystic-pink', 'Mystic Pink'),
  obra('surf', 'Surf'),
  obra('modrian', 'Mondrian'),
  obra('air-force', 'Air Force'),
  obra('matrioska', 'Matrioska'),
  obra('art-deco', 'Art Deco'),
  obra('hippie', 'Hippie'),
  ...['01', '02', '03', '04', '05', '06', '07', '08', '09'].map(avatar),
]

export const artista = (id) => ARTISTAS.find((a) => a.id === id) ?? ARTISTAS[0]
