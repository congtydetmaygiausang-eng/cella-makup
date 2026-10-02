// Standalone Vercel Serverless Function for CELLA AI Chat & Connection Testing
// Completely self-contained with no external local dependencies to ensure 100% reliable execution on Vercel.

export const CELLA_SYSTEM_PROMPT = `Bạn là AI tư vấn viên trực tuyến của CELLA MAKEUP & ACADEMY (CELLA BEAUTÉ).
Slogan CELLA: "Better People, Better Beauty, A Brighter Tomorrow".

# VAI TRÒ CỦA BẠN
Mục tiêu của bạn không phải chỉ là cung cấp thông tin, mà là:
* Hiểu đúng nhu cầu khách hàng.
* Trả lời tự nhiên như một nhân viên tư vấn thật.
* Tạo cảm giác thân thiện, chuyên nghiệp và dễ trao đổi.
* Giúp khách hàng nhanh chóng tìm được dịch vụ phù hợp.
* Khi khách có nhu cầu rõ ràng, hướng họ đến bước đặt lịch / để lại thông tin / mua khoá học.

# NGUYÊN TẮC GIAO TIẾP
Luôn nói chuyện tự nhiên, ngắn gọn (1-4 câu), thân thiện, không trả lời theo kiểu máy móc "Rất vui được hỗ trợ bạn".
Sử dụng tiếng Việt tự nhiên: "Dạ", "ạ", "chị nhé", "nha". Tiết chế emoji (0-2 emoji / tin nhắn).
Chính xác theo bảng giá: Makeup cô dâu ngày cưới VIP 2.500.000đ/120p; Ăn hỏi 1.800.000đ; Dự tiệc 600.000đ - 900.000đ; Khóa Pro Artist 28.500.000đ; Khóa Master Trainer 45.000.000đ; Khóa Cá nhân 3.500.000đ.
Cơ sở chính: 37-39 Phan Bội Châu, Phường Lê Hồng Phong, TP. Thái Bình & Atelier 18A Ngô Thời Nhiệm, Q.3, TP.HCM.
Hotline: 0961 161 994.`;

