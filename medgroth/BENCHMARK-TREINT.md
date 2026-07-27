# Benchmark competitivo · Treint (Treatment Intelligence) × Ecossistema MedGroth

**Data:** 27/07/2026 · **Fontes:** capturas de tela dos 4 produtos (docx.treint.com, treint.vercel.app, treint.vercel.app/docatlas, treatmentintelligence.com) + pesquisa pública (treint.com). O acesso direto ao site foi bloqueado pela rede do ambiente de análise; onde a informação vem só de screenshot ou busca, está sinalizado.

---

## 1. Quem é a Treint

- **Nome completo:** Treint — "Treatment Intelligence". Slogan público: *"Stay on top of your health game"*.
- **Origem provável:** Índia (telefones +91 nas telas, nomes de médicos/pacientes indianos, terminologia OPD/IPD típica de hospitais indianos).
- **Estágio aparente:** early-stage. Sinais: produto principal hospedado em subdomínio gratuito `treint.vercel.app`, dados de demonstração com placeholders (`Rxxxxz 100mg Injection`), claim de "10.000+ profissionais" sem prova social nominal, tráfego comprado no Instagram (as capturas vieram de anúncios).
- **Tese central:** verticalizar a relação médico–paciente em torno do médico ("Direct-to-Doctor"), com IA como camada de inteligência — *"systematic intelligence, not software complexity"*.

## 2. Portfólio de produtos (4 frentes)

| Produto | O que é | Proposta de valor | Modelo |
|---|---|---|---|
| **DocX** (docx.treint.com) | Plataforma "Direct-to-Doctor": o médico cria **planos de saúde próprios**, **assina pacientes** (recorrência) e constrói **comunidade própria** | *"Where Doctors Own Modern Healthcare"* — IA/analytics para "gerenciar milhares de pacientes em paralelo"; "institutional-grade" | Entrada por **aplicação** ("Apply to Join DocX") — exclusividade/escassez |
| **Prime** (treint.vercel.app) | Gestão de clínica all-in-one: EHR, faturamento automatizado, OPD/IPD, agenda com status de pagamento, analytics em tempo real | *"One platform. Total control."* — consolidar operação e "maximizar receita" | SaaS clássico de clínica |
| **DocAtlas / DocPedia** (treint.vercel.app/docatlas) | Base de conhecimento médico pesquisável: **Medicamentos, Sais, Labs, Radiologia, Procedimentos, Doenças**, com monografia completa (usos, benefícios, efeitos colaterais, substitutos, fact box) | *"Unlock Medical Knowledge, Empower Your Growth"* — educação/atualização rápida do médico | Isca de topo de funil + retenção diária |
| **Treatment Intelligence** (treatmentintelligence.com) | IA de análise de caso: campo único *"Describe your patient case…"* → **Diagnosis · Treatment Plan · Research** baseados em evidência | *"Analyze any patient case… instantly"* | Produto-vitrine de IA clínica |

**Leitura estratégica:** os 4 produtos formam um funil — DocAtlas (uso diário gratuito, hábito) → Treatment Intelligence (uau de IA) → Prime (operação da clínica) → DocX (monetização recorrente do médico via assinatura de pacientes). O médico entra pelo conhecimento e sai dono de um "mini plano de saúde" dentro da plataforma.

## 3. O que eles fazem bem (para copiar com adaptação)

1. **Narrativa de posse:** "Where Doctors **Own** Modern Healthcare" — não vendem software, vendem propriedade do negócio. Idêntico em espírito ao MedGroth ("cockpit de crescimento"), mas com verbo mais forte.
2. **Recorrência do paciente como produto:** o coração do DocX é o médico vender **assinatura de cuidado** ao próprio paciente. Isso transforma o SaaS em infraestrutura de receita do médico (alinhamento perfeito de incentivos: a plataforma cresce quando o médico fatura).
3. **Funil de aplicação:** "Apply to Join" em vez de "Sign up" — escassez, curadoria e senso de clube. MedGroth já tem as "20 vagas de fundador"; eles elevam isso a mecânica de produto.
4. **Base de conhecimento como hábito diário:** DocAtlas dá motivo para o médico abrir a plataforma todo dia mesmo sem paciente novo. Retenção barata.
5. **Entrada de IA com um campo só:** a home do Treatment Intelligence é um input + 3 chips (Diagnóstico/Plano/Pesquisa). Zero fricção para demonstrar valor.
6. **Aquisição:** anúncios de Instagram levando direto a landings específicas por produto (as capturas vieram de Stories) — cada produto tem sua própria porta de entrada e URL.

## 4. Fraquezas deles (onde o seu ecossistema ganha)

1. **Amplitude sem profundidade:** 4 produtos simultâneos em estágio inicial (subdomínio vercel.app, dados placeholder) = execução diluída. MedGroth/SosMed são focados e já têm backend real (Supabase com RLS, fallback de leads).
2. **IA clínica sem guarda-corpos visíveis:** "generate treatment plans instantly" sem disclaimers aparentes. No Brasil isso bate no CFM; o seu princípio "apoio, não diagnóstico" (Lia/Copiloto) é diferencial de confiança e de compliance.
3. **Promessas infláveis:** "manage thousands of patients in parallel", "10,000+ professionals" — sem prova. A regra do MedGroth ("prova de valor = resultado clínico medido, nunca promessa") envelhece melhor.
4. **Sem camada de crescimento/vendas:** eles dão a infraestrutura, mas não ensinam o médico a encher a agenda. O MedGroth (diagnóstico → plano de 4 semanas → CRM → protocolos precificados) não tem equivalente no portfólio deles.
5. **Contexto regulatório:** modelo "médico cria plano de saúde" é sensível no Brasil (ANS regula planos; assinatura de serviços médicos precisa de desenho jurídico cuidadoso — ver §6).

