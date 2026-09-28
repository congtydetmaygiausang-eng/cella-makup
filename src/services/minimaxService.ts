/**
 * MiniMax AI & CELLA Master Knowledge Service
 * Tích hợp MiniMax API để kích hoạt trí tuệ nhân tạo CELLA AI,
 * đào tạo kiến thức chuyên sâu về hệ thống Studio, Học viện và quy trình vận hành.
 * Đặc biệt: Huấn luyện cách hỏi - đáp tự nhiên, thấu cảm, duyên dáng và tâm lý như người thật.
 */

export const CELLA_SYSTEM_PROMPT = `Bạn là CELLA AI - Trợ lý Trí tuệ Nhân tạo Độc quyền của Hệ thống CELLA MAKEUP & ACADEMY (CELLA BEAUTÉ).
Slogan CELLA: "Better People, Better Beauty, A Brighter Tomorrow".

=======================================================
⚡ NGUYÊN TẮC BẮT BUỘC: TRẢ LỜI NGẮN GỌN, SÚC TÍCH & TỰ NHIÊN
=======================================================
1. ĐỘ DÀI: CỰC KỲ NGẮN GỌN! Mỗi câu trả lời CHỈ NÊN TỪ 2 ĐẾN 4 CÂU hoặc 3-4 gạch đầu dòng siêu ngắn. Tuyệt đối không viết bài văn dài dông dài.
2. ĐI THẲNG VÀO TRỌNG TÂM: Khách hỏi gì đáp nấy ngay ở câu đầu tiên (nêu rõ giá, học phí, địa chỉ...).
3. XƯNG HÔ THÂN TÌNH: Xưng "em", gọi "chị" (hoặc "anh") lễ phép, ấm áp, dùng ngữ điệu tự nhiên ("nè", "nha", "ạ").
4. KẾT THÚC BẰNG 1 CÂU HỎI MỞ DUY NHẤT: Luôn khép lại bằng đúng 1 câu hỏi mở ngắn gọn, quan tâm thật lòng để tiếp nối câu chuyện.

Ví dụ mẫu ngắn gọn chuẩn mực:
- Khách: "Makeup cô dâu bao nhiêu em?"
- AI: "Dạ gói Cô dâu Ngày cưới VIP bên em là 2.500.000đ (120p), dùng 100% mỹ phẩm High-End Tom Ford/Dior, trọn gói đã gồm làm tóc nghệ thuật và dặm phấn son chị nha. Chị dự định tổ chức vào ngày nào thế ạ? 🥰"

=======================================================
🏛️ THÔNG TIN HỆ THỐNG CELLA MAKEUP & ACADEMY
=======================================================
1. Ban lãnh đạo & Người sáng lập:
- Viện trưởng & Master Artist: Đặng Thuỳ Tiên - Chuyên gia trang điểm hơn 10 năm kinh nghiệm, tu nghiệp tại Hàn Quốc & Thái Lan, giám khảo các cuộc thi trang điểm quốc tế.
- Đội ngũ: Các Master Trainer, Senior Artists và Giảng viên chuyên ngành Makeup, Làm tóc, Chăm sóc da.

2. Hệ thống Cơ sở & Chi nhánh:
- Cơ sở 1 (Trụ sở chính & Studio): 18A Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh.
- Cơ sở 2 (Học viện Đào tạo Chuyên nghiệp): 245 Phan Xích Long, Phường 2, Quận Phú Nhuận, TP. Hồ Chí Minh.
- Hotline tổng đài tư vấn: 0908 654 321 / 0766 311 313.
- Thời gian làm việc: 07:00 - 19:30 tất cả các ngày trong tuần (kể cả Thứ 7, Chủ Nhật và ngày lễ).

=======================================================
💄 BẢNG GIÁ DỊCH VỤ STUDIO CELLA MAKEUP
=======================================================
1. Makeup Cô dâu VIP Ngày cưới:
- Giá niêm yết: 2.500.000 VNĐ (Thời lượng: 120 phút).
- Quyền lợi: Sử dụng 100% mỹ phẩm High-end (Tom Ford, Dior, Chanel, Charlotte Tilbury); Tạo kiểu tóc cô dâu nghệ thuật; Dán mi gân tơ cao cấp; Hoa tươi/phụ kiện cài tóc; Tặng set dặm phấn son mini độc quyền CELLA.
2. Makeup Cô dâu Ăn hỏi / Dạm ngõ:
- Giá: 1.800.000 VNĐ (Thời lượng: 90 phút). Phong cách trang nhã, trong trẻo, áo dài truyền thống hoặc hiện đại.
3. Makeup Thử cô dâu (Bridal Trial):
- Giá: 1.200.000 VNĐ (Thời lượng: 90 phút). Test 2 layout makeup khác nhau (Tone Thái sang chảnh / Hàn Quốc căng bóng) để cô dâu chọn tone ưng ý nhất trước ngày trọng đại.
4. Makeup & Làm tóc Dự tiệc cao cấp:
- Giá: 800.000 VNĐ (Thời lượng: 60 phút). Phù hợp tiệc cưới, sinh nhật, dạ hội, tone Douyin, Clean Girl, Glowy tự nhiên.
5. Makeup Chụp ảnh Kỷ yếu / Profile / Doanh nhân:
- Giá: 600.000 VNĐ (Thời lượng: 60 phút). Lớp nền mỏng mịn, kiềm dầu, chuẩn ánh sáng Studio flash.
6. Dịch vụ Tận nơi (Home / Hotel Service):
- Có hỗ trợ chuyên viên đến tận nơi phục vụ với phụ phí di chuyển từ 300.000đ - 500.000đ trong nội thành TP.HCM.

=======================================================
🎓 CHƯƠNG TRÌNH ĐÀO TẠO TẠI CELLA ACADEMY
=======================================================
1. Khóa Makeup Chuyên Nghiệp Toàn Diện (Pro Artist Course):
- Học phí: 28.500.000 VNĐ (Thời lượng: 3 tháng).
- Đặc điểm: Thực hành 85% trên mẫu thật; Tài trợ 100% mỹ phẩm học tập tại lớp; Tặng bộ cọ Master CELLA cao cấp trị giá 3.500.000đ; Cấp bằng tốt nghiệp có giá trị toàn quốc; Bảo trợ việc làm hoặc cơ hội gia nhập đội ngũ nghệ nhân CELLA.
2. Khóa Master Trainer & Sư Phạm Makeup:
- Học phí: 45.000.000 VNĐ (Thời lượng: 6 tháng).
- Dành cho: Chuyên viên muốn nâng hạng làm Giảng viên đào tạo, mở Studio riêng.
- Nội dung: Kỹ thuật makeup nâng cao đa quốc gia; Kỹ năng sư phạm dạy nghề; Kỹ năng chụp ảnh lookbook; Kỹ thuật xây dựng thương hiệu cá nhân trên TikTok, Reels. Cấp chứng chỉ Sư phạm dạy nghề chuẩn Tổng cục Giáo dục Nghề nghiệp.
3. Khóa Makeup Cô Dâu Chuyên Sâu (Bridal Pro):
- Học phí: 16.500.000 VNĐ (Thời lượng: 1.5 tháng). Chuyên sâu các layout cô dâu đón đầu xu hướng.
4. Khóa Makeup Cá Nhân Cấp Tốc (Personal Beauty):
- Học phí: 3.500.000 VNĐ (6 buổi). Giúp học viên hiểu cấu trúc khuôn mặt, loại da, cách tự trang điểm đi làm và đi tiệc tự tin.

=======================================================
📅 QUY TRÌNH LỊCH HẸN & THANH TOÁN (BOOKING & PAYMENT)
=======================================================
- Đặt cọc: Khách hàng đặt cọc tối thiểu 30% - 50% tổng giá trị dịch vụ để giữ slot giờ đẹp và chỉ định Artist phục vụ.
- Thanh toán số dư: Thanh toán ngay tại Studio sau khi hoàn thành dịch vụ qua mã QR động (VietQR tự động có sẵn số tiền và nội dung chuyển khoản), thẻ POS hoặc tiền mặt.
- Chính sách dời lịch: Báo trước tối thiểu 24 giờ để được dời ngày hẹn miễn phí.

=======================================================
🛡️ PHÂN QUYỀN HỆ THỐNG (RBAC - AI ĐƯỢC XEM/SỬA/XÓA)
=======================================================
- ADMIN / OWNER (Ban Giám Đốc): Toàn quyền Thêm, Xem, Sửa, Xóa mọi dữ liệu, phê duyệt nhân sự, xem toàn bộ báo cáo doanh thu tài chính.
- TRAINER / MASTER: Xem và quản lý học viên lớp mình dạy, quản lý video khóa học, chấm điểm, xem lịch làm việc.
- ARTIST (Nghệ nhân makeup): Tiếp nhận lịch hẹn, check-in đón khách, cập nhật trạng thái làm dịch vụ.
- STAFF / SALES: Quản lý khách hàng, tạo đơn booking, theo dõi phễu CRM (COLD, WARM, HOT, WON).
- STUDENT / CUSTOMER: Xem lịch học/hẹn của cá nhân, xem video khóa học đã mua, kiểm tra điểm tích lũy và ưu đãi.`;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface MinimaxResponse {
  reply: string;
  provider: 'minimax' | 'gemini' | 'cella_engine';
  model?: string;
}

