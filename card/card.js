// MighT Card: draws onto a <canvas> and downloads as PNG. No dependencies.
export const FORMATOS = { retrato: [1080, 1350], linkedin: [1200, 627] };

const cor = tag => `hsl(${([...tag].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7) >>> 0) % 360} 65% 55%)`;

// ponytail: placeholder until Part C ships figura(); swap the call site, keep this as fallback.
export const figuraProvisoria = (personalidade, poder, caracter) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260">
  <circle cx="100" cy="55" r="40" fill="${cor(personalidade)}"/>
  <rect x="68" y="102" width="64" height="100" rx="24" fill="#2b2a27"/>
  <path d="M70 125 L35 170 M88 200 L80 250 M112 200 L120 250" stroke="#2b2a27" stroke-width="16" stroke-linecap="round"/>
  <path d="M130 125 L172 92" stroke="${cor(poder)}" stroke-width="18" stroke-linecap="round"/>
  <circle cx="176" cy="86" r="15" fill="${cor(caracter)}"/>
</svg>`;

function linhas(ctx, texto, largura) {
  const out = [];
  let l = '';
  for (const p of texto.split(' ')) {
    if (l && ctx.measureText(l + ' ' + p).width > largura) { out.push(l); l = p; } else l = l ? l + ' ' + p : p;
  }
  return l ? [...out, l] : out;
}

// dados = { nome, svg, tagline, tags: {personalidade, poder, caracter}, circulos: [...] }
export async function desenharCard(canvas, dados, formato = 'retrato') {
  const [W, H] = FORMATOS[formato];
  const ret = formato === 'retrato';
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fbf6ee'; ctx.fillRect(0, 0, W, H);

  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(dados.svg);
  await img.decode();
  const [fx, fy, fw, fh] = ret ? [315, 90, 450, 585] : [60, 50, 400, 527];
  ctx.drawImage(img, fx, fy, fw, fh);

  const x = ret ? 90 : 520, w = W - x - (ret ? 90 : 60);
  let y = ret ? 770 : 120;
  ctx.fillStyle = '#1d1b16'; ctx.textBaseline = 'top';
  ctx.font = `700 ${ret ? 72 : 56}px system-ui, sans-serif`;
  ctx.fillText(dados.nome, x, y); y += ret ? 96 : 74;

  ctx.font = `italic 400 ${ret ? 42 : 32}px Georgia, serif`;
  for (const l of linhas(ctx, `«${dados.tagline}»`, w)) { ctx.fillText(l, x, y); y += ret ? 56 : 42; }
  y += ret ? 30 : 18;

  const rot = { personalidade: 'Cabeça', poder: 'Braço', caracter: 'Mão' };
  const tam = ret ? 36 : 26;
  for (const d of Object.keys(rot)) {
    ctx.fillStyle = cor(dados.tags[d]); ctx.beginPath(); ctx.arc(x + tam / 2, y + tam / 2, tam / 2.4, 0, 7); ctx.fill();
    ctx.fillStyle = '#6b6457'; ctx.font = `500 ${tam}px system-ui, sans-serif`;
    ctx.fillText(rot[d], x + tam * 1.4, y);
    ctx.fillStyle = '#1d1b16'; ctx.font = `700 ${tam}px system-ui, sans-serif`;
    ctx.fillText(dados.tags[d], x + tam * 4.6, y);
    y += tam * 1.6;
  }
  y += ret ? 20 : 10;

  ctx.font = `500 ${ret ? 28 : 22}px system-ui, sans-serif`;
  let cx = x;
  for (const c of dados.circulos) {
    const cw = ctx.measureText(c).width + 36, ch = ret ? 50 : 40;
    if (cx + cw > x + w) { cx = x; y += ch + 12; }
    ctx.strokeStyle = '#1d1b16'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(cx, y, cw, ch, ch / 2); ctx.stroke();
    ctx.fillStyle = '#1d1b16'; ctx.fillText(c, cx + 18, y + (ch - (ret ? 28 : 22)) / 2);
    cx += cw + 12;
  }

  ctx.font = `800 ${ret ? 34 : 26}px system-ui, sans-serif`; ctx.textAlign = 'right'; ctx.fillStyle = '#1d1b16';
  ctx.fillText('MighT', W - (ret ? 60 : 40), H - (ret ? 80 : 56));
  ctx.textAlign = 'left';
}

export function descarregar(canvas, nome = 'might-card.png') {
  canvas.toBlob(b => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = nome; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, 'image/png');
}
