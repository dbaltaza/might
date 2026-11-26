# Debrief (2 min) — como nos organizámos

Sobre o quê, nunca sobre quem. Preencher **durante** o sprint (nos check-ins), não no fim.

## O que esperávamos (minuto 0–20)
- Abordagem: …
- Divisão: front end + BD (Dinis) · A lógica · B Card e demo · C figura · contrato de dados comum
  no TAREFAS.md, para trabalharmos em paralelo sem esperar uns pelos outros.
- Check-ins aos 30 · 40 · 50 · 60; código congelado aos 65.

## O que aconteceu de facto
| Check-in | Onde estávamos | Bloqueio | Decisão |
|---|---|---|---|
| 30 | | | |
| 40 | | | |
| 50 | | | |
| 60 | | | |

## O que faríamos diferente
- …

## Porquê uma base de dados real (Supabase)
- A demo vive de MighTs enviados pela sala, por QR, para o telemóvel do apresentador. Isso pede
  um servidor partilhado; o localStorage só chega para um dispositivo (fica como plano B, mesma API em `src/db.js`).
- Dados mínimos: só primeiro nome e 3 palavras, com opt-in explícito antes de enviar.
- A chave pública só consegue criar linhas. Ler e responder passa por funções que pedem o id da pessoa,
  que só o telemóvel dela tem (`db/schema.sql`). Sem login, por isso não é para produção: aí entraria a auth do Supabase.
