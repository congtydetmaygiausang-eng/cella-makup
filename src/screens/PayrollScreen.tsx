import React from 'react';
import { ScreenId, PayrollData } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import {
  Download,
  Filter,
  Eye,
  Briefcase,
  Coins,
  Sparkles,
  Wallet,
  MinusCircle,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

interface PayrollScreenProps {
  payroll: PayrollData;
  onBack: () => void;
}

export const PayrollScreen: React.FC<PayrollScreenProps> = ({ payroll, onBack }) => {
  return (
    <div className="min-h-full bg-[#F8F9FA] pb-28 text-slate-900 animate-in fade-in duration-300">
      <div className="pt-10 pb-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200"
          >
            <ChevronRight className="w-5 h-5 text-slate-700 stroke-[2.5] rotate-180" />
          </button>
          <div>
            <h2 className="text-[16px] font-black text-slate-900 leading-none">
              Bảng lương & Hoa hồng
            </h2>
            <p className="text-[11px] font-medium text-slate-400 mt-1">
              Kỳ T04/2025 • <strong className="text-[#544CDE]">Nhân sự CELLA</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200">
            <Download className="w-4 h-4 text-slate-600" />
          </button>
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200">
            <Filter className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-2 space-y-4">
        {/* Month Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-[13px] font-bold text-slate-500 whitespace-nowrap">
            Tháng 03/2025
          </button>
          <button className="px-4 py-2 rounded-full bg-[#544CDE] text-white text-[13px] font-bold whitespace-nowrap shadow-md shadow-indigo-200 flex items-center gap-2">
            Tháng 04/2025 <span className="bg-white/20 px-1.5 rounded text-[9px]">Hiện tại</span>
          </button>
          <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-[13px] font-bold text-slate-400 whitespace-nowrap">
            Dự tính T05
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Đã chốt lương & Sẵn sàng thanh toán
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-[#6A5FFF] to-[#4338CA] rounded-[24px] p-5 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-indigo-100 uppercase tracking-wider">
                THỰC NHẬN KỲ NÀY
              </span>
              <Eye className="w-4 h-4 text-indigo-200" />
            </div>
            <span className="text-[10px] font-bold text-indigo-100 bg-white/10 px-2 py-0.5 rounded border border-white/20">
              KỲ CHỐT: 25/04
            </span>
          </div>

          <div className="mb-3">
            <h1 className="text-[36px] font-black tracking-tight flex items-baseline gap-1">
              28.450.000 <span className="text-[18px] font-bold text-indigo-200">đ</span>
            </h1>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-[11px] font-bold text-emerald-100">
              +18.2%
            </span>
            <span className="text-[11px] text-indigo-100">
              so với tháng trước (KPI đạt 125%)
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-indigo-200 font-medium pt-3 border-t border-white/10">
            <Calendar className="w-3.5 h-3.5" />
            <span>Dự kiến chi trả: 05/05/2025 qua Techcombank **** 6868</span>
          </div>
        </div>

        {/* Cơ cấu thu nhập */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-5 rounded-full bg-[#544CDE]"></div>
              <h3 className="text-[14px] font-black text-slate-800">Cơ cấu thu nhập</h3>
            </div>
            <span className="text-[11px] font-bold text-[#544CDE] flex items-center gap-0.5">
              Công thức tính <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-bold text-slate-900">Lương cứng cơ bản</span>
                  <span className="text-[14px] font-black text-slate-900">10.000.000 đ</span>
                </div>
                <span className="text-[11px] text-slate-500">Đạt 24/24 ngày công tiêu chuẩn</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
                    Hoa hồng dịch vụ & Học viên
                    <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">Cao nhất</span>
                  </span>
                  <span className="text-[14px] font-black text-purple-700">12.850.000 đ</span>
                </div>
                <span className="text-[11px] text-slate-500">15 ca liệu trình Meso, Phun & 3 học viên</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-bold text-slate-900">Thưởng đạt KPI & Nóng</span>
                  <span className="text-[14px] font-black text-slate-900">4.500.000 đ</span>
                </div>
                <span className="text-[11px] text-slate-500">Vượt 125% target & Top 1 tư vấn tuần</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-bold text-slate-900">Phụ cấp công tác & Khác</span>
                  <span className="text-[14px] font-black text-slate-900">1.500.000 đ</span>
                </div>
                <span className="text-[11px] text-slate-500">Cơm trưa (720k), Điện thoại & Gửi xe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hoa hồng & Thưởng phát sinh */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[14px] font-black text-slate-800">Hoa hồng & Thưởng phát sinh</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Các giao dịch chốt thành công trong kỳ</p>
            </div>
            <span className="text-[11px] font-bold text-[#544CDE] bg-indigo-50 px-2 py-1 rounded-md">
              Xem tất cả (18)
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-[12px]">HƯ</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-bold text-slate-900">Đặng Thanh Hương</span>
                  <span className="text-[12px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+1.850.000 đ</span>
                </div>
                <span className="text-[11px] text-slate-500">Cấy vi chất Meso Extra Pro</span>
                <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                  <span>Doanh số: <strong className="text-slate-600">18.500.000 đ</strong> (Tỉ lệ: 10%)</span>
                  <span>24/04/2025</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 font-bold flex items-center justify-center text-[12px]">LH</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-bold text-slate-900">Lê Thu Hà (Học viên)</span>
                  <span className="text-[12px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+2.000.000 đ</span>
                </div>
                <span className="text-[11px] text-slate-500">Khóa Phun thêu Điêu khắc 9D</span>
                <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                  <span>Học phí: <strong className="text-slate-600">25.000.000 đ</strong> (Thưởng 8%)</span>
                  <span>22/04/2025</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center text-[12px]">HK</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-bold text-slate-900">Hoàng Thị Kim</span>
                  <span className="text-[12px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+525.000 đ</span>
                </div>
                <span className="text-[11px] text-slate-500">Chăm sóc da chuyên sâu VIP</span>
                <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                  <span>Doanh số: <strong className="text-slate-600">3.500.000 đ</strong> (Tỉ lệ: 15%)</span>
                  <span>20/04/2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Các khoản giảm trừ */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-rose-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MinusCircle className="w-4 h-4 text-rose-500" />
              <h3 className="text-[13px] font-bold text-slate-800">Các khoản giảm trừ & Thuế</h3>
            </div>
            <span className="text-[14px] font-black text-rose-600">-1.400.000 đ</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">BHXH, BHYT & BHTN:</span>
              <span className="text-[13px] font-bold text-slate-800 mt-1 block">-800.000 đ</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Thuế TNCN tạm tính:</span>
              <span className="text-[13px] font-bold text-slate-800 mt-1 block">-600.000 đ</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 space-y-3">
          <button className="w-full h-14 bg-[#544CDE] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-[14px] shadow-lg shadow-indigo-500/30 hover:bg-[#4338ca] active:scale-[0.98] transition-all">
            <CheckCircle2 className="w-5 h-5" />
            Xác nhận bảng lương (Ký nhận số)
          </button>
          <button className="w-full h-14 bg-white border border-slate-200 text-slate-600 rounded-2xl flex items-center justify-center gap-2 font-bold text-[14px] hover:bg-slate-50 transition-colors">
            <HelpCircle className="w-5 h-5" />
            Thắc mắc hoặc khiếu nại công lương
          </button>
        </div>
      </div>
    </div>
  );
};
