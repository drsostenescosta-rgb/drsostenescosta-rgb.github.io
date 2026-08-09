// Token assinado para o chat da Emily — a chave ElevenLabs vive SÓ no servidor (env da Vercel).
const AGENT_ID = "agent_7501kzdamp08emhs7cc61avfg2nf";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.status(405).json({ erro: "método não permitido" });
    return;
  }
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    res.status(500).json({ erro: "ELEVENLABS_API_KEY não configurada no servidor" });
    return;
  }
  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`,
      { headers: { "xi-api-key": key }, signal: AbortSignal.timeout(8000) }
    );
    if (!r.ok) {
      res.status(502).json({ erro: `elevenlabs ${r.status}` });
      return;
    }
    const { signed_url } = await r.json();
    res.status(200).json({ signed_url });
  } catch (e) {
    res.status(504).json({ erro: "tempo esgotado ao falar com a ElevenLabs" });
  }
}