## 5. Ideias de integração ao MedGroth (priorizadas)

### Prioridade A — encaixam nos sprints já planejados, alto impacto

1. **"Protocolos por assinatura" (DocX à brasileira).** O MedGroth já sugere *protocolos precificados por nicho*; evoluir para o médico empacotar o protocolo como **plano de acompanhamento recorrente** (ex.: "Acompanhamento metabólico — R$ X/mês: consultas trimestrais + revisão de exames + canal de dúvidas"). Encaixa direto no Sprint 2 (Stripe/Mercado Pago Assinaturas): a mesma infra que cobra o médico pode gerar links de assinatura dos pacientes dele. **É a ideia mais valiosa do benchmark** — muda o MedGroth de "app de crescimento" para "infraestrutura de receita recorrente do médico".
2. **Mecânica "Apply to Join" nas 20 vagas de fundador.** Trocar o CTA de compra por **aplicação com curadoria** (formulário de diagnóstico já existe em `captura.html` — vira a própria aplicação). Aumenta percepção de valor e qualifica o lead antes do WhatsApp.
3. **Campo único de IA como demo pública.** Na página de vendas, um input "Descreva sua clínica em 1 frase" → 3 chips (Diagnóstico · Plano de 4 semanas · Script de conversão) com resposta parcial e CTA para destravar o restante. Usa o `/api/groth` já previsto no Sprint 3; vira o "uau" de topo de funil igual ao Treatment Intelligence, mas sobre **crescimento**, não clínica (zero risco CFM).

### Prioridade B — retenção e ecossistema

4. **"GrothPedia" — biblioteca de crescimento por nicho.** Versão MedGroth do DocAtlas: fichas pesquisáveis de *protocolos por especialidade* (o que é, precificação de referência, script de oferta, regras de publicidade CFM aplicáveis). Conteúdo que o médico consulta toda semana = hábito diário barato, e cada ficha é uma landing indexável (SEO).
5. **Dashboard "receita em tempo real" estilo Prime.** O painel de metas do app já existe; adicionar visão de agenda×pagamento (consultas com status pago/pendente, MRR de pacientes assinantes quando o item 1 existir). Reforça a narrativa "cockpit".
6. **Comunidade dos fundadores.** O DocX vende "build your own healthcare community" para pacientes; a versão MedGroth é a **comunidade das 20 fundadoras** (grupo WhatsApp + casos antes/depois do Sprint 4). Prova social composta.

### Prioridade C — posicionamento e aquisição

7. **Uma landing por produto do ecossistema** (padrão Treint): MedEasy, SosMed e MedGroth já têm páginas; padronizar narrativa de suíte ("um ecossistema, três camadas: cuidado → operação → crescimento") com navegação cruzada, cada uma pronta para receber tráfego de Instagram separadamente.
8. **Verbo de posse no copy.** Testar headline do MedGroth no espírito "seja dono": ex. *"O médico dono da própria demanda"* — mantendo a regra de venda ética (sem promessa de resultado).
9. **Versão em inglês** (já no Sprint 4) ganha urgência menor: o benchmark mostra que o jogo deles é volume/Índia; o seu é profundidade/Brasil+CFM. Diferencial defensável é o compliance local, não a globalização precoce.

## 6. Alertas regulatórios (o que NÃO copiar)

- **Não** chamar assinatura de acompanhamento de "plano de saúde" — no Brasil, plano de saúde é atividade regulada pela **ANS**. O desenho correto é *contrato de prestação de serviços médicos com pagamento recorrente* (fee for care / assinatura de serviços), com escopo definido e sem intermediação de risco. Validar com o advogado já previsto no plano do SosMed.
- **Não** prometer diagnóstico/plano de tratamento por IA ao paciente ou ao médico sem supervisão — manter o padrão Lia/Copiloto ("apoio, não diagnóstico", log auditável).
- **Não** usar claims não comprováveis ("milhares de pacientes em paralelo") — CFM/publicidade médica e a própria regra nº 2 do backlog.

## 7. Matriz comparativa rápida

| Dimensão | Treint | Ecossistema (MedEasy+SosMed+MedGroth) |
|---|---|---|
| Foco | Suíte ampla (4 produtos), Índia | Profundidade no médico BR, 3 camadas integradas |
| IA | Diagnóstico/plano de tratamento (agressivo) | Vendas/crescimento + copiloto com guarda-corpos |
| Receita do médico | Assinatura de pacientes (DocX) | **Gap → ideia nº 1** |
| Gestão de clínica | Prime (EHR/OPD/IPD/billing) | SosMed console + agenda + marketplace |
| Crescimento/vendas do médico | **Gap deles** | MedGroth (diagnóstico→plano→CRM→protocolos) |
| Conhecimento/hábito diário | DocAtlas/DocPedia | Gap → ideia nº 4 |
| Compliance local | Não visível | Regra de produto explícita (CFM, venda ética) |
| Prova social | Claim sem nome | 20 fundadoras com casos medidos (planejado) |

## 8. Resumo executivo

A Treint valida a tese de que o próximo passo do SaaS médico é **transformar o médico em dono de receita recorrente** — exatamente o degrau que falta entre o MedGroth de hoje (crescimento da agenda) e o de amanhã (assinatura de pacientes por protocolo). As três apostas que mais valem o esforço: **(1)** protocolos por assinatura sobre a infra de cobrança do Sprint 2, **(2)** funil de aplicação nas vagas de fundador, **(3)** demo pública de IA de um campo só via `/api/groth`. Tudo o mais deles é execução ampla e rasa; o diferencial defensável do seu ecossistema é profundidade + compliance brasileiro.
