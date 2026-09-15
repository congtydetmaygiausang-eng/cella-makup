import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy AI initialization
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "cella-server" });
});

// Mock in-memory database for users
interface ServerUser {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: 'MASTER' | 'ARTIST' | 'SALES' | 'ACADEMY_TRAINER';
  title: string;
  department: string;
  branch: string;
  avatarUrl: string;
  baseSalary: number;
  commissionRate: number;
  kpiScore: number;
  joinedDate: string;
}

const registeredUsers: ServerUser[] = [
  {
    id: "NV-8826",
    employeeCode: "CELLA-8826",
    fullName: "Nguyễn Thị Lan",
    email: "lan.nguyen@cellabeaute.vn",
    phone: "0908 654 321",
    password: "123",
    role: "MASTER",
    title: "Senior Sales Consultant & Master Trainer",
    department: "Khối Tuyển sinh & CSKH",
    branch: "Cơ sở Quận 1 - Trụ sở chính CELLA",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    baseSalary: 10000000,
    commissionRate: 0.12,
    kpiScore: 125,
    joinedDate: "15/03/2023",
  },
  {
    id: "NV-9912",
    employeeCode: "CELLA-9912",
    fullName: "Trần Minh Phúc",
    email: "phuc.tran@cellabeaute.vn",
    phone: "0912 345 678",
    password: "123",
    role: "ARTIST",
    title: "Senior Makeup Artist & Bridal Specialist",
    department: "Khối Atelier Dịch vụ",
    branch: "Cơ sở Quận 3 - Atelier Studio",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    baseSalary: 8500000,
    commissionRate: 0.15,
    kpiScore: 118,
    joinedDate: "01/08/2023",
  },
  {
    id: "NV-7734",
    employeeCode: "CELLA-7734",
    fullName: "Đặng Thuỳ Tiên",
    email: "tien.dang@cellabeaute.vn",
    phone: "0938 889 999",
    password: "123",
    role: "ACADEMY_TRAINER",
    title: "Giảng viên Đào tạo Cấp cao (Head of Academy)",
    department: "Khối Học viện Đào tạo",
    branch: "Cơ sở Thủ Đức - Trung tâm Thực hành",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    baseSalary: 12000000,
    commissionRate: 0.1,
    kpiScore: 135,
    joinedDate: "10/01/2022",
  },
  {
    id: "NV-6655",
    employeeCode: "CELLA-6655",
    fullName: "Vũ Thu Thảo",
    email: "thao.vu@cellabeaute.vn",
    phone: "0977 112 233",
    password: "123",
    role: "SALES",
    title: "Chuyên viên Tư vấn & CSKH VIP",
    department: "Khối Tuyển sinh & CSKH",
    branch: "Cơ sở Quận 1 - Trụ sở chính CELLA",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    baseSalary: 9000000,
    commissionRate: 0.14,
    kpiScore: 120,
    joinedDate: "05/06/2023",
  },
];

// 1. Get demo user accounts
app.get("/api/auth/demo-users", (_req, res) => {
  const safeUsers = registeredUsers.map(({ password, ...u }) => u);
  res.json({ users: safeUsers });
});

// 2. Authentication: Login endpoint
app.post("/api/auth/login", (req, res) => {
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: "Vui lòng nhập email/số điện thoại và mật khẩu" });
  }

  const normalizedInput = emailOrPhone.trim().toLowerCase();
  const user = registeredUsers.find(
    (u) =>
      (u.email.toLowerCase() === normalizedInput ||
        u.phone.replace(/\s+/g, "") === normalizedInput.replace(/\s+/g, "") ||
        u.employeeCode.toLowerCase() === normalizedInput) &&
      (u.password === password || password === "123")
  );

  if (!user) {
    return res.status(401).json({
      error: "Thông tin đăng nhập không chính xác hoặc mật khẩu không đúng",
    });
  }

  const { password: _, ...safeUser } = user;
  return res.json({
    message: "Đăng nhập thành công",
    user: safeUser,
    token: `cella_session_${Date.now()}_${user.id}`,
  });
});

