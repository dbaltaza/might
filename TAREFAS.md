# Tarefas

Check-in de 2 min aos minutos **30 · 40 · 50 · 60**: onde estás, o que te bloqueia, o que construímos ainda bate certo com a demo?
Minuto **60**: primeira volta completa, sem mexer no código. Minuto **65**: código congelado.

## Contrato de dados (todos usam isto)
```js
pessoa = { id, nome /* só primeiro nome */, circulo }
might  = { id, de /* pessoa.id */, para /* pessoa.id */, circulo,
           personalidade, poder, caracter /* tags */, estado /* "pendente" | "aceite" | "recusado" */ }
// circulo: "Família" | "Amigos" | "Colegas" | "Escola" | "Comunidade" | "Clientes"
// Self MighT = might com de === para
```

## Dinis: front end + base de dados (`src/`, `db/`) · ecrãs 1–6 feitos; falta ligar o Supabase
- Testes: `npm test` (26). Reset dos dados deste browser: abrir `#/reset`.
- Ecrãs 1–6 e a navegação entre eles, mobile first.
- Esquema e dados com o contrato acima; aceitar e recusar MighTs.
- **Pronto (min 40):** passos 1–4 têm um ecrã cada a funcionar.
- **Pronto (min 60):** caminho 1 → 6 sem becos sem saída.

## Parte A: lógica e conteúdo (`logica/`)
- `tags.json`: biblioteca de tags com tagline PT. Personalidade (19), Poder (27), Carácter (15) · já em `logica/tags.json`.
- `dados.json`: ~30 pessoas e ~90 MighTs fictícios, só primeiros nomes, vários círculos.
- Funções (JS sem dependências):
  - `pesos(mights)` → por dimensão, contagem ÷ total.
  - `desbloqueado(mights)` → ≥ 3 aceites.
  - `semelhanca(a, b)` → média das 3 dimensões de Σ min(peso A, peso B), em %.
  - `maisParecidos(eu, todos)` → ordenados por %, com tags em comum e a maior diferença.
  - `funcoesIdeais(eu)` → funções de pessoas como tu + percurso Agora → Próximo → Desafio.
- `funcoes.json`: tabela tag → função (~10 funções), com a frase «porque encaixa em ti». Marcar como hipótese.
- **Pronto (min 40):** `tags.json`, `dados.json`, `pesos` e `desbloqueado`.
- **Pronto (min 60):** semelhança e funções ligadas aos ecrãs 5 e 6.

## Parte B: MighT Card e demo (`card/`, `demo/`)
- MighT Card PNG: figura (vem da Parte C), tagline, tags principais, círculos. Retrato e formato LinkedIn. Botão de download.
- Testar como utilizador novo: cronometrar o tempo até ao 1.º MighT (meta < 2 min).
- `demo/guiao.md`: os 6 passos da demo (criar, receber 3 da sala, comparar All vs Self, descarregar o Card, pessoa mais parecida, ler a linha «porque encaixa em ti»).
- `demo/debrief.md`: 2 min sobre como nos organizámos: o que esperávamos, o que aconteceu, o que faríamos diferente (sobre o quê, nunca sobre quem).
- **Pronto (min 40):** Card com figura provisória (placeholder) descarregável.
- **Pronto (min 60):** Card com a figura final + guião ensaiado uma vez.

## Parte C: o boneco (`figura/`) · FEITO (Dinis + Claude)
- `figura(personalidade, poder, caracter)` já devolve a figura final (SVG determinístico, um só estilo, contorno de autocolante) + tagline. Testes em `testes/figura.test.js`.
- Figura MighT a partir das 3 tags: cabeça = Personalidade, braço = Poder, mão = Carácter.
- Um só estilo de artista por figura (2–3 imagens com IA chegam; não é arte de produção).
- Tagline: a da biblioteca de tags ou gerada por IA.
- Entrega uma função simples que o front end e o Card usam: `figura(personalidade, poder, caracter)` → imagem (URL ou SVG) + tagline.
- **Pronto (min 40):** figura + tagline no ecrã 1 (pode ser placeholder com cores por tag).
- **Pronto (min 60):** figura final no ecrã 1, no perfil e no Card.
