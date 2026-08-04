-- Decision authority map: where authority actually sits for each authorized
-- system. Deliberately nullable with no default — a record that never stated
-- where authority sits is a real gap, and silently defaulting it to the
-- safest-sounding value would manufacture an answer nobody gave.
alter table boundary_authorization_records
  add column if not exists authority_mode text
    check (authority_mode in ('human_decides', 'ai_recommends', 'ai_decides'));
