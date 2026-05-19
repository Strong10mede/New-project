create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  author text not null default 'guest@visitor',
  message text not null check (char_length(trim(message)) > 0 and char_length(message) <= 280),
  created_at timestamptz not null default now(),
  user_agent text,
  ip inet
);

alter table public.guestbook enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'guestbook'
      and policyname = 'anon can read guestbook'
  ) then
    create policy "anon can read guestbook"
    on public.guestbook
    for select
    to anon, authenticated
    using (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'guestbook'
      and policyname = 'service role can insert guestbook'
  ) then
    create policy "service role can insert guestbook"
    on public.guestbook
    for insert
    to service_role
    with check (true);
  end if;
end
$$;

create index if not exists guestbook_created_at_idx
on public.guestbook (created_at desc);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'guestbook'
  ) then
    alter publication supabase_realtime add table public.guestbook;
  end if;
end
$$;
