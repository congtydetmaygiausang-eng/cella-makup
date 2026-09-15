import React, { useState } from 'react';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import { ScreenId } from '../types';
import {
  TrendingUp,
  DollarSign,
  ChevronRight,
  ArrowUpRight,
  CreditCard,
  PieChart,
} from 'lucide-react';

interface RevenueScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
}

export const RevenueScreen: React.FC<RevenueScreenProps> = ({ onNavigate, onBack }) => {
  const [period, setPeriod] = useState<'day' | 'month' | 'year' | 'custom'>('month');

  const monthlyData = [
    { month: 'T1', revenue: 160, cost: 85 },
    { month: 'T2', revenue: 195, cost: 95 },
    { month: 'T3', revenue: 220, cost: 105 },
    { month: 'T4', revenue: 256.45, cost: 118, highlight: true },
    { month: 'T5', revenue: 210, cost: 98 },
    { month: 'T6', revenue: 180, cost: 90 },
  ];

  const sources = [
    { label: 'Booking dịch vụ', percent: 45, amount: '115.402.500 đ', color: 'bg-[#5850EC]' },
    { label: 'Khóa học đào tạo', percent: 30, amount: '76.935.000 đ', color: 'bg-[#8B5CF6]' },
    { label: 'TikTok livestream', percent: 15, amount: '38.467.500 đ', color: 'bg-[#EC4899]' },
    { label: 'Sản phẩm & Mỹ phẩm', percent: 10, amount: '25.645.000 đ', color: 'bg-[#38BDF8]' },
  ];

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900">
      <MobileHeader
        title="Doanh thu"
        subtitle="Báo cáo tài chính & Tăng trưởng CELLA"
        showBack={true}
        onBack={onBack || (() => onNavigate('home'))}
        rightAction={
          <button
            onClick={() => onNavigate('payroll')}
            className="text-xs font-semibold text-[#5850EC] bg-[#EFF4FF] px-2.5 py-1.5 rounded-xl border border-[#5850EC]/20 hover:bg-[#E0EAFF]"
          >
            Bảng lương cá nhân
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-3.5">
        {/* Period Selector (Matching screenshot 6) */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
          {(['day', 'month', 'year', 'custom'] as const).map((p) => {
            const labels = { day: 'Ngày', month: 'Tháng', year: 'Năm', custom: 'Tùy chọn' };
            const isSelected = period === p;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`py-1.5 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-[#5850EC] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>

        {/* Tổng doanh thu card (Matching screenshot 6) */}
        <GlassCard className="p-4 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Tổng doanh thu Tháng 4/2025</span>
            <div className="flex items-center gap-1 text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% so với tháng trước</span>
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            256.450.000 đ
          </h2>
          <p className="text-xs text-slate-400">
            Lợi nhuận gộp ước tính: <strong className="text-slate-700">138.450.000 đ</strong> (Biên lợi nhuận 54%)
          </p>
        </GlassCard>

        {/* Bar chart Doanh thu vs Chi phí (Matching screenshot 6) */}
        <GlassCard className="p-4 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Biểu đồ Doanh thu & Chi phí
            </h3>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#5850EC]" /> Doanh thu
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-200" /> Chi phí
              </span>
            </div>
          </div>

          {/* Render bar chart */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
            {monthlyData.map((d) => {
              const revHeight = (d.revenue / 280) * 100;
              const costHeight = (d.cost / 280) * 100;

              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  {d.highlight && (
                    <div className="text-[10px] font-bold text-white bg-[#5850EC] px-1.5 py-0.5 rounded-md shadow-xs mb-1">
                      256.4M
                    </div>
                  )}
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Revenue bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className={`w-3.5 rounded-t-md transition-all ${
                        d.highlight ? 'bg-[#5850EC]' : 'bg-indigo-500 hover:bg-[#5850EC]'
                      }`}
                      title={`Doanh thu ${d.month}: ${d.revenue}M`}
                    />
                    {/* Cost bar */}
                    <div
                      style={{ height: `${costHeight}%` }}
                      className="w-3.5 rounded-t-md bg-indigo-200"
                      title={`Chi phí ${d.month}: ${d.cost}M`}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      d.highlight ? 'text-[#5850EC]' : 'text-slate-400'
                    }`}
                  >
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Nguồn doanh thu progress bars (Matching screenshot 6) */}
        <GlassCard className="p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nguồn doanh thu
            </h3>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {sources.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-normal text-[11px]">{item.amount}</span>
                    <span className="text-slate-900">{item.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${item.percent}%` }}
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Link to payroll */}
        <div
          onClick={() => onNavigate('payroll')}
          className="p-3.5 rounded-2xl bg-[#EFF4FF] border border-[#5850EC]/30 flex items-center justify-between cursor-pointer hover:bg-[#E0EAFF] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5850EC] text-white flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Bảng lương & Hoa hồng T04/2025</h4>
              <p className="text-[11px] text-slate-500">Thực nhận cá nhân: 28.450.000 đ (Đã chốt)</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
