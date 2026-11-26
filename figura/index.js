// Parte C: o boneco. Substituam o corpo, NÃO a assinatura.
// figura(personalidade, poder, caracter) → { src, tagline }
//   src: URL de imagem ou data:URL (SVG). Um só estilo de artista por figura.
//   tagline: frase curta (da biblioteca de tags ou gerada por IA).
import { tagline as taglineDe } from '../logica/index.js'

const COR = (s) => {
  let h = 0
  for (const c of s || '') h = (h * 31 + c.charCodeAt(0)) % 360
  return `hsl(${h} 70% 55%)`
}

export function figura(personalidade, poder, caracter) {
  // STUB: boneco provisório em SVG, cabeça/corpo/braços coloridos por tag.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240">
    <rect x="45" y="105" width="110" height="110" rx="40" fill="${COR(poder)}"/>
    <rect x="18" y="120" width="30" height="80" rx="15" fill="${COR(caracter)}"/>
    <rect x="152" y="120" width="30" height="80" rx="15" fill="${COR(caracter)}"/>
    <circle cx="100" cy="70" r="62" fill="${COR(personalidade)}"/>
    <circle cx="78" cy="65" r="9" fill="#0f1a3a"/><circle cx="122" cy="65" r="9" fill="#0f1a3a"/>
  </svg>`
  return {
    src: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg),
    tagline: taglineDe('personalidade', personalidade) || 'O teu MighT',
  }
}
