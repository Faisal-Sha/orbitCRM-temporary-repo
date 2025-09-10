-- -- williamv.vysniauskas@gmail.com
-- INSERT INTO auth.users (
--   instance_id, id, aud, role, email,
--   encrypted_password,
--   email_confirmed_at, invited_at,
--   raw_app_meta_data, raw_user_meta_data,
--   created_at, updated_at,
--   is_super_admin, is_sso_user, is_anonymous
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   'ea2b3f2e-6514-412a-b26c-185f49c07098',
--   'authenticated', 'authenticated', 'williamv.vysniauskas@gmail.com',
--   '$2a$10$12Y9j9DDYgDvFtgHduQd1OHtvKJMtC5rWecd6lg2bDKwE1DbK/LIW',
--   '2025-08-27 09:22:30.8031+00', NULL,
--   '{"provider":"email","providers":["email"]}',
--   '{"sub":"ea2b3f2e-6514-412a-b26c-185f49c07098","email":"williamv.vysniauskas@gmail.com","last_name":"Vysniauskas","first_name":"William","email_verified":true,"phone_verified":false}',
--   '2025-08-27 09:22:30.776818+00', '2025-09-04 19:41:06.248655+00',
--   NULL, FALSE, FALSE
-- );

-- -- 444subscriptions@gmail.com
-- INSERT INTO auth.users (
--   instance_id, id, aud, role, email,
--   encrypted_password,
--   email_confirmed_at, invited_at,
--   raw_app_meta_data, raw_user_meta_data,
--   created_at, updated_at,
--   is_super_admin, is_sso_user, is_anonymous
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   '4a0a2f2a-bd6a-4f07-a247-935f715dd337',
--   'authenticated', 'authenticated', '444subscriptions@gmail.com',
--   '$2a$10$lRslWkOiGE7Go5fgQJG/3OCzISTVONU0VrJIbyIT9rC.5wYRDX8TO',
--   '2025-08-31 18:34:45.015293+00', NULL,
--   '{"provider":"email","providers":["email"]}',
--   '{"sub":"4a0a2f2a-bd6a-4f07-a247-935f715dd337","email":"444subscriptions@gmail.com","last_name":"Admin2","first_name":"Admin1","email_verified":true,"phone_verified":false}',
--   '2025-08-31 18:34:44.96537+00', '2025-09-08 14:36:22.814137+00',
--   NULL, FALSE, FALSE
-- );

-- INSERT INTO "public"."app_users" ("id", "user_id", "created_at", "updated_at", "status", "created_by", "updated_by", "deleted_by", "deleted_at", "is_deleted", "account_email") VALUES ('0f3f6449-c702-4c9d-acf4-443f914f828f', 'ea2b3f2e-6514-412a-b26c-185f49c07098', '2025-08-27 09:22:30.774238+00', '2025-08-30 22:13:41.816308+00', 'active', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, null, 'false', 'williamv.vysniauskas@gmail.com'), ('4bc39102-b3d9-4a37-be97-0b1a70f13533', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '2025-08-31 18:34:44.965014+00', '2025-08-31 18:34:44.965014+00', 'active', null, null, null, null, 'false', '444subscriptions@gmail.com');

-- INSERT INTO "public"."app_data_labels" ("id", "created_by", "updated_by", "created_at", "updated_at", "label_color", "label_name", "label_category", "text_color", "font_weight") VALUES ('2daba52b-43ef-418f-8546-a8fc637b9be2', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '2025-09-04 18:40:46.729932+00', '2025-09-04 20:15:53.515733+00', '#dcfce7', 'Green Label', 'Green Labels', 'black', 'normal'), ('3164bf35-4f63-43bd-8c3d-934dd1969b89', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '2025-09-04 16:54:27.880081+00', '2025-09-05 15:23:44.071657+00', '#ededed', 'Grey Label', 'Grey Labels', 'black', 'normal'), ('6091aced-98a9-49eb-a415-dca93e423f0f', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '2025-09-04 18:40:28.473449+00', '2025-09-04 20:16:12.461247+00', '#fdd3eb', 'Red Label', 'Red Labels', 'black', 'normal'), ('794c6fc9-107d-4d20-95b4-00c1c1f6d594', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '2025-09-04 20:13:37.335812+00', '2025-09-04 20:15:14.450228+00', '#e9e0ff', 'Purple Label', 'Purple Labels', 'black', 'normal'), ('c6806bfc-e68b-448d-90c7-5b5efe51a7d5', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '2025-09-04 18:41:05.112196+00', '2025-09-05 15:23:12.869385+00', '#dbeafe', 'Blue Label', 'Blue Labels', 'black', 'normal'), ('dc051733-7173-41c5-8dd5-44bd8a07adbe', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '2025-09-04 19:17:53.865717+00', '2025-09-05 16:48:51.58614+00', '#fef9c3', 'Yellow Label', 'Yellow Labels', 'black', 'bold');

