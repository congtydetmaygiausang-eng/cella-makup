import { CELLA_SYSTEM_PROMPT, generateOfflineDomainResponse } from '../../src/services/minimaxService';

export default async function handler(req: any, res: any) {
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

  // 1. ACTION: TEST CONNECTION (Bypass browser CORS for testing)
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

  // TẦNG 1: Thử Google Gemini 2.5 Flash trước (Tốc độ phản hồi cực nhanh, tiếng Việt xuất sắc)
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

      // Thử model gemini-2.5-flash
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${effectiveGeminiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: CELLA_SYSTEM_PROMPT }],
            },
            contents: contentsPayload,
            generationConfig: {
              temperature: 0.65,
              maxOutputTokens: 600,
            },
          }),
        }
      );

      if (geminiRes.ok) {
        const gData = await geminiRes.json();
        const geminiReply = gData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (geminiReply && geminiReply.trim()) {
          return res.status(200).json({
            reply: geminiReply.trim(),
            provider: 'gemini',
            model: 'Gemini 2.5 Flash',
          });
        }
      }
    } catch (gErr) {
      console.warn('Gemini 2.5 Flash call failed in Vercel function:', gErr);
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
}
