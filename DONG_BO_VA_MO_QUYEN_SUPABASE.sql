-- ==============================================================================
-- CELLA MAKEUP ACADEMY - SCRIPT ĐỒNG BỘ & MỞ QUYỀN LƯU DỮ LIỆU SUPABASE
-- Mục đích: Cho phép ứng dụng Web lưu trực tiếp Khách hàng, Lịch hẹn,
--          Nhiệm vụ, Học viên, Lookbook vào Supabase mà không bị lỗi RLS (42501).
-- Chạy script này tại: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Bật Extensions cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ĐẢM BẢO CÁC BẢNG DỮ LIỆU ĐÃ TỒN TẠI VỚI CẤU TRÚC CHUẨN

-- Bảng Hồ sơ người dùng / Nhân sự (profiles)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone VARCHAR(20),
    email TEXT,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    cover_url TEXT DEFAULT 'https://images.unsplash.com/photo-1512496015851-a1dc8a477d70?auto=format&fit=crop&w=1200&q=80',
    role VARCHAR(50) DEFAULT 'CUSTOMER',
    bio TEXT,
    branch_studio VARCHAR(100) DEFAULT '37–39 Phan Bội Châu, P. Lê Hồng Phong, TP. Thái Bình',
    base_salary NUMERIC(12, 2) DEFAULT 0,
    commission_rate NUMERIC(4, 2) DEFAULT 0.10,
    kpi_score NUMERIC(3, 1) DEFAULT 5.0,
    followers_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Khách hàng & CRM Leads (customers)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email TEXT,
    avatar_url TEXT,
    source VARCHAR(50) DEFAULT 'TIKTOK',
    status VARCHAR(50) DEFAULT 'NEW_LEAD',
    assigned_staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    skin_type VARCHAR(50) DEFAULT 'COMBINATION',
    undertone VARCHAR(50) DEFAULT 'COOL',
    face_shape VARCHAR(50) DEFAULT 'OVAL',
    skin_notes TEXT,
    total_spent NUMERIC(12, 2) DEFAULT 0,
    loyalty_points INT DEFAULT 0,
    is_member_pass BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Mẫu Makeup Lookbook (makeup_looks)
CREATE TABLE IF NOT EXISTS makeup_looks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    tagline TEXT,
    category VARCHAR(50) DEFAULT 'EDITORIAL',
    aura_tone VARCHAR(50) DEFAULT 'Cool Blue & Rose Dewy',
    rating NUMERIC(2, 1) DEFAULT 5.0,
    saved_count INT DEFAULT 120,
    reviews_count INT DEFAULT 15,
    duration_minutes INT DEFAULT 60,
    standard_price NUMERIC(12, 2) NOT NULL DEFAULT 350000,
    member_price NUMERIC(12, 2) DEFAULT 300000,
    hero_image_url TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    video_tutorial_url TEXT,
    artist VARCHAR(100) DEFAULT 'Cella Hương Phượng',
    description TEXT,
    color_breakdown JSONB DEFAULT '[]'::JSONB,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Đặt lịch hẹn dịch vụ (bookings)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(50),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    customer_name TEXT,
    customer_phone VARCHAR(20),
    service_title TEXT DEFAULT 'Trang điểm tiệc & sự kiện',
    artist_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    artist_name TEXT,
    appointment_time TIMESTAMPTZ,
    location_type VARCHAR(50) DEFAULT 'STUDIO',
    destination_address TEXT DEFAULT '37–39 Phan Bội Châu, TP. Thái Bình',
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 350000,
    deposit_amount NUMERIC(12, 2) DEFAULT 100000,
    is_deposit_paid BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Quản lý công việc & Nhắc việc (tasks)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_name TEXT,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    priority VARCHAR(50) DEFAULT 'NORMAL',
    due_time TIMESTAMPTZ,
    due_date VARCHAR(50),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Khóa học (academy_courses)
CREATE TABLE IF NOT EXISTS academy_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    course_code VARCHAR(50) UNIQUE,
    level VARCHAR(50) DEFAULT 'CHUYÊN NGHIỆP',
    duration_weeks INT DEFAULT 8,
    tuition_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    thumbnail_url TEXT,
    max_students INT DEFAULT 15,
    enrolled_students INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Đăng ký học viên (academy_enrollments)
CREATE TABLE IF NOT EXISTS academy_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    student_name TEXT,
    student_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'ENROLLED',
    tuition_paid NUMERIC(12, 2) DEFAULT 0,
    total_tuition NUMERIC(12, 2) DEFAULT 0,
    progress_percentage INT DEFAULT 0,
    enrolled_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Khen thưởng / Kỷ luật (rewards_disciplines)
