-- ==============================================================================
-- CELLA MAKEUP ACADEMY - HỆ THỐNG PHÂN QUYỀN TRUY CẬP (RBAC & RLS POLICIES)
-- CẤU TRÚC DỮ LIỆU BẢO MẬT: AI ĐƯỢC XEM, AI ĐƯỢC THÊM, AI ĐƯỢC SỬA, AI ĐƯỢC XÓA
-- ==============================================================================

-- 1. KIỂM TRA & BẬT TÍNH NĂNG ROW LEVEL SECURITY (RLS) TRÊN CÁC BẢNG CỐT LÕI
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS academy_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS academy_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS makeup_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendances ENABLE ROW LEVEL SECURITY;

-- 2. HÀM TIỆN ÍCH LẤY VAI TRÒ CỦA NGƯỜI DÙNG HIỆN TẠI (auth.uid())
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS text AS $$
DECLARE
    user_role text;
BEGIN
    SELECT role INTO user_role 
    FROM profiles 
    WHERE id = auth.uid();
    
    RETURN COALESCE(user_role, 'CUSTOMER');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. HÀM KIỂM TRA CÓ PHẢI QUẢN TRỊ VIÊN (SUPER_ADMIN HOẶC ADMIN)
CREATE OR REPLACE FUNCTION is_admin_or_super()
RETURNS boolean AS $$
BEGIN
    RETURN current_user_role() IN ('SUPER_ADMIN', 'ADMIN');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- BẢNG 1: KHÁCH HÀNG (customers)
-- XEM:   SUPER_ADMIN, ADMIN, MASTER_ARTIST, SALES_CONSULTANT, ARTIST
-- THÊM:  SUPER_ADMIN, ADMIN, MASTER_ARTIST, SALES_CONSULTANT
-- SỬA:   SUPER_ADMIN, ADMIN, SALES_CONSULTANT (hoặc Artist được phân công)
-- XÓA:   CHỈ SUPER_ADMIN, ADMIN
-- ==============================================================================
DROP POLICY IF EXISTS "customers_select_policy" ON customers;
CREATE POLICY "customers_select_policy" ON customers
FOR SELECT USING (
    is_admin_or_super()
    OR current_user_role() IN ('MASTER_ARTIST', 'SALES_CONSULTANT', 'ARTIST')
    OR assigned_staff_id = auth.uid()
);

DROP POLICY IF EXISTS "customers_insert_policy" ON customers;
CREATE POLICY "customers_insert_policy" ON customers
FOR INSERT WITH CHECK (
    is_admin_or_super()
    OR current_user_role() IN ('MASTER_ARTIST', 'SALES_CONSULTANT')
);

DROP POLICY IF EXISTS "customers_update_policy" ON customers;
CREATE POLICY "customers_update_policy" ON customers
FOR UPDATE USING (
    is_admin_or_super()
    OR current_user_role() = 'SALES_CONSULTANT'
    OR assigned_staff_id = auth.uid()
);

DROP POLICY IF EXISTS "customers_delete_policy" ON customers;
CREATE POLICY "customers_delete_policy" ON customers
FOR DELETE USING (
    is_admin_or_super()
);


-- ==============================================================================
-- BẢNG 2: LỊCH HẸN & DỊCH VỤ (bookings)
-- XEM:   Toàn bộ nhân viên; Khách hàng chỉ xem lịch của chính mình
-- THÊM:  SUPER_ADMIN, ADMIN, SALES_CONSULTANT, MASTER_ARTIST, Khách hàng tự đặt
-- SỬA:   SUPER_ADMIN, ADMIN, SALES, Artist được phân công (cập nhật trạng thái)
-- XÓA:   CHỈ SUPER_ADMIN, ADMIN
-- ==============================================================================
DROP POLICY IF EXISTS "bookings_select_policy" ON bookings;
CREATE POLICY "bookings_select_policy" ON bookings
FOR SELECT USING (
    is_admin_or_super()
    OR current_user_role() IN ('MASTER_ARTIST', 'ARTIST', 'SALES_CONSULTANT', 'ACADEMY_TRAINER')
    OR artist_id = auth.uid()
    OR customer_id = auth.uid()
);

DROP POLICY IF EXISTS "bookings_insert_policy" ON bookings;
CREATE POLICY "bookings_insert_policy" ON bookings
FOR INSERT WITH CHECK (
    is_admin_or_super()
    OR current_user_role() IN ('SALES_CONSULTANT', 'MASTER_ARTIST', 'ARTIST')
    OR customer_id = auth.uid()
);

DROP POLICY IF EXISTS "bookings_update_policy" ON bookings;
CREATE POLICY "bookings_update_policy" ON bookings
FOR UPDATE USING (
    is_admin_or_super()
    OR current_user_role() = 'SALES_CONSULTANT'
    OR artist_id = auth.uid()
);

DROP POLICY IF EXISTS "bookings_delete_policy" ON bookings;
CREATE POLICY "bookings_delete_policy" ON bookings
FOR DELETE USING (
    is_admin_or_super()
);


