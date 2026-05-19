create table if not exists public.visitor_logs (
  id bigint generated always as identity primary key,
  command text not null,
  created_at timestamptz not null default now(),
  user_agent text,
  ip inet
);

alter table public.visitor_logs enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'visitor_logs'
      and policyname = 'service role can insert visitor logs'
  ) then
    create policy "service role can insert visitor logs"
    on public.visitor_logs
    for insert
    to service_role
    with check (true);
  end if;
end
$$;

create index if not exists visitor_logs_created_at_idx
on public.visitor_logs (created_at desc);
