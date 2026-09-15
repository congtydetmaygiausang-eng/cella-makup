import React from 'react';
import { PayrollRecord } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import {
  CreditCard,
  TrendingUp,
  Download,
  Building2,
  CheckCircle2,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface PayrollScreenProps {
  payroll: PayrollRecord;
  onBack: () => void;
}

export const PayrollScreen: React.FC<PayrollScreenProps> = ({ payroll, onBack }) => {
  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900">
      {/* Header (Matching screenshot 14) */}
      <MobileHeader
        showBack
        onBack={onBack}
        title="Bảng lương & Hoa hồng"
        subtitle={`Kỳ thanh toán: ${payroll.month}`}
        rightAction={
          <button
            onClick={() => alert('Đã tải xuống phiếu lương định dạng PDF')}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
            title="Tải phiếu lương PDF"
          >
            <Download className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-3.5">
        {/* Status Approval Badge (Matching screenshot 14) */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>ĐÃ PHÊ DUYỆT (Kế toán trưởng & Ban Giám Đốc CELLA)</span>
        </div>

        {/* Tổng Thực Lãnh Card (Matching screenshot 14) */}
        <div className="p-4 rounded-3xl bg-gradient-to-tr from-[#1E1B4B] to-[#5850EC] text-white shadow-lg space-y-2">
          <span className="text-xs text-indigo-200 font-medium uppercase tracking-wider block">
            TỔNG THỰC LÃNH KỲ NÀY
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {payroll.netSalary.toLocaleString('vi-VN')} đ
          </h2>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-indigo-100">
            <span>Sẽ giải ngân vào tài khoản ngày:</span>
            <span className="font-bold text-white">05/05/2025</span>
          </div>
        </div>

        {/* CHI TIẾT THU NHẬP (Matching screenshot 14) */}
        <GlassCard className="p-4 bg-white space-y-2.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Chi tiết thu nhập (Earnings)
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span>Lương cơ bản ngạch Master Trainer:</span>
              <span className="font-semibold text-slate-900">
                {payroll.baseSalary.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-700">
              <div>
                <span className="block">Hoa hồng tư vấn dịch vụ:</span>
                <span className="text-[10px] text-slate-400">10% trên doanh số 94.500.000 đ</span>
              </div>
              <span className="font-semibold text-[#5850EC]">
                +{payroll.commissionService.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-700">
              <div>
                <span className="block">Hoa hồng tuyển sinh Academy:</span>
                <span className="text-[10px] text-slate-400">8% doanh số khóa K24</span>
              </div>
              <span className="font-semibold text-[#5850EC]">
                +{payroll.commissionAcademy.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-700">
              <span>Thưởng nóng vượt KPI tuần:</span>
              <span className="font-semibold text-emerald-600">
                +{payroll.bonusKpi.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-700">
              <span>Phụ cấp chuyên cần & điện thoại:</span>
              <span className="font-semibold text-slate-900">
                +{payroll.allowances.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-900">
              <span>Tổng thu nhập trước khấu trừ:</span>
              <span>
                {(
                  payroll.baseSalary +
                  payroll.commissionService +
                  payroll.commissionAcademy +
                  payroll.bonusKpi +
                  payroll.allowances
                ).toLocaleString('vi-VN')}{' '}
                đ
              </span>
            </div>
          </div>
        </GlassCard>

        {/* CÁC KHOẢN KHẤU TRỪ (Matching screenshot 14) */}
        <GlassCard className="p-4 bg-white space-y-2.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Các khoản khấu trừ (Deductions)
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span>Trích nộp BHXH, BHYT, BHTN:</span>
              <span className="font-semibold text-rose-600">
                -{payroll.deductions.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span>Tạm ứng giữa kỳ:</span>
              <span className="text-slate-400">0 đ</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-rose-600">
              <span>Tổng khấu trừ:</span>
              <span>-{payroll.deductions.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </GlassCard>

        {/* THÔNG TIN TÀI KHOẢN NHẬN LƯƠNG (Matching screenshot 14) */}
        <GlassCard className="p-4 bg-white space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tài khoản nhận lương
          </h3>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F9FF] border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs">
              MB
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {payroll.bankAccount.bankName}
              </span>
              <span className="text-xs font-mono font-bold text-[#5850EC] block">
                {payroll.bankAccount.accountNumber}
              </span>
              <span className="text-[10px] text-slate-500 block uppercase">
                {payroll.bankAccount.accountHolder}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* CHÍNH SÁCH HOA HỒNG CELLA */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5 text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Chính sách hoa hồng CELLA Pro</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            • 5% – 10% doanh số cho dịch vụ thẩm mỹ trực tiếp.
            <br />
            • 8% – 12% hoa hồng khi tư vấn tuyển sinh thành công học viên Academy.
            <br />• Thưởng nóng 2.000.000 đ – 5.000.000 đ khi đạt top 1 doanh thu tháng.
          </p>
        </div>
      </div>
    </div>
  );
};
