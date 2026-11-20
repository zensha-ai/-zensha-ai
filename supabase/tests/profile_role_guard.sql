-- Run as postgres against a local/test Supabase database after all migrations.
-- Any failed assertion raises an exception. Fixtures are rolled back on success.
begin;

-- Auth's existing trigger creates the corresponding customer profiles.
insert into auth.users (id, email) values
  ('819e043a-52a2-4db3-9c7b-7c6a0f94d101', 'role-guard-admin@example.invalid'),
  ('819e043a-52a2-4db3-9c7b-7c6a0f94d102', 'role-guard-customer@example.invalid');

-- Bootstrap must work without an existing admin or a signed-in user.
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{}', true);
update public.profiles set role = 'admin'
where id = '819e043a-52a2-4db3-9c7b-7c6a0f94d101';

-- Admin server actions use a service-role client without a user's JWT.
set local role service_role;
update public.profiles set role = 'admin'
where id = '819e043a-52a2-4db3-9c7b-7c6a0f94d102';
update public.profiles set role = 'customer'
where id = '819e043a-52a2-4db3-9c7b-7c6a0f94d102';
reset role;

-- An authenticated admin can still manage another profile through RLS.
select set_config('request.jwt.claim.sub', '819e043a-52a2-4db3-9c7b-7c6a0f94d101', true);
select set_config('request.jwt.claims', '{"sub":"819e043a-52a2-4db3-9c7b-7c6a0f94d101","role":"authenticated"}', true);
set local role authenticated;
do $$
begin
  update public.profiles set role = 'admin'
  where id = '819e043a-52a2-4db3-9c7b-7c6a0f94d102';
  if not found then raise exception 'Admin promotion did not update a profile'; end if;
  update public.profiles set role = 'customer'
  where id = '819e043a-52a2-4db3-9c7b-7c6a0f94d102';
  if not found then raise exception 'Admin demotion did not update a profile'; end if;
end;
$$;
reset role;

select set_config('request.jwt.claim.sub', '819e043a-52a2-4db3-9c7b-7c6a0f94d102', true);
select set_config('request.jwt.claims', '{"sub":"819e043a-52a2-4db3-9c7b-7c6a0f94d102","role":"authenticated"}', true);
set local role authenticated;
do $$
begin
  -- Customers must retain the ability to edit normal profile fields.
  update public.profiles set full_name = 'Customer profile edit'
  where id = '819e043a-52a2-4db3-9c7b-7c6a0f94d102';
  if not found then raise exception 'Customer profile edit did not update a profile'; end if;

  begin
    update public.profiles set role = 'admin'
    where id = '819e043a-52a2-4db3-9c7b-7c6a0f94d102';
    raise exception 'Customer was allowed to promote themselves';
  exception when insufficient_privilege then
    null; -- Expected: role changes are still blocked.
  end;
end;
$$;
reset role;

do $$
begin
  if (select role from public.profiles where id = '819e043a-52a2-4db3-9c7b-7c6a0f94d101') is distinct from 'admin' then
    raise exception 'First-admin setup failed';
  end if;
  if (select role from public.profiles where id = '819e043a-52a2-4db3-9c7b-7c6a0f94d102') is distinct from 'customer' then
    raise exception 'Customer role protection failed';
  end if;
end;
$$;

rollback;
