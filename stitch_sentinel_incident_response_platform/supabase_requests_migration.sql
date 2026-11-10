-- Ejecuta este archivo una vez en un proyecto que ya tenga aplicada supabase.sql.
create table if not exists public.analyst_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now()
);

alter table public.incidents
  add column if not exists owner_user_id uuid references auth.users(id) on delete cascade;
alter table public.incidents
  add column if not exists problem_category text
    check (problem_category is null or problem_category in (
      'phishing', 'malware', 'acceso_no_autorizado', 'fuga_datos', 'disponibilidad', 'otro'
    ));
alter table public.incidents
  add column if not exists diagnosis text
    check (diagnosis is null or char_length(diagnosis) <= 2000);

create index if not exists incidents_owner_user_idx on public.incidents(owner_user_id);

alter table public.analyst_access enable row level security;
alter table public.incidents enable row level security;
alter table public.incident_updates enable row level security;

create or replace function public.is_security_analyst()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.analyst_access
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_security_analyst() from public, anon;
grant execute on function public.is_security_analyst() to authenticated;

create or replace function public.guard_incident_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('postgres', 'service_role', 'supabase_admin') then
    return new;
  end if;

  if public.is_security_analyst() then
    if new.owner_user_id is distinct from old.owner_user_id
      or new.title is distinct from old.title
      or new.description is distinct from old.description
      or new.source is distinct from old.source then
      raise exception 'El equipo de ciberseguridad no puede modificar los datos originales del reporte.';
    end if;
  elsif old.owner_user_id = (select auth.uid()) then
    if new.status is distinct from old.status
      or new.assigned_analyst_id is distinct from old.assigned_analyst_id
      or new.problem_category is distinct from old.problem_category
      or new.diagnosis is distinct from old.diagnosis then
      raise exception 'Solo el equipo de ciberseguridad puede actualizar el diagnóstico y estado.';
    end if;
  else
    raise exception 'No tienes permiso para modificar esta solicitud.';
  end if;
  return new;
end;
$$;

revoke all on function public.guard_incident_update() from public, anon, authenticated;

drop trigger if exists incidents_guard_update on public.incidents;
create trigger incidents_guard_update
before update on public.incidents
for each row execute function public.guard_incident_update();

revoke all on public.incidents from public, anon, authenticated;
revoke all on public.analyst_access from public, anon, authenticated;
revoke all on public.incident_updates from public, anon, authenticated;

grant select on public.analyst_access to authenticated;
grant select, delete on public.incidents to authenticated;
grant insert (title, description, severity, source, owner_user_id) on public.incidents to authenticated;
grant update (title, description, severity, source, status, assigned_analyst_id, problem_category, diagnosis)
  on public.incidents to authenticated;
grant select on public.incident_updates to authenticated;
grant insert (incident_id, event_type, message, performed_by)
  on public.incident_updates to authenticated;

drop policy if exists "Users can read their own analyst access" on public.analyst_access;
create policy "Users can read their own analyst access"
  on public.analyst_access for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Signed-in users can read incidents" on public.incidents;
drop policy if exists "Signed-in users can create incidents" on public.incidents;
drop policy if exists "Signed-in users can update incidents" on public.incidents;
drop policy if exists "Authorized analysts can update incident diagnosis" on public.incidents;
drop policy if exists "Signed-in users can delete incidents" on public.incidents;

create policy "Signed-in users can read incidents"
  on public.incidents for select to authenticated
  using (owner_user_id = (select auth.uid()) or (select public.is_security_analyst()));

create policy "Signed-in users can create incidents"
  on public.incidents for insert to authenticated
  with check (owner_user_id = (select auth.uid()));

create policy "Signed-in users can update incidents"
  on public.incidents for update to authenticated
  using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));

create policy "Authorized analysts can update incident diagnosis"
  on public.incidents for update to authenticated
  using ((select public.is_security_analyst()))
  with check ((select public.is_security_analyst()));

create policy "Signed-in users can delete incidents"
  on public.incidents for delete to authenticated
  using (owner_user_id = (select auth.uid()));

drop policy if exists "Signed-in users can read incident history" on public.incident_updates;
drop policy if exists "Signed-in users can add incident history" on public.incident_updates;
drop policy if exists "Authorized analysts can add incident history" on public.incident_updates;

alter table public.incident_updates
  drop constraint if exists incident_updates_event_type_check;
alter table public.incident_updates
  add constraint incident_updates_event_type_check
  check (event_type in ('creado', 'actualizado', 'nota', 'diagnostico'));

create policy "Signed-in users can read incident history"
  on public.incident_updates for select to authenticated
  using (exists (
    select 1 from public.incidents
    where incidents.id = incident_updates.incident_id
      and (
        incidents.owner_user_id = (select auth.uid())
        or (select public.is_security_analyst())
      )
  ));

create policy "Authorized analysts can add incident history"
  on public.incident_updates for insert to authenticated
  with check (
    performed_by = (select auth.uid())
    and (select public.is_security_analyst())
  );
