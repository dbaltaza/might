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

-- RLS: a anon key só pode criar linhas. Ler e mudar passa por funções que pedem o uuid
-- da pessoa (só o telemóvel dela o tem). Quem tem a chave pública já não lista a tabela toda.
-- Idempotente: pode colar-se outra vez por cima de um projeto já criado.
alter table pessoas enable row level security;
alter table mights enable row level security;
drop policy if exists "demo ler pessoas" on pessoas;
drop policy if exists "demo editar pessoas" on pessoas;
drop policy if exists "demo ler mights" on mights;
drop policy if exists "demo responder mights" on mights;
drop policy if exists "demo criar pessoas" on pessoas;
drop policy if exists "demo criar mights" on mights;
create policy "demo criar pessoas" on pessoas for insert to anon with check (true);
create policy "demo criar mights" on mights for insert to anon with check (true);
revoke select, update, delete on pessoas, mights from anon;
grant insert on pessoas, mights to anon;

create or replace function ler_pessoa(p uuid) returns setof pessoas
  language sql security definer set search_path = public as $$ select * from pessoas where id = p $$;

create or replace function mights_para(p uuid) returns setof mights
  language sql security definer set search_path = public as $$ select * from mights where para_id = p order by criado_em $$;

-- Só quem recebeu o MighT (para_id) o pode aceitar ou recusar.
create or replace function responder_might(m uuid, eu uuid, novo text) returns void
  language sql security definer set search_path = public as $$ update mights set estado = novo where id = m and para_id = eu $$;

-- null = não mexer nesse campo
create or replace function editar_pessoa(p uuid, novo_artista text default null, novo_publico boolean default null) returns void
  language sql security definer set search_path = public as $$
  update pessoas set artista = coalesce(novo_artista, artista), publico = coalesce(novo_publico, publico) where id = p $$;

grant execute on function ler_pessoa, mights_para, responder_might, editar_pessoa to anon;
-- ponytail: sem tempo real (precisa de SELECT na tabela); a caixa consulta de 3 em 3 s. Auth anónima do Supabase se for preciso mais.
