import React, { useState } from 'react';
import { Customer, ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import { PrimaryButton } from '../components/common/PrimaryButton';
import {
  Phone,
  MessageCircle,
  CalendarPlus,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  User,
  Plus,
  Send,
  MoreVertical,
  Edit2,
} from 'lucide-react';

interface CustomerDetailScreenProps {
  customer: Customer;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  onQuickCall: (customer: Customer) => void;
  onQuickMessage: (customer: Customer) => void;
  onAddNote: (customerId: string, noteText: string) => void;
}

export const CustomerDetailScreen: React.FC<CustomerDetailScreenProps> = ({
  customer,
  onBack,
  onNavigate,
  onQuickCall,
  onQuickMessage,
  onAddNote,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'booking' | 'notes'>('info');
  const [newNoteInput, setNewNoteInput] = useState('');

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    onAddNote(customer.id, newNoteInput.trim());
    setNewNoteInput('');
  };

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900">
      {/* Header */}
      <MobileHeader
        showBack
        onBack={onBack}
        title="Chi tiết khách hàng"
        subtitle={customer.id}
        rightAction={
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('create_customer')}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Chỉnh sửa"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Tùy chọn khác"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="px-4 pt-2 space-y-3.5">
        {/* Profile Card (Matching screenshot 9) */}
        <GlassCard className="p-4 bg-white border border-slate-100 flex flex-col items-center text-center">
          <div className="relative mb-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#5850EC] to-[#A855F7] text-white font-bold text-xl flex items-center justify-center shadow-md">
              {customer.name
                .split(' ')
                .map((n) => n[0])
                .slice(-2)
                .join('')}
            </div>
            {customer.vipTier && (
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                {customer.vipTier}
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-900">{customer.name}</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{customer.phone}</p>
          {customer.email && (
            <p className="text-[11px] text-slate-400">{customer.email}</p>
          )}

          <div className="flex items-center gap-1.5 mt-2.5">
            <AuraBadge variant="primary" size="xs">
              {customer.status === 'LEAD' ? 'Lead mới' : customer.status}
            </AuraBadge>
            <AuraBadge variant="purple" size="xs">
              {customer.source}
            </AuraBadge>
          </div>

          {/* 4 Action Buttons Grid (Matching screenshot 9) */}
          <div className="grid grid-cols-4 gap-2 w-full mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onQuickCall(customer)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-emerald-50 active:scale-95 transition-all text-slate-700"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Gọi điện</span>
            </button>

            <button
              onClick={() => onQuickMessage(customer)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-sky-50 active:scale-95 transition-all text-slate-700"
            >
              <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Nhắn tin</span>
            </button>

            <button
              onClick={() => onNavigate('create_booking')}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-indigo-50 active:scale-95 transition-all text-slate-700"
            >
              <div className="w-9 h-9 rounded-full bg-[#EFF4FF] text-[#5850EC] flex items-center justify-center">
                <CalendarPlus className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Đặt lịch</span>
            </button>

            <button
              onClick={() => setActiveSubTab('notes')}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-amber-50 active:scale-95 transition-all text-slate-700"
            >
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Ghi chú</span>
            </button>
          </div>
        </GlassCard>

        {/* Segmented control tabs (Matching screenshot 9) */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 rounded-xl">
          <button
            onClick={() => setActiveSubTab('info')}
            className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'info'
                ? 'bg-white text-[#5850EC] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Thông tin
          </button>
          <button
            onClick={() => setActiveSubTab('booking')}
            className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'booking'
                ? 'bg-white text-[#5850EC] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lịch hẹn (1)
          </button>
          <button
            onClick={() => setActiveSubTab('notes')}
            className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'notes'
                ? 'bg-white text-[#5850EC] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ghi chú & CSKH
          </button>
        </div>

        {/* TAB 1: THÔNG TIN */}
        {activeSubTab === 'info' && (
          <div className="space-y-3">
            {/* Lịch hẹn sắp tới banner (Matching screenshot 9) */}
            <div
              onClick={() => onNavigate('booking_detail')}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-[#EFF4FF] to-white border border-[#5850EC]/30 shadow-xs cursor-pointer hover:border-[#5850EC] transition-all"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#5850EC] uppercase tracking-wider mb-2">
                <span>LỊCH HẸN SẮP TỚI</span>
                <span className="px-2 py-0.5 rounded-full bg-[#5850EC] text-white text-[10px]">
                  Ca trực tiếp
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#5850EC] text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold">Thứ 6</span>
                  <span className="text-base font-extrabold leading-none">25</span>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Tư vấn khóa học thẩm mỹ & Lộ trình Master Trainer
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>09:00 - 10:30 • Cơ sở Q.1</span>
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Chuyên gia: Lan Anh (Master Trainer)</span>
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>

            {/* Thông tin cơ bản (Matching screenshot 9) */}
            <GlassCard className="p-3.5 bg-white space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Thông tin cơ bản
                </h4>
                <span className="text-[11px] text-slate-400">
                  Cập nhật {customer.lastContactText || '2 giờ trước'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Ngày sinh</span>
                  <span className="font-semibold text-slate-800">
                    {customer.birthDate || '15/08/1995 (29 tuổi)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Khu vực / Địa chỉ</span>
                  <span className="font-semibold text-slate-800">
                    {customer.address || 'Quận 1, TP. Hồ Chí Minh'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Chuyên viên phụ trách</span>
                  <span className="font-semibold text-[#5850EC]">
                    {customer.assignedStaff || 'Lan Anh (Sales Team)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Nguồn tiếp cận</span>
                  <span className="font-semibold text-slate-800">{customer.source}</span>
                </div>
              </div>

              {customer.interests && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px] mb-1.5">
                    Nhu cầu quan tâm
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {customer.interests.map((interest, i) => (
                      <AuraBadge key={i} variant="primary" size="xs">
                        {interest}
                      </AuraBadge>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Skin Profile & Makeup Fit */}
            {customer.skinProfile && (
              <GlassCard className="p-3.5 bg-white space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>HỒ SƠ DA & MAKEUP PROFILE</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-900">
                    <span className="text-[10px] text-purple-600 block font-medium">Loại da</span>
                    <span className="font-bold">{customer.skinProfile.skinType}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-900">
                    <span className="text-[10px] text-amber-700 block font-medium">Undertone</span>
                    <span className="font-bold">{customer.skinProfile.undertone}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-900">
                    <span className="text-[10px] text-sky-700 block font-medium">Dáng mặt</span>
                    <span className="font-bold">{customer.skinProfile.faceShape}</span>
                  </div>
                </div>
                {customer.skinProfile.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    💡 <span className="font-medium">Chỉ định chuyên gia:</span> {customer.skinProfile.notes}
                  </p>
                )}
              </GlassCard>
            )}

            {/* Tương tác & Chi tiêu (Matching screenshot 9) */}
            <GlassCard className="p-3.5 bg-white space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tương tác & Chi tiêu
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F8F9FF] border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Tổng chi tiêu</span>
                  <span className="text-sm font-bold text-slate-900">
                    {customer.totalSpent ? `${customer.totalSpent.toLocaleString('vi-VN')} đ` : '0 đ (Đang tư vấn)'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F9FF] border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Lịch sử liên hệ</span>
                  <span className="text-sm font-bold text-slate-900">
                    {customer.contactCount || 5} lượt (3 gọi • 2 Zalo)
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 2: LỊCH HẸN */}
        {activeSubTab === 'booking' && (
          <div className="space-y-2.5">
            <GlassCard
              onClick={() => onNavigate('booking_detail')}
              className="p-3.5 bg-white cursor-pointer hover:border-[#5850EC]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#5850EC]">#BK-20250425-01</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Đã xác nhận
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Tư vấn khóa học thẩm mỹ & Lộ trình Master Trainer
              </h4>
              <div className="text-xs text-slate-500 mt-2 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Thứ Sáu, 25/04/2025 • 09:00 - 10:30</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Trụ sở chính: Tòa nhà CELLA, 128 Nguyễn Trãi, Q.1</span>
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                <span className="text-xs font-semibold text-[#5850EC] flex items-center gap-1">
                  Xem chi tiết & Check-in <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </GlassCard>

            <PrimaryButton
              variant="outline"
              fullWidth
              onClick={() => onNavigate('create_booking')}
              icon={<Plus className="w-4 h-4" />}
            >
              Tạo thêm lịch hẹn mới
            </PrimaryButton>
          </div>
        )}

        {/* TAB 3: GHI CHÚ & CSKH */}
        {activeSubTab === 'notes' && (
          <div className="space-y-3">
            {/* Form thêm ghi chú nhanh */}
            <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập ghi chú chăm sóc khách hàng..."
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                className="flex-1 h-10 px-3.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
              />
              <PrimaryButton size="sm" type="submit">
                <Send className="w-3.5 h-3.5" />
              </PrimaryButton>
            </form>

            {/* Danh sách ghi chú */}
            <div className="space-y-2">
              {(customer.notesHistory || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Chưa có ghi chú nào. Hãy nhập ghi chú đầu tiên!
                </p>
              ) : (
                customer.notesHistory?.map((note) => (
                  <GlassCard key={note.id} className="p-3 bg-white space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#5850EC]">{note.author}</span>
                      <span className="text-slate-400">{note.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700">{note.content}</p>
                  </GlassCard>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
