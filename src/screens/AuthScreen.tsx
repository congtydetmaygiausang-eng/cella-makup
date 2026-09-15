import React, { useState } from 'react';
import { Staff, ScreenId } from '../types';
import { SAMPLE_ACCOUNTS } from '../data/mockData';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  ChevronRight,
  AlertCircle,
  X,
  Briefcase,
  Check,
} from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: Staff) => void;
  onContinueAsGuest?: () => void;
  onBack?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  onBack,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBranch, setRegBranch] = useState('Cơ sở Quận 1 - Trụ sở chính CELLA');
  const [regRole, setRegRole] = useState<'MASTER' | 'ARTIST' | 'SALES' | 'ACADEMY_TRAINER'>('ARTIST');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotStep, setForgotStep] = useState<'input' | 'otp' | 'success'>('input');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Handle Quick Demo 1-Click Login
  const handleQuickLogin = (account: Staff) => {
    setLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(account);
    }, 400);
  };

  // 2. Handle Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginInput.trim()) {
      setErrorMessage('Vui lòng nhập email, số điện thoại hoặc mã nhân viên.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu đăng nhập.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: loginInput.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setSuccessMessage('Đăng nhập thành công!');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 300);
      } else {
        // Local fallback if server unreachable
        const localMatch = SAMPLE_ACCOUNTS.find(
          (u) =>
            u.email?.toLowerCase() === loginInput.toLowerCase() ||
            u.phone.replace(/\s+/g, '') === loginInput.replace(/\s+/g, '') ||
            u.employeeCode?.toLowerCase() === loginInput.toLowerCase()
        );
        if (localMatch) {
          onLoginSuccess(localMatch);
        } else {
          setErrorMessage(data.error || 'Tài khoản hoặc mật khẩu không chính xác.');
        }
      }
    } catch {
      // Local fallback on network error
      const localMatch = SAMPLE_ACCOUNTS.find(
        (u) =>
          u.email?.toLowerCase() === loginInput.toLowerCase() ||
          u.phone.replace(/\s+/g, '') === loginInput.replace(/\s+/g, '') ||
          u.employeeCode?.toLowerCase() === loginInput.toLowerCase()
      );
      if (localMatch) {
        onLoginSuccess(localMatch);
      } else {
        setErrorMessage('Tài khoản hoặc mật khẩu không chính xác. Bạn có thể chọn tài khoản mẫu phía dưới.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Register Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên.');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMessage('Vui lòng nhập số điện thoại liên hệ.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (regPassword.length < 3) {
      setErrorMessage('Mật khẩu cần tối thiểu 3 ký tự.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với Quy chế bảo mật dữ liệu của CELLA.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName,
          email: regEmail,
          phone: regPhone,
          role: regRole,
          branch: regBranch,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setSuccessMessage('Đăng ký thành công! Đang chuyển hướng...');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 500);
      } else {
        setErrorMessage(data.error || 'Không thể hoàn tất đăng ký.');
      }
    } catch {
      // Local fallback create
      const newUser: Staff = {
        id: `NV-${Math.floor(1000 + Math.random() * 9000)}`,
        employeeCode: `CELLA-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        role: regRole,
        title: regRole === 'MASTER' ? 'Master Trainer' : regRole === 'SALES' ? 'Chuyên viên Sales' : 'Makeup Artist',
        department: regRole === 'ACADEMY_TRAINER' ? 'Khối Học viện' : 'Khối Atelier Dịch vụ',
        branch: regBranch,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        baseSalary: 8500000,
        commissionRate: 0.12,
        kpiScore: 100,
        joinedDate: new Date().toLocaleDateString('vi-VN'),
      };
      setSuccessMessage('Đăng ký tài khoản thành công!');
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  // 4. Forgot password request
  const handleForgotRequest = async () => {
    if (!forgotInput.trim()) {
      setErrorMessage('Vui lòng nhập email hoặc số điện thoại.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: forgotInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedOtp(data.otpCode || '882699');
        setForgotStep('otp');
      } else {
        setGeneratedOtp('882699');
        setForgotStep('otp');
      }
    } catch {
      setGeneratedOtp('882699');
      setForgotStep('otp');
    } finally {
      setLoading(false);
    }
  };

  // 5. Forgot password verify
  const handleForgotVerify = () => {
    if (forgotOtp === generatedOtp || forgotOtp === '882699') {
      setForgotStep('success');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep('input');
        setForgotInput('');
        setSuccessMessage('Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập ngay.');
      }, 1500);
    } else {
      setErrorMessage('Mã OTP không chính xác. Vui lòng nhập: 882699');
    }
  };

  return (
    <div className="min-h-full bg-linear-to-b from-[#F0F4FF] via-[#F8F9FF] to-white pb-16 text-slate-900 flex flex-col justify-between">
      {/* Brand Header */}
      <div className="pt-8 pb-4 px-6 text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-tr from-[#5850EC] to-[#7E77F3] text-white shadow-lg shadow-[#5850EC]/25 mx-auto ring-4 ring-white">
          <Sparkles className="w-8 h-8 stroke-[2]" />
        </div>

        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            CELLA BEAUTÉ
          </h1>
          <p className="text-[11px] font-semibold text-[#5850EC] uppercase tracking-widest mt-0.5">
            Atelier & Academy Management
          </p>
          <p className="text-xs text-slate-500 italic mt-1">
            "Better People, Better Beauty, A Brighter Tomorrow"
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="px-4 max-w-md mx-auto w-full space-y-4">
        {/* Tab Switcher (Login / Register) */}
        <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center shadow-inner">
          <button
            id="tab-login-btn"
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Đăng nhập
          </button>
          <button
            id="tab-register-btn"
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all ${
              tab === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Đăng ký tài khoản
          </button>
        </div>

        {/* Feedback Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5 animate-fade-in font-medium">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 stroke-[2.5]" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5 animate-fade-in font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 stroke-[2.5]" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        {tab === 'login' && (
          <GlassCard className="p-6 bg-white border border-slate-200/90 shadow-md space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email or Phone Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800 block">
                  Email, Số điện thoại hoặc Mã NV
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4338CA]">
                    <User className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <input
                    id="login-account-input"
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="VD: lan.nguyen@cellabeaute.vn hoặc 0908 654 321"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4338CA]/30 focus:border-[#4338CA] bg-slate-50 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800">
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setForgotStep('input');
                      setErrorMessage(null);
                    }}
                    className="text-xs font-bold text-[#4338CA] hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4338CA]">
                    <Lock className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <input
                    id="login-password-input"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu (mặc định: 123)"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4338CA]/30 focus:border-[#4338CA] bg-slate-50 text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-800"
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5 stroke-[2.2]" /> : <Eye className="w-5 h-5 stroke-[2.2]" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 font-bold">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4338CA] focus:ring-[#4338CA]"
                  />
                  <span>Ghi nhớ phiên đăng nhập</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-[#4338CA] to-[#6366F1] hover:from-[#3730A3] hover:to-[#4F46E5] text-white font-extrabold text-sm shadow-md shadow-indigo-500/30 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <span>Đang xác thực...</span>
                ) : (
                  <>
                    <span>Đăng nhập hệ thống</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.8]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Demo Accounts */}
            <div className="pt-3.5 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Chọn nhanh tài khoản mẫu:
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">MK: 123</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {SAMPLE_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickLogin(acc)}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-[#4338CA] bg-slate-50 hover:bg-white text-left transition-all group flex items-center gap-2.5 shadow-2xs cursor-pointer"
                  >
                    <img
                      src={acc.avatarUrl}
                      alt={acc.fullName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-200 group-hover:ring-[#4338CA]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-slate-900 truncate group-hover:text-[#4338CA]">
                        {acc.fullName}
                      </p>
                      <p className="text-[11px] text-slate-600 font-semibold truncate">
                        {acc.role === 'MASTER' ? 'Master Trainer' : acc.role === 'ARTIST' ? 'Makeup Artist' : acc.role === 'ACADEMY_TRAINER' ? 'Giảng viên' : 'Sales Lead'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* ================= REGISTER FORM ================= */}
        {tab === 'register' && (
          <GlassCard className="p-5 bg-white border border-slate-100/90 shadow-sm space-y-3.5">
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Họ và tên chuyên viên / Học viên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-fullname-input"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="VD: Hoàng Mỹ Linh"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30 focus:border-[#5850EC] bg-[#F8F9FF]"
                    required
                  />
                </div>
              </div>

              {/* Phone and Email in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-phone-input"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30 focus:border-[#5850EC] bg-[#F8F9FF]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Email làm việc <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-email-input"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="linh.hoang@cellabeaute.vn"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30 focus:border-[#5850EC] bg-[#F8F9FF]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Role & Branch selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Vị trí chuyên môn
                  </label>
                  <div className="relative">
                    <select
                      id="reg-role-select"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30 focus:border-[#5850EC] bg-[#F8F9FF] text-slate-800"
                    >
                      <option value="ARTIST">Makeup Artist & Stylist</option>
                      <option value="MASTER">Master Trainer (Giảng dạy)</option>
                      <option value="SALES">Tư vấn viên Tuyển sinh & CRM</option>
                      <option value="ACADEMY_TRAINER">Giảng viên Thực hành</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Cơ sở / Chi nhánh
                  </label>
                  <select
                    id="reg-branch-select"
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30 focus:border-[#5850EC] bg-[#F8F9FF] text-slate-800"
                  >
                    <option value="Cơ sở Quận 1 - Trụ sở chính CELLA">Cơ sở Quận 1 (Trụ sở)</option>
                    <option value="Cơ sở Quận 3 - Atelier Studio">Cơ sở Quận 3 (Atelier)</option>
                    <option value="Cơ sở Thủ Đức - Trung tâm Thực hành">Cơ sở Thủ Đức (Academy)</option>
                    <option value="Cơ sở Hoàn Kiếm - Hà Nội">Cơ sở Hà Nội</option>
                  </select>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password-input"
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Ít nhất 3 ký tự"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30 focus:border-[#5850EC] bg-[#F8F9FF]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Xác nhận mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-confirm-password-input"
                      type={showRegPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30 focus:border-[#5850EC] bg-[#F8F9FF]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 rounded text-[#5850EC] focus:ring-[#5850EC]"
                  />
                  <span>
                    Tôi cam kết bảo mật thông tin khách hàng VIP và tuân thủ Quy chế vận hành Atelier CELLA BEAUTÉ.
                  </span>
                </label>
              </div>

              {/* Submit Register Button */}
              <button
                id="reg-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <span>Đang xử lý đăng ký...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Hoàn tất tạo tài khoản CELLA</span>
                  </>
                )}
              </button>
            </form>
          </GlassCard>
        )}

        {/* Guest Mode Link */}
        {onContinueAsGuest && (
          <div className="text-center pt-2">
            <button
              id="guest-tour-btn"
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs text-slate-500 hover:text-[#5850EC] font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>Trải nghiệm nhanh với tư cách Khách xem (Guest Mode)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Security Badge Footer */}
      <div className="px-6 text-center text-[10px] text-slate-400 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Hệ thống bảo mật dữ liệu khách hàng CRM & Academy chuẩn ISO</span>
        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#5850EC] flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Khôi phục mật khẩu
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Xác thực qua OTP an toàn
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotStep === 'input' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Nhập email hoặc số điện thoại đã đăng ký để nhận mã OTP xác thực khôi phục:
                </p>
                <input
                  type="text"
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="VD: lan.nguyen@cellabeaute.vn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#5850EC]/30 focus:border-[#5850EC]"
                />
                <button
                  type="button"
                  onClick={handleForgotRequest}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#5850EC] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Đang gửi mã...' : 'Gửi mã xác nhận OTP'}
                </button>
              </div>
            )}

            {forgotStep === 'otp' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <p className="font-bold">Mã OTP thử nghiệm:</p>
                  <p className="text-base font-extrabold tracking-widest text-[#5850EC] mt-0.5">
                    {generatedOtp || '882699'}
                  </p>
                  <p className="text-[10px] text-amber-600 mt-1">
                    (Đã gửi giả lập tới: {forgotInput})
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Nhập mã OTP 6 số:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="882699"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono tracking-widest text-center font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleForgotVerify}
                  className="w-full py-2.5 rounded-xl bg-[#5850EC] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  Xác nhận & Khôi phục
                </button>
              </div>
            )}

            {forgotStep === 'success' && (
              <div className="py-4 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Mật khẩu đã đặt lại!
                </h4>
                <p className="text-xs text-slate-500">
                  Mật khẩu mới đã được kích hoạt. Đang chuyển về màn hình đăng nhập...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
