-- The original SECURITY DEFINER guard checks auth.uid(), which is absent for
-- service-role requests and SQL-editor sessions. This prevents both first-admin
-- setup and role changes made by the authenticated admin server action.
-- Run as the caller so current_user identifies the actual database role, rather
-- than the function owner (which would let every customer bypass this guard).
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
    and current_user not in ('postgres', 'supabase_admin', 'service_role')
    and not public.is_admin()
  then
    raise exception 'Only admins can change roles' using errcode = '42501';
  end if;
  return new;
end;
$$;