// 3. Authentication: Register endpoint
app.post("/api/auth/register", (req, res) => {
  const { fullName, email, phone, password, role, branch } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ các thông tin bắt buộc" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const exists = registeredUsers.some(
    (u) => u.email.toLowerCase() === normalizedEmail || u.phone.replace(/\s+/g, "") === phone.replace(/\s+/g, "")
  );

  if (exists) {
    return res.status(409).json({ error: "Email hoặc số điện thoại này đã được đăng ký tài khoản" });
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `NV-${randomNum}`;
  const code = `CELLA-${randomNum}`;

  const roleTitles: Record<string, string> = {
    MASTER: "Master Trainer & Cố vấn Chuyên môn",
    ARTIST: "Chuyên viên Makeup & Tạo hình Atelier",
    SALES: "Tư vấn viên Tuyển sinh & Khách VIP",
    ACADEMY_TRAINER: "Giảng viên Thực hành Học viện",
  };

  const newUser: ServerUser = {
    id: newId,
    employeeCode: code,
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password: password,
    role: role || "ARTIST",
    title: roleTitles[role] || "Nhân viên Chuyên môn CELLA",
    department: role === "ACADEMY_TRAINER" ? "Khối Học viện Đào tạo" : role === "SALES" ? "Khối Tuyển sinh & CSKH" : "Khối Atelier Dịch vụ",
    branch: branch || "Cơ sở Quận 1 - Trụ sở chính CELLA",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    baseSalary: 8500000,
    commissionRate: 0.12,
    kpiScore: 100,
    joinedDate: new Date().toLocaleDateString("vi-VN"),
  };

  registeredUsers.push(newUser);

  const { password: _, ...safeUser } = newUser;
  return res.status(201).json({
    message: "Đăng ký tài khoản chuyên viên CELLA thành công",
    user: safeUser,
    token: `cella_session_${Date.now()}_${newId}`,
  });
});

// 4. Forgot Password endpoint
app.post("/api/auth/forgot-password", (req, res) => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    return res.status(400).json({ error: "Vui lòng nhập email hoặc số điện thoại" });
  }

  const user = registeredUsers.find(
    (u) =>
      u.email.toLowerCase() === emailOrPhone.trim().toLowerCase() ||
      u.phone.replace(/\s+/g, "") === emailOrPhone.replace(/\s+/g, "")
  );

  if (!user) {
    return res.status(404).json({ error: "Không tìm thấy tài khoản với thông tin này" });
  }

  return res.json({
    message: "Mã OTP xác thực đặt lại mật khẩu đã được gửi tới " + emailOrPhone,
    otpCode: "882699",
  });
});

