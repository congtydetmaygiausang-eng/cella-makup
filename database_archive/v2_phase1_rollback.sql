-- ==============================================================================
-- CELLA ROLLBACK SCRIPT - PHASE 1
-- Ch?y script này d? hu? b? các thay d?i c?a Phase 1 Migration.
-- ==============================================================================

-- 1. XOÁ CÁC B?NG M?I (DROP TABLES & VIEWS)
DROP VIEW IF EXISTS students CASCADE;

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;

DROP TABLE IF EXISTS ai_messages CASCADE;
DROP TABLE IF EXISTS ai_conversations CASCADE;

DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

DROP TABLE IF EXISTS customer_interactions CASCADE;

-- 2. Ð?I TÊN B?NG V? CU
ALTER TABLE IF EXISTS courses RENAME TO academy_courses;
ALTER TABLE IF EXISTS student_enrollments RENAME TO academy_enrollments;

-- 3. XOÁ C?T ÐÃ THÊM (DROP COLUMNS)
ALTER TABLE tasks DROP COLUMN IF EXISTS created_by;
ALTER TABLE tasks DROP COLUMN IF EXISTS status;
ALTER TABLE tasks DROP COLUMN IF EXISTS task_type;

ALTER TABLE profiles DROP COLUMN IF EXISTS department;

ALTER TABLE customers DROP COLUMN IF EXISTS last_contact_at;
ALTER TABLE customers DROP COLUMN IF EXISTS crm_stage;
ALTER TABLE customers DROP COLUMN IF EXISTS customer_code;

-- 4. XOÁ CÁC ENUM (Luu ý: PostgreSQL không h? tr? DROP TYPE tr?c ti?p n?u dang dùng, nhung do ta dã drop c?t nên có th? drop type CASCADE)
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS ai_assistant_type CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS crm_stage_enum CASCADE;

-- HOÀN T?T ROLLBACK
