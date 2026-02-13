const { randomUUID } = require('node:crypto');

function send(res, status, payload) {
  res.status(status).json(payload);
}

function cleanNumber(input) {
  return String(input || '').replace(/\D/g, '');
}

function isValidMode(mode) {
  return mode === 'pair' || mode === 'qr';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return send(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  const botBackendUrl = process.env.BOT_BACKEND_URL;
  if (!botBackendUrl) {
    return send(res, 503, {
      ok: false,
      error: 'BOT_BACKEND_URL non configure. Configure ton backend bot persistant.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const phoneNumber = cleanNumber(body.phoneNumber);
    const mode = body.mode;

    if (!phoneNumber || phoneNumber.length < 8 || phoneNumber.length > 15) {
      return send(res, 400, { ok: false, error: 'Numero WhatsApp invalide.' });
    }

    if (!isValidMode(mode)) {
      return send(res, 400, { ok: false, error: 'Mode invalide. Utilise pair ou qr.' });
    }

    const requestSessionId = randomUUID();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const upstreamResponse = await fetch(`${botBackendUrl.replace(/\/$/, '')}/session/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, mode, requestSessionId }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    const upstreamData = await upstreamResponse.json();
    if (!upstreamResponse.ok || upstreamData.ok === false) {
      return send(res, upstreamResponse.status || 502, {
        ok: false,
        error: upstreamData.error || 'Echec de creation de session.'
      });
    }

    return send(res, 200, {
      ok: true,
      sessionId: upstreamData.sessionId || requestSessionId,
      status: upstreamData.status || 'pending',
      mode: upstreamData.mode || mode,
      pairingCode: upstreamData.pairingCode || null,
      qrText: upstreamData.qrText || null,
      qrImageUrl: upstreamData.qrImageUrl || null,
      expiresAt: upstreamData.expiresAt || null,
      message: upstreamData.message || 'Session creee.'
    });
  } catch (error) {
    return send(res, 500, {
      ok: false,
      error: error?.name === 'AbortError'
        ? 'Timeout backend. Reessaie.'
        : 'Erreur interne create-session.'
    });
  }
};
