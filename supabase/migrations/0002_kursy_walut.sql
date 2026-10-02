-- Trwała serwerowa kopia kursów ECB (Frankfurter) — /api/kursy. Jeden wiersz na dzień publikacji ECB
-- (historia kursów), kursy = jednostki waluty na 1 PLN. Zapis i odczyt wyłącznie z serwera kluczem
-- service role (omija RLS); RLS włączone bez polityk = przeglądarka nie ma bezpośredniego dostępu.
--
-- Uruchom w Supabase Dashboard → SQL Editor (albo `supabase db push`).

create table public.kursy_walut (
  data_ecb date primary key,
  kursy jsonb not null,
  pobrano timestamptz not null default now()
);

alter table public.kursy_walut enable row level security;
