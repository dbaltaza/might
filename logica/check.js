// Run: node logica/check.js
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { DIM, pesos, desbloqueado, semelhanca, perfis, maisParecidos, funcoesIdeais, allMight, selfMight } from './logica.js';

const ler = f => JSON.parse(readFileSync(new URL(f, import.meta.url)));
const tags = ler('./tags.json'), dados = ler('./dados.json'), { funcoes } = ler('./funcoes.json');

// Content
assert.deepEqual(DIM.map(d => tags[d].length), [19, 25, 17]);
const todas = new Set(DIM.flatMap(d => tags[d].map(t => t.tag)));
for (const f of funcoes) for (const t of f.tags) assert(todas.has(t), `funcoes.json: tag desconhecida ${t}`);
const ids = new Set(dados.pessoas.map(p => p.id));
for (const m of dados.mights) {
  assert(ids.has(m.de) && ids.has(m.para), `${m.id}: pessoa desconhecida`);
  for (const d of DIM) assert(tags[d].some(t => t.tag === m[d]), `${m.id}: tag ${m[d]} não está em ${d}`);
}

// pesos + desbloqueado
const m = (de, para, p, po, c, estado = 'aceite') => ({ de, para, personalidade: p, poder: po, caracter: c, estado });
const ms = [m('a', 'x', 'Calma', 'Escuta', 'Bondade'), m('b', 'x', 'Calma', 'Ensino', 'Bondade'), m('x', 'x', 'Foco', 'Escuta', 'Coragem')];
assert.deepEqual(pesos(ms.slice(0, 2)).poder, { Escuta: 0.5, Ensino: 0.5 });
assert.equal(desbloqueado(ms), false, 'Self MighT does not count');
assert.equal(desbloqueado([...ms, m('c', 'x', 'Calma', 'Escuta', 'Bondade')]), true);
assert.equal(desbloqueado([...ms, m('c', 'x', 'Calma', 'Escuta', 'Bondade', 'pendente')]), false);
assert.deepEqual(selfMight('x', ms).personalidade, { Foco: 1 });

// semelhanca
const A = allMight('x', ms);
assert.equal(semelhanca(A, A), 100);
assert.equal(semelhanca(A, selfMight('x', ms)), 17); // poder overlaps 0.5, others 0 → 0.5/3

// On the real data
const ps = perfis(dados);
const rita = ps.find(p => p.nome === 'Rita');
assert.equal(rita.desbloqueado, false, 'Rita needs 1 live MighT in the demo');
const eu = ps.find(p => p.desbloqueado);
const top = maisParecidos(eu, ps);
assert(top.length && top[0].pct >= top.at(-1).pct);
const f = funcoesIdeais(eu, ps, funcoes);
assert(f.agora && f.proximo && f.desafio);
assert.equal(new Set([f.agora.funcao, f.proximo.funcao, f.desafio.funcao]).size, 3);

console.log(`ok · ${ps.filter(p => p.desbloqueado).length}/${ps.length} unlocked`);
console.log(`${eu.nome}: closest ${top[0].pessoa.nome} ${top[0].pct}%, shared ${top[0].comuns.join(', ')}, gap ${top[0].diferenca.tag}`);
console.log(`Now ${f.agora.funcao} → Next ${f.proximo.funcao} → Challenge ${f.desafio.funcao}`);
