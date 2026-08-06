# Hostinger para o ClinicNow — análise e decisão (01/08/2026)

Origem: diretriz do fundador (vídeo de referência sobre Hostinger + página de vendas; pontos específicos do vídeo a incorporar quando o fundador enviar o resumo — o ambiente de trabalho não acessa YouTube).

## O que temos hoje (custo: R$ 0)

| Peça | Onde | Custo |
|---|---|---|
| Site + páginas de venda | GitHub Pages (`drsostenescosta-rgb.github.io`) | grátis |
| Banco + auth + analytics | Supabase São Paulo | grátis (tier atual) |
| Cobrança | Pix manual → gateway no Sprint 2 | — |

## O que o Hostinger acrescentaria

1. **Domínio próprio** (ex.: `clinicnow.com.br` / `clinicnow.app`) — o maior ganho: confiança na venda (médico desconfia de link `github.io`), WhatsApp com link limpo, e base para e-mail profissional. *Alternativa BR: Registro.br (~R$ 40/ano, sem revenda).* 
2. **E-mail profissional** (`sostenes@clinicnow.com.br`) — importante para proposta comercial e para o e-mail transacional do backlog (Resend/Brevo precisam de domínio verificado).
3. **Hospedagem com CDN/SSL** — substituiria o GitHub Pages. Ganho real pequeno: nosso site é estático e o Pages já entrega grátis com SSL.
4. **Builder com IA (Horizons)** — não usar para o produto: nossas páginas são código próprio versionado, com analytics e Supabase integrados; um builder criaria um segundo sistema fora do git (viola a regra "nenhum lead se perde" e a auditoria).

## Decisão recomendada (menor custo, maior ganho)

- **Comprar o domínio** (Hostinger ou Registro.br — o que for mais barato na renovação, não só no 1º ano) e **apontar para o GitHub Pages** (CNAME). O site continua grátis, o link fica profissional, nada muda no código além do arquivo `CNAME`.
- **E-mail profissional** no plano do domínio (Hostinger inclui em vários planos; alternativa: Zoho Mail grátis).
- **Não migrar a hospedagem** enquanto o Pages atender (zero custo, deploy por git, já integrado ao fluxo).
- Isso também destrava a pendência do comitê "registrar domínios das 4 marcas" (prazo 31/ago) — agora para a marca **ClinicNow** (verificar disponibilidade + INPI classes 9/42).

## Passo a passo quando o fundador comprar o domínio

1. Comprar `clinicnow.com.br` (ou `.app`). 2. No painel DNS: criar `CNAME www → drsostenescosta-rgb.github.io` e apontar o apex via `A` para os IPs do GitHub Pages. 3. Me avisar: eu crio o arquivo `CNAME` no repositório e ativo o HTTPS. 4. Atualizar os links do kit de vendas e do WhatsApp.

## Checklist de conversão da página de vendas (aplicado 01/08)

Boas práticas consolidadas de páginas de venda (a incorporar pontos específicos do vídeo quando chegarem):
- [x] Um CTA primário claro e repetido (diagnóstico → aplicação)
- [x] Botão flutuante de WhatsApp (canal de venda real do funil)
- [x] Prova sem promessa: contador real de vagas + selo LGPD + preço público
- [x] Velocidade: página estática, sem libs externas, fontes com preconnect
- [ ] Depoimentos/casos reais — só após os 2 primeiros casos documentados (regra do comitê)
- [ ] Domínio próprio no link (depende da compra acima)
