// MighT logic. Plain ES module, no dependencies.
// A "pesos" object is { personalidade: {tag: peso}, poder: {...}, caracter: {...} }.
export const DIM = ['personalidade', 'poder', 'caracter'];

const aceitesDeOutros = (id, mights) =>
  mights.filter(m => m.para === id && m.de !== id && m.estado === 'aceite');

// Weight of a tag = count ÷ total in that dimension. Pass in the already-filtered MighTs.
export function pesos(mights) {
  const out = {};
  for (const d of DIM) {
    const c = {};
    for (const m of mights) c[m[d]] = (c[m[d]] || 0) + 1;
    for (const t in c) c[t] /= mights.length;
    out[d] = c;
  }
  return out;
}

// Unlocked = at least 3 accepted MighTs (the Self MighT doesn't count).
export const desbloqueado = mights =>
  mights.filter(m => m.estado === 'aceite' && m.de !== m.para).length >= 3;

// All MighT = accepted from others, optionally filtered by circle. Self MighT = de === para.
export const allMight = (id, mights, circulo) =>
  pesos(aceitesDeOutros(id, mights).filter(m => !circulo || m.circulo === circulo));
export const selfMight = (id, mights) => pesos(mights.filter(m => m.de === id && m.para === id));

// Top tag per dimension, e.g. for the Card: { personalidade: 'Calma', ... }.
export const principais = p => Object.fromEntries(DIM.map(d => [d, Object.keys(p[d]).sort((a, b) => p[d][b] - p[d][a])[0]]));

// Every person with their All MighT weights and whether they're unlocked.
export const perfis = ({ pessoas, mights }) => pessoas.map(p => ({
  ...p,
  pesos: allMight(p.id, mights),
  desbloqueado: desbloqueado(mights.filter(m => m.para === p.id)),
}));

// Overlap Σ min(pesoA, pesoB) per dimension, averaged over the 3 dimensions, as a % (0–100).
export function semelhanca(a, b) {
  let s = 0;
  for (const d of DIM) for (const t in a[d]) s += Math.min(a[d][t], b[d][t] || 0);
  return Math.round((s / DIM.length) * 100);
}

// Others sorted by similarity, with shared tags and the single biggest weight gap.
export function maisParecidos(eu, todos) {
  return todos
    .filter(o => o.id !== eu.id && o.desbloqueado)
    .map(o => {
      const comuns = [];
      let diferenca = null;
      for (const d of DIM) {
        for (const t of new Set([...Object.keys(eu.pesos[d]), ...Object.keys(o.pesos[d])])) {
          const a = eu.pesos[d][t] || 0, b = o.pesos[d][t] || 0;
          if (a && b) comuns.push(t);
          if (!diferenca || Math.abs(a - b) > diferenca.gap) diferenca = { tag: t, dimensao: d, eu: a, outro: b, gap: Math.abs(a - b) };
        }
      }
      return { pessoa: o, pct: semelhanca(eu.pesos, o.pesos), comuns, diferenca };
    })
    .sort((x, y) => y.pct - x.pct);
}

// How well a role fits a profile: sum of the profile's weights on the role's tags.
const encaixe = (funcao, p) => DIM.reduce((s, d) => s + funcao.tags.reduce((t, tag) => t + (p[d][tag] || 0), 0), 0);
const melhores = (p, funcoes) => [...funcoes].sort((a, b) => encaixe(b, p) - encaixe(a, p));
const comTags = (funcao, p) => ({ ...funcao, tagsEmComum: funcao.tags.filter(t => DIM.some(d => p[d][t])) });

// Now = best fit for you. Next = most common best fit among your 3 closest people.
// Challenge = best fit for your closest person among roles you don't already have.
export function funcoesIdeais(eu, todos, funcoes) {
  const parecidos = maisParecidos(eu, todos).slice(0, 3);
  const minhas = melhores(eu.pesos, funcoes);
  const agora = minhas[0];
  const comoTu = parecidos.map(x => ({ nome: x.pessoa.nome, pct: x.pct, funcao: melhores(x.pessoa.pesos, funcoes)[0].funcao }));
  const conta = {};
  for (const c of comoTu) if (c.funcao !== agora.funcao) conta[c.funcao] = (conta[c.funcao] || 0) + 1;
  const topo = Object.keys(conta).sort((a, b) => conta[b] - conta[a])[0];
  const proximo = funcoes.find(f => f.funcao === topo) || minhas[1];
  const usadas = [agora.funcao, proximo.funcao];
  const desafio = (parecidos[0] ? melhores(parecidos[0].pessoa.pesos, funcoes) : minhas.slice().reverse())
    .find(f => !usadas.includes(f.funcao));
  return { agora: comTags(agora, eu.pesos), proximo: comTags(proximo, eu.pesos), desafio: comTags(desafio, eu.pesos), comoTu };
}
