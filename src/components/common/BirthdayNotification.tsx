import React, { useState, useEffect } from 'react';
import { X, Gift, Send, ChevronRight, Cake } from 'lucide-react';

interface BirthdayPerson {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  age?: number;
  role: 'customer' | 'staff';
}

// Simulated birthday list — trong thực tế sẽ filter từ customers/staff có ngày sinh = hôm nay
const TODAY_BIRTHDAYS: BirthdayPerson[] = [
  {
    id: 'CUST-003',
    name: 'Nguyễn Thị Mai',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    phone: '0901 234 567',
    age: 28,
    role: 'customer',
  },
  {
    id: 'NV-004',
    name: 'Hoàng Bảo Châu',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop&q=80',
    phone: '0933 444 555',
    role: 'staff',
  },
];

const BIRTHDAY_MESSAGES = [
  '🎂 Chúc mừng sinh nhật {name}! CELLA gửi đến bạn ngàn lời chúc tốt đẹp nhất 🌸',
  '🎉 Happy Birthday {name}! Chúc bạn luôn xinh đẹp, rạng rỡ và tràn đầy hạnh phúc! 💄✨',
  '🥳 CELLA Beauté chúc {name} sinh nhật vui vẻ! Mong bạn mãi trẻ trung và tỏa sáng 🌟',
  '🎁 Sinh nhật vui vẻ {name}! Cảm ơn bạn đã đồng hành cùng CELLA. Chúc bạn nhiều sức khỏe và may mắn! 💕',
];

interface BirthdayNotificationProps {
  onSendMessage?: (phone: string, message: string) => void;
}

export const BirthdayNotification: React.FC<BirthdayNotificationProps> = ({ onSendMessage }) => {
  const [dismissed, setDismissed] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<BirthdayPerson | null>(null);
  const [selectedMsg, setSelectedMsg] = useState(0);
  const [customMsg, setCustomMsg] = useState('');
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [justSent, setJustSent] = useState<string | null>(null);

  if (dismissed || TODAY_BIRTHDAYS.length === 0) return null;

  const openModal = (person: BirthdayPerson) => {
    setSelectedPerson(person);
    const msg = BIRTHDAY_MESSAGES[0].replace('{name}', person.name.split(' ').pop()!);
    setCustomMsg(msg);
    setSelectedMsg(0);
    setShowModal(true);
  };

  const handleSend = () => {
    if (!selectedPerson) return;
    const finalMsg = customMsg;
    if (onSendMessage) {
      onSendMessage(selectedPerson.phone, finalMsg);
    }
    setSent((prev) => new Set([...prev, selectedPerson.id]));
    setJustSent(selectedPerson.name.split(' ').pop()!);
    setShowModal(false);
    setTimeout(() => setJustSent(null), 3000);
  };

  const selectTemplate = (idx: number) => {
    if (!selectedPerson) return;
    setSelectedMsg(idx);
    setCustomMsg(BIRTHDAY_MESSAGES[idx].replace('{name}', selectedPerson.name.split(' ').pop()!));
  };

  return (
    <>
      {/* ── TOAST BANNER (Zalo style) ── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[9999] px-3 pt-2">
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 border border-slate-100 overflow-hidden animate-in slide-in-from-top duration-400">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-pink-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎂</span>
              <span className="text-[12px] font-black text-rose-600 uppercase tracking-wide">
                Sinh nhật hôm nay
              </span>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Birthday people list */}
          <div className="divide-y divide-slate-100">
            {TODAY_BIRTHDAYS.map((person) => {
              const isSent = sent.has(person.id);
              return (
                <div key={person.id} className="flex items-center gap-3 px-4 py-3">
                  {/* Avatar with cake icon */}
                  <div className="relative shrink-0">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-pink-200"
                    />
                    <span className="absolute -bottom-1 -right-1 text-sm">🎂</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-900 truncate">{person.name}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      {person.role === 'customer' ? '💎 Khách hàng' : '👤 Nhân viên'}
                      {person.age && <span className="text-slate-400">· {person.age} tuổi</span>}
                    </p>
                  </div>

                  {/* Action button */}
                  {isSent ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-full border border-emerald-100">
                      ✓ Đã gửi
                    </span>
                  ) : (
                    <button
                      onClick={() => openModal(person)}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1.5 rounded-full shadow-sm shadow-rose-200 hover:shadow-md active:scale-95 transition-all"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      Gửi lời chúc
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Just sent toast */}
        {justSent && (
          <div className="mt-2 flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 animate-in slide-in-from-top duration-300">
            <span>🎉</span>
            Đã gửi lời chúc đến {justSent}!
          </div>
        )}
      </div>

      {/* ── SEND MESSAGE MODAL ── */}
      {showModal && selectedPerson && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Bottom sheet */}
          <div className="relative w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedPerson.avatar}
                    alt={selectedPerson.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-pink-200"
                  />
                  <span className="absolute -bottom-1 -right-1 text-sm">🎂</span>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{selectedPerson.name}</p>
                  <p className="text-[11px] text-slate-400">{selectedPerson.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-6 space-y-4">
              {/* Template selector */}
              <div>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
                  Chọn mẫu lời chúc:
                </p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {['Lời chúc 1', 'Lời chúc 2', 'Lời chúc 3', 'Lời chúc 4'].map((lbl, i) => (
                    <button
                      key={i}
                      onClick={() => selectTemplate(i)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap border transition-all shrink-0 ${
                        selectedMsg === i
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message textarea */}
              <div>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
                  Nội dung tin nhắn:
                </p>
                <textarea
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-[13px] text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 bg-slate-50 leading-relaxed"
                  placeholder="Nhập lời chúc..."
                />
                <p className="text-[10px] text-slate-400 mt-1 text-right">{customMsg.length} ký tự</p>
              </div>

              {/* Send channels */}
              <div className="flex gap-2">
                <button
                  onClick={handleSend}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-md shadow-rose-300/40 hover:shadow-lg active:scale-[0.98] transition-all"
                >
                  <Send className="w-4 h-4" />
                  Gửi qua Zalo
                </button>
                <button
                  onClick={handleSend}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-300/40 hover:shadow-lg active:scale-[0.98] transition-all"
                >
                  <Send className="w-4 h-4" />
                  Gửi SMS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
