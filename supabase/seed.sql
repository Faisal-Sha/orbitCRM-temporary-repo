INSERT INTO "public"."app_data_labels" (
    "label_color", "label_name", "label_category", "text_color", "font_weight"
) VALUES (
    '#dcfce7', 'Green Label', 'Green Labels', 'black', 'normal'), 
    ('#ededed', 'Grey Label', 'Grey Labels', 'black', 'normal'),
    ('#fdd3eb', 'Red Label', 'Red Labels', 'black', 'normal'),
    ('#e9e0ff', 'Purple Label', 'Purple Labels', 'black', 'normal'),
    ('#dbeafe', 'Blue Label', 'Blue Labels', 'black', 'normal'),
    ('#fef9c3', 'Yellow Label', 'Yellow Labels', 'black', 'bold');

INSERT INTO public.app_user_roles (role_name, role_label_id)
SELECT m.role_name::public.user_roles_enum, l.id
FROM (VALUES
  ('general','Grey Label'),
  ('staff'  ,'Blue Label'),
  ('admin'  ,'Purple Label'),
  ('owner'  ,'Purple Label'),
  ('client' ,'Green Label'),
  ('lead'   ,'Yellow Label')
) AS m(role_name,label_name)
JOIN public.app_data_labels l ON l.label_name = m.label_name;

INSERT INTO public.app_user_staff_types (staff_type, staff_type_label_id)
SELECT m.staff_type::public.staff_type_enum, l.id
FROM (VALUES
  ('specialist_it',         'Blue Label'),
  ('sales_rep',             'Green Label'),
  ('specialist_finance',    'Grey Label'),
  ('leadership_team_lead',  'Purple Label'),
  ('clinical_supervisor',   'Red Label'),
  ('leadership_exec',       'Purple Label'),
  ('admin_support',         'Grey Label'),
  ('specialist_hr',         'Grey Label'),
  ('clinical_assessor',     'Red Label'),
  ('specialist_marketer',   'Yellow Label'),
  ('case_manager',          'Green Label')
) AS m(staff_type, label_name)
JOIN public.app_data_labels l ON l.label_name = m.label_name;

INSERT INTO public.app_user_permissions(user_permissions) VALUES
('owner.view'),
('settings.view')
ON CONFLICT DO NOTHING; -- add a unique index later if you want


INSERT INTO "public"."app_organizations" ("organization_name", "status", "organization_state") VALUES ('Test Org', 'active', 'Connecticut');