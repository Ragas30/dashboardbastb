alter table public.defects
  alter column target_repair drop not null,
  add column description text;
