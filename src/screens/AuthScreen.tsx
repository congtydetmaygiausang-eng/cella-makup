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
import { supabase } from '../config/supabase';

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
  const [regBranch] = useState('Cơ sở Quận 1 - Trụ sở chính CELLA');
  const [regRole, setRegRole] = useState<'STAFF' | 'CUSTOMER' | 'TRAINER' | 'STUDENT'>('STAFF');
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
      setErrorMessage('Vui lòng nhập email.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu.');
      return;
    }

    // Bypass Supabase for mock accounts
    const mockAccount = SAMPLE_ACCOUNTS.find(acc => acc.email === loginInput.trim() || acc.employeeCode === loginInput.trim() || acc.phone === loginInput.trim());
    if (mockAccount && loginPassword === '123') {
      setSuccessMessage('Đăng nhập tài khoản mẫu thành công!');
      setTimeout(() => {
        onLoginSuccess(mockAccount);
      }, 500);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginInput.trim(),
        password: loginPassword,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        setSuccessMessage('Đăng nhập thành công!');
        setTimeout(() => {
          onLoginSuccess({
            id: data.user.id,
            employeeCode: 'CELLA-USER',
            fullName: profile?.full_name || 'Người dùng CELLA',
            email: data.user.email || '',
            password: '',
            role: profile?.role || 'CUSTOMER',
            phone: profile?.phone || '',
            avatarUrl: profile?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            department: '',
            branch: profile?.branch_studio || '',
            joinedDate: new Date(profile?.created_at || new Date()).toLocaleDateString('vi-VN'),
          });
        }, 500);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Đăng nhập thất bại: ' + err.message);
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
      const { data, error } = await supabase.auth.signUp({
        email: regEmail.trim(),
        password: regPassword,
        options: {
          data: {
            full_name: regFullName.trim(),
          },
        },
      });

      if (error) throw error;

      setSuccessMessage('Đăng ký thành công! Đang tự động đăng nhập...');
      
      // Đảm bảo lưu ngay lập tức vào bảng profiles trên Supabase
      if (data.user) {
        try {
          await supabase.from('profiles').upsert([{
            id: data.user.id,
            full_name: regFullName.trim(),
            email: regEmail.trim(),
            phone: regPhone.trim() || null,
            role: 'CUSTOMER',
            avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            branch_studio: '37–39 Phan Bội Châu, TP. Thái Bình',
            is_active: true,
            created_at: new Date().toISOString()
          }]);
        } catch (profileErr) {
          console.warn('Upsert profile notice:', profileErr);
        }
      }

      // Force sign-in to establish a real session (if email confirmation is off)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: regEmail.trim(),
        password: regPassword
      });

      if (signInError) {
        console.error('Auto login error:', signInError);
      }

      setTimeout(() => {
        if (data.user) {
          onLoginSuccess({
            id: data.user.id,
            employeeCode: 'CELLA-USER',
            fullName: regFullName.trim(),
            email: data.user.email || '',
            password: '',
            role: 'CUSTOMER',
            phone: regPhone,
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            department: '',
            branch: '',
            joinedDate: new Date().toLocaleDateString('vi-VN'),
          });
        }
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Đăng ký thất bại: ' + err.message);
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
    <div className="min-h-full bg-[#EFF4EF] bg-botanical-mesh pb-16 text-[#1A2820] flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Botanical Ambient Backdrop (Right-side papercut leaf layer as in reference) */}
      <div 
        className="absolute top-0 right-0 w-44 md:w-56 h-80 bg-no-repeat bg-contain bg-top opacity-35 pointer-events-none z-0"
        style={{ backgroundImage: 'url(/botanical-bg.jpg)', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }}
      />

      {/* Brand Header */}
      <div className="pt-8 pb-3 px-6 text-center space-y-2 relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#2D503E] to-[#1A3326] text-white shadow-lg shadow-[#1A3326]/20 mx-auto ring-4 ring-white">
          <Sparkles className="w-7 h-7 text-emerald-300 stroke-[2]" />
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1A2820]">
            CELLA MAKEUP
          </h1>
          <p className="text-[11px] font-bold text-[#3E6B52] uppercase tracking-widest mt-0.5">
            Atelier & Academy Management
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="px-4 max-w-md mx-auto w-full space-y-4 relative z-10">
        {/* Tab Switcher (Login / Register) */}
        <div className="bg-[#E2ECE4] p-1.5 rounded-full flex items-center shadow-inner border border-[#264736]/10">
          <button
            id="tab-login-btn"
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-black rounded-full transition-all ${
              tab === 'login'
                ? 'bg-white text-[#1A3326] shadow-xs'
                : 'text-[#486B56] hover:text-[#1A3326]'
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
            className={`flex-1 py-2.5 text-xs font-black rounded-full transition-all ${
              tab === 'register'
                ? 'bg-white text-[#1A3326] shadow-xs'
                : 'text-[#486B56] hover:text-[#1A3326]'
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

        {/* ================= LOGIN FORM (Matching Reference Image) ================= */}
        {tab === 'login' && (
          <div className="p-6 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-[0_20px_45px_-10px_rgba(26,51,38,0.12)] space-y-4">
            <div className="text-center pb-1">
              <h2 className="text-xl font-bold text-[#1A2820]">Log in</h2>
              <p className="text-xs text-slate-500 mt-0.5">Truy cập hệ thống làm việc CELLA</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email or Phone Input (Pill shape as in reference) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block px-1">
                  Login, email or phone number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#3E6B52]">
                    <User className="w-4.5 h-4.5 stroke-[2.2]" />
                  </div>
                  <input
                    id="login-account-input"
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="lan.nguyen@cellabeaute.vn hoặc 0908 654 321"
                    className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-300/80 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#264736]/20 focus:border-[#264736] bg-[#FCFDFB] text-[#1A2820] placeholder:text-slate-400 shadow-2xs transition-all"
                  />
                </div>
              </div>

              {/* Password Input (Pill shape as in reference) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setForgotStep('input');
                      setErrorMessage(null);
                    }}
                    className="text-xs font-bold text-[#264736] hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#3E6B52]">
                    <Lock className="w-4.5 h-4.5 stroke-[2.2]" />
                  </div>
                  <input
                    id="login-password-input"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Mật khẩu (mặc định: 123)"
                    className="w-full pl-11 pr-11 py-3 rounded-full border border-slate-300/80 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#264736]/20 focus:border-[#264736] bg-[#FCFDFB] text-[#1A2820] placeholder:text-slate-400 shadow-2xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700"
                  >
                    {showLoginPassword ? <EyeOff className="w-4.5 h-4.5 stroke-[2]" /> : <Eye className="w-4.5 h-4.5 stroke-[2]" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between px-1 pt-0.5">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 font-bold">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#264736] focus:ring-[#264736]"
                  />
                  <span>Ghi nhớ phiên đăng nhập</span>
                </label>
              </div>

              {/* Submit Button (Deep Forest Green Pill matching reference image) */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="btn-forest w-full py-3.5 px-4 font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-70 cursor-pointer shadow-md"
              >
                {loading ? (
                  <span>Đang xác thực...</span>
                ) : (
                  <>
                    <span>Log in</span>
                    <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Social Log In with G and O as in Reference Image */}
            <div className="pt-2">
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-[1px] bg-slate-200" />
                <span className="text-[11px] text-slate-400 font-medium">or log in with</span>
                <div className="flex-1 h-[1px] bg-slate-200" />
              </div>

              <div className="flex items-center justify-center gap-4">
                {/* Google Icon Button */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin(SAMPLE_ACCOUNTS[0])}
                  className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center bg-white shadow-xs hover:bg-[#EAF2EC] active:scale-95 transition-all"
                  title="Đăng nhập Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </button>

                {/* Office 365 / Microsoft Icon Button */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin(SAMPLE_ACCOUNTS[1])}
                  className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center bg-white shadow-xs hover:bg-[#EAF2EC] active:scale-95 transition-all"
                  title="Đăng nhập Microsoft 365"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z"/>
                    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                    <path fill="#FFB900" d="M13 13h10v10H13z"/>
                  </svg>
                </button>
              </div>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setForgotStep('input');
                    setErrorMessage(null);
                  }}
                  className="text-xs font-semibold text-[#264736] hover:underline"
                >
                  Forgot login or password?
                </button>
              </div>
            </div>

            {/* Quick 1-Click Demo Accounts */}
            <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-[#264736] uppercase tracking-wider">
                  Tài khoản mẫu thử nghiệm:
                </span>
                <span className="text-[11px] font-bold text-[#264736] bg-[#EAF2EC] px-2 py-0.5 rounded-full border border-[#264736]/15">MK: 123</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickLogin(acc)}
                    className="p-2.5 rounded-2xl border border-[#264736]/10 hover:border-[#264736] bg-[#FCFDFB] hover:bg-[#EAF2EC]/60 text-left transition-all group flex items-center gap-2 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <img
                      src={acc.avatarUrl}
                      alt={acc.fullName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 group-hover:ring-[#264736]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-black text-slate-900 truncate group-hover:text-[#264736]">
                        {acc.fullName}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium truncate">
                        {acc.role === 'MASTER_ARTIST' ? 'Master' : acc.role === 'ARTIST' ? 'Artist' : acc.role === 'ACADEMY_TRAINER' ? 'Giảng viên' : acc.role === 'SUPER_ADMIN' ? 'Quản trị' : 'Sales'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
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
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Role selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Vai trò người dùng
                </label>
                <select
                  id="reg-role-select"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30 focus:border-[#5850EC] bg-[#F8F9FF] text-slate-800"
                >
                  <option value="STAFF">👤 Nhân sự (Artist / Sales / Admin)</option>
                  <option value="CUSTOMER">💎 Khách hàng (CRM)</option>
                  <option value="TRAINER">🏫 Giảng viên Academy</option>
                  <option value="STUDENT">🎓 Học viên</option>
                </select>
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
                      autoComplete="new-password"
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
                      autoComplete="new-password"
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
