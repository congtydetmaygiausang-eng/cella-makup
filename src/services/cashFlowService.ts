import { CashVoucher, VoucherCategory, VoucherType } from '../types';
import { supabase } from '../config/supabase';

const STORAGE_KEY = 'cella_cash_flow_vouchers_v1';

export const VOUCHER_CATEGORY_LABELS: Record<VoucherCategory, { label: string; group: 'VẬT TƯ' | 'VẬN HÀNH' | 'DOANH THU' | 'KHÁC'; color: string }> = {
  SUPPLIES_COSMETICS: {
    label: 'Mỹ phẩm & Nguyên vật tư Studio',
    group: 'VẬT TƯ',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  SUPPLIES_ACADEMY: {
    label: 'Vật tư thực hành Học viện (Academy)',
    group: 'VẬT TƯ',
    color: 'bg-teal-50 text-teal-800 border-teal-200',
  },
  EQUIPMENT: {
    label: 'Dụng cụ cọ, máy & đèn trang điểm',
    group: 'VẬT TƯ',
    color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },
  OPERATIONS: {
    label: 'Chi phí mặt bằng, điện nước & studio',
    group: 'VẬN HÀNH',
    color: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  MARKETING: {
    label: 'Quảng cáo & Marketing TikTok/FB',
    group: 'VẬN HÀNH',
    color: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  SALARY_ADVANCE: {
    label: 'Lương, thưởng & Tạm ứng nhân viên',
    group: 'VẬN HÀNH',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  INCOME_SERVICE: {
    label: 'Thu dịch vụ Makeup & Làm tóc',
    group: 'DOANH THU',
    color: 'bg-emerald-100 text-[#1F392C] border-emerald-300',
  },
  INCOME_ACADEMY: {
    label: 'Thu học phí Khóa học Academy',
    group: 'DOANH THU',
    color: 'bg-green-100 text-green-900 border-green-300',
  },
  INCOME_RETAIL: {
    label: 'Thu bán lẻ mỹ phẩm & phụ kiện',
    group: 'DOANH THU',
    color: 'bg-lime-50 text-lime-800 border-lime-200',
  },
  OTHER: {
    label: 'Khoản thu / chi khác',
    group: 'KHÁC',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

// Dữ liệu mẫu thực tế của CELLA Studio & Academy cho các tháng
export const INITIAL_CASH_VOUCHERS: CashVoucher[] = [
  // THÁNG 10/2026 (Tháng hiện tại)
  {
    id: 'vc-1001',
    code: 'PC-202610-001',
    type: 'EXPENSE',
    category: 'SUPPLIES_COSMETICS',
    categoryName: 'Mỹ phẩm & Nguyên vật tư Studio',
    title: 'Nhập kem nền MAC Studio Fix, phấn Dior & son NARS tháng 10',
    amount: 14500000,
    date: '2026-10-02',
    time: '09:30',
    recipientOrPayer: 'Công ty TNHH Phân Phối Mỹ Phẩm Cao Cấp Sài Gòn',
    creatorName: 'Cella Hương Phượng',
    paymentMethod: 'TRANSFER',
    referenceCode: 'HD-MAC261002',
    notes: 'Bao gồm: 10 chai kem nền MAC Studio Fix (NC15, NC20), 4 hộp phấn phủ Dior Forever, 8 thỏi son NARS Powermatte phục vụ mùa cưới tháng 10.',
    itemsList: [
      { name: 'Kem nền MAC Studio Fix Fluid', quantity: 10, unitPrice: 750000, subtotal: 7500000 },
      { name: 'Phấn phủ Dior Forever Cushion Powder', quantity: 4, unitPrice: 1150000, subtotal: 4600000 },
      { name: 'Son kem NARS Powermatte Lip Pigment', quantity: 8, unitPrice: 300000, subtotal: 2400000 },
    ],
    status: 'COMPLETED',
    createdAt: '2026-10-02T09:30:00Z',
  },
  {
    id: 'vc-1002',
    code: 'PC-202610-002',
    type: 'EXPENSE',
    category: 'SUPPLIES_COSMETICS',
    categoryName: 'Mỹ phẩm & Nguyên vật tư Studio',
    title: 'Nhập sỉ 60 hộp mi gân tơ, keo dán mi & 30 bịch bông mút hình hồ lô',
    amount: 3850000,
    date: '2026-10-01',
    time: '14:15',
    recipientOrPayer: 'Kho Phụ Liệu Makeup Chuyên Nghiệp Lan Anh',
    creatorName: 'Trần Minh Phúc',
    paymentMethod: 'TRANSFER',
    referenceCode: 'QR-LANANH-9921',
    notes: '60 hộp mi gân tơ số 4 & 5 siêu nhẹ cho cô dâu; 10 chai keo dán mi Duo không cay mắt; 30 bịch mút vát hồ lô dặm nền.',
    itemsList: [
      { name: 'Mi gân tơ tự nhiên gân mềm (hộp 5 cặp)', quantity: 60, unitPrice: 42000, subtotal: 2520000 },
      { name: 'Keo dán mi Duo Quick-Set Dark', quantity: 10, unitPrice: 65000, subtotal: 650000 },
      { name: 'Mút dặm nền hồ lô siêu mềm Beauty Blender', quantity: 30, unitPrice: 22666, subtotal: 680000 },
    ],
    status: 'COMPLETED',
    createdAt: '2026-10-01T14:15:00Z',
  },
  {
    id: 'vc-1003',
    code: 'PC-202610-003',
    type: 'EXPENSE',
    category: 'SUPPLIES_ACADEMY',
    categoryName: 'Vật tư thực hành Học viện (Academy)',
    title: 'Nguyên vật tư & cốp đồ nghề tài trợ khóa Pro Artist Khóa K15',
    amount: 12600000,
    date: '2026-10-01',
    time: '11:00',
    recipientOrPayer: 'Cửa hàng Thiết bị & Dụng cụ Thẩm mỹ Sư phạm',
    creatorName: 'Đặng Thuỳ Tiên',
    paymentMethod: 'TRANSFER',
    referenceCode: 'HDV-K15-01',
    notes: 'Vật tư cấp phát đầu khóa cho 8 học viên Pro Artist: 8 bộ cọ 28 cây lông dê cao cấp, bảng màu mắt Morphe 35O, khay trộn nền inox & xịt khoáng.',
    itemsList: [
      { name: 'Bộ cọ chuyên nghiệp CELLA Pro 28 cây', quantity: 8, unitPrice: 1100000, subtotal: 8800000 },
      { name: 'Bảng phấn mắt Morphe Warm Pro Palette', quantity: 4, unitPrice: 650000, subtotal: 2600000 },
      { name: 'Khay inox + que trộn kem nền cao cấp', quantity: 8, unitPrice: 150000, subtotal: 1200000 },
    ],
    status: 'COMPLETED',
    createdAt: '2026-10-01T11:00:00Z',
  },
  {
    id: 'vc-1004',
    code: 'PT-202610-001',
    type: 'INCOME',
    category: 'INCOME_SERVICE',
    categoryName: 'Thu dịch vụ Makeup & Làm tóc',
    title: 'Thu trọn gói Makeup Cô dâu Ngày Cưới VIP + Mẹ cô dâu (Chị Mai Linh)',
    amount: 3400000,
    date: '2026-10-02',
    time: '07:30',
    recipientOrPayer: 'Chị Mai Linh (Khách cô dâu VIP)',
    creatorName: 'Vũ Thu Thảo',
    paymentMethod: 'TRANSFER',
    referenceCode: 'VIETQR-ML-2610',
    notes: 'Gói cô dâu ngày cưới VIP 2.500.000đ + Makeup mẹ cô dâu sang trọng 900.000đ. Đã thanh toán chuyển khoản qua VietQR đủ 100%.',
    status: 'COMPLETED',
    createdAt: '2026-10-02T07:30:00Z',
  },
  {
    id: 'vc-1005',
    code: 'PT-202610-002',
    type: 'INCOME',
    category: 'INCOME_ACADEMY',
    categoryName: 'Thu học phí Khóa học Academy',
    title: 'Học viên Nguyễn Yến Nhi đóng học phí Khóa Pro Artist K15',
    amount: 28500000,
    date: '2026-10-01',
    time: '16:00',
    recipientOrPayer: 'Nguyễn Yến Nhi (Học viên mới)',
    creatorName: 'Nguyễn Thị Lan',
    paymentMethod: 'TRANSFER',
    referenceCode: 'MB-YN-K15',
    notes: 'Thu đủ học phí trọn gói 28.500.000đ. Đã cấp phát đồng phục, hợp đồng đào tạo cam kết việc làm.',
    status: 'COMPLETED',
    createdAt: '2026-10-01T16:00:00Z',
  },
  {
    id: 'vc-1006',
    code: 'PC-202610-004',
    type: 'EXPENSE',
    category: 'OPERATIONS',
    categoryName: 'Chi phí mặt bằng, điện nước & studio',
    title: 'Tiền điện lạnh 3 pha & nước sinh hoạt Studio Atelier tháng 9',
    amount: 4250000,
    date: '2026-10-01',
    time: '10:30',
    recipientOrPayer: 'Điện Lực & Cấp Nước Khu Vực',
    creatorName: 'Nguyễn Thị Lan',
    paymentMethod: 'TRANSFER',
    referenceCode: 'EVN-998124',
    notes: 'Chi phí tiền điện chiếu sáng studio & điều hòa liên tục phục vụ đào tạo và trang điểm.',
    status: 'COMPLETED',
    createdAt: '2026-10-01T10:30:00Z',
  },

  // THÁNG 9/2026 (Tháng trước để so sánh đối soát)
  {
    id: 'vc-0901',
    code: 'PC-202609-001',
    type: 'EXPENSE',
    category: 'SUPPLIES_COSMETICS',
    categoryName: 'Mỹ phẩm & Nguyên vật tư Studio',
    title: 'Mua nguyên vật tư đầu tháng 9: Xịt khóa nền MAC, kem lót Bobbi Brown',
    amount: 11200000,
    date: '2026-09-05',
    time: '10:00',
    recipientOrPayer: 'Tổng Kho Mỹ Phẩm Authentic VN',
    creatorName: 'Cella Hương Phượng',
    paymentMethod: 'TRANSFER',
    referenceCode: 'HD-905-BB',
    notes: '8 chai xịt khóa nền MAC Prep+Prime Fix 100ml, 5 hũ kem lót kiềm dầu Bobbi Brown Vitamin Enriched Face Base.',
    status: 'COMPLETED',
    createdAt: '2026-09-05T10:00:00Z',
  },
  {
    id: 'vc-0902',
    code: 'PC-202609-002',
    type: 'EXPENSE',
    category: 'SUPPLIES_COSMETICS',
    categoryName: 'Mỹ phẩm & Nguyên vật tư Studio',
    title: 'Mua vật tư tiêu hao: Nước tẩy trang Bioderma 500ml & 40 cây chì xé định hình lông mày',
    amount: 2450000,
    date: '2026-09-12',
    time: '15:20',
    recipientOrPayer: 'Cửa hàng Phụ Liệu Minh Châu',
    creatorName: 'Trần Minh Phúc',
    paymentMethod: 'CASH',
    referenceCode: 'BL-9012',
    notes: '6 chai Bioderma nắp hồng 500ml tẩy trang cho khách, 40 cây chì xé nâu tây và nâu đen.',
    status: 'COMPLETED',
    createdAt: '2026-09-12T15:20:00Z',
  },
  {
    id: 'vc-0903',
    code: 'PT-202609-001',
    type: 'INCOME',
    category: 'INCOME_SERVICE',
    categoryName: 'Thu dịch vụ Makeup & Làm tóc',
    title: 'Thu dịch vụ Makeup đoàn tiệc hội nghị 12 khách VIP Khách sạn Mường Thanh',
    amount: 9600000,
    date: '2026-09-18',
    time: '16:45',
    recipientOrPayer: 'Công ty Cổ Phần Tập Đoàn Phú Thái',
    creatorName: 'Vũ Thu Thảo',
    paymentMethod: 'TRANSFER',
    referenceCode: 'UNC-PT-918',
    notes: 'Makeup dự tiệc sự kiện 12 người x 800.000đ/người. Artist CELLA thực hiện tận nơi.',
    status: 'COMPLETED',
    createdAt: '2026-09-18T16:45:00Z',
  },
  {
    id: 'vc-0904',
    code: 'PT-202609-002',
    type: 'INCOME',
    category: 'INCOME_ACADEMY',
    categoryName: 'Thu học phí Khóa học Academy',
    title: 'Thu học phí Khóa Master Trainer & Sư Phạm (Chị Hoàng Yến)',
    amount: 45000000,
    date: '2026-09-22',
    time: '10:30',
    recipientOrPayer: 'Chị Hoàng Yến (Học viên Master)',
    creatorName: 'Nguyễn Thị Lan',
    paymentMethod: 'TRANSFER',
    referenceCode: 'VCB-HY-MASTER',
    notes: 'Đăng ký khóa Master Trainer 6 tháng cấp bằng Sư phạm Tổng Cục GDNN mở tiệm.',
    status: 'COMPLETED',
    createdAt: '2026-09-22T10:30:00Z',
  },
];

/**
 * Lấy toàn bộ danh sách phiếu thu chi (kết hợp localStorage & fallback mẫu)
 */
export function getCashVouchers(): CashVoucher[] {
  if (typeof window === 'undefined') return INITIAL_CASH_VOUCHERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc phiếu thu chi từ localStorage:', e);
  }
  // Khởi tạo dữ liệu mẫu nếu chưa có
  setCashVouchers(INITIAL_CASH_VOUCHERS);
  return INITIAL_CASH_VOUCHERS;
}

/**
 * Lưu danh sách phiếu vào localStorage & đồng bộ Supabase nếu có
 */
export function setCashVouchers(vouchers: CashVoucher[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
    } catch (e) {
      console.error('Lỗi lưu phiếu thu chi vào localStorage:', e);
    }
  }
}

/**
 * Thêm mới hoặc cập nhật phiếu
 */
export async function saveCashVoucher(voucher: Omit<CashVoucher, 'id' | 'code' | 'createdAt'> & { id?: string; code?: string }): Promise<CashVoucher> {
  const currentList = getCashVouchers();
  const now = new Date();
  const dateStr = voucher.date || now.toISOString().split('T')[0];
  const yearMonth = dateStr.replace(/-/g, '').slice(0, 6);
  const prefix = voucher.type === 'EXPENSE' ? 'PC' : 'PT';

  let savedVoucher: CashVoucher;

  if (voucher.id) {
    // Cập nhật
    savedVoucher = {
      ...(voucher as CashVoucher),
      code: voucher.code || `${prefix}-${yearMonth}-${String(currentList.length + 1).padStart(3, '0')}`,
    };
    const updated = currentList.map((v) => (v.id === voucher.id ? savedVoucher : v));
    setCashVouchers(updated);
  } else {
    // Tạo mới
    const nextNum = currentList.filter((v) => v.date.startsWith(dateStr.slice(0, 7))).length + 1;
    const newCode = `${prefix}-${yearMonth}-${String(nextNum).padStart(3, '0')}`;
    savedVoucher = {
      ...voucher,
      id: `vc-${Date.now()}`,
      code: newCode,
      createdAt: now.toISOString(),
      status: voucher.status || 'COMPLETED',
    };
    const updated = [savedVoucher, ...currentList];
    setCashVouchers(updated);
  }

  // Cố gắng đồng bộ lên Supabase ngầm (nếu có bảng transactions)
  try {
    if (supabase) {
      await supabase.from('transactions').upsert([
        {
          id: savedVoucher.id.startsWith('vc-') ? undefined : savedVoucher.id,
          transaction_code: savedVoucher.code,
          type: savedVoucher.type,
          amount: savedVoucher.amount,
          category: savedVoucher.category,
          description: `${savedVoucher.title}. Người nhận/nộp: ${savedVoucher.recipientOrPayer}. Ghi chú: ${savedVoucher.notes || ''}`,
          date: savedVoucher.date,
        },
      ]);
    }
  } catch {}

  return savedVoucher;
}

/**
 * Xóa phiếu thu chi
 */
export async function deleteCashVoucher(id: string): Promise<boolean> {
  const currentList = getCashVouchers();
  const updated = currentList.filter((v) => v.id !== id);
  setCashVouchers(updated);

  try {
    if (supabase) {
      await supabase.from('transactions').delete().eq('id', id);
    }
  } catch {}

  return true;
}

/**
 * Thống kê thu chi theo tháng và năm
 */
export function getMonthlyCashStats(month: number, year: number) {
  const vouchers = getCashVouchers();
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

  const monthlyVouchers = vouchers.filter((v) => v.date.startsWith(monthPrefix));

  let totalIncome = 0;
  let totalExpense = 0;
  let totalSuppliesExpense = 0; // Chuyên biệt: Chi mua nguyên vật tư & mỹ phẩm

  const categoryBreakdown: Record<string, { label: string; amount: number; count: number; color: string; isSupplies: boolean }> = {};

  monthlyVouchers.forEach((v) => {
    const isSupplies = v.category === 'SUPPLIES_COSMETICS' || v.category === 'SUPPLIES_ACADEMY' || v.category === 'EQUIPMENT';

    if (v.type === 'INCOME') {
      totalIncome += v.amount;
    } else {
      totalExpense += v.amount;
      if (isSupplies) {
        totalSuppliesExpense += v.amount;
      }
    }

    if (!categoryBreakdown[v.category]) {
      const meta = VOUCHER_CATEGORY_LABELS[v.category] || { label: v.categoryName || v.category, color: 'bg-slate-100 text-slate-700' };
      categoryBreakdown[v.category] = {
        label: meta.label,
        amount: 0,
        count: 0,
        color: meta.color,
        isSupplies,
      };
    }
    categoryBreakdown[v.category].amount += v.amount;
    categoryBreakdown[v.category].count += 1;
  });

  const netBalance = totalIncome - totalExpense;
  const suppliesPercentOfExpense = totalExpense > 0 ? Math.round((totalSuppliesExpense / totalExpense) * 100) : 0;

  return {
    month,
    year,
    monthPrefix,
    vouchers: monthlyVouchers,
    totalIncome,
    totalExpense,
    totalSuppliesExpense,
    suppliesPercentOfExpense,
    netBalance,
    count: monthlyVouchers.length,
    categoryBreakdown: Object.entries(categoryBreakdown).map(([cat, data]) => ({
      category: cat as VoucherCategory,
      ...data,
    })),
  };
}
