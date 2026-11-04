-- Hardening of public.handle_new_user (0001): a SECURITY DEFINER function without a fixed search_path
-- runs with the search_path of the caller, so a schema the caller controls could shadow `public.profiles`.
-- Supabase's database linter flags this as "function_search_path_mutable". The body already qualifies
-- the table (public.profiles), so an empty search_path changes nothing else.
-- Run after 0001 (Supabase Dashboard → SQL Editor, or `supabase db push`).

create or replace function public.handle_new_user () returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = '';
