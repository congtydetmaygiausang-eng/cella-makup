-- ==============================================================================
-- CELLA MIGRATION SCRIPT - PHASE 1 (MINIMAL SCHEMA)
-- M?c tiêu: T?i gi?n schema, thêm các b?ng m?i (Tài chính, AI, L?ch s?),
-- d?i tên b?ng/c?t cho phù h?p v?i UI Phase 1.
-- Luu ý: KHÔNG DROP TABLE CU ? file này d? d?m b?o an toàn.
-- ==============================================================================

-- 1. ENUM M?I CHO GIAI ÐO?N 1
DO  BEGIN CREATE TYPE crm_stage_enum AS ENUM ('LEAD_NEW', 'CONSULTING', 'BOOKED', 'PURCHASED', 'FOLLOW_UP'); EXCEPTION WHEN duplicate_object THEN null; END ;
DO  BEGIN CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN null; END ;
DO  BEGIN CREATE TYPE ai_assistant_type AS ENUM ('GENERAL', 'SALES', 'CRM', 'CONTENT', 'TRAINING', 'REPORT'); EXCEPTION WHEN duplicate_object THEN null; END ;
DO  BEGIN CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN null; END ;

-- 2. C?P NH?T B?NG HI?N T?I (ADD COLUMNS & RENAME)
-- B?ng customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_code VARCHAR(30) UNIQUE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS crm_stage crm_stage_enum DEFAULT 'LEAD_NEW';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_contact_at TIMESTAMPTZ;
-- Xóa ràng bu?c cu n?u c?n thi?t (không xoá c?t)
-- ALTER TABLE customers ALTER COLUMN status DROP NOT NULL;

-- B?ng profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department VARCHAR(100);

-- B?ng tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_type VARCHAR(50);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status task_status DEFAULT 'TODO';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Ð?i tên b?ng Academy thành d?ng chu?n Phase 1
ALTER TABLE IF EXISTS academy_courses RENAME TO courses;
ALTER TABLE IF EXISTS academy_enrollments RENAME TO student_enrollments;
-- Note: 'students' table can just be profiles with role='CUSTOMER' or 'STUDENT', but per specs we can create a view or just keep using profiles.
CREATE OR REPLACE VIEW students AS SELECT * FROM profiles WHERE role = 'CUSTOMER';

-- 3. T?O CÁC B?NG M?I THEO SPEC
-- 3.1 CRM: L?ch s? tuong tác
CREATE TABLE IF NOT EXISTS customer_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    interaction_type VARCHAR(50) NOT NULL, -- CALL, ZALO, SMS, MEETING
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 FINANCE: Doanh thu & Chi phí
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    source VARCHAR(50) DEFAULT 'Booking', -- Booking, Khóa h?c, TikTok, S?n ph?m
    total_amount NUMERIC(12, 2) NOT NULL,
    status order_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    paid_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount NUMERIC(12, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 AI: Tr? lý CELLA
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assistant_type ai_assistant_type DEFAULT 'GENERAL',
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user', 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 SYSTEM: Tài kho?n & B?o m?t
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    device_info TEXT,
    ip_address VARCHAR(45),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. B?T RLS (ROW LEVEL SECURITY) CHO B?NG M?I
ALTER TABLE customer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- T?o policy don gi?n (Authenticated users can read/write everything cho Phase 1, s? tinh ch?nh sau)
CREATE POLICY "Staff all access" ON customer_interactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff all access" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff all access" ON payments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff all access" ON expenses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "User all access" ON ai_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User all access" ON ai_messages FOR ALL USING (
    conversation_id IN (SELECT id FROM ai_conversations WHERE user_id = auth.uid())
);

-- ==============================================================================
-- HOÀN T?T MIGRATION PHASE 1
-- Các b?ng không dùng (makeup_looks, attendances...) V?N ÐU?C GI? L?I
-- d? không gây s?p h? th?ng (Zero-downtime). Xoá ? Phase sau.
-- ==============================================================================
