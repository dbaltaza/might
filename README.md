# MighT · MVP mobile

Três palavras de quem te conhece constroem a tua figura MighT e mostram-te funções e carreiras que encaixam em ti.

## Jornada (sem becos sem saída)
1. **Cria o teu MighT**: uma tag para Personalidade (cabeça), Poder (braço) e Carácter (mão) → figura + tagline. Menos de 2 min.
2. **Envia e pede MighTs**: uma pessoa, um círculo, 3 tags. Pedir só depois de enviar (link de convite, sem conta).
3. **Desbloqueia o perfil**: com 3 MighTs aceites vês o All MighT. Filtrar por círculo, comparar com o Self MighT.
4. **MighT Card**: PNG em retrato ou formato LinkedIn.
5. **Pessoas como tu**: ordenadas por % de semelhança, tags em comum e maior diferença.
6. **Funções ideais**: percurso Agora → Próximo → Desafio, com uma linha «porque encaixa em ti» (só hipóteses).

## Regras de cálculo
- **Desbloqueio:** 3 MighTs aceites.
- **Peso** de uma tag = contagem ÷ total de tags nessa dimensão.
- **Semelhança** = % de peso sobreposto: Σ min(peso A, peso B), média das 3 dimensões.

## Regras do desafio
- Dados fictícios por defeito; MighTs reais só com opt-in e apenas o primeiro nome.
- Nenhum MighT fica público sem consentimento.
- Cada figura mantém o estilo de um só artista.
- Simulado: login, emails de convite, LinkedIn.

## Estrutura
```
frontend/   ecrãs e navegação           (Dinis)
db/         esquema e dados             (Dinis)
logica/     tags, dados fictícios, pesos, semelhança, funções   (Parte A)
card/       MighT Card PNG              (Parte B)
demo/       guião da demo e debrief     (Parte B)
figura/     o boneco + tagline          (Parte C)
```
Divisão e prazos em [TAREFAS.md](TAREFAS.md).