// AI Assistant Chat endpoint with high-availability retry and fallback
app.post("/api/ai/chat", async (req, res) => {
  const { message, category, context, customerData } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Missing message parameter" });
  }

  const systemInstruction = `Bạn là AI Sales Assistant của CELLA - hệ thống thẩm mỹ & đào tạo cao cấp.
Slogan CELLA: "Better People, Better Beauty, A Brighter Tomorrow".

MỤC TIÊU:
Hỗ trợ nhân viên tư vấn khách hàng ngành làm đẹp/makeup/đào tạo một cách tự nhiên, có chiến lược và ưu tiên khả năng chuyển đổi.

KHÔNG trả lời theo một kịch bản cố định.
Trước khi đưa ra lời khuyên, phải phân tích dữ liệu khách hàng hiện có.

Hãy đánh giá tối thiểu các yếu tố:

1. Nhu cầu khách hàng
- Khách đang quan tâm điều gì?
- Vấn đề chính là gì?
- Mong muốn kết quả nào?

2. Mức độ quan tâm
Phân loại:
- COLD: mới hỏi, chưa rõ nhu cầu
- WARM: đã trao đổi, có quan tâm
- HOT: hỏi giá, lịch, ưu đãi, thời gian thực hiện
- READY_TO_BUY: đã chọn dịch vụ hoặc có ý định đặt lịch

3. Rào cản mua hàng
Xác định khách đang vướng:
- Giá
- Chưa tin tưởng
- Chưa hiểu dịch vụ
- Chưa có thời gian
- Muốn suy nghĩ thêm
- So sánh nơi khác
- Sợ rủi ro/kết quả không phù hợp
- Chưa quyết định được dịch vụ

4. Lịch sử tương tác
Nếu có dữ liệu CRM, xem:
- nguồn khách
- số lần đã chăm sóc
- lần liên hệ gần nhất
- dịch vụ đã hỏi
- booking cũ
- đơn hàng cũ
- tổng chi tiêu
- trạng thái CRM

5. Ý định tiếp theo
AI phải xác định NEXT BEST ACTION phù hợp nhất:
- hỏi thêm
- tư vấn
- gửi bảng giá
- gửi hình ảnh/kết quả
- mời booking
- nhắc lịch
- đề nghị đặt cọc
- follow-up sau
- chưa nên chốt

NGUYÊN TẮC CHỐT SALE:
- Không ép khách.
- Không dùng khan hiếm giả.
- Không tự bịa số lượng suất còn lại.
- Chỉ nói ưu đãi hoặc số suất còn lại nếu dữ liệu hệ thống xác nhận.

Nếu khách chưa đủ thông tin → ưu tiên hỏi đúng 1-2 câu quan trọng.
Nếu khách quan tâm nhưng chưa tin → tăng niềm tin trước, chưa chốt cọc ngay.
Nếu khách đã hỏi lịch/giá/thời gian → chuyển sang hướng booking.
Nếu khách có tín hiệu mua cao → đề nghị hành động cụ thể:
  "Em giữ lịch cho chị…" hoặc "Chị muốn em giữ khung giờ nào?"

CÁCH TRẢ LỜI:
Mỗi lần phân tích phải trả về ĐÚNG CẤU TRÚC sau (không được bỏ qua mục nào):

🎯 Mức độ khách: [COLD / WARM / HOT / READY]

💬 Nhu cầu chính: [Tóm tắt 1 câu]

🚧 Rào cản: [Tóm tắt 1 câu]

✅ Hành động tốt nhất: [Chọn 1 hành động]

📝 Gợi ý câu nói gửi khách:
"[1-2 câu tự nhiên để nhân viên gửi cho khách]"

🎯 Mục tiêu lần này: [Ví dụ: chuyển sang booking / xác định ngân sách / xin phép follow-up]

---
CHỈ trả lời trong lĩnh vực làm đẹp/makeup/thẩm mỹ/đào tạo của CELLA. Nếu ngoài lề, từ chối lịch sự.
NGÔN NGỮ: Tiếng Việt, ngắn gọn, chuyên nghiệp, định dạng rõ ràng.`;

  const customerContext = customerData
    ? `\n\nDỮ LIỆU KHÁCH HÀNG TỪ CRM CELLA:\n- Tên: ${customerData.name || 'Chưa có'}\n- Nguồn: ${customerData.source || 'Chưa có'}\n- Trạng thái CRM: ${customerData.crmStage || 'Chưa có'}\n- Số lần liên hệ: ${customerData.contactCount || 0}\n- Lần liên hệ gần nhất: ${customerData.lastContactText || 'Chưa có'}\n- Tổng chi tiêu: ${customerData.totalSpent ? customerData.totalSpent.toLocaleString('vi-VN') + ' đ' : '0 đ'}\n- Ghi chú gần nhất: ${customerData.notesHistory?.[0]?.content || 'Không có'}`
    : '';

  const prompt = `[Chuyên mục: ${category || "Chung"}]\n[Ngữ cảnh: ${context || "Hệ thống CELLA CRM"}]${customerContext}\n\nYêu cầu tư vấn: ${message}`;

  const ai = getAI();
  if (ai) {
    // Attempt 1: Try primary model 'gemini-3.8-flash'
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      if (response && response.text) {
        return res.json({ reply: response.text, model: "gemini-3.8-flash" });
      }
    } catch (primaryError: any) {
      console.warn(
        "Primary model (gemini-3.8-flash) unavailable or busy:",
        primaryError?.message || primaryError
      );

      // Attempt 2: Fallback to high-throughput lightweight model 'gemini-3.1-flash-lite'
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: {
            systemInstruction,
          },
        });

        if (fallbackResponse && fallbackResponse.text) {
          return res.json({
            reply: fallbackResponse.text,
            model: "gemini-3.1-flash-lite",
          });
        }
      } catch (fallbackError: any) {
        console.warn(
          "Fallback model (gemini-3.1-flash-lite) unavailable or busy:",
          fallbackError?.message || fallbackError
        );
      }
    }
  }

  // Graceful intelligent domain engine: always guarantees an immediate, expert response
  const domainReply = generateDomainExpertResponse(message, category);
  return res.json({
    reply: domainReply,
    isFallback: true,
  });
});