-- INSERT INTO "public"."people" ("id", "user_account_id", "first_name", "middle_name", "last_name", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted", "status", "user_profile_pic", "user_profile_bio") VALUES ('20caf755-16b4-46d7-a87a-134a5f6d3e0c', '0f3f6449-c702-4c9d-acf4-443f914f828f', 'William', 'V', 'Vysniauskas', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-08-29 08:54:49+00', '2025-09-04 14:40:24.844393+00', null, 'false', 'active', 'https://zihgewzxoeozgfhyczhf.supabase.co/storage/v1/object/public/profile-pictures/ea2b3f2e-6514-412a-b26c-185f49c07098/1756655843819.jpg', 'my bio....'), ('6aca39d3-c5ca-49ea-a3a6-b1d55dc39929', '4bc39102-b3d9-4a37-be97-0b1a70f13533', 'Admin1', null, 'Admin2', 'ea2b3f2e-6514-412a-b26c-185f49c07098', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-08-31 18:33:27.416681+00', '2025-08-31 18:36:38.022274+00', null, 'false', 'active', null, null);
-- INSERT INTO "public"."people_contacts" ("id", "person_id", "email", "work_email", "phone", "phone_home", "address_line_1", "address_line_2", "city", "state", "zip_code", "country", "url_facebook", "url_instagram", "url_tiktok", "url_linkedin", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted") VALUES ('16b45c9a-ee66-4e20-8ac6-16f7f5eb9db3', '20caf755-16b4-46d7-a87a-134a5f6d3e0c', 'williamv.vysniauskas@gmail.com', null, '067701362', null, 'Benedikto Vainos g 5', null, 'Vilnius', 'Vilniaus sav.', 'LT-08461', 'USA', 'https://www.facebook.com/william.v.vysniauskas', null, null, null, 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-08-29 20:35:22+00', '2025-09-04 14:40:24.844393+00', null, 'false'), ('89cf7d37-cff1-49a6-88da-256a6f891e14', '6aca39d3-c5ca-49ea-a3a6-b1d55dc39929', '444subscriptions@gmail.com', null, null, null, null, null, null, null, null, 'USA', null, null, null, null, 'ea2b3f2e-6514-412a-b26c-185f49c07098', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-08-31 18:33:27.416681+00', '2025-08-31 18:36:38.022274+00', null, 'false');

-- INSERT INTO "public"."app_user_roles" ("id", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted", "role_name", "role_label_id") VALUES ('1b29e5e8-e25e-4326-b8cf-121d527339ea', 'ea2b3f2e-6514-412a-b26c-185f49c07098', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-09-03 15:36:02.067295+00', '2025-09-04 20:11:59.493572+00', null, 'false', 'general', '3164bf35-4f63-43bd-8c3d-934dd1969b89'), ('37dc029f-f8dd-4ae7-a073-f89633decb9d', 'ea2b3f2e-6514-412a-b26c-185f49c07098', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-08-29 09:34:41.674527+00', '2025-09-04 20:12:44.616383+00', null, 'false', 'staff', 'c6806bfc-e68b-448d-90c7-5b5efe51a7d5'), ('389ef5df-2b0c-46d0-a31b-e83cf88ba5a4', 'ea2b3f2e-6514-412a-b26c-185f49c07098', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-08-29 09:36:06.723951+00', '2025-09-04 20:13:54.301226+00', null, 'false', 'admin', '794c6fc9-107d-4d20-95b4-00c1c1f6d594'), ('55046a85-1ae8-4154-8996-0a948b65b8e2', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-09-04 19:37:55.964736+00', '2025-09-05 16:47:59.437987+00', null, 'false', 'owner', '794c6fc9-107d-4d20-95b4-00c1c1f6d594'), ('c7ed5e9e-abe9-4181-ad87-afbc409cecdb', 'ea2b3f2e-6514-412a-b26c-185f49c07098', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-08-29 09:37:43.491352+00', '2025-09-04 20:12:07.620736+00', null, 'false', 'client', '2daba52b-43ef-418f-8546-a8fc637b9be2'), ('cdaf6cdd-23be-43cf-b263-5ce85f2abcb2', 'ea2b3f2e-6514-412a-b26c-185f49c07098', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-08-29 09:37:02.398101+00', '2025-09-04 20:12:16.354986+00', null, 'false', 'lead', 'dc051733-7173-41c5-8dd5-44bd8a07adbe');
-- INSERT INTO "public"."app_global_people" ("id", "person_id", "user_role_id", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted") VALUES ('9e5d6335-22e4-461d-a934-c816a7814db6', '20caf755-16b4-46d7-a87a-134a5f6d3e0c', '55046a85-1ae8-4154-8996-0a948b65b8e2', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-08-29 09:44:28+00', '2025-08-29 09:44:33+00', null, 'false');

-- INSERT INTO "public"."app_agencies" ("id", "agency_name", "agency_state", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted", "status") VALUES ('0c155069-ac35-40ce-990b-f6fc0f8ae613', 'Test Agency', null, null, null, null, '2025-09-07 18:43:15+00', '2025-09-07 18:43:23+00', null, 'false', 'active');
-- INSERT INTO "public"."app_agencies_admins" ("id", "agency_id", "person_id", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted") VALUES ('a67e89c8-250b-4a0c-a775-0453118aede9', '0c155069-ac35-40ce-990b-f6fc0f8ae613', '6aca39d3-c5ca-49ea-a3a6-b1d55dc39929', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-08-31 18:33:27.416681+00', '2025-08-31 18:33:27.416681+00', null, 'false');
-- INSERT INTO "public"."app_agencies_people" ("id", "agency_id", "person_id", "user_role_id", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted") VALUES ('660ae463-7e6b-49c0-bd84-cb93da81b451', '0c155069-ac35-40ce-990b-f6fc0f8ae613', '6aca39d3-c5ca-49ea-a3a6-b1d55dc39929', '389ef5df-2b0c-46d0-a31b-e83cf88ba5a4', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-08-31 18:33:27.416681+00', '2025-08-31 18:33:27.416681+00', null, 'false');

-- INSERT INTO "public"."app_data_programs" ("id", "program_name", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted") VALUES ('06ec2728-3b2c-466c-87b3-7e076a99caf8', 'test', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-09-04 18:42:11.132169+00', '2025-09-04 18:42:11.132169+00', null, 'false'), ('ac6308c3-d3ef-4bd9-bbb1-abcf72912d14', 'Program1', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-09-04 17:36:23.660277+00', '2025-09-04 17:36:23.660277+00', null, 'false');
-- INSERT INTO "public"."app_data_programs_goals" ("id", "goal_name", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted", "program_id") VALUES ('0c74b6d1-2eaf-4dda-a4e1-2dd162c1ef54', 'dddddddddd', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-09-04 18:42:11.132169+00', '2025-09-04 18:42:11.132169+00', null, 'false', '06ec2728-3b2c-466c-87b3-7e076a99caf8'), ('107f73fb-f7b8-4e95-9eda-a379369a9ad3', 'aaa', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-09-04 18:42:11.132169+00', '2025-09-04 18:42:11.132169+00', null, 'false', '06ec2728-3b2c-466c-87b3-7e076a99caf8'), ('1be3f00b-c7ed-4aeb-aed3-411bdc43fe0d', 'Goal 3', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-09-04 17:36:23.660277+00', '2025-09-04 17:36:23.660277+00', null, 'false', 'ac6308c3-d3ef-4bd9-bbb1-abcf72912d14'), ('3c615bf2-8e35-496e-bcee-3324a6da9cb5', 'Goals 1', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-09-04 17:36:23.660277+00', '2025-09-04 17:36:23.660277+00', null, 'false', 'ac6308c3-d3ef-4bd9-bbb1-abcf72912d14'), ('8a404a64-f3b9-4d43-820e-815c6c035045', 'Gaol 2', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-09-04 17:36:23.660277+00', '2025-09-04 17:36:23.660277+00', null, 'false', 'ac6308c3-d3ef-4bd9-bbb1-abcf72912d14'), ('abbc90bf-27ba-4e91-ad45-74ba160f52a1', 'aaaaaaa', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-09-04 18:42:11.132169+00', '2025-09-04 18:42:11.132169+00', null, 'false', '06ec2728-3b2c-466c-87b3-7e076a99caf8');

-- INSERT INTO "public"."app_organizations" ("id", "organization_name", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted", "status", "organization_state") VALUES ('48f282eb-d14e-4d29-9ea8-a4f525200aa6', 'Test Org', 'ea2b3f2e-6514-412a-b26c-185f49c07098', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-08-31 18:33:27.416681+00', '2025-09-07 17:32:49.767968+00', null, 'false', 'active', 'Connecticut');
-- INSERT INTO "public"."app_organizations_owners" ("id", "organization_id", "owner_id", "is_deleted", "created_at", "updated_at", "deleted_at", "created_by", "updated_by", "deleted_by") VALUES ('344401c1-ec9f-4d52-81ad-abdf9471441e', '48f282eb-d14e-4d29-9ea8-a4f525200aa6', '20caf755-16b4-46d7-a87a-134a5f6d3e0c', 'false', '2025-09-09 01:48:48+00', null, null, 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, null);
-- INSERT INTO "public"."settings_organization" ("id", "organization_id", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted", "address_line_1", "address_line_2", "zip_cone", "country", "default_language", "default_currency", "default_timezone", "facebook_url", "instagram_url", "x_url", "tiktok_url", "linkedin_url", "google_profile_url", "youtube_url", "organization_logo") VALUES ('5652c0be-aec3-4fa5-a70d-d847861e5f14', '48f282eb-d14e-4d29-9ea8-a4f525200aa6', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', '4a0a2f2a-bd6a-4f07-a247-935f715dd337', null, '2025-09-05 09:59:01.755122+00', '2025-09-05 09:59:01.755122+00', null, 'false', 'Benedikto Vainos g 5', 'Suite 2005', 'LT-08461', 'United States', 'English (US)', 'USD ($)', 'America/New_York', 'https://www.facebook.com/william.v.vysniauskas', '', '', '', '', '', '', null);

-- INSERT INTO "public"."app_user_staff_types" ("id", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted", "staff_type", "staff_type_label_id") VALUES ('042f99e6-ea7a-4fda-bbe9-9598bb8b3702', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-02 12:08:45.959467+00', '2025-09-02 12:08:45.959467+00', null, 'false', 'specialist_it', null), ('27efa271-7340-4199-9f63-11a4b323de2b', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-02 12:07:51.34904+00', '2025-09-02 12:07:51.34904+00', null, 'false', 'sales_rep', null), ('8cd85135-2a33-4239-a4b3-b6c6a4e82002', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-02 12:09:00.064295+00', '2025-09-02 12:09:00.064295+00', null, 'false', 'specialist_finance', null), ('8e8a5840-9145-4b5d-a2de-d5bd7bd05112', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-02 12:09:21.260587+00', '2025-09-02 12:09:21.260587+00', null, 'false', 'leadership_team_lead', null), ('9583c1c5-7950-484d-ba85-76c12347c573', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-02 12:06:45.203776+00', '2025-09-02 12:06:45.203776+00', null, 'false', 'clinical_supervisor', null), ('979a20e1-0512-4128-8563-ef26ade9b310', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-02 12:09:48.811579+00', '2025-09-02 12:09:48.811579+00', null, 'false', 'leadership_exec', null), ('9b78826a-003e-4bef-b377-af3f85b0c6cf', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-02 12:07:33.759234+00', '2025-09-02 12:07:33.759234+00', null, 'false', 'admin_support', null), ('b6febaf0-b3dc-482a-ac5c-4227fa7d78be', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-02 12:08:31.889255+00', '2025-09-02 12:08:31.889255+00', null, 'false', 'specialist_hr', null), ('b95e2918-37f7-4516-b82f-ae5de173c262', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-02 11:59:53.559697+00', '2025-09-02 11:59:53.559697+00', null, 'false', 'clinical_assessor', null), ('c86020c0-04ca-40b0-ba6a-27e93fb5fb1f', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-02 12:08:14.592946+00', '2025-09-02 12:08:14.592946+00', null, 'false', 'specialist_marketer', null), ('d44fa1f6-71ff-4030-bef9-1c5690814b9c', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-02 12:07:12.433758+00', '2025-09-02 12:07:12.433758+00', null, 'false', 'case_manager', null);

-- INSERT INTO "public"."people_assign_user_role" ("id", "person_id", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "is_deleted", "user_role_id") VALUES ('83a587c3-20d6-4b4f-93e6-818ad1cee466', '20caf755-16b4-46d7-a87a-134a5f6d3e0c', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-05 15:14:44.979131+00', '2025-09-05 15:14:44.979131+00', null, 'false', '55046a85-1ae8-4154-8996-0a948b65b8e2'), ('a6f6c2c8-16f7-4150-ae3d-535cf8748e1f', '6aca39d3-c5ca-49ea-a3a6-b1d55dc39929', 'ea2b3f2e-6514-412a-b26c-185f49c07098', 'ea2b3f2e-6514-412a-b26c-185f49c07098', null, '2025-09-05 15:16:47.064946+00', '2025-09-05 15:16:47.064946+00', null, 'false', '389ef5df-2b0c-46d0-a31b-e83cf88ba5a4');


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

INSERT INTO "public"."app_organizations" ("organization_name", "status", "organization_state") VALUES ('Test Org', 'active', 'Connecticut');