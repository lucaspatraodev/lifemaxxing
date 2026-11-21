-- Lifemaxxing · esquema do banco (rode uma vez no SQL Editor do Supabase)
-- O app guarda o estado inteiro em uma linha (jsonb). Só as funções da Vercel
-- acessam, com a chave secreta. A RLS fica ligada e sem políticas: a chave
-- pública (anon) não lê nem escreve nada.

create table if not exists public.estado (
  id            text primary key,
  dados         jsonb not null,
  versao        integer not null default 1,
  atualizado_em timestamptz not null default now()
);
alter table public.estado enable row level security;

-- Cópias automáticas: a cada gravação, a versão anterior vai para cá.
create table if not exists public.estado_backup (
  id            bigint generated always as identity primary key,
  estado_id     text not null,
  dados         jsonb not null,
  versao        integer not null,
  salvo_em      timestamptz not null default now()
);
alter table public.estado_backup enable row level security;
create index if not exists estado_backup_salvo_em on public.estado_backup (salvo_em desc);

create or replace function public.guardar_backup() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.estado_backup (estado_id, dados, versao) values (old.id, old.dados, old.versao);
  -- mantém só as 200 cópias mais recentes
  delete from public.estado_backup
   where id in (select id from public.estado_backup order by id desc offset 200);
  return new;
end $$;

drop trigger if exists estado_backup_trg on public.estado;
create trigger estado_backup_trg before update on public.estado
  for each row execute function public.guardar_backup();

-- Permissões explícitas: só a chave secreta (service_role) usa as tabelas.
-- Funciona mesmo com "Grant API access to new tables automatically" desligado.
grant usage on schema public to service_role;
grant select, insert, update, delete on public.estado to service_role;
grant select, insert, update, delete on public.estado_backup to service_role;
grant usage, select on all sequences in schema public to service_role;
revoke all on public.estado, public.estado_backup from anon, authenticated;

-- Para voltar a uma cópia (troque o número):
-- update public.estado set dados = (select dados from public.estado_backup where id = 123), versao = versao + 1 where id = 'principal';
