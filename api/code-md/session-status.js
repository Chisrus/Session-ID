function send(res, status, payload) {
  res.status(status).json(payload);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return send(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  const botBackendUrl = process.env.BOT_BACKEND_URL;
  if (!botBackendUrl) {
    return send(res, 503, {
      ok: false,
      error: 'BOT_BACKEND_URL non configure. Configure ton backend bot persistant.'
    });
  }

  const sessionId = String(req.query?.sessionId || '').trim();
  if (!sessionId) {
    return send(res, 400, { ok: false, error: 'sessionId manquant.' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const upstreamResponse = await fetch(
      `${botBackendUrl.replace(/\/$/, '')}/session/${encodeURIComponent(sessionId)}`,
      { method: 'GET', signal: controller.signal }
    );
    clearTimeout(timeout);

    const upstreamData = await upstreamResponse.json();
    if (!upstreamResponse.ok || upstreamData.ok === false) {
      return send(res, upstreamResponse.status || 502, {
        ok: false,
        error: upstreamData.error || 'Impossible de recuperer la session.'
      });
    }

    return send(res, 200, {
      ok: true,
      sessionId: upstreamData.sessionId || sessionId,
      status: upstreamData.status || 'pending',
      mode: upstreamData.mode || null,
      pairingCode: upstreamData.pairingCode || null,
      qrText: upstreamData.qrText || null,
      qrImageUrl: upstreamData.qrImageUrl || null,
      expiresAt: upstreamData.expiresAt || null
    });
  } catch (error) {
    return send(res, 500, {
      ok: false,
      error: error?.name === 'AbortError'
        ? 'Timeout backend status.'
        : 'Erreur interne session-status.'
    });
  }
};