const LOCAL_STORAGE_KEY = 'cella_minimax_api_key';

/**
 * Lấy MiniMax API Key đã lưu (ưu tiên localStorage, fallback sang env)
 */
export function getMinimaxApiKey(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  }
  return (import.meta as any).env?.VITE_MINIMAX_API_KEY || '';
}

/**
 * Lưu MiniMax API Key vào trình duyệt
 */
export function setMinimaxApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
}

/**
 * Kiểm tra kết nối đến API MiniMax
 */
export async function testMinimaxConnection(apiKey: string): Promise<{ success: boolean; message: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: 'Chưa nhập API Key MiniMax' };
  }

  try {
    const response = await fetch('https://api.minimax.chat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-Text-01',
        messages: [
          { role: 'system', content: 'You are CELLA AI.' },
          { role: 'user', content: 'Xin chào, hãy phản hồi 1 câu ngắn xác nhận kết nối.' },
        ],
        max_tokens: 60,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || 'Đã kết nối thành công!';
      return { success: true, message: `Kết nối thành công! (${text.slice(0, 50)}...)` };
    }

    const errData = await response.json().catch(() => ({}));
    return {
      success: false,
      message: errData.error?.message || `Lỗi máy chủ MiniMax (${response.status})`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Không thể kết nối tới máy chủ MiniMax',
    };
  }
}

/**
 * Gửi yêu cầu trò chuyện tới MiniMax API
 */
export async function callMinimaxChat(
  prompt: string,
  history: ChatMessage[] = [],
  apiKey?: string
): Promise<string | null> {
  const key = apiKey || getMinimaxApiKey();
  if (!key) return null;

  const messagesPayload: ChatMessage[] = [
    { role: 'system', content: CELLA_SYSTEM_PROMPT },
    ...history.slice(-6), // Gửi kèm 6 tin nhắn gần nhất để AI hiểu ngữ cảnh
    { role: 'user', content: prompt },
  ];

  try {
    // 1. Thử gọi qua endpoint OpenAI-compatible chuẩn của MiniMax
    const response = await fetch('https://api.minimax.chat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key.trim()}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-Text-01',
        messages: messagesPayload,
        temperature: 0.7,
        max_tokens: 350,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    }

    // 2. Fallback thử endpoint phụ của MiniMax
    const altResponse = await fetch('https://api.minimaxi.chat/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key.trim()}`,
      },
      body: JSON.stringify({
        model: 'abab6.5s-chat',
        messages: [
          {
            sender_type: 'USER',
            sender_name: 'KhachHang',
            text: prompt,
          },
        ],
        bot_setting: [
          {
            bot_name: 'CELLA AI',
            content: CELLA_SYSTEM_PROMPT,
          },
        ],
      }),
    });

    if (altResponse.ok) {
      const altData = await altResponse.json();
      const altContent = altData.choices?.[0]?.messages?.[0]?.text;
      if (altContent) return altContent;
    }
  } catch (error) {
    console.warn('MiniMax direct call failed, falling back to backend or domain engine:', error);
  }

  return null;
}

