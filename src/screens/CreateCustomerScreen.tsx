import React, { useState } from 'react';
import { Customer } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Check } from 'lucide-react';

interface CreateCustomerScreenProps {
  onBack: () => void;
  onSave: (customer: Partial<Customer>) => void;
}

export const CreateCustomerScreen: React.FC<CreateCustomerScreenProps> = ({
  onBack,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Nữ' | 'Nam' | 'Khác'>('Nữ');
  const [source, setSource] = useState<Customer['source']>('TIKTOK');
  const [status, setStatus] = useState<Customer['status']>('LEAD');
  const [skinType, setSkinType] = useState<'COMBINATION' | 'OILY' | 'DRY' | 'NORMAL'>('COMBINATION');
  const [undertone, setUndertone] = useState<'WARM' | 'COOL' | 'NEUTRAL'>('WARM');
  const [notes, setNotes] = useState('');

  const sources: { id: Customer['source']; label: string }[] = [
    { id: 'TIKTOK', label: 'TikTok' },
    { id: 'FACEBOOK', label: 'Facebook' },
    { id: 'REFERRAL', label: 'Giới thiệu' },
    { id: 'HOTLINE', label: 'Hotline' },
    { id: 'WALK_IN', label: 'Vãng lai' },
  ];

  const statuses: { id: Customer['status']; label: string }[] = [
    { id: 'LEAD', label: 'Lead mới' },
    { id: 'CONSULTING', label: 'Đang tư vấn' },
    { id: 'BOOKED', label: 'Hẹn tư vấn' },
    { id: 'VIP', label: 'Tiềm năng cao' },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại khách hàng!');
      return;
    }

    const newCust: Partial<Customer> = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      source,
      status,
      vipTier: status === 'VIP' ? 'VIP 1' : 'Thành viên mới',
      lastContactText: 'Vừa tạo',
      totalSpent: 0,
      contactCount: 1,
      skinProfile: {
        skinType,
        undertone,
        faceShape: 'OVAL',
        notes: notes.trim(),
      },
      notesHistory: notes.trim()
        ? [
            {
              id: 'n-initial',
              author: 'Nguyễn Thị Lan',
              timestamp: 'Vừa xong',
              content: notes.trim(),
            },
          ]
        : [],
    };

    onSave(newCust);
  };

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900">
      <MobileHeader
        showBack
        onBack={onBack}
        title="Thêm mới khách hàng"
        subtitle="Hệ thống quản lý CELLA"
        rightAction={
          <button
            onClick={() => handleSubmit()}
            className="text-sm font-bold text-[#5850EC] px-2 py-1 rounded-lg hover:bg-[#EFF4FF] transition-colors"
          >
            Lưu
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="px-4 pt-3 space-y-4">
        {/* THÔNG TIN CƠ BẢN (Matching screenshot 11) */}
        <GlassCard className="p-4 bg-white space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Thông tin cơ bản
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Họ và tên khách hàng *
            </label>
            <input
              type="text"
              placeholder="VD: Nguyễn Thị Mai"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-11 px-3.5 rounded-xl bg-[#F8F9FF] border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Số điện thoại *
            </label>
            <input
              type="tel"
              placeholder="VD: 0901 234 567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full h-11 px-3.5 rounded-xl bg-[#F8F9FF] border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email liên hệ
            </label>
            <input
              type="email"
              placeholder="VD: mai.tran@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#F8F9FF] border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Giới tính
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Nữ', 'Nam', 'Khác'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`h-9 rounded-xl text-xs font-semibold transition-all ${
                    gender === g
                      ? 'bg-[#5850EC] text-white'
                      : 'bg-[#F8F9FF] text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* NGUỒN & TRẠNG THÁI LEAD (Matching screenshot 11) */}
        <GlassCard className="p-4 bg-white space-y-3.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Nguồn & Trạng thái Lead
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Nguồn tiếp cận
            </label>
            <div className="flex flex-wrap gap-2">
              {sources.map((src) => (
                <button
                  type="button"
                  key={src.id}
                  onClick={() => setSource(src.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    source === src.id
                      ? 'bg-[#5850EC] text-white shadow-xs'
                      : 'bg-[#F8F9FF] text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Trạng thái ban đầu
            </label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((st) => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setStatus(st.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    status === st.id
                      ? 'bg-[#5850EC] text-white shadow-xs'
                      : 'bg-[#F8F9FF] text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* ĐẶC ĐIỂM DA & NHU CẦU */}
        <GlassCard className="p-4 bg-white space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Đặc điểm da & Nhu cầu
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loại da
              </label>
              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl bg-[#F8F9FF] border border-slate-200 text-xs font-medium focus:outline-none"
              >
                <option value="COMBINATION">Da hỗn hợp</option>
                <option value="OILY">Da dầu</option>
                <option value="DRY">Da khô</option>
                <option value="NORMAL">Da thường</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Undertone
              </label>
              <select
                value={undertone}
                onChange={(e) => setUndertone(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl bg-[#F8F9FF] border border-slate-200 text-xs font-medium focus:outline-none"
              >
                <option value="WARM">Warm Undertone</option>
                <option value="COOL">Cool Undertone</option>
                <option value="NEUTRAL">Neutral</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú tư vấn ban đầu
            </label>
            <textarea
              rows={2}
              placeholder="VD: Quan tâm khóa học trang điểm cô dâu, thích layout tự nhiên..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#F8F9FF] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
            />
          </div>
        </GlassCard>

        {/* Primary Action Button */}
        <PrimaryButton
          type="submit"
          size="lg"
          fullWidth
          icon={<Check className="w-5 h-5" />}
        >
          Tạo khách hàng mới
        </PrimaryButton>
      </form>
    </div>
  );
};
