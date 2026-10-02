import React, { useState, useMemo, useEffect } from 'react';
import { ScreenId, Staff, CashVoucher, VoucherCategory, VoucherType } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import {
  getCashVouchers,
  saveCashVoucher,
  deleteCashVoucher,
  getMonthlyCashStats,
  VOUCHER_CATEGORY_LABELS,
} from '../services/cashFlowService';
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  TrendingUp,
  Wallet,
  ShoppingBag,
  Calendar,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  DollarSign,
  Package,
  Building,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  CreditCard,
  User,
  Info,
  Layers,
  ArrowLeft,
} from 'lucide-react';

interface CashFlowScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  currentUser?: Staff;
}

export const CashFlowScreen: React.FC<CashFlowScreenProps> = ({
  onNavigate,
  onBack,
  currentUser,
}) => {
  // Lựa chọn tháng & năm
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  // Danh sách phiếu & bộ lọc
  const [vouchers, setVouchers] = useState<CashVoucher[]>(() => getCashVouchers());
  const [filterTab, setFilterTab] = useState<'ALL' | 'SUPPLIES' | 'EXPENSE' | 'INCOME'>('SUPPLIES');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal tạo / sửa phiếu
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<CashVoucher | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    type: 'EXPENSE' as VoucherType,
    category: 'SUPPLIES_COSMETICS' as VoucherCategory,
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    recipientOrPayer: '',
    paymentMethod: 'TRANSFER' as 'TRANSFER' | 'CASH' | 'CARD',
    referenceCode: '',
    notes: '',
  });

  // Modal xem chi tiết
  const [viewingVoucher, setViewingVoucher] = useState<CashVoucher | null>(null);

  // Cập nhật lại danh sách khi load
  const reloadVouchers = () => {
    setVouchers(getCashVouchers());
  };

  // Thống kê theo tháng được chọn
  const monthlyStats = useMemo(() => {
    return getMonthlyCashStats(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, vouchers]);

  // Lọc phiếu theo tháng, filterTab và từ khóa tìm kiếm
  const filteredVouchers = useMemo(() => {
    const monthPrefix = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    let list = vouchers.filter((v) => v.date.startsWith(monthPrefix));

    // Lọc theo Tab
    if (filterTab === 'SUPPLIES') {
      list = list.filter(
        (v) =>
          v.type === 'EXPENSE' &&
          (v.category === 'SUPPLIES_COSMETICS' ||
            v.category === 'SUPPLIES_ACADEMY' ||
            v.category === 'EQUIPMENT')
      );
    } else if (filterTab === 'EXPENSE') {
      list = list.filter((v) => v.type === 'EXPENSE');
    } else if (filterTab === 'INCOME') {
      list = list.filter((v) => v.type === 'INCOME');
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.code.toLowerCase().includes(q) ||
          v.recipientOrPayer.toLowerCase().includes(q) ||
          (v.notes && v.notes.toLowerCase().includes(q))
      );
    }

    return list;
  }, [vouchers, selectedMonth, selectedYear, filterTab, searchQuery]);

  // Điều hướng chuyển tháng
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const handleCurrentMonth = () => {
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());
  };

  // Mở modal tạo phiếu mới
  const handleOpenCreateModal = (defaultSupplies: boolean = true) => {
    setEditingVoucher(null);
    setFormData({
      type: 'EXPENSE',
      category: defaultSupplies ? 'SUPPLIES_COSMETICS' : 'OPERATIONS',
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      recipientOrPayer: '',
      paymentMethod: 'TRANSFER',
      referenceCode: '',
      notes: '',
    });
    setIsFormModalOpen(true);
  };

  // Mở modal sửa phiếu
  const handleOpenEditModal = (v: CashVoucher) => {
    setEditingVoucher(v);
    setFormData({
      type: v.type,
      category: v.category,
      title: v.title,
      amount: v.amount.toString(),
      date: v.date,
      recipientOrPayer: v.recipientOrPayer,
      paymentMethod: v.paymentMethod,
      referenceCode: v.referenceCode || '',
      notes: v.notes || '',
    });
    setIsFormModalOpen(true);
  };

  // Lưu phiếu
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(formData.amount.replace(/\D/g, ''), 10);
    if (!numAmount || numAmount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ lớn hơn 0');
      return;
    }
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề hoặc nội dung phiếu');
      return;
    }

    const catMeta = VOUCHER_CATEGORY_LABELS[formData.category];

    await saveCashVoucher({
      id: editingVoucher?.id,
      code: editingVoucher?.code,
      type: formData.type,
      category: formData.category,
      categoryName: catMeta ? catMeta.label : formData.category,
      title: formData.title.trim(),
      amount: numAmount,
      date: formData.date,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      recipientOrPayer: formData.recipientOrPayer.trim() || (formData.type === 'EXPENSE' ? 'Nhà cung cấp' : 'Khách hàng'),
      creatorName: currentUser?.fullName || 'Quản lý CELLA',
      paymentMethod: formData.paymentMethod,
      referenceCode: formData.referenceCode.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    });

    reloadVouchers();
    setIsFormModalOpen(false);
  };

  // Xóa phiếu
  const handleDeleteVoucher = async (id: string, code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phiếu [${code}] không?`)) {
      await deleteCashVoucher(id);
      reloadVouchers();
      if (viewingVoucher?.id === id) setViewingVoucher(null);
    }
  };

  return (
    <div className="min-h-full bg-[#F4F7F4] bg-botanical-mesh flex flex-col pb-24 text-slate-900 select-none">
      {/* ─── Header ─── */}
      <MobileHeader
        title="Phiếu Thu - Chi"
        subtitle="Sổ quỹ & Quản lý mua nguyên vật tư hàng tháng"
        showBack={true}
        onBack={onBack || (() => onNavigate('home'))}
        rightAction={
          <button
            onClick={() => handleOpenCreateModal(true)}
            className="btn-forest px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Phiếu</span>
          </button>
        }
      />

      <div className="px-3.5 pt-2 space-y-3">
        {/* ─── Month Navigation Pill Bar ─── */}
        <div className="flex items-center justify-between bg-white/95 backdrop-blur-xl p-2 rounded-2xl border border-[#264736]/15 shadow-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#EAF2EC] text-[#264736] transition-colors cursor-pointer"
              title="Tháng trước"
            >
              <ChevronLeft className="w-4.5 h-4.5 stroke-[2.2]" />
            </button>

            <div className="px-2.5 py-1 rounded-xl bg-[#EAF2EC] border border-[#264736]/15 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#264736]" />
              <span className="text-[13px] font-black text-[#1E3A2F]">
                Tháng {selectedMonth}/{selectedYear}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#EAF2EC] text-[#264736] transition-colors cursor-pointer"
              title="Tháng sau"
            >
              <ChevronRight className="w-4.5 h-4.5 stroke-[2.2]" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {(selectedMonth !== today.getMonth() + 1 || selectedYear !== today.getFullYear()) && (
              <button
                onClick={handleCurrentMonth}
                className="text-[11px] font-bold text-[#264736] bg-[#EAF2EC] px-2.5 py-1.5 rounded-xl hover:bg-[#DEEAE1] transition-all cursor-pointer"
              >
                Hôm nay
              </button>
            )}

            <button
              onClick={() => onNavigate('revenue')}
              className="text-[11px] font-bold text-[#264736] hover:underline px-1.5 py-1 cursor-pointer"
            >
              Doanh thu &gt;
            </button>
          </div>
        </div>

        {/* ─── KPI Financial Cards (Focused on Monthly Supplies & Balance) ─── */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card: Tổng Chi (Highlight Nguyên Vật Tư) */}
          <GlassCard className="p-3.5 bg-white border border-rose-100 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span className="flex items-center gap-1 text-rose-700 font-bold">
                <ArrowDownRight className="w-4 h-4 text-rose-600" />
                Tổng Chi Tháng {selectedMonth}
              </span>
            </div>

            <h3 className="text-[18px] font-black text-rose-600 tracking-tight leading-none my-1">
              -{monthlyStats.totalExpense.toLocaleString('vi-VN')} đ
            </h3>

            {/* Chi tiết nguyên vật tư */}
            <div className="mt-2 pt-2 border-t border-rose-50 text-[11px] text-slate-600 space-y-0.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-rose-900 flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3 text-rose-600" />
                  Mua nguyên vật tư:
                </span>
                <strong className="text-rose-700 font-bold">
                  {monthlyStats.totalSuppliesExpense.toLocaleString('vi-VN')} đ
                </strong>
              </div>
              <p className="text-[10px] text-slate-400">
                Chiếm {monthlyStats.suppliesPercentOfExpense}% tổng chi phí hoạt động
              </p>
            </div>
          </GlassCard>

          {/* Card: Tổng Thu */}
          <GlassCard className="p-3.5 bg-white border border-emerald-100 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span className="flex items-center gap-1 text-emerald-800 font-bold">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                Tổng Thu Tháng {selectedMonth}
              </span>
            </div>

            <h3 className="text-[18px] font-black text-emerald-700 tracking-tight leading-none my-1">
              +{monthlyStats.totalIncome.toLocaleString('vi-VN')} đ
            </h3>

            {/* Tồn quỹ ròng */}
            <div className="mt-2 pt-2 border-t border-emerald-50 text-[11px] text-slate-600 space-y-0.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#1F392C] flex items-center gap-1">
                  <Wallet className="w-3 h-3 text-[#264736]" />
                  Tồn quỹ ròng:
                </span>
                <strong className={`font-black ${monthlyStats.netBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {monthlyStats.netBalance >= 0 ? '+' : ''}{monthlyStats.netBalance.toLocaleString('vi-VN')} đ
                </strong>
              </div>
              <p className="text-[10px] text-slate-400">
                {monthlyStats.count} phiếu phát sinh trong tháng
              </p>
            </div>
          </GlassCard>
        </div>

        {/* ─── Search & Quick Action Buttons ─── */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tiêu đề, nhà cung cấp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-8 bg-white border border-[#264736]/15 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#264736] focus:ring-1 focus:ring-[#264736]/20 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => handleOpenCreateModal(true)}
            className="h-10 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs cursor-pointer shrink-0"
            title="Tạo phiếu chi mua nguyên vật tư"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-rose-600" />
            <span>+ Chi vật tư</span>
          </button>
        </div>

        {/* ─── Filter Tabs Bar ─── */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-white/90 backdrop-blur-md rounded-xl border border-[#264736]/10 text-xs font-bold shadow-2xs">
          <button
            onClick={() => setFilterTab('SUPPLIES')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              filterTab === 'SUPPLIES'
                ? 'bg-[#264736] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="truncate">🛒 Mua vật tư</span>
          </button>

          <button
            onClick={() => setFilterTab('EXPENSE')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              filterTab === 'EXPENSE'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span className="truncate">Phiếu Chi</span>
          </button>

          <button
            onClick={() => setFilterTab('INCOME')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              filterTab === 'INCOME'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="truncate">Phiếu Thu</span>
          </button>

          <button
            onClick={() => setFilterTab('ALL')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              filterTab === 'ALL'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="truncate">Tất cả ({monthlyStats.count})</span>
          </button>
        </div>

        {/* ─── Vouchers List ─── */}
        <div className="space-y-2.5">
          {filteredVouchers.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-slate-800">Chưa có phiếu nào trong mục này</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tháng {selectedMonth}/{selectedYear} chưa phát sinh phiếu theo bộ lọc đang chọn.
                </p>
              </div>
              <button
                onClick={() => handleOpenCreateModal(filterTab === 'SUPPLIES')}
                className="btn-forest px-4 py-2 text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Lập phiếu chi mua vật tư ngay</span>
              </button>
            </div>
          ) : (
            filteredVouchers.map((v) => {
              const isExpense = v.type === 'EXPENSE';
              const isSupplies =
                v.category === 'SUPPLIES_COSMETICS' ||
                v.category === 'SUPPLIES_ACADEMY' ||
                v.category === 'EQUIPMENT';
              const catMeta = VOUCHER_CATEGORY_LABELS[v.category];

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#264736]/10 shadow-xs hover:border-[#264736]/30 transition-all space-y-2.5"
                >
                  {/* Top Row: Code, Date & Type Badge */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        {v.code}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {v.date} {v.time && `· ${v.time}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isSupplies && (
                        <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          🛒 VẬT TƯ
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          isExpense
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {isExpense ? 'Phiếu Chi' : 'Phiếu Thu'}
                      </span>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <h4 className="text-[13.5px] font-bold text-slate-900 leading-snug">
                      {v.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className={`text-[10.5px] font-medium px-2 py-0.5 rounded-md border ${catMeta?.color || 'bg-slate-50 text-slate-600'}`}>
                        {catMeta?.label || v.categoryName}
                      </span>
                      {v.paymentMethod && (
                        <span className="text-[10.5px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                          {v.paymentMethod === 'TRANSFER' ? 'Chuyển khoản' : v.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Thẻ'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recipient / Partner & Amount */}
                  <div className="flex items-end justify-between pt-1 border-t border-slate-100">
                    <div className="text-[11px] text-slate-500 max-w-[60%] truncate">
                      <span className="text-slate-400">Đối tác:</span>{' '}
                      <strong className="text-slate-700 font-semibold">{v.recipientOrPayer}</strong>
                      {v.referenceCode && (
                        <span className="block text-[10px] text-slate-400 font-mono">
                          Số HĐ: {v.referenceCode}
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[15px] font-black tracking-tight ${
                          isExpense ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        {isExpense ? '-' : '+'}{v.amount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                  {/* Notes / Items preview */}
                  {v.notes && (
                    <div className="text-[11px] text-slate-600 bg-[#F4F7F4] p-2 rounded-xl border border-[#264736]/10 text-xs line-clamp-2">
                      <span className="font-semibold text-[#1F392C]">Chi tiết:</span> {v.notes}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => setViewingVoucher(v)}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#264736] hover:bg-[#EAF2EC] rounded-lg transition-colors cursor-pointer"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(v)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Chỉnh sửa phiếu"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVoucher(v.id, v.code)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa phiếu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── MODAL TẠO / SỬA PHIẾU THU - CHI ─── */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3.5 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF2EC] text-[#264736] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900">
                    {editingVoucher ? `Chỉnh sửa ${editingVoucher.code}` : 'Lập Phiếu Thu - Chi'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Ghi nhận mua nguyên vật tư, vận hành & doanh thu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5">
              {/* Loại phiếu Toggle */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Loại phiếu:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({
                        ...p,
                        type: 'EXPENSE',
                        category: p.category.startsWith('INCOME') ? 'SUPPLIES_COSMETICS' : p.category,
                      }));
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      formData.type === 'EXPENSE'
                        ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4 text-rose-600" />
                    <span>Phiếu Chi (Mua vật tư/Chi phí)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({
                        ...p,
                        type: 'INCOME',
                        category: !p.category.startsWith('INCOME') ? 'INCOME_SERVICE' : p.category,
                      }));
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      formData.type === 'INCOME'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    <span>Phiếu Thu (Doanh thu)</span>
                  </button>
                </div>
              </div>

              {/* Hạng mục phân loại */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Hạng mục {formData.type === 'EXPENSE' ? 'chi phí' : 'nguồn thu'}:
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value as VoucherCategory }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#264736] focus:outline-none focus:ring-1 focus:ring-[#264736] bg-[#F8FAF8]"
                >
                  {formData.type === 'EXPENSE' ? (
                    <>
                      <optgroup label="🛍️ Mua nguyên vật tư & Mỹ phẩm">
                        <option value="SUPPLIES_COSMETICS">Mỹ phẩm & Nguyên vật tư Studio (Son, kem nền, mi gân tơ, mút...)</option>
                        <option value="SUPPLIES_ACADEMY">Vật tư thực hành Học viện Academy (Cốp đồ nghề, cọ, bảng mắt...)</option>
                        <option value="EQUIPMENT">Dụng cụ cọ, máy móc & đèn trang điểm</option>
                      </optgroup>
                      <optgroup label="🏢 Chi phí vận hành">
                        <option value="OPERATIONS">Chi phí mặt bằng, điện nước, internet</option>
                        <option value="MARKETING">Chi phí quảng cáo Facebook / TikTok</option>
                        <option value="SALARY_ADVANCE">Lương, thưởng & Tạm ứng nhân viên</option>
                        <option value="OTHER">Chi phí khác</option>
                      </optgroup>
                    </>
                  ) : (
                    <>
                      <optgroup label="💰 Doanh thu dịch vụ & đào tạo">
                        <option value="INCOME_SERVICE">Thu dịch vụ Makeup Cô dâu & Dự tiệc</option>
                        <option value="INCOME_ACADEMY">Thu học phí Khóa học Academy (Pro / Master / Cá nhân)</option>
                        <option value="INCOME_RETAIL">Thu bán lẻ mỹ phẩm & phụ kiện</option>
                        <option value="OTHER">Khoản thu khác</option>
                      </optgroup>
                    </>
                  )}
                </select>
              </div>

              {/* Tiêu đề phiếu */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tiêu đề / Nội dung phiếu:
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    formData.type === 'EXPENSE'
                      ? 'Vd: Mua 10 chai kem nền MAC, 50 hộp mi gân tơ...'
                      : 'Vd: Thu trọn gói Makeup cô dâu ngày cưới VIP...'
                  }
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#264736] focus:outline-none focus:ring-1 focus:ring-[#264736] bg-white"
                />
              </div>

              {/* Số tiền & Ngày */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Số tiền (VNĐ):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0 đ"
                    value={
                      formData.amount
                        ? parseInt(formData.amount.replace(/\D/g, ''), 10).toLocaleString('vi-VN')
                        : ''
                    }
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData((p) => ({ ...p, amount: val }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:border-[#264736] focus:outline-none focus:ring-1 focus:ring-[#264736] bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Ngày ghi nhận:
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#264736] focus:outline-none focus:ring-1 focus:ring-[#264736] bg-white"
                  />
                </div>
              </div>

              {/* Đối tác / Nhà cung cấp & Hình thức thanh toán */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {formData.type === 'EXPENSE' ? 'Nhà cung cấp / Đối tác:' : 'Người nộp tiền:'}
                  </label>
                  <input
                    type="text"
                    placeholder={formData.type === 'EXPENSE' ? 'Vd: Kho Phụ Liệu Lan Anh' : 'Vd: Cô dâu Mai Linh'}
                    value={formData.recipientOrPayer}
                    onChange={(e) => setFormData((p) => ({ ...p, recipientOrPayer: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#264736] focus:outline-none focus:ring-1 focus:ring-[#264736] bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Hình thức thanh toán:
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData((p) => ({ ...p, paymentMethod: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#264736] focus:outline-none focus:ring-1 focus:ring-[#264736] bg-[#F8FAF8]"
                  >
                    <option value="TRANSFER">Chuyển khoản (VietQR / MB)</option>
                    <option value="CASH">Tiền mặt tại quầy</option>
                    <option value="CARD">Cà thẻ POS</option>
                  </select>
                </div>
              </div>

              {/* Số hóa đơn / Mã tham chiếu */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Số hóa đơn / Mã chứng từ (nếu có):
                </label>
                <input
                  type="text"
                  placeholder="Vd: HD-202610-09, UNC-9921, BIENLAI-01"
                  value={formData.referenceCode}
                  onChange={(e) => setFormData((p) => ({ ...p, referenceCode: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:border-[#264736] focus:outline-none focus:ring-1 focus:ring-[#264736] bg-white"
                />
              </div>

              {/* Ghi chú chi tiết quy cách hàng hóa */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Chi tiết quy cách, số lượng nguyên vật tư mua:
                </label>
                <textarea
                  rows={3}
                  placeholder="Vd: 20 hộp mi gân tơ số 5 x 42k; 5 chai xịt MAC Fix+ x 650k; 10 mút hồ lô x 25k..."
                  value={formData.notes}
                  onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#264736] focus:outline-none focus:ring-1 focus:ring-[#264736] bg-white"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl btn-forest text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {editingVoucher ? 'Lưu Thay Đổi' : 'Xác Nhận Lập Phiếu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL XEM CHI TIẾT PHIẾU ─── */}
      {viewingVoucher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF2EC] text-[#264736] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900">{viewingVoucher.code}</h3>
                  <p className="text-[11px] text-slate-400">Chi tiết chứng từ thu chi</p>
                </div>
              </div>
              <button
                onClick={() => setViewingVoucher(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#F4F7F4] border border-[#264736]/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Số tiền chứng từ:</span>
                  <div className={`text-xl font-black ${viewingVoucher.type === 'EXPENSE' ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {viewingVoucher.type === 'EXPENSE' ? '-' : '+'}{viewingVoucher.amount.toLocaleString('vi-VN')} đ
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${viewingVoucher.type === 'EXPENSE' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                  {viewingVoucher.type === 'EXPENSE' ? 'Phiếu Chi' : 'Phiếu Thu'}
                </span>
              </div>

              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nội dung:</span>
                  <span className="font-bold text-right max-w-[70%]">{viewingVoucher.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hạng mục:</span>
                  <span className="font-semibold text-right">{viewingVoucher.categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngày phát sinh:</span>
                  <span className="font-semibold">{viewingVoucher.date} {viewingVoucher.time && `· ${viewingVoucher.time}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Đối tác / Nhà cung cấp:</span>
                  <span className="font-bold text-[#1F392C]">{viewingVoucher.recipientOrPayer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Người lập phiếu:</span>
                  <span className="font-semibold">{viewingVoucher.creatorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phương thức:</span>
                  <span className="font-semibold">{viewingVoucher.paymentMethod === 'TRANSFER' ? 'Chuyển khoản VietQR' : viewingVoucher.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Thẻ'}</span>
                </div>
                {viewingVoucher.referenceCode && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số HĐ / Chứng từ:</span>
                    <span className="font-mono font-bold text-slate-800">{viewingVoucher.referenceCode}</span>
                  </div>
                )}
              </div>

              {/* Items List if available */}
              {viewingVoucher.itemsList && viewingVoucher.itemsList.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 block">Danh mục vật tư chi tiết:</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {viewingVoucher.itemsList.map((item, idx) => (
                      <div key={idx} className="p-2 flex items-center justify-between text-[11.5px] bg-white">
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.quantity} x {item.unitPrice.toLocaleString('vi-VN')} đ</p>
                        </div>
                        <span className="font-bold text-slate-700">{item.subtotal.toLocaleString('vi-VN')} đ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewingVoucher.notes && (
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-amber-900 text-[11.5px]">
                  <strong>Ghi chú:</strong> {viewingVoucher.notes}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const v = viewingVoucher;
                  setViewingVoucher(null);
                  handleOpenEditModal(v);
                }}
                className="flex-1 py-2 rounded-xl border border-[#264736]/20 bg-[#EAF2EC] text-[#1E3A2F] font-bold text-xs hover:bg-[#DEEAE1] transition-all cursor-pointer"
              >
                Chỉnh sửa
              </button>
              <button
                type="button"
                onClick={() => setViewingVoucher(null)}
                className="flex-1 py-2 rounded-xl btn-forest font-bold text-xs shadow-sm cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
