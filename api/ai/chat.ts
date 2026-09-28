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

  const { message, category, customerData, minimaxApiKey } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Missing message parameter' });
  }

  const effectiveKey = minimaxApiKey || process.env.MINIMAX_API_KEY || process.env.VITE_MINIMAX_API_KEY;

  // 1. Try MiniMax API if Key is present
  if (effectiveKey) {
    try {
      const minimaxRes = await fetch('https://api.minimax.chat/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'MiniMax-Text-01',
          messages: [
            { role: 'system', content: CELLA_SYSTEM_PROMPT },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (minimaxRes.ok) {
        const data = await minimaxRes.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return res.status(200).json({
            reply: content,
            provider: 'minimax',
            model: 'MiniMax-Text-01',
          });
        }
      }
    } catch (err) {
      console.warn('MiniMax call error in Vercel function:', err);
    }
  }

  // 2. Fallback to CELLA Domain Knowledge Engine
  const reply = generateOfflineDomainResponse(message, category, customerData);
  return res.status(200).json({
    reply,
    provider: 'cella_engine',
    model: 'CELLA Expert Knowledge 2.0',
  });
}