/**
 * Hàm gọi AI đa tầng (MiniMax Direct -> Backend Proxy -> CELLA Knowledge Engine)
 */
export async function askCellaAI(params: {
  message: string;
  category?: string;
  customerData?: any;
  history?: { role: 'user' | 'ai'; text: string }[];
}): Promise<MinimaxResponse> {
  const { message, category = 'Chung', customerData, history = [] } = params;
  const apiKey = getMinimaxApiKey();

  // Chuẩn bị lịch sử trò chuyện
  const chatHistory: ChatMessage[] = history.map((h) => ({
    role: h.role === 'user' ? 'user' : 'assistant',
    content: h.text,
  }));

  // Ngữ cảnh khách hàng nếu có
  const customerContext = customerData
    ? `\n[Thông tin khách: ${customerData.name || 'N/A'} - Trạng thái: ${customerData.crmStage || 'N/A'} - Tổng chi tiêu: ${customerData.totalSpent ? customerData.totalSpent.toLocaleString('vi-VN') + 'đ' : '0đ'}]`
    : '';

  const fullPrompt = `[Chuyên mục: ${category}]${customerContext}\n\nNội dung hỏi: ${message}`;

  // TẦNG 1: Gọi trực tiếp MiniMax nếu đã có API Key
  if (apiKey) {
    const minimaxReply = await callMinimaxChat(fullPrompt, chatHistory, apiKey);
    if (minimaxReply) {
      return {
        reply: minimaxReply,
        provider: 'minimax',
        model: 'MiniMax-Text-01',
      };
    }
  }

  // TẦNG 2: Gọi qua backend API (/api/ai/chat)
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        category,
        customerData,
        minimaxApiKey: apiKey || undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return {
          reply: data.reply,
          provider: data.model?.includes('minimax') ? 'minimax' : 'gemini',
          model: data.model || 'CELLA Server AI',
        };
      }
    }
  } catch {
    // Backend không khả dụng, tiếp tục fallback tầng 3
  }

  // TẦNG 3: CELLA Master Domain Knowledge Engine (Đảm bảo luôn phản hồi chính xác 100% về hệ thống)
  const domainReply = generateOfflineDomainResponse(message, category, customerData);
  return {
    reply: domainReply,
    provider: 'cella_engine',
    model: 'CELLA Expert Knowledge 2.0',
  };
}

/**
 * Bộ tri thức chuyên gia dự phòng thông minh của CELLA
 */
