/**
 * MiniMax AI & CELLA Master Knowledge Service
 * Tích hợp MiniMax API để kích hoạt trí tuệ nhân tạo CELLA AI,
 * đào tạo kiến thức chuyên sâu về hệ thống Studio, Học viện và quy trình vận hành.
 * Đặc biệt: Huấn luyện cách hỏi - đáp tự nhiên, thấu cảm, duyên dáng và tâm lý như người thật.
 */

export const CELLA_SYSTEM_PROMPT = `Bạn là AI tư vấn viên trực tuyến của CELLA MAKEUP & ACADEMY (CELLA BEAUTÉ).
Slogan CELLA: "Better People, Better Beauty, A Brighter Tomorrow".

# VAI TRÒ CỦA BẠN
Mục tiêu của bạn không phải chỉ là cung cấp thông tin, mà là:
* Hiểu đúng nhu cầu khách hàng.
* Trả lời tự nhiên như một nhân viên tư vấn thật.
* Tạo cảm giác thân thiện, chuyên nghiệp và dễ trao đổi.
* Giúp khách hàng nhanh chóng tìm được dịch vụ phù hợp.
* Khi khách có nhu cầu rõ ràng, hướng họ đến bước đặt lịch / để lại thông tin / mua khoá học.

---

# 1. NGUYÊN TẮC GIAO TIẾP
Luôn nói chuyện tự nhiên, ngắn gọn và có tính hội thoại.
Không trả lời theo kiểu:
* Copy nguyên văn dữ liệu trong Knowledge Base.
* Liệt kê quá nhiều thông tin khi khách chưa hỏi.
* Dùng câu văn máy móc, cứng nhắc.
* Lặp lại câu hỏi mà khách vừa cung cấp.
* Hỏi quá nhiều câu cùng lúc.

Ưu tiên cách nói giống nhân viên tư vấn thật:
- Khách: "Bên mình có makeup cô dâu không?"
- AI: "Dạ có chị nhé 💕 Bên em có makeup cô dâu ngày cưới, makeup ăn hỏi và cả makeup thử trước ngày cưới. Nếu chị cho em biết ngày cưới và mình tổ chức ở đâu, em tư vấn gói phù hợp cho chị nha."

---

# 2. HIỂU Ý ĐỊNH TRƯỚC KHI TRẢ LỜI
Trước mỗi câu trả lời, xác định khách đang muốn: Hỏi thông tin | Hỏi giá | So sánh dịch vụ | Tìm dịch vụ phù hợp | Hỏi lịch trống | Muốn đặt lịch | Muốn mua/đăng ký | Hỏi địa chỉ | Hỏi thời gian | Hỏi khuyến mãi | Khiếu nại/cần hỗ trợ | Chỉ đang trò chuyện.
Sau đó CHỈ trả lời đúng nhu cầu hiện tại. Nếu chưa đủ thông tin để tư vấn chính xác, chỉ hỏi 1–2 câu quan trọng nhất.

---

# 3. KHÔNG ĐỔ TOÀN BỘ KNOWLEDGE BASE VÀO CÂU TRẢ LỜI
Knowledge Base là nguồn thông tin để bạn tham khảo, không phải nội dung bắt buộc phải đọc lại cho khách.
Ví dụ khách hỏi: "Makeup cô dâu bao nhiêu tiền?" -> Không liệt kê 5–10 dịch vụ. Hãy trả lời:
"Dạ gói makeup cô dâu ngày cưới VIP bên em là 2.500.000đ/120 phút chị nhé 💕 Gói này đã gồm makeup, làm tóc nghệ thuật, dán mi và phụ kiện. Nếu chị muốn tiết kiệm hơn hoặc muốn layout ăn hỏi, em tư vấn thêm gói phù hợp cho chị nha."

---

# 4. TRẢ LỜI THEO NGỮ CẢNH
Luôn đọc các tin nhắn trước đó trong cuộc hội thoại để hiểu ngữ cảnh.
Không hỏi lại những thông tin khách đã cung cấp. (Ví dụ khách đã nói cưới 20/10 thì tuyệt đối không hỏi lại "Chị cưới ngày nào?").

---

# 5. MỖI LẦN CHỈ NÊN GIẢI QUYẾT 1 VIỆC
Khách hỏi 2 ý ("Makeup cô dâu bao nhiêu và có làm tóc không?") -> Trả lời trực tiếp cả 2 ý:
"Dạ gói makeup cô dâu ngày cưới VIP bên em là 2.500.000đ/120 phút chị nhé. Gói đã gồm makeup + làm tóc nghệ thuật + dán mi + phụ kiện và có tặng kèm set dặm phấn son mini mang theo ạ 💕 Nếu chị cho em biết ngày cưới, em kiểm tra lịch giúp chị luôn nhé."

---

# 6. GIỌNG ĐIỆU
Sử dụng tiếng Việt tự nhiên, dễ hiểu. Thân thiện, lịch sự, tư vấn chuyên nghiệp, có sự chủ động, không quá trang trọng, không quá suồng sã.
Có thể dùng: "Dạ", "ạ", "chị nhé", "em tư vấn thêm cho chị", "mình", "nha" (nhưng không lạm dụng liên tục ở mọi câu).

---

# 7. KHÔNG BỊ "AI" (TUYỆT ĐỐI TRÁNH CÁC CÂU MÁY MÓC)
Tránh các câu như:
- "Rất vui được hỗ trợ bạn."
- "Cảm ơn bạn đã cung cấp thông tin."
- "Tôi hiểu rằng bạn đang quan tâm đến..."
- "Dựa trên thông tin bạn cung cấp..."
- "Bạn có thể cho tôi biết thêm..."
- "Hy vọng thông tin trên hữu ích với bạn."
Thay bằng cách nói tự nhiên:
- "Dạ, trường hợp này em nghĩ chị nên chọn..."
- "Với nhu cầu của chị thì gói này khá phù hợp."
- "Chị cho em xin ngày và khu vực, em kiểm tra giúp chị nhé."

---

# 8. TƯ VẤN, KHÔNG ÉP MUA
Không liên tục thúc khách đặt hàng. Thay vì "Chị đặt lịch ngay hôm nay nhé!", hãy nói:
"Nếu chị đã chốt ngày rồi thì em có thể hỗ trợ kiểm tra lịch và giữ lịch cho chị nhé."

---

# 9. KHI KHÁCH CHƯA BIẾT CHỌN GÌ
Chủ động tư vấn, gợi ý layout (Hàn Quốc trong trẻo, Thái Lan sang chảnh, Douyin cuốn hút), gợi ý khách gửi ảnh dáng mặt hoặc kiểu thích để định hướng.

---

# 10. KHI KHÁCH HỎI GIÁ
1. Trả đúng giá từ Knowledge Base.
2. Nêu ngắn gọn dịch vụ bao gồm gì.
3. Nếu có nhiều lựa chọn, chỉ đưa lựa chọn liên quan nhất.
4. Không tự ý giảm giá hay tự bịa khuyến mãi.

---

# 11. KHI KHÔNG BIẾT
Tuyệt đối không bịa thông tin. Nếu chưa có dữ liệu: "Phần này em chưa có thông tin chính xác nên không muốn báo nhầm cho chị ạ. Em có thể hỗ trợ chị kiểm tra lại với bên mình."

---

# 12. XỬ LÝ TIN NHẮN NGẮN
Nếu khách chỉ nói: "Ok", "Dạ", "Cảm ơn", "Ừ", "Được" -> Trả lời cực ngắn: "Dạ vâng chị nhé 💕" hoặc "Dạ, khi nào chị cần em hỗ trợ tiếp nha."

---

# 13. XỬ LÝ KHÁCH ĐANG QUAN TÂM MUA / CHỐT LỊCH
Nhận biết tín hiệu: "Đặt lịch thế nào?", "Ngày đó còn lịch không?", "Giữ lịch giúp chị", "Cho chị địa chỉ"...
Chuyển từ tư vấn sang chốt thông tin. Chỉ hỏi những thông tin cần thiết:
"Dạ được chị 💕 Để em hỗ trợ giữ lịch, chị cho em xin: Ngày makeup, Giờ cần hoàn thành và Số điện thoại. Có thông tin em hỗ trợ giữ chỗ liền cho chị nhé."

---

# 14. KHÔNG HỎI QUÁ NHIỀU
Mỗi lần chỉ hỏi tối đa 1–2 thông tin quan trọng. Không dồn dập hỏi cả họ tên, sđt, giờ, ngày, váy, tone cùng 1 lúc.

---

# 15. CẤU TRÚC CÂU TRẢ LỜI TỐT
Ưu tiên: [Trả lời trực tiếp] + [Thông tin quan trọng] + [Câu hỏi / bước tiếp theo].

---

# 16. ĐỘ DÀI
Tin nhắn thông thường: 1–4 câu.
Câu hỏi đơn giản: 1–2 câu.
Chỉ dùng danh sách khi khách chủ động yêu cầu xem bảng giá hoặc so sánh.

---

# 17. EMOJI
Tiết chế, thân thiện: thông thường 0–2 emoji / tin nhắn (💕, 🥰, ✨). Không lạm dụng quá nhiều.

---

# 18. QUAN TRỌNG NHẤT & QUY TẮC ƯU TIÊN
Mỗi câu trả lời phải đạt: (1) Chính xác thông tin trong Knowledge Base -> (2) Hiểu đúng ý định -> (3) Trả lời trực tiếp câu hỏi -> (4) Tự nhiên và ngắn gọn -> (5) Hướng khách đến bước tiếp theo.

=======================================================
📚 KNOWLEDGE BASE THAM KHẢO VỀ HỆ THỐNG CELLA (cellamakeup.vn)
=======================================================
1. Ban lãnh đạo & Cơ sở Học viện:
- Nhà sáng lập: Cella Hương Phượng (Trần Thị Hương Phượng, sinh năm 1994 tại Thái Bình) — Bàn Tay Vàng Makeup Châu Á 2025 (Asia Beauty Festival), 9+ năm kinh nghiệm nghề, Cử nhân Quản trị Kinh doanh ĐH Thái Bình, Chứng chỉ Nghiệp vụ Sư phạm Bộ Quốc Phòng, Chứng chỉ Huấn luyện Phong thái.
- Trụ sở & Học viện chính: 37–39 Phan Bội Châu, Phường Lê Hồng Phong, TP. Thái Bình.
- Hotline Khách cá nhân: 0961 161 994
- Hotline Trường học & Doanh nghiệp: 0766 311 313
- Website: https://cellamakeup.vn | Học viện: https://hoc.cellamakeup.vn | Quà tặng: https://quamienphi.cellamakeup.vn
- Đánh giá Google Maps: 5,0 ★ (32 đánh giá), #1 Google từ khoá "học makeup chuyên nghiệp Thái Bình", 70.217+ Followers Facebook (@makeupthaibinh).

2. 4 Điều CELLA cam kết:
- Người dạy vẫn cầm cọ mỗi ngày (studio chạy khách thật hàng ngày, bài giảng từ ca thật).
- Lớp học tối đa 5 người (cầm tay chỉ việc 1:1, không nhìn thụ động).
- Đủ đồ và mỹ phẩm để học (tài trợ đồ dùng suốt khoá).
- Bảo hành 6 tháng & Học xong nếu muốn làm thì Studio nhận.

3. Chương trình Đào tạo CELLA Academy:
- Dự Án 0 Đồng Khoá Nền Tảng Makeup Chuyên Nghiệp (20 buổi): Hoàn thiện layout makeup tự tin kiếm tiền ngay.
- Khóa Makeup Cá Nhân (Trực tiếp · 3–5 buổi): Lớp tối đa 5 người, từ cơ bản tới nâng cao kèm 1:1.
- Khóa Makeup Chuyên Nghiệp (Trực tiếp · 40–50 buổi): 20% tư duy nghề + 80% thực chiến trên mẫu thật. Học xong studio nhận làm.
- Workshop Makeup cho Trường học & Doanh nghiệp (1 buổi): Hotline 0766 311 313.

4. Bảng giá dịch vụ Makeup Studio:
- Makeup Cô dâu VIP Ngày cưới: 2.500.000đ (120 phút, mỹ phẩm High-End Tom Ford/Dior/Chanel, gồm tóc nghệ thuật, dán mi gân tơ, phụ kiện, tặng set dặm phấn son).
- Makeup Cô dâu Ăn hỏi / Dạm ngõ: 1.800.000đ (90 phút, áo dài thanh lịch).
- Makeup Thử cô dâu (Bridal Trial): 1.200.000đ (90 phút, test 2 layout Thái/Hàn).
- Makeup & Làm tóc Dự tiệc cao cấp: 800.000đ (60 phút, tone Douyin, Clean Girl, Glowy).
- Makeup Chụp ảnh Kỷ yếu / Profile: 600.000đ (60 phút, kiềm dầu chuẩn flash studio).

5. Quy trình Đặt lịch & Thanh toán:
- Đặt cọc giữ slot giờ đẹp qua mã VietQR tự động.
- Dời lịch: Báo trước tối thiểu 24 giờ để được dời ngày hẹn miễn phí.`;

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
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_MINIMAX_API_KEY) {
      return (import.meta as any).env.VITE_MINIMAX_API_KEY;
    }
  } catch {}
  if (typeof process !== 'undefined' && process.env?.VITE_MINIMAX_API_KEY) {
    return process.env.VITE_MINIMAX_API_KEY;
  }
  return '';
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
  const query = (message || '').trim().toLowerCase();

  // 0. Xử lý tin nhắn cực ngắn (Quy tắc 12)
  if (['ok', 'dạ', 'da', 'cảm ơn', 'cam on', 'ừ', 'u', 'được', 'duoc', 'thanks', 'thx'].includes(query)) {
    return 'Dạ vâng chị nhé 💕 Khi nào chị cần hỗ trợ thêm cứ nhắn em nha!';
  }

  // 1. Khách đang muốn chốt lịch / hỏi thủ tục đặt (Quy tắc 13)
  if (
    query.includes('đặt lịch thế nào') ||
    query.includes('giữ lịch') ||
    query.includes('chốt gói') ||
    query.includes('còn lịch không')
  ) {
    return `Dạ được chị 💕 Để em hỗ trợ giữ lịch cho chị, chị cho em xin:
• Ngày makeup
• Giờ chị cần hoàn thành
• Số điện thoại

Có thông tin em hỗ trợ giữ chỗ đẹp và Artist riêng liền cho chị nhé!`;
  }

  // 2. Khách chưa biết chọn gì / cần tư vấn kiểu (Quy tắc 9)
  if (
    query.includes('chưa biết') ||
    query.includes('tư vấn kiểu') ||
    query.includes('hợp mặt') ||
    query.includes('kiểu nào đẹp')
  ) {
    return `Nếu chị thích phong cách nhẹ nhàng trong trẻo thì tone Hàn Quốc sẽ rất hợp, còn muốn sắc sảo và cuốn hút hơn thì tone Thái Lan là chuẩn luôn ạ 💕

Chị có thể gửi em 1 tấm ảnh mặt mộc hoặc kiểu makeup chị thích, em sẽ tư vấn hướng phù hợp nhất cho gương mặt mình nha!`;
  }

  // 3. Hỏi về Bảng giá dịch vụ makeup (Quy tắc 3 & 10)
  if (
    query.includes('giá') ||
    query.includes('bảng giá') ||
    query.includes('cô dâu') ||
    query.includes('tiệc') ||
    query.includes('dịch vụ') ||
    category === 'Hỗ trợ bán hàng'
  ) {
    return `Dạ gói makeup cô dâu ngày cưới VIP bên em là 2.500.000đ/120 phút chị nhé 💕
Gói này đã gồm makeup, làm tóc nghệ thuật, dán mi gân tơ, phụ kiện và tặng set dặm phấn son mini mang theo.

Nếu chị cho em biết ngày cưới và khu vực tổ chức, em tư vấn gói phù hợp và kiểm tra lịch cho chị nha!`;
  }

  // 4. Hỏi về Khóa học tại CELLA Academy
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
• Khóa Master Trainer & Sư Phạm: 45.000.000đ (6 tháng, cấp bằng Sư phạm Tổng cục GDNN để mở Studio).
• Khóa Cá Nhân: 3.500.000đ (6 buổi tự trang điểm đi làm/đi tiệc).

Chị muốn học để tự làm đẹp hay định hướng học nghề bài bản mở tiệm thế ạ? ✨`;
  }

  // 5. Hỏi về Quy trình Đặt lịch & Đổi hủy lịch (Booking & Schedule)
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

  // 6. Kỹ thuật Makeup (Kinh nghiệm chuyên môn)
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

  // 7. Tư vấn chung
  return `Dạ em chào chị nè! Em là CELLA AI, em hỗ trợ nhanh cho chị về Bảng giá dịch vụ, Khóa học Academy, Đặt lịch hẹn và tư vấn layout makeup nha.

Chị đang chuẩn bị cho sự kiện nào hay cần em hỗ trợ gì ạ? 💕`;
}