function generateOfflineDomainResponse(message: string, category?: string, _customerData?: any): string {
  const query = (message || '').trim().toLowerCase();

  if (['ok', 'dạ', 'da', 'cảm ơn', 'cam on', 'ừ', 'u', 'được', 'duoc', 'thanks', 'thx'].includes(query)) {
    return 'Dạ vâng chị nhé 💕 Khi nào chị cần hỗ trợ thêm cứ nhắn em nha!';
  }

  if (query.includes('đặt lịch thế nào') || query.includes('giữ lịch') || query.includes('chốt gói') || query.includes('còn lịch không')) {
    return `Dạ được chị 💕 Để em hỗ trợ giữ lịch cho chị, chị cho em xin:
• Ngày makeup
• Giờ chị cần hoàn thành
• Số điện thoại

Có thông tin em hỗ trợ giữ chỗ đẹp và Artist riêng liền cho chị nhé!`;
  }

  if (query.includes('chưa biết') || query.includes('tư vấn kiểu') || query.includes('hợp mặt') || query.includes('kiểu nào đẹp')) {
    return `Nếu chị thích phong cách nhẹ nhàng trong trẻo thì tone Hàn Quốc sẽ rất hợp, còn muốn sắc sảo và cuốn hút hơn thì tone Thái Lan là chuẩn luôn ạ 💕

Chị có thể gửi em 1 tấm ảnh mặt mộc hoặc kiểu makeup chị thích, em sẽ tư vấn hướng phù hợp nhất cho gương mặt mình nha!`;
  }

  if (query.includes('giá') || query.includes('bảng giá') || query.includes('cô dâu') || query.includes('tiệc') || query.includes('dịch vụ') || category === 'Hỗ trợ bán hàng') {
    return `Dạ gói makeup cô dâu ngày cưới VIP bên em là 2.500.000đ/120 phút chị nhé 💕
Gói này đã gồm makeup, làm tóc nghệ thuật, dán mi gân tơ, phụ kiện và tặng set dặm phấn son mini mang theo.

Nếu chị cho em biết ngày cưới và khu vực tổ chức, em tư vấn gói phù hợp và kiểm tra lịch cho chị nha!`;
  }

  if (query.includes('khóa học') || query.includes('học phí') || query.includes('đào tạo') || query.includes('pro artist') || query.includes('master trainer') || category === 'Hỗ trợ đào tạo') {
    return `Dạ CELLA Academy hiện có 3 khóa học nổi bật nè chị:
• Khóa Chuyên Nghiệp Pro Artist: 28.500.000đ (3 tháng, thực hành 85% trên mẫu, tài trợ 100% mỹ phẩm + tặng bộ cọ 3.5tr, bao ra nghề).
• Khóa Master Trainer & Sư Phạm: 45.000.000đ (6 tháng, cấp bằng Sư phạm Tổng cục GDNN để mở Studio).
• Khóa Cá Nhân: 3.500.000đ (6 buổi tự trang điểm đi làm/đi tiệc).

Chị muốn học để tự làm đẹp hay định hướng học nghề bài bản mở tiệm thế ạ? ✨`;
  }

  if (query.includes('đặt lịch') || query.includes('booking') || query.includes('đổi lịch') || query.includes('hủy') || query.includes('cọc')) {
    return `Dạ đặt lịch bên em rất tiện và nhanh gọn nha chị:
• Giờ phục vụ: 07:00 - 19:30 mỗi ngày (hoặc tận nơi có phụ phí).
• Đặt cọc: 30% - 50% qua mã VietQR tự động để khóa giờ và chọn riêng Artist.
• Đổi lịch: Báo trước 24h là bên em dời lịch hoàn toàn miễn phí ạ.

Chị muốn đặt lịch vào ngày nào và mấy giờ để em kiểm tra slot nghệ nhân cho chị nha? 🗓️`;
  }

  if (query.includes('mốc') || query.includes('cakey') || query.includes('da dầu') || query.includes('kỹ thuật') || query.includes('nền')) {
    return `Dạ để nền mướt mịn không bị mốc (cakey), chị áp dụng 3 mẹo chuẩn Master CELLA nha:
1. Đắp mask cấp ẩm 10 phút trước khi makeup và thoa kem dưỡng mỏng nhẹ.
2. Dùng mút ẩm dặm từng lớp mỏng dứt khoát (tuyệt đối không miết kéo).
3. Phủ phấn bột vùng chữ T và xịt khóa nền setting spray cách mặt 20cm.

Da của chị là da khô hay thiên dầu ở vùng chữ T thế ạ? 💧`;
  }

  return `Dạ em chào chị nè! Em là CELLA AI, em hỗ trợ nhanh cho chị về Bảng giá dịch vụ, Khóa học Academy, Đặt lịch hẹn và tư vấn layout makeup nha.

Chị đang chuẩn bị cho sự kiện nào hay cần em hỗ trợ gì ạ? 💕`;
}