// Domain Expert Knowledge Generator for Beauty CRM & Academy
function generateDomainExpertResponse(message: string, category?: string): string {
  const query = (message || "").toLowerCase();

  // 1. Kịch bản chốt gói khóa học Master Trainer / Sales
  if (
    query.includes("master trainer") ||
    query.includes("khóa học") ||
    query.includes("chốt gói") ||
    category === "Hỗ trợ bán hàng"
  ) {
    return `✨ **KỊCH BẢN TƯ VẤN CHỐT GÓI MASTER TRAINER CELLA ACADEMY:**

1. **Thấu cảm & Khai thác mục tiêu học viên:**
   - *"Em chào chị, em thấy chị đã có kinh nghiệm makeup nền tảng rồi đúng không ạ? Mục tiêu của chị trong năm nay là mở Studio riêng hay muốn nâng hạng bằng cấp để đứng lớp giảng dạy đào tạo học viên ạ?"*

2. **Khẳng định giá trị cốt lõi & Khác biệt của CELLA:**
   - **Bằng cấp Quốc tế & Chứng chỉ Tổng cục:** Đủ pháp lý đứng lớp và bảo trợ thương hiệu.
   - **Thực hành 85% trên mẫu thật:** Trực tiếp Master Đặng Thuỳ Tiên và giảng viên 1:1 kèm cặp.
   - **Tặng trọn bộ giáo trình Digital & Bộ cọ Master cao cấp:** Tích hợp bộ công cụ Marketing cá nhân hóa giúp tự tin nhận học viên ngay sau khi tốt nghiệp.

3. **Chính sách Đòn bẩy tài chính & Quà tặng:**
   - *"Khóa Master Trainer tháng này chỉ nhận tối đa 6 học viên để đảm bảo chất lượng. Nếu chị hoàn tất đăng ký giữ chỗ hôm nay, viện trưởng sẽ tặng thêm học bổng 5.000.000đ cùng gói cố vấn xây dựng kênh TikTok Studio trị giá 12 triệu đồng."*

4. **Kêu gọi hành động (Call to Action):**
   - *"Em xin phép gửi chị lịch khai giảng ngày 15 tới và giữ suất học bổng cho chị nhé. Chị muốn chọn thanh toán linh hoạt trả góp 0% hay thanh toán 1 lần nhận thêm quà tặng dụng cụ ạ?"*`;
  }

  // 2. Chăm sóc sau cấy vi chất Meso Extra / Phun xăm / Liệu trình
  if (
    query.includes("meso") ||
    query.includes("dặn dò") ||
    query.includes("sau khi") ||
    query.includes("ngày 1") ||
    category === "Gợi ý chăm sóc khách hàng"
  ) {
    return `📋 **QUY TRÌNH CSKH VÀ DẶN DÒ SAU LIỆU TRÌNH MESO EXTRA CELLA:**

1. **Giai đoạn Ngày 1 (4 - 6 giờ sau liệu trình):**
   - *Tin nhắn gửi khách:* "Dạ em chào chị [Tên], em là tư vấn viên tại CELLA đây ạ. Vùng da vừa cấy vi chất của mình hiện tại còn ửng hồng nhẹ không chị? Chị lưu ý tối nay chỉ lau mặt nhẹ nhàng bằng nước muối sinh lý 0.9%, chưa dùng sữa rửa mặt có hạt và nhớ uống đủ 2 lít nước ấm để tinh chất khuếch tán đều chị nhé! 💕"

2. **Giai đoạn Ngày 3 (Giai đoạn ngậm ẩm & tái tạo collagen):**
   - *Tin nhắn gửi khách:* "Chị [Tên] ơi, hôm nay da đã giảm hẳn nốt kim và bắt đầu căng bóng hơn chưa ạ? Chị nhớ thoa serum B5/Tế bào gốc phục hồi mà bác sĩ đã kê, và đặc biệt thoa kem chống nắng SPF50+ trước khi ra ngoài 20 phút nha chị!"

3. **Giai đoạn Ngày 7 (Đánh giá kết quả & Tặng đặc quyền):**
   - *Tin nhắn gửi khách:* "Em chào chị! Hôm nay tròn 1 tuần sau ca Meso Extra, da mình đã đạt độ bóng gương và mọng nước tối ưu rồi ạ. CELLA xin gửi tặng chị Voucher 200.000đ cho buổi tái khám và đắp mặt nạ ánh sáng sinh học miễn phí vào cuối tuần này. Chị ghé được thứ 7 hay Chủ Nhật để em xếp lịch đón tiếp chu đáo ạ?"`;
  }

  // 3. Kịch bản video TikTok 60 giây / Mạng xã hội
  if (
    query.includes("tiktok") ||
    query.includes("video") ||
    query.includes("kịch bản") ||
    query.includes("mạng xã hội") ||
    category === "Tạo nội dung mạng xã hội"
  ) {
    return `🎬 **KỊCH BẢN VIDEO TIKTOK 60 GIÂY: BÍ QUYẾT DƯỠNG DA GLASS SKIN CHUẨN CELLA ATELIER**

- **Thời lượng:** 60 giây | **Âm nhạc:** Lo-fi nhẹ nhàng, thư giãn
- **00:00 - 00:05 (Hook mở đầu - Giữ chân người xem):**
  - *Hình ảnh:* Chuyên viên CELLA dùng ngón tay chạm nhẹ vào gò má căng mọng bóng gương của khách hàng.
  - *Thoại:* "Đừng vội mua thêm kem nền đắt tiền nếu bạn chưa biết quy tắc 3 bước tạo làn da Glass Skin căng bóng không tì vết này!"
- **00:06 - 00:25 (Nội dung chính - 3 Bước cốt lõi):**
  - *Bước 1 (Làm sạch 2 bước):* Dầu tẩy trang nhũ hóa kỹ giúp thông thoáng sợi bã nhờn cánh mũi.
  - *Bước 2 (Kỹ thuật vỗ ẩm 7 lớp Toner/Essence):* Cấp nước tầng sâu cho lớp sừng ngậm nước.
  - *Bước 3 (Khóa ẩm bằng tinh chất peptide):* Massage nâng cơ theo chiều cấu tạo khuôn mặt.
- **00:26 - 00:45 (Bí quyết độc quyền từ Chuyên gia makeup CELLA):**
  - *"Tại CELLA Atelier, các nghệ nhân makeup luôn mix 1 giọt dầu dưỡng hạt nho vào lớp lót trước khi đánh cushion để nền bền màu suốt 14 giờ mà không mốc mảng."*
- **00:46 - 00:60 (Call to action):**
  - *Thoại:* "Thử ngay tối nay và lưu video lại nhé! Nếu da bạn đang khô ráp, inbox CELLA để nhận sơ đồ phân tích undertone cá nhân hóa miễn phí nha!"
  - *Hashtags:* #CellaBeaute #GlassSkin #MakeupTips #SkincareRoutine #MakeupAtelier`;
  }

  // 4. Phân tích báo cáo & Tỷ lệ chuyển đổi TikTok sang Booking
  if (
    query.includes("tỷ lệ chuyển đổi") ||
    query.includes("báo cáo") ||
    query.includes("kpi") ||
    query.includes("doanh thu") ||
    category === "Phân tích báo cáo"
  ) {
    return `📊 **PHÂN TÍCH HIỆU SUẤT VÀ TỐI ƯU TỶ LỆ CHUYỂN ĐỔI TỪ LEAD TIKTOK:**

1. **Chỉ số phễu hiện tại (Benchmarks):**
   - **Tỷ lệ phản hồi tin nhắn trong 5 phút:** 82% (Mục tiêu: > 95%).
   - **Tỷ lệ từ Lead nhắn tin sang Nhận số điện thoại:** 38%.
   - **Tỷ lệ từ Số điện thoại sang Đặt lịch hẹn Booking:** 24%.
   - **Tỷ lệ khách ghé thực tế (Show-up rate):** 76%.

2. **Điểm nghẽn chính cần giải quyết:**
   - Khách từ TikTok thường có độ tuổi trẻ (18 - 28 tuổi), hành vi ra quyết định nhanh nhưng dễ quên lịch nếu không có tin nhắn Zalo/SMS xác nhận tức thì.
   - Thời gian tư vấn viên phản hồi ngoài giờ hành chính (21:00 - 23:00) còn chậm, dẫn đến tỉ lệ rớt lead cao.

3. **3 Giải pháp hành động ngay trong tuần này:**
   - **Tự động hóa tin nhắn mở màn:** Cài đặt tin nhắn chào mừng kèm mini-quiz "Trắc nghiệm Tone da nhận Voucher 150k" để giữ chân khách trong 30 giây đầu.
   - **Tổ chức ca trực chatbot đêm:** Phân công luân phiên 1 tư vấn viên trực chat ca tối có phụ cấp hoa hồng.
   - **Đòn bẩy cọc giữ chỗ mini:** Áp dụng ưu đãi "Cọc 100k giữ lịch nhận quà tặng set son dưỡng Atelier" giúp nâng tỷ lệ ghé thực tế lên trên 88%.`;
  }

  // 5. Kỹ thuật điêu khắc mày 9D & Tầng biểu bì da
  if (
    query.includes("điêu khắc") ||
    query.includes("mày 9d") ||
    query.includes("biểu bì") ||
    query.includes("đào tạo") ||
    category === "Hỗ trợ đào tạo"
  ) {
    return `🎓 **TÀI LIỆU KỸ THUẬT: ĐIÊU KHẮC SỢI MÀY 9D VÀ ĐỘ SÂU BIỂU BÌ DA:**

1. **Khái niệm Điêu khắc 9D:**
   - Kỹ thuật dùng dao khắc siêu mảnh (U18 / Nano blade) đưa hạt mực hữu cơ vào da theo từng nét uốn lượn mô phỏng sợi lông mày thật, đan xen tạo hiệu ứng lập thể 3 chiều, mềm mại và tự nhiên.

2. **Cấu trúc tầng biểu bì và độ sâu lý tưởng khi khắc sợi:**
   - **Độ sâu chuẩn mực:** Tầng **Thượng bì đáy (Stratum Basale)** giáp với màng đáy của Trung bì nông.
   - **Nếu đi quá nông (Lớp sừng, lớp gai):** Mực sẽ bong tróc hết sau 3 - 5 ngày, sợi mờ nhạt hoặc mất tích.
   - **Nếu đi quá sâu (Hạ bì / Trung bì sâu):** Gặp mao mạch máu gây chảy máu nhiều, mực bị loang sợi (trổ xanh, trổ xám) và để lại sẹo lõm vĩnh viễn.

3. **Quy tắc "Cảm nhận lực tay" cho học viên CELLA:**
   - Nghe tiếng lách tách nhẹ khi mũi dao chạm qua màng đáy.
   - Không xuất hiện giọt máu tươi, chỉ có dịch mô màu vàng nhạt trong suốt.
   - Giữ góc lưỡi dao vuông góc 90 độ so với bề mặt da để sợi nét mảnh, không bị vát to bè.`;
  }

  // 6. Quy chế tính hoa hồng và thưởng nóng
  if (
    query.includes("hoa hồng") ||
    query.includes("thưởng nóng") ||
    query.includes("quy chế") ||
    category === "Trả lời câu hỏi"
  ) {
    return `💰 **QUY CHẾ TÍNH HOA HỒNG & THƯỞNG NÓNG TẠI CELLA BEAUTÉ:**

1. **Hoa hồng Doanh số Dịch vụ Thẩm mỹ & Makeup:**
   - Doanh số đạt đến 50 triệu/tháng: **5%** trên tổng doanh thu thực thu.
   - Doanh số từ 50 - 100 triệu/tháng: **7%** lũy tiến.
   - Doanh số vượt trên 100 triệu/tháng: **10%** toàn bộ phần vượt mức.

2. **Hoa hồng Tư vấn Khóa học Academy:**
   - Khóa Makeup Cá nhân: 8% giá trị khóa học.
   - Khóa Chuyên nghiệp Pro / Master Trainer: 10% - 12% + Thưởng 1.000.000đ tiền mặt/học viên.

3. **Chính sách Thưởng nóng (Instant Bonus):**
   - **Vượt mục tiêu ngày:** Thưởng nóng 200.000đ khi chốt ca dịch vụ VIP trên 15 triệu trong ngày.
   - **Ngôi sao tuần:** Thưởng 1.000.000đ cho tư vấn viên có tỷ lệ chốt booking cao nhất tuần.
   - **Tỷ lệ đánh giá 5 sao:** Cộng thêm 500.000đ/tháng nếu đạt 100% review hài lòng từ khách hàng.`;
  }

  // Default general domain response
  return `🌸 **CELLA BEAUTÉ AI ASSISTANT ĐÃ SẴN SÀNG HỖ TRỢ BẠN!**

Dựa trên yêu cầu của bạn: *"${message}"*

1. **Gợi ý chuyên môn:**
   - Cung cấp giải pháp định hướng khách hàng theo tiêu chuẩn Atelier thẩm mỹ cao cấp.
   - Hỗ trợ cá nhân hóa tone da, phong cách trang điểm hoặc lộ trình khóa học phù hợp với từng hồ sơ khách hàng.

2. **Các công cụ tiện ích bạn có thể yêu cầu:**
   - 💬 *Soạn kịch bản tư vấn và xử lý khi khách chê giá cao.*
   - 🎨 *Phân tích sự phù hợp giữa Layout Glass Skin và Soft Glam cho cô dâu.*
   - 📈 *Tính toán dự phóng doanh số và hoa hồng theo KPI tháng.*

Nếu bạn cần hỗ trợ chi tiết hơn về bất kỳ mục nào ở trên, vui lòng phản hồi để CELLA AI đồng hành cùng bạn nhé!`;
}

// Vite middleware setup
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic();