-- ==============================================================================
-- BẢNG 3: KHÓA HỌC & ĐÀO TẠO (academy_courses)
-- XEM:   MỌI NGƯỜI ĐƯỢC XEM (Public)
-- THÊM:  SUPER_ADMIN, ADMIN, MASTER_ARTIST
-- SỬA:   SUPER_ADMIN, ADMIN, MASTER_ARTIST (sửa giá, lịch học, video demo)
-- XÓA:   CHỈ SUPER_ADMIN, ADMIN
-- ==============================================================================
DROP POLICY IF EXISTS "courses_select_policy" ON academy_courses;
CREATE POLICY "courses_select_policy" ON academy_courses
FOR SELECT USING (true);

DROP POLICY IF EXISTS "courses_insert_policy" ON academy_courses;
CREATE POLICY "courses_insert_policy" ON academy_courses
FOR INSERT WITH CHECK (
    is_admin_or_super() OR current_user_role() = 'MASTER_ARTIST'
);

DROP POLICY IF EXISTS "courses_update_policy" ON academy_courses;
CREATE POLICY "courses_update_policy" ON academy_courses
FOR UPDATE USING (
    is_admin_or_super() OR current_user_role() = 'MASTER_ARTIST'
);

DROP POLICY IF EXISTS "courses_delete_policy" ON academy_courses;
CREATE POLICY "courses_delete_policy" ON academy_courses
FOR DELETE USING (
    is_admin_or_super()
);


-- ==============================================================================
-- BẢNG 4: HỒ SƠ HỌC VIÊN & ĐĂNG KÝ (academy_enrollments)
-- XEM:   SUPER_ADMIN, ADMIN, MASTER_ARTIST, ACADEMY_TRAINER, SALES; Học viên xem của mình
-- THÊM:  SUPER_ADMIN, ADMIN, SALES (tuyển sinh), Học viên (đăng ký mua khóa học)
-- SỬA:   SUPER_ADMIN, ADMIN, TRAINER (chấm điểm tay nghề), SALES (cập nhật học phí)
-- XÓA:   CHỈ SUPER_ADMIN, ADMIN
-- ==============================================================================
DROP POLICY IF EXISTS "enrollments_select_policy" ON academy_enrollments;
CREATE POLICY "enrollments_select_policy" ON academy_enrollments
FOR SELECT USING (
    is_admin_or_super()
    OR current_user_role() IN ('MASTER_ARTIST', 'ACADEMY_TRAINER', 'SALES_CONSULTANT')
    OR student_id = auth.uid()
);

DROP POLICY IF EXISTS "enrollments_insert_policy" ON academy_enrollments;
CREATE POLICY "enrollments_insert_policy" ON academy_enrollments
FOR INSERT WITH CHECK (
    is_admin_or_super()
    OR current_user_role() = 'SALES_CONSULTANT'
    OR student_id = auth.uid()
);

DROP POLICY IF EXISTS "enrollments_update_policy" ON academy_enrollments;
CREATE POLICY "enrollments_update_policy" ON academy_enrollments
FOR UPDATE USING (
    is_admin_or_super()
    OR current_user_role() IN ('MASTER_ARTIST', 'ACADEMY_TRAINER', 'SALES_CONSULTANT')
);

DROP POLICY IF EXISTS "enrollments_delete_policy" ON academy_enrollments;
CREATE POLICY "enrollments_delete_policy" ON academy_enrollments
FOR DELETE USING (
    is_admin_or_super()
);


-- ==============================================================================
-- BẢNG 5: MẪU MAKEUP LOOKBOOK & BẢNG GIÁ (makeup_looks)
-- XEM:   MỌI NGƯỜI ĐƯỢC XEM (Public)
-- THÊM:  SUPER_ADMIN, ADMIN, MASTER_ARTIST, ARTIST (đăng mẫu tác phẩm của mình)
-- SỬA:   SUPER_ADMIN, ADMIN, MASTER_ARTIST hoặc Tác giả Artist
-- XÓA:   SUPER_ADMIN, ADMIN hoặc Tác giả Artist
-- ==============================================================================
DROP POLICY IF EXISTS "looks_select_policy" ON makeup_looks;
CREATE POLICY "looks_select_policy" ON makeup_looks
FOR SELECT USING (true);

DROP POLICY IF EXISTS "looks_insert_policy" ON makeup_looks;
CREATE POLICY "looks_insert_policy" ON makeup_looks
FOR INSERT WITH CHECK (
    is_admin_or_super() OR current_user_role() IN ('MASTER_ARTIST', 'ARTIST')
);

DROP POLICY IF EXISTS "looks_update_policy" ON makeup_looks;
CREATE POLICY "looks_update_policy" ON makeup_looks
FOR UPDATE USING (
    is_admin_or_super()
    OR current_user_role() = 'MASTER_ARTIST'
    OR author_artist_id = auth.uid()
);

DROP POLICY IF EXISTS "looks_delete_policy" ON makeup_looks;
CREATE POLICY "looks_delete_policy" ON makeup_looks
FOR DELETE USING (
    is_admin_or_super() OR author_artist_id = auth.uid()
);

-- ==============================================================================
-- HOÀN TẤT THIẾT LẬP PHÂN QUYỀN RLS
-- ==============================================================================