CREATE TABLE IF NOT EXISTS rewards_disciplines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL DEFAULT 'REWARD',
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    reason TEXT NOT NULL,
    issued_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. MỞ QUYỀN ROW LEVEL SECURITY (RLS) - ĐẢM BẢO KHÔNG BỊ LỖI 42501 KHI LƯU
-- ==============================================================================

-- Bật RLS cho các bảng
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE makeup_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_disciplines ENABLE ROW LEVEL SECURITY;

-- Xóa chính sách cũ bị xung đột nếu có
DROP POLICY IF EXISTS "allow_all_profiles_read" ON profiles;
DROP POLICY IF EXISTS "allow_all_profiles_write" ON profiles;
DROP POLICY IF EXISTS "allow_all_customers_read" ON customers;
DROP POLICY IF EXISTS "allow_all_customers_write" ON customers;
DROP POLICY IF EXISTS "allow_all_looks_read" ON makeup_looks;
DROP POLICY IF EXISTS "allow_all_looks_write" ON makeup_looks;
DROP POLICY IF EXISTS "allow_all_bookings_read" ON bookings;
DROP POLICY IF EXISTS "allow_all_bookings_write" ON bookings;
DROP POLICY IF EXISTS "allow_all_tasks_read" ON tasks;
DROP POLICY IF EXISTS "allow_all_tasks_write" ON tasks;
DROP POLICY IF EXISTS "allow_all_courses_read" ON academy_courses;
DROP POLICY IF EXISTS "allow_all_courses_write" ON academy_courses;
DROP POLICY IF EXISTS "allow_all_enrollments_read" ON academy_enrollments;
DROP POLICY IF EXISTS "allow_all_enrollments_write" ON academy_enrollments;
DROP POLICY IF EXISTS "allow_all_rewards_read" ON rewards_disciplines;
DROP POLICY IF EXISTS "allow_all_rewards_write" ON rewards_disciplines;

-- Tạo chính sách MỞ TOÀN DIỆN cho ứng dụng hoạt động trơn tru:
-- (Cho phép cả người dùng đăng nhập & khách vãng lai đặt hẹn/liên hệ được lưu vào Supabase)

-- Profiles
CREATE POLICY "allow_all_profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "allow_all_profiles_write" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- Customers (Khách hàng & Leads)
CREATE POLICY "allow_all_customers_read" ON customers FOR SELECT USING (true);
CREATE POLICY "allow_all_customers_write" ON customers FOR ALL USING (true) WITH CHECK (true);

-- Makeup Looks (Lookbook)
CREATE POLICY "allow_all_looks_read" ON makeup_looks FOR SELECT USING (true);
CREATE POLICY "allow_all_looks_write" ON makeup_looks FOR ALL USING (true) WITH CHECK (true);

-- Bookings (Lịch hẹn dịch vụ)
CREATE POLICY "allow_all_bookings_read" ON bookings FOR SELECT USING (true);
CREATE POLICY "allow_all_bookings_write" ON bookings FOR ALL USING (true) WITH CHECK (true);

-- Tasks (Công việc & Nhắc việc)
CREATE POLICY "allow_all_tasks_read" ON tasks FOR SELECT USING (true);
CREATE POLICY "allow_all_tasks_write" ON tasks FOR ALL USING (true) WITH CHECK (true);

-- Academy Courses (Khóa học)
CREATE POLICY "allow_all_courses_read" ON academy_courses FOR SELECT USING (true);
CREATE POLICY "allow_all_courses_write" ON academy_courses FOR ALL USING (true) WITH CHECK (true);

-- Academy Enrollments (Đăng ký học viên)
CREATE POLICY "allow_all_enrollments_read" ON academy_enrollments FOR SELECT USING (true);
CREATE POLICY "allow_all_enrollments_write" ON academy_enrollments FOR ALL USING (true) WITH CHECK (true);

-- Rewards & Disciplines (Thưởng/Phạt)
CREATE POLICY "allow_all_rewards_read" ON rewards_disciplines FOR SELECT USING (true);
CREATE POLICY "allow_all_rewards_write" ON rewards_disciplines FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 4. THĂNG HẠNG VAI TRÒ QUẢN TRỊ VIÊN CẤP CAO (SUPER_ADMIN)
-- ==============================================================================
UPDATE profiles
SET role = 'SUPER_ADMIN'
WHERE email IN ('polomin1994@gmail.com', 'polomin@gmail.com');

-- Thông báo hoàn thành
SELECT 'CHÚC MỪNG! HỆ THỐNG SUPABASE CELLA ĐÃ MỞ QUYỀN LƯU DỮ LIỆU TOÀN DIỆN THÀNH CÔNG!' AS ket_qua;
