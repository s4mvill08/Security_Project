
create extension if not exists pgcrypto;

create table public.analysts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role text not null default 'Analista SOC',
  created_at timestamptz not null default now()
);

create table public.analyst_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now()
);

create sequence public.incident_code_sequence start with 1001;

create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default (
    'INC-' || to_char(now() at time zone 'UTC', 'YYYY') || '-' ||
    lpad(nextval('public.incident_code_sequence')::text, 4, '0')
  ),
  title text not null check (char_length(title) between 1 and 160),
  description text not null check (char_length(description) between 1 and 2000),
  severity text not null check (severity in ('critica', 'alta', 'media', 'baja')),
  status text not null default 'abierto'
    check (status in ('abierto', 'en_progreso', 'contenido', 'resuelto')),
  problem_category text check (problem_category is null or problem_category in (
    'phishing', 'malware', 'acceso_no_autorizado', 'fuga_datos', 'disponibilidad', 'otro'
  )),
  diagnosis text check (diagnosis is null or char_length(diagnosis) <= 2000),
  source text check (source is null or char_length(source) <= 100),
  owner_user_id uuid references auth.users(id) on delete cascade,
  assigned_analyst_id uuid references public.analysts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.incident_updates (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.incidents(id) on delete cascade,
  event_type text not null check (event_type in ('creado', 'actualizado', 'nota', 'diagnostico')),
  message text not null check (char_length(message) between 1 and 1000),
  performed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index incidents_status_idx on public.incidents(status);
create index incidents_severity_idx on public.incidents(severity);
create index incidents_assigned_analyst_idx on public.incidents(assigned_analyst_id);
create index incidents_owner_user_idx on public.incidents(owner_user_id);
create index incident_updates_incident_created_idx on public.incident_updates(incident_id, created_at);
grant usage on sequence public.incident_code_sequence to authenticated;

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

create trigger incidents_guard_update
before update on public.incidents
for each row execute function public.guard_incident_update();

-- Mantiene updated_at actualizado cuando se edita un incidente.
create or replace function public.set_incident_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_incident_updated_at() is
  'Actualiza la fecha de modificación del incidente antes de cada UPDATE.';

create trigger incidents_set_updated_at
before update on public.incidents
for each row execute function public.set_incident_updated_at();

alter table public.analysts enable row level security;
alter table public.analyst_access enable row level security;
alter table public.incidents enable row level security;
alter table public.incident_updates enable row level security;

revoke all on public.analysts from public, anon, authenticated;
revoke all on public.analyst_access from public, anon, authenticated;
revoke all on public.incidents from public, anon, authenticated;
revoke all on public.incident_updates from public, anon, authenticated;

grant select on public.analysts to authenticated;
grant select on public.analyst_access to authenticated;
grant select, delete on public.incidents to authenticated;
grant insert (title, description, severity, source, owner_user_id) on public.incidents to authenticated;
grant update (title, description, severity, source, status, assigned_analyst_id, problem_category, diagnosis)
  on public.incidents to authenticated;
grant select on public.incident_updates to authenticated;
grant insert (incident_id, event_type, message, performed_by)
  on public.incident_updates to authenticated;

create policy "Analysts are readable by signed-in users"
  on public.analysts for select to authenticated
  using (true);

create policy "Users can read their own analyst access"
  on public.analyst_access for select to authenticated
  using (user_id = (select auth.uid()));

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

-- Analistas de ejemplo: no son cuentas de inicio de sesión.
insert into public.analysts (id, name, email, role) values
  ('10000000-0000-4000-8000-000000000001', 'Ana Torres', 'ana.torres@example.com', 'Líder SOC'),
  ('10000000-0000-4000-8000-000000000002', 'Bruno Vega', 'bruno.vega@example.com', 'Analista L2'),
  ('10000000-0000-4000-8000-000000000003', 'Carla Ruiz', 'carla.ruiz@example.com', 'Analista L1'),
  ('10000000-0000-4000-8000-000000000004', 'Diego Luna', 'diego.luna@example.com', 'Analista L2'),
  ('10000000-0000-4000-8000-000000000005', 'Elena Soto', 'elena.soto@example.com', 'Analista L1'),
  ('10000000-0000-4000-8000-000000000006', 'Fabio Cruz', 'fabio.cruz@example.com', 'Analista L2'),
  ('10000000-0000-4000-8000-000000000007', 'Gabriela León', 'gabriela.leon@example.com', 'Analista L1'),
  ('10000000-0000-4000-8000-000000000008', 'Hugo Díaz', 'hugo.diaz@example.com', 'Analista L2'),
  ('10000000-0000-4000-8000-000000000009', 'Inés Mora', 'ines.mora@example.com', 'Analista L1'),
  ('10000000-0000-4000-8000-000000000010', 'Javier Paredes', 'javier.paredes@example.com', 'Analista L2');

-- Diez incidentes de ejemplo para probar búsquedas, filtros y operaciones CRUD.
insert into public.incidents
  (id, code, title, description, severity, status, source, assigned_analyst_id, created_at) values
  ('20000000-0000-4000-8000-000000000001', 'INC-2026-0001', 'Inicio de sesión inusual', 'Acceso desde una ubicación no habitual detectado por el sistema de identidad.', 'alta', 'en_progreso', 'SIEM', '10000000-0000-4000-8000-000000000001', now() - interval '1 day'),
  ('20000000-0000-4000-8000-000000000002', 'INC-2026-0002', 'Correo sospechoso reportado', 'Un usuario reportó un correo con un enlace inesperado.', 'media', 'abierto', 'Usuario', '10000000-0000-4000-8000-000000000003', now() - interval '2 days'),
  ('20000000-0000-4000-8000-000000000003', 'INC-2026-0003', 'Equipo sin actualizaciones', 'Un equipo de pruebas no ha recibido actualizaciones recientes.', 'baja', 'resuelto', 'EDR', '10000000-0000-4000-8000-000000000005', now() - interval '3 days'),
  ('20000000-0000-4000-8000-000000000004', 'INC-2026-0004', 'Alerta de tráfico elevado', 'El monitoreo registró un aumento inusual de solicitudes.', 'alta', 'contenido', 'Firewall', '10000000-0000-4000-8000-000000000002', now() - interval '4 days'),
  ('20000000-0000-4000-8000-000000000005', 'INC-2026-0005', 'Cuenta bloqueada repetidamente', 'Se observaron varios bloqueos de una cuenta de servicio.', 'media', 'en_progreso', 'SIEM', '10000000-0000-4000-8000-000000000004', now() - interval '5 days'),
  ('20000000-0000-4000-8000-000000000006', 'INC-2026-0006', 'Archivo marcado para revisión', 'El antivirus puso un archivo en cuarentena para análisis.', 'critica', 'abierto', 'EDR', '10000000-0000-4000-8000-000000000006', now() - interval '6 days'),
  ('20000000-0000-4000-8000-000000000007', 'INC-2026-0007', 'Certificado próximo a vencer', 'Se notificó que un certificado interno debe renovarse pronto.', 'baja', 'abierto', 'Monitoreo', '10000000-0000-4000-8000-000000000007', now() - interval '7 days'),
  ('20000000-0000-4000-8000-000000000008', 'INC-2026-0008', 'Cambio de permisos pendiente', 'Una revisión encontró un cambio de permisos que requiere validación.', 'media', 'contenido', 'Auditoría', '10000000-0000-4000-8000-000000000008', now() - interval '8 days'),
  ('20000000-0000-4000-8000-000000000009', 'INC-2026-0009', 'Servicio interno no disponible', 'Una alerta de disponibilidad reportó una interrupción temporal.', 'alta', 'resuelto', 'Monitoreo', '10000000-0000-4000-8000-000000000009', now() - interval '9 days'),
  ('20000000-0000-4000-8000-000000000010', 'INC-2026-0010', 'Revisión de regla de firewall', 'Se solicita revisar una regla que ya no parece necesaria.', 'baja', 'abierto', 'Solicitud interna', '10000000-0000-4000-8000-000000000010', now() - interval '10 days');

-- Diez eventos vinculados a los incidentes de ejemplo.
insert into public.incident_updates (incident_id, event_type, message, created_at) values
  ('20000000-0000-4000-8000-000000000001', 'creado', 'Incidente de ejemplo registrado para revisión.', now() - interval '1 day'),
  ('20000000-0000-4000-8000-000000000002', 'creado', 'Se recibió el reporte del usuario.', now() - interval '2 days'),
  ('20000000-0000-4000-8000-000000000003', 'actualizado', 'Se verificó la instalación de las actualizaciones.', now() - interval '3 days'),
  ('20000000-0000-4000-8000-000000000004', 'actualizado', 'Se aplicaron controles temporales mientras se revisa el tráfico.', now() - interval '4 days'),
  ('20000000-0000-4000-8000-000000000005', 'nota', 'Contactar al responsable de la cuenta para confirmar el uso.', now() - interval '5 days'),
  ('20000000-0000-4000-8000-000000000006', 'creado', 'El archivo quedó en cuarentena para revisión.', now() - interval '6 days'),
  ('20000000-0000-4000-8000-000000000007', 'nota', 'Programar la renovación antes de la fecha de vencimiento.', now() - interval '7 days'),
  ('20000000-0000-4000-8000-000000000008', 'actualizado', 'El equipo responsable está validando el cambio.', now() - interval '8 days'),
  ('20000000-0000-4000-8000-000000000009', 'actualizado', 'El servicio volvió a estar disponible.', now() - interval '9 days'),
  ('20000000-0000-4000-8000-000000000010', 'creado', 'Pendiente de aprobación del responsable de red.', now() - interval '10 days');
