-- docs/standards/18-logowanie.md — profil 1:1 z auth.users. Puste dziś poza id/created_at;
-- pole tier (freemium, rozdz. 12) dołączy tu, gdy projekt zdecyduje się na wdrożenie freemium
-- (patrz docs/lista-do-zrobienia.md) — nie dodawaj go teraz spekulacyjnie.
--
-- Uruchom w Supabase Dashboard → SQL Editor (albo `supabase db push`, jeśli używasz Supabase CLI).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 18.8: prawdziwy DELETE z ON DELETE CASCADE (wyżej) — usunięcie auth.users usuwa profil,
-- nie tombstone.

create policy "Użytkownik widzi tylko swój profil"
  on public.profiles for select
  using (auth.uid () = id);

create policy "Użytkownik edytuje tylko swój profil"
  on public.profiles for update
  using (auth.uid () = id);

-- Automatyczne założenie profilu przy pierwszej rejestracji (magic link/Google/Apple) —
-- bez tego triggera zalogowany użytkownik istniałby w auth.users, ale nie w public.profiles.
create function public.handle_new_user () returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users for each row
execute function public.handle_new_user ();
