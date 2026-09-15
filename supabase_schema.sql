-- ==============================================================================
-- CELLA BEAUTÉ & ACADEMY - SUPABASE DATABASE SCHEMA (POSTGRESQL)
-- Phiên bản: 2.0 (HOÀN THIỆN TOÀN DIỆN - PRODUCTION READY)
-- Bao gồm: Profiles, Customers/Leads, Lookbook, Reviews, Favorites,
--          Bookings, Tasks, Academy & Enrollments, Attendance GPS, Payrolls,
--          Trigger tự động Auth/Updated_at & Trọn bộ RLS Security Policies.
-- ==============================================================================

-- 1. Bật Extensions cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Hỗ trợ tìm kiếm tiếng Việt mờ (fuzzy search)

-- ==============================================================================
-- 2. ENUM TYPES (Chuẩn hóa các trạng thái và phân loại)
-- ==============================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'SUPER_ADMIN', 
        'ADMIN', 
        'MASTER_ARTIST', 
        'ARTIST', 
        'SALES_CONSULTANT', 
        'ACADEMY_TRAINER', 
        'CUSTOMER'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('NEW_LEAD', 'CONSULTING', 'BOOKED', 'WON', 'LOST');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE lead_source AS ENUM ('TIKTOK', 'FACEBOOK', 'ZALO', 'INSTAGRAM', 'REFERRAL', 'WALK_IN', 'WEBSITE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE skin_undertone AS ENUM ('COOL', 'WARM', 'NEUTRAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE face_shape AS ENUM ('OVAL', 'ROUND', 'SQUARE', 'HEART', 'DIAMOND');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE location_type AS ENUM ('STUDIO', 'HOME_VISIT', 'DESTINATION_WEDDING');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE attendance_type AS ENUM ('GPS', 'QR_CODE', 'MANUAL_APPROVAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('APPLIED', 'DEPOSIT_PAID', 'ENROLLED', 'COMPLETED', 'DROPPED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==============================================================================
-- 3. HÀM DÙNG CHUNG: CẬP NHẬT UPDATED_AT TỰ ĐỘNG
-- ==============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. BẢNG HỒ SƠ NGƯỜI DÙNG & NHÂN SỰ (profiles)
-- Tự động đồng bộ từ Supabase auth.users qua trigger
-- ==============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email TEXT,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    role user_role DEFAULT 'CUSTOMER',
    bio TEXT,
    branch_studio VARCHAR(100) DEFAULT 'CELLA Flagship Q.1, TP.HCM',
    
    -- Dành cho chuyên gia / Artist / Trainer
    base_salary NUMERIC(12, 2) DEFAULT 0,
    commission_rate NUMERIC(4, 2) DEFAULT 0.10, -- 10%
    kpi_score NUMERIC(3, 1) DEFAULT 5.0,
    followers_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger tự động tạo bản ghi profiles khi người dùng đăng ký qua auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Hội viên CELLA'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
        'CUSTOMER'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. BẢNG KHÁCH HÀNG & CRM LEADS (customers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Liên kết nếu khách tạo tài khoản
    full_name TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email TEXT,
    avatar_url TEXT,
    source lead_source DEFAULT 'TIKTOK',
    status lead_status DEFAULT 'NEW_LEAD',
    assigned_staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Hồ sơ làm đẹp & thông số khuôn mặt cá nhân hóa
    skin_type VARCHAR(50) DEFAULT 'COMBINATION',
    undertone skin_undertone DEFAULT 'COOL',
    face_shape face_shape DEFAULT 'OVAL',
    skin_notes TEXT,
    
    total_spent NUMERIC(12, 2) DEFAULT 0,
    loyalty_points INT DEFAULT 0,
    is_member_pass BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_staff ON customers(assigned_staff_id);

-- ==============================================================================
-- 6. BẢNG DANH MỤC MẪU MAKEUP LOOKBOOK (makeup_looks)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS makeup_looks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    tagline TEXT,
    category VARCHAR(50) DEFAULT 'EDITORIAL', -- BRIDAL, EDITORIAL, KOREAN_GLOW, Y2K, DAILY
    aura_tone VARCHAR(50) DEFAULT 'Cool Blue & Rose Dewy',
    rating NUMERIC(2, 1) DEFAULT 4.9,
    saved_count INT DEFAULT 420,
    reviews_count INT DEFAULT 38,
    duration_minutes INT DEFAULT 75,
    standard_price NUMERIC(12, 2) NOT NULL DEFAULT 1250000,
    member_price NUMERIC(12, 2) DEFAULT 1050000,
    
    hero_image_url TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    video_tutorial_url TEXT,
    author_artist_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    color_breakdown JSONB DEFAULT '[]'::JSONB,
    suitable_face_shapes face_shape[] DEFAULT ARRAY['OVAL', 'ROUND']::face_shape[],
    ideal_undertones skin_undertone[] DEFAULT ARRAY['COOL', 'NEUTRAL']::skin_undertone[],
    
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_makeup_looks_category ON makeup_looks(category);
CREATE INDEX IF NOT EXISTS idx_makeup_looks_featured ON makeup_looks(is_featured);

-- ==============================================================================
-- 7. BẢNG DANH SÁCH YÊU THÍCH (look_favorites)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS look_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    look_id UUID NOT NULL REFERENCES makeup_looks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, look_id)
);

-- ==============================================================================
-- 8. BẢNG ĐÁNH GIÁ & REVIEW LOOK (look_reviews)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS look_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    look_id UUID NOT NULL REFERENCES makeup_looks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. BẢNG SẢN PHẨM MỸ PHẨM GẮN THẺ (cosmetic_products & look_products)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS cosmetic_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    color_code VARCHAR(50),
    price NUMERIC(12, 2) NOT NULL,
    image_url TEXT,
    description TEXT,
    stock_quantity INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS look_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    look_id UUID NOT NULL REFERENCES makeup_looks(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES cosmetic_products(id) ON DELETE CASCADE,
    step_order INT DEFAULT 1,
    UNIQUE(look_id, product_id)
);

-- ==============================================================================
-- 10. BẢNG CÁC BƯỚC VIDEO TUTORIAL / TIMELINE CHAPTERS (look_video_steps)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS look_video_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    look_id UUID NOT NULL REFERENCES makeup_looks(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    title TEXT NOT NULL,
    start_time_seconds INT NOT NULL,
    end_time_seconds INT NOT NULL,
    description TEXT,
    pro_tip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 11. BẢNG ĐẶT LỊCH HẸN & BOOKING (bookings)
-- Tự động sinh mã booking BK-YYYYMMDD-XXXX
-- ==============================================================================
CREATE SEQUENCE IF NOT EXISTS booking_code_seq START WITH 101;

CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_code IS NULL OR NEW.booking_code = '' THEN
        NEW.booking_code := 'BK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('booking_code_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(30) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    look_id UUID REFERENCES makeup_looks(id) ON DELETE SET NULL,
    artist_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    appointment_time TIMESTAMPTZ NOT NULL,
    location_type location_type DEFAULT 'STUDIO',
    destination_address TEXT,
    status booking_status DEFAULT 'CONFIRMED',
    
    total_amount NUMERIC(12, 2) NOT NULL,
    deposit_amount NUMERIC(12, 2) DEFAULT 300000,
    is_deposit_paid BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_booking_generate_code
BEFORE INSERT ON bookings
FOR EACH ROW EXECUTE FUNCTION generate_booking_code();

CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_bookings_time ON bookings(appointment_time);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_artist ON bookings(artist_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- ==============================================================================
-- 12. BẢNG QUẢN LÝ CÔNG VIỆC & NHẮC HẸN (tasks)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    priority task_priority DEFAULT 'NORMAL',
    due_time TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_time ON tasks(due_time);

-- ==============================================================================
-- 13. BẢNG KHÓA HỌC & ĐĂNG KÝ HỌC VIÊN (academy_courses & academy_enrollments)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS academy_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    level VARCHAR(50) DEFAULT 'CHUYÊN NGHIỆP', -- Cá nhân, Chuyên nghiệp, Nâng cao Master
    duration_weeks INT DEFAULT 8,
    tuition_fee NUMERIC(12, 2) NOT NULL,
    trainer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    start_date DATE,
    thumbnail_url TEXT,
    max_students INT DEFAULT 15,
    enrolled_students INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS academy_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES academy_courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tuition_paid NUMERIC(12, 2) DEFAULT 0,
    status enrollment_status DEFAULT 'ENROLLED',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    completion_grade NUMERIC(3, 1),
    is_graduated BOOLEAN DEFAULT FALSE,
    UNIQUE(course_id, student_id)
);

-- ==============================================================================
-- 14. BẢNG CHẤM CÔNG & ĐIỂM DANH GPS (attendances)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    check_out_time TIMESTAMPTZ,
    attendance_type attendance_type DEFAULT 'GPS',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_valid_location BOOLEAN DEFAULT TRUE,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendances_staff ON attendances(staff_id, check_in_time);

-- ==============================================================================
-- 15. BẢNG LƯƠNG, HOA HỒNG & THƯỞNG (payrolls)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS payrolls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- VD: '2025-04'
    base_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
    commission_amount NUMERIC(12, 2) DEFAULT 0,
    bonus_kpi NUMERIC(12, 2) DEFAULT 0,
    deductions NUMERIC(12, 2) DEFAULT 0,
    net_salary NUMERIC(12, 2) GENERATED ALWAYS AS (base_salary + commission_amount + bonus_kpi - deductions) STORED,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, month_year)
);

