-- MighT · esquema Supabase (colar no SQL Editor do projeto)
-- Dados de demo, fictícios. Sem login: o id da pessoa fica no localStorage do telemóvel.

create table if not exists pessoas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,                      -- só primeiro nome
  tagline text,
  artista text,                            -- estilo escolhido (src/artistas.js); null = figura das palavras
  publico boolean not null default false,  -- nenhum MighT fica público sem consentimento
  criado_em timestamptz not null default now()
);

create table if not exists mights (
  id uuid primary key default gen_random_uuid(),
  de_id uuid references pessoas(id),        -- null se quem envia não tem conta (link de convite)
  de_nome text,                             -- primeiro nome de quem envia
  para_id uuid not null references pessoas(id) on delete cascade,
  circulo text not null check (circulo in ('Família','Amigos','Colegas','Escola','Comunidade','Clientes','Self')),
  personalidade text not null,
  poder text not null,
  caracter text not null,
  estado text not null default 'pendente' check (estado in ('pendente','aceite','recusado')),
  criado_em timestamptz not null default now()
);
create index if not exists mights_para on mights(para_id);
create index if not exists mights_de on mights(de_id);

-- RLS: aberto para a demo (anon pode ler, criar e mudar o estado). Não usar em produção.
alter table pessoas enable row level security;
alter table mights enable row level security;
create policy "demo ler pessoas" on pessoas for select to anon using (true);
create policy "demo criar pessoas" on pessoas for insert to anon with check (true);
create policy "demo editar pessoas" on pessoas for update to anon using (true);
create policy "demo ler mights" on mights for select to anon using (true);
create policy "demo criar mights" on mights for insert to anon with check (true);
create policy "demo responder mights" on mights for update to anon using (true);

grant select, insert, update on pessoas, mights to anon;

-- Tempo real: a caixa do apresentador recebe os MighTs da sala sem recarregar.
alter publication supabase_realtime add table mights;
