// Token assinado para o chat da Emily — a chave ElevenLabs vive SÓ no servidor (env da Vercel).
const AGENT_ID = "agent_7501kzdamp08emhs7cc61avfg2nf";

const ORIGENS = new Set([
  "https://zatheon.ai", "https://www.zatheon.ai",
  "https://zatheon.vercel.app", "https://drsostenescosta-rgb.github.io",
]);
const hits = new Map(); // rate limit por IP (por instância morna)

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.status(405).json({ erro: "método não permitido" });
    return;
  }
  const origem = req.headers.origin || "";
  const referer = req.headers.referer || "";
  const permitido = ORIGENS.has(origem) ||
    [...ORIGENS].some((o) => referer.startsWith(o + "/")) ||
    (!origem && !referer); // navegação direta sem headers não é farm de script
  if (!permitido) {
    res.status(403).json({ erro: "origem não autorizada" });
    return;
  }
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon";
  const agora = Date.now();
  const reg = hits.get(ip) || { n: 0, t: agora };
  if (agora - reg.t > 60_000) { reg.n = 0; reg.t = agora; }
  reg.n += 1; hits.set(ip, reg);
  if (reg.n > 10) {
    res.status(429).json({ erro: "muitas conexões — aguarde um minuto" });
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