export default async function handler(req: any, res: any) {
  try {
    // CORS configuration
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const {
      action,
      provider,
      apiKey,
      message,
      category,
      customerData,
      minimaxApiKey,
      geminiApiKey,
      history = [],
    } = req.body || {};

    // 1. ACTION: TEST CONNECTION
    if (action === 'test') {
      const testKey = (apiKey || '').trim();
      if (!testKey) {
        return res.status(400).json({ success: false, message: 'Chưa cung cấp API Key để kiểm tra' });
      }

      const isGemini = provider === 'gemini' || testKey.startsWith('AQ.') || testKey.startsWith('AIzaSy');
      if (isGemini) {
        try {
          const testRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${testKey}`
          );
          if (testRes.ok) {
            return res.status(200).json({
              success: true,
              provider: 'gemini',
              message: 'Đã kết nối thành công tới Google Gemini 2.5 Flash API!',
            });
          }
          const errJson = await testRes.json().catch(() => ({}));
          return res.status(200).json({
            success: false,
            provider: 'gemini',
            message: errJson.error?.message || `Lỗi xác thực Gemini API (${testRes.status})`,
          });
        } catch (err: any) {
          return res.status(200).json({
            success: false,
            message: err.message || 'Không thể kết nối đến máy chủ Google Gemini',
          });
        }
      } else {
        // MiniMax Test
        try {
          const mmRes = await fetch('https://api.minimax.chat/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${testKey}`,
            },
            body: JSON.stringify({
              model: 'MiniMax-Text-01',
              messages: [
                { role: 'system', content: 'You are CELLA AI.' },
                { role: 'user', content: 'Ping' },
              ],
              max_tokens: 20,
            }),
          });

          if (mmRes.ok) {
            return res.status(200).json({
              success: true,
              provider: 'minimax',
              message: 'Đã kết nối thành công tới MiniMax-Text-01 API!',
            });
          }
          const mmErr = await mmRes.json().catch(() => ({}));
          return res.status(200).json({
            success: false,
            provider: 'minimax',
            message: mmErr.error?.message || `Lỗi máy chủ MiniMax (${mmRes.status})`,
          });
        } catch (err: any) {
          return res.status(200).json({
            success: false,
            message: err.message || 'Không thể kết nối tới máy chủ MiniMax',
          });
        }
      }
    }

    // 2. CHAT INVOCATION
    if (!message) {
      return res.status(400).json({ error: 'Missing message parameter' });
    }

    const effectiveMinimaxKey = minimaxApiKey || process.env.MINIMAX_API_KEY || process.env.VITE_MINIMAX_API_KEY;
    const effectiveGeminiKey =
      geminiApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY;

    const customerContext = customerData
      ? `\n\n[DỮ LIỆU KHÁCH HÀNG CRM: Tên: ${customerData.name || 'N/A'}, Trạng thái: ${customerData.crmStage || 'N/A'}, Chi tiêu: ${customerData.totalSpent ? customerData.totalSpent.toLocaleString('vi-VN') + 'đ' : '0đ'}]`
      : '';

    const fullPrompt = `[Chuyên mục: ${category || 'Chung'}]${customerContext}\n\nYêu cầu tư vấn: ${message}`;

    // TẦNG 1: Thử Google Gemini 2.5 Flash trước
    if (effectiveGeminiKey) {
      try {
        const contentsPayload = [
          ...history.slice(-6).map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text || h.content || '' }],
          })),
          {
            role: 'user',
            parts: [{ text: fullPrompt }],
          },
        ];

        // TẦNG 1: Google Gemini (Ưu tiên các dòng Flash-Lite siêu tốc độ < 800ms)
        const geminiModels = [
          'gemini-3.5-flash-lite',
          'gemini-flash-lite-latest',
          'gemini-3.1-flash-lite',
          'gemini-3.5-flash',
        ];
        for (const mName of geminiModels) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);

            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${mName}:generateContent?key=${effectiveGeminiKey.trim()}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                  systemInstruction: {
                    parts: [{ text: CELLA_SYSTEM_PROMPT }],
                  },
                  contents: contentsPayload,
                  generationConfig: {
                    temperature: 0.65,
                    maxOutputTokens: 350,
                  },
                }),
              }
            );

            clearTimeout(timeoutId);

            if (geminiRes.ok) {
              const gData = await geminiRes.json();
              const geminiReply = gData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (geminiReply && geminiReply.trim()) {
                return res.status(200).json({
                  reply: geminiReply.trim(),
                  provider: 'gemini',
                  model: `${mName} ⚡ (Siêu tốc)`,
                });
              }
            }
          } catch (modelErr) {
            console.warn(`Model ${mName} attempt failed:`, modelErr);
          }
        }
      } catch (gErr) {
        console.warn('Gemini calls failed in Vercel function:', gErr);
      }
    }

    // TẦNG 2: Thử MiniMax API nếu có Key
    if (effectiveMinimaxKey) {
      try {
        const minimaxRes = await fetch('https://api.minimax.chat/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${effectiveMinimaxKey.trim()}`,
          },
          body: JSON.stringify({
            model: 'MiniMax-Text-01',
            messages: [
              { role: 'system', content: CELLA_SYSTEM_PROMPT },
              ...history.slice(-6).map((h: any) => ({
                role: h.role === 'user' ? 'user' : 'assistant',
                content: h.text || h.content || '',
              })),
              { role: 'user', content: fullPrompt },
            ],
            temperature: 0.7,
            max_tokens: 450,
          }),
        });

        if (minimaxRes.ok) {
          const data = await minimaxRes.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            return res.status(200).json({
              reply: content.trim(),
              provider: 'minimax',
              model: 'MiniMax-Text-01',
            });
          }
        }
      } catch (err) {
        console.warn('MiniMax call error in Vercel function:', err);
      }
    }

    // TẦNG 3: Fallback chuyên gia CELLA Offline Domain Engine
    const reply = generateOfflineDomainResponse(message, category, customerData);
    return res.status(200).json({
      reply,
      provider: 'cella_engine',
      model: 'CELLA Expert Knowledge 2.0',
    });
  } catch (globalErr: any) {
    console.error('Fatal handler error:', globalErr);
    const reply = generateOfflineDomainResponse(req?.body?.message || '', req?.body?.category);
    return res.status(200).json({
      reply,
      provider: 'cella_engine',
      model: 'CELLA Expert Knowledge 2.0 (Resilience)',
    });
  }
}
