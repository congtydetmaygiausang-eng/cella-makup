-- ==============================================================================
-- CELLA - MODULE QUẢN LÝ NHÂN SỰ & TIỀN LƯƠNG (SUPABASE SQL)
-- Gồm: Thông tin chi tiết nhân sự, Chấm công, Khen thưởng/Kỷ luật, Bảng lương
-- ==============================================================================

-- 1. BẢNG THÔNG TIN CHI TIẾT NHÂN SỰ (Mở rộng từ bảng profiles)
-- Lưu trữ các thông tin bảo mật như CMND, Ngân hàng, Bằng cấp...
DROP TABLE IF EXISTS hr_employee_details CASCADE;
DROP TABLE IF EXISTS attendances CASCADE;
DROP TABLE IF EXISTS rewards_disciplines CASCADE;
DROP TABLE IF EXISTS payrolls CASCADE;

CREATE TABLE IF NOT EXISTS hr_employee_details (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    identity_card VARCHAR(20) UNIQUE, -- CMND/CCCD
    tax_code VARCHAR(20), -- Mã số thuế
    bank_name VARCHAR(100), -- Tên ngân hàng
    bank_account_number VARCHAR(50), -- Số tài khoản
    bank_account_name VARCHAR(100), -- Tên chủ tài khoản
    emergency_contact_name VARCHAR(100), -- Người liên hệ khẩn cấp
    emergency_contact_phone VARCHAR(20), -- SĐT khẩn cấp
    education_level VARCHAR(100), -- Trình độ học vấn
    start_date DATE, -- Ngày bắt đầu làm việc
    contract_type VARCHAR(50) DEFAULT 'FULL_TIME', -- FULL_TIME, PART_TIME, PROBATION
    base_salary_agreed NUMERIC(12, 2) DEFAULT 0, -- Lương cơ bản thỏa thuận
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_hr_employee_updated
BEFORE UPDATE ON hr_employee_details
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 2. BẢNG CHẤM CÔNG (attendances)
-- Lưu lịch sử check-in, check-out hàng ngày
CREATE TABLE IF NOT EXISTS attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    check_out_time TIMESTAMPTZ,
    work_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Ngày làm việc
    status VARCHAR(20) DEFAULT 'ON_TIME', -- ON_TIME, LATE, ABSENT, LEAVE
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tạo Index tìm kiếm nhanh
CREATE INDEX idx_attendances_staff_date ON attendances(staff_id, work_date);

-- ==============================================================================
-- 3. BẢNG KHEN THƯỞNG & KỶ LUẬT (rewards_disciplines)
-- Lưu lịch sử thưởng nóng, phạt đi muộn, vi phạm...
CREATE TABLE IF NOT EXISTS rewards_disciplines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- REWARD (Thưởng), DISCIPLINE (Phạt)
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0, -- Số tiền thưởng/phạt
    reason TEXT NOT NULL, -- Lý do
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Ngày ban hành
    issued_by UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Người ra quyết định
    is_applied_to_payroll BOOLEAN DEFAULT FALSE, -- Đã tính vào lương chưa?
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rewards_disciplines_staff ON rewards_disciplines(staff_id, issued_date);

-- ==============================================================================
-- 4. BẢNG LƯƠNG (payrolls)
-- Tổng hợp lương mỗi tháng của nhân viên
CREATE TABLE IF NOT EXISTS payrolls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- VD: '2025-04'
    base_salary NUMERIC(12, 2) NOT NULL DEFAULT 0, -- Lương cơ bản
    total_allowance NUMERIC(12, 2) DEFAULT 0, -- Phụ cấp
    total_commission NUMERIC(12, 2) DEFAULT 0, -- Hoa hồng
    total_reward NUMERIC(12, 2) DEFAULT 0, -- Tổng thưởng (Từ bảng rewards)
    total_penalty NUMERIC(12, 2) DEFAULT 0, -- Tổng phạt (Từ bảng disciplines)
    net_salary NUMERIC(12, 2) GENERATED ALWAYS AS (base_salary + total_allowance + total_commission + total_reward - total_penalty) STORED, -- Lương thực nhận
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT (Nháp), APPROVED (Đã duyệt), PAID (Đã thanh toán)
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, month_year)
);

CREATE TRIGGER trg_payrolls_updated
BEFORE UPDATE ON payrolls
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 5. BẢO MẬT RLS (ROW LEVEL SECURITY)
-- Chỉ Quản lý/Admin mới xem được lương, nhân sự xem của chính mình
-- ==============================================================================
ALTER TABLE hr_employee_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;

-- Policy cho Nhân viên tự xem dữ liệu của mình
CREATE POLICY "Staff view own details" ON hr_employee_details FOR SELECT USING (auth.uid() = id OR auth.role() = 'authenticated');
CREATE POLICY "Staff view own attendances" ON attendances FOR SELECT USING (auth.uid() = staff_id OR auth.role() = 'authenticated');
CREATE POLICY "Staff view own rewards" ON rewards_disciplines FOR SELECT USING (auth.uid() = staff_id OR auth.role() = 'authenticated');
CREATE POLICY "Staff view own payrolls" ON payrolls FOR SELECT USING (auth.uid() = staff_id OR auth.role() = 'authenticated');