export function generateOfflineDomainResponse(
  message: string,
  category?: string,
  customerData?: any
): string {
  const query = (message || '').toLowerCase();

  // 1. Hỏi về Bảng giá dịch vụ makeup
  if (
    query.includes('giá') ||
    query.includes('bảng giá') ||
    query.includes('cô dâu') ||
    query.includes('tiệc') ||
    query.includes('dịch vụ') ||
    category === 'Hỗ trợ bán hàng'
  ) {
    return `Dạ bên em có các gói chính nè chị:
• Cô dâu Ngày cưới VIP: 2.500.000đ (120p, mỹ phẩm High-End Dior/Tom Ford, gồm tóc nghệ thuật & set son phấn dặm).
• Cô dâu Ăn hỏi / Dạm ngõ: 1.800.000đ (90p).
• Thử layout cô dâu (Trial): 1.200.000đ (test 2 layout Thái/Hàn).
• Makeup Dự tiệc cao cấp: 800.000đ (60p).
• Kỷ yếu / Doanh nhân: 600.000đ (60p).

Chị đang dự định làm đẹp cho ngày cưới hay đi tiệc vào ngày nào thế ạ? 🥰`;
  }

  // 2. Hỏi về Khóa học tại CELLA Academy
  if (
    query.includes('khóa học') ||
    query.includes('học phí') ||
    query.includes('đào tạo') ||
    query.includes('pro artist') ||
    query.includes('master trainer') ||
    category === 'Hỗ trợ đào tạo'
  ) {
    return `Dạ CELLA Academy hiện có 3 khóa học nổi bật nè chị:
• Khóa Chuyên Nghiệp Pro Artist: 28.500.000đ (3 tháng, thực hành 85% trên mẫu, tài trợ 100% mỹ phẩm + tặng bộ cọ 3.5tr, bao ra nghề).
• Khóa Master Trainer & Sư Phạm: 45.000.000đ (6 tháng, cấp bằng Sư phạm Tổng cục GDNN để đứng lớp/mở Studio).
• Khóa Cá Nhân (Personal Beauty): 3.500.000đ (6 buổi tự trang điểm đi làm/đi tiệc).

Chị muốn học để tự làm đẹp hay định hướng học nghề bài bản mở tiệm thế ạ? ✨`;
  }

  // 3. Hỏi về Quy trình Đặt lịch & Đổi hủy lịch (Booking & Schedule)
  if (
    query.includes('đặt lịch') ||
    query.includes('booking') ||
    query.includes('đổi lịch') ||
    query.includes('hủy') ||
    query.includes('cọc')
  ) {
    return `Dạ đặt lịch bên em rất tiện và nhanh gọn nha chị:
• Giờ phục vụ: 07:00 - 19:30 mỗi ngày tại 18A Ngô Thời Nhiệm, Q.3 (hoặc tận nơi có phụ phí).
• Đặt cọc: 30% - 50% qua mã VietQR tự động để khóa giờ và chọn riêng Artist.
• Đổi lịch: Báo trước 24h là bên em dời lịch hoàn toàn miễn phí ạ.

Chị muốn đặt lịch vào ngày nào và mấy giờ để em kiểm tra slot nghệ nhân cho chị nha? 🗓️`;
  }

  // 4. Kỹ thuật Makeup (Kinh nghiệm chuyên môn)
  if (
    query.includes('mốc') ||
    query.includes('cakey') ||
    query.includes('da dầu') ||
    query.includes('kỹ thuật') ||
    query.includes('nền')
  ) {
    return `Dạ để nền mướt mịn không bị mốc (cakey), chị áp dụng 3 mẹo chuẩn Master CELLA nha:
1. Đắp mask cấp ẩm 10 phút trước khi makeup và thoa kem dưỡng mỏng nhẹ.
2. Dùng mút ẩm dặm từng lớp mỏng dứt khoát (tuyệt đối không miết kéo).
3. Phủ phấn bột vùng chữ T và xịt khóa nền setting spray cách mặt 20cm.

Da của chị là da khô hay thiên dầu ở vùng chữ T thế ạ? 💧`;
  }

  // 5. Tư vấn chung / Kịch bản chốt Sale
  return `Dạ em chào chị nè! Em là CELLA AI, em hỗ trợ nhanh cho chị về Bảng giá dịch vụ, Khóa học Academy, Đặt lịch hẹn và mẹo trang điểm nha.

Chị đang quan tâm dịch vụ nào hay cần em hỗ trợ tình huống gì ạ? 🌸`;
}

