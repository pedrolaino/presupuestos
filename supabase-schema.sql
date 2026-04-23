-- ============================================================
-- SCHEMA para la app de presupuestos
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- Habilitar extensión para UUIDs
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLA: profiles
-- ============================================================
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  business_name text not null default '',
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  phone text,
  address text,
  cuit text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = user_id);

-- Trigger para crear perfil vacío al registrarse
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (user_id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- TABLA: clients
-- ============================================================
create table clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

-- RLS
alter table clients enable row level security;

create policy "Users can manage own clients"
  on clients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- TABLA: quotes
-- ============================================================
create table quotes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  quote_number integer not null,
  client_id uuid references clients(id) on delete set null,
  client_name text not null,
  client_email text,
  client_phone text,
  status text not null default 'borrador' check (status in ('borrador', 'enviado', 'aprobado', 'rechazado')),
  notes text,
  discount_type text check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(12,2),
  subtotal numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, quote_number)
);

-- RLS
alter table quotes enable row level security;

create policy "Users can manage own quotes"
  on quotes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- TABLA: quote_items
-- ============================================================
create table quote_items (
  id uuid primary key default uuid_generate_v4(),
  quote_id uuid references quotes(id) on delete cascade not null,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  sort_order integer not null default 0
);

-- RLS
alter table quote_items enable row level security;

create policy "Users can manage own quote items"
  on quote_items for all
  using (
    exists (
      select 1 from quotes
      where quotes.id = quote_items.quote_id
      and quotes.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from quotes
      where quotes.id = quote_items.quote_id
      and quotes.user_id = auth.uid()
    )
  );

-- ============================================================
-- STORAGE: bucket para logos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict do nothing;

create policy "Authenticated users can upload their logo"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Authenticated users can update their logo"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Authenticated users can delete their logo"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Logos are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'logos');

-- ============================================================
-- FUNCIÓN: obtener próximo número de presupuesto
-- Usa auth.uid() internamente para evitar que un cliente
-- pase el UUID de otro usuario.
-- ============================================================
create or replace function get_next_quote_number()
returns integer as $$
declare
  next_num integer;
begin
  select coalesce(max(quote_number), 0) + 1
  into next_num
  from quotes
  where user_id = auth.uid();
  return next_num;
end;
$$ language plpgsql security definer;

grant execute on function get_next_quote_number() to authenticated;