-- ==============================================================================
-- 16. BẢO MẬT PHÂN QUYỀN HÀNG TOÀN DIỆN (ROW LEVEL SECURITY - RLS POLICIES)
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE makeup_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE look_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE look_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmetic_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE look_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE look_video_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;

-- 16.1 PROFILES POLICIES
DROP POLICY IF EXISTS "Public profiles viewable" ON profiles;
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 16.2 LOOKBOOK & CATALOGUE POLICIES (Ai cũng xem được)
DROP POLICY IF EXISTS "Public lookbook is viewable" ON makeup_looks;
CREATE POLICY "Public lookbook is viewable" ON makeup_looks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public products are viewable" ON cosmetic_products;
CREATE POLICY "Public products are viewable" ON cosmetic_products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public look products are viewable" ON look_products;
CREATE POLICY "Public look products are viewable" ON look_products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public video steps are viewable" ON look_video_steps;
CREATE POLICY "Public video steps are viewable" ON look_video_steps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public courses are viewable" ON academy_courses;
CREATE POLICY "Public courses are viewable" ON academy_courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public reviews are viewable" ON look_reviews;
CREATE POLICY "Public reviews are viewable" ON look_reviews FOR SELECT USING (true);

-- 16.3 FAVORITES & REVIEWS POLICIES
DROP POLICY IF EXISTS "Users can manage own favorites" ON look_favorites;
CREATE POLICY "Users can manage own favorites" ON look_favorites FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create review" ON look_reviews;
CREATE POLICY "Users can create review" ON look_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 16.4 CUSTOMERS & BOOKINGS POLICIES (Nhân sự & Chính chủ)
DROP POLICY IF EXISTS "Staff can manage customers" ON customers;
CREATE POLICY "Staff can manage customers" ON customers FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Staff or customer can view bookings" ON bookings;
CREATE POLICY "Staff or customer can view bookings" ON bookings FOR SELECT 
USING (
    auth.role() = 'authenticated' OR 
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Authenticated users can create bookings" ON bookings;
CREATE POLICY "Authenticated users can create bookings" ON bookings FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can update bookings" ON bookings;
CREATE POLICY "Staff can update bookings" ON bookings FOR UPDATE 
USING (auth.role() = 'authenticated');

-- 16.5 TASKS POLICIES
DROP POLICY IF EXISTS "Staff can manage tasks" ON tasks;
CREATE POLICY "Staff can manage tasks" ON tasks FOR ALL USING (auth.role() = 'authenticated');

-- 16.6 ACADEMY ENROLLMENTS POLICIES
DROP POLICY IF EXISTS "Students view own enrollments or staff view all" ON academy_enrollments;
CREATE POLICY "Students view own enrollments or staff view all" ON academy_enrollments FOR SELECT
USING (auth.uid() = student_id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Students can register course" ON academy_enrollments;
CREATE POLICY "Students can register course" ON academy_enrollments FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- 16.7 ATTENDANCE & PAYROLL POLICIES
DROP POLICY IF EXISTS "Staff can check in or view own attendance" ON attendances;
CREATE POLICY "Staff can check in or view own attendance" ON attendances FOR ALL
USING (auth.uid() = staff_id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Staff can view own payroll or admin view all" ON payrolls;
CREATE POLICY "Staff can view own payroll or admin view all" ON payrolls FOR SELECT
USING (auth.uid() = staff_id OR auth.role() = 'authenticated');

-- ==============================================================================
-- 17. SEED DATA KHỞI TẠO (MẪU LOOK MÙA, MỸ PHẨM & KHÓA HỌC)
-- ==============================================================================
INSERT INTO cosmetic_products (id, product_name, category, color_code, price, stock_quantity) VALUES
('b1000000-0000-0000-0000-000000000001', 'Kem nền CELLA Liquid Glass', 'KEM NỀN', 'Tone #01', 580000, 50),
('b1000000-0000-0000-0000-000000000002', 'Prism Starlight Highlighter', 'HIGHLIGHTER', 'Aura Glow', 450000, 35),
('b1000000-0000-0000-0000-000000000003', 'Son Thạch Dưỡng CELLA Dew', 'SON DƯỠNG', 'No. 04 Pink', 320000, 120)
ON CONFLICT (id) DO NOTHING;

INSERT INTO makeup_looks (
    id, title, tagline, category, aura_tone, rating, saved_count, duration_minutes, 
    standard_price, member_price, hero_image_url, color_breakdown, is_featured
) VALUES (
    'a1000000-0000-0000-0000-000000000001',
    'Nữ Thần Ánh Sáng & Thủy Tinh (Ethereal Prism)',
    'ETHEREAL PRISM HOLOGRAM FINISH',
    'EDITORIAL',
    'Tone Cool Blue & Rose Dewy',
    4.9,
    420,
    75,
    1250000,
    1050000,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    '[
        {"code": "01", "part": "MÔI", "label": "Son bóng pha lê", "hex": "#fda4af"},
        {"code": "02", "part": "MẮT", "label": "Hologram Prism", "hex": "#a5b4fc"},
        {"code": "03", "part": "MÁ", "label": "Hồng đào sương mờ", "hex": "#fcd34d"},
        {"code": "04", "part": "BẮT SÁNG", "label": "Highlight thủy tinh", "hex": "#99f6e4"}
    ]'::JSONB,
    TRUE
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO look_products (look_id, product_id, step_order) VALUES
('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 1),
('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 2),
('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', 3)
ON CONFLICT (look_id, product_id) DO NOTHING;

INSERT INTO look_video_steps (look_id, step_number, title, start_time_seconds, end_time_seconds, description, pro_tip) VALUES
('a1000000-0000-0000-0000-000000000001', 1, 'Chuẩn bị da & Tạo nền Glass Skin', 0, 105, 'Dưỡng ẩm sâu đa tầng, mix primer bắt sáng, dặm nền mỏng mịn tạo độ bóng trong suốt.', 'Xoa ấm 2 lòng bàn tay và áp nhẹ lên má 10s để tránh mốc nền cakey.'),
('a1000000-0000-0000-0000-000000000001', 2, 'Kỹ thuật Má hồng Aura sương mờ', 105, 200, 'Khuếch tán đốm màu cam hồng gradient bằng cọ vát mềm.', 'Tán xéo về phía thái dương giúp nâng cơ gò má tự nhiên.'),
('a1000000-0000-0000-0000-000000000001', 3, 'Tán Mắt Nhũ Prism Holographic', 200, 310, 'Layer nhũ lăng kính quang phổ, nhấn bọng mắt aegyo-sal tạo chiều sâu cuốn hút.', 'Sử dụng đầu ngón tay áp út để dặm nhũ giúp nhũ bám chặt hơn dùng cọ.'),
('a1000000-0000-0000-0000-000000000001', 4, 'Khóa nền & Phủ Son bóng pha lê', 310, 378, 'Xịt khóa sương vi hạt giữ ẩm 12h và hoàn thiện làn môi căng mọng 3D.', 'Thoa viền môi mờ nhẹ trước khi tô son thạch giữa lòng môi.')
ON CONFLICT DO NOTHING;

INSERT INTO academy_courses (id, title, course_code, level, duration_weeks, tuition_fee, start_date, max_students, enrolled_students) VALUES
('c1000000-0000-0000-0000-000000000001', 'Khóa Makeup Chuyên Nghiệp Masterclass K18', 'PRO-MK-K18', 'CHUYÊN NGHIỆP', 12, 28000000, '2025-05-01', 15, 8),
('c1000000-0000-0000-0000-000000000002', 'Nghệ Thuật Đánh Nền Thủy Tinh & Tone Thái', 'SPEC-GLASS-04', 'NÂNG CAO', 4, 12000000, '2025-05-15', 10, 6)
ON CONFLICT (id) DO NOTHING;
