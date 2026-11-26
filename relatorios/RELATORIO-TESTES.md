# Relatório de testes e pendências — 26/11/2026

## Auditoria do projeto existente

- Repositório confirmado: `github.com/jpcnexus/renda-extra-qr`, branch `main` (commit `3d3e2ab`, merge da PR #1). Continha `index.html` (landing completa) e `README.md`.
- Trabalho feito na branch `claude/cool-hawking-dlnszi`. A versão anterior continua intacta em `main` (backup e rollback via Git).
- Nenhuma URL pública confirmada: o ambiente do Claude não alcança `nexusjpc.com.br`, `rendaextra.nexusjpc.com.br` nem `kiwify.app` (bloqueio de rede da sessão — **não** significa que os sites estão fora do ar).
- Hostinger: sem acesso nesta sessão. Nenhum arquivo da Hostinger foi lido, alterado ou removido.

## O que foi preservado e o que mudou

Preservado: identidade visual aprovada (paleta creme/laranja), ilustrações próprias dos cards, os 3 links de afiliado com `afid` (idênticos na página antiga e no briefing), `rel="sponsored noopener"`, aviso de afiliação.

Alterado, conforme o briefing:
- Ofertas centralizadas em `public/offers.js` com IDs `shopee`, `pva`, `canva`; ordem do menor para o maior preço.
- Copy do topo, CTA interno, FAQ, rodapé "Um projeto da Nexus JPC", política de privacidade.
- Removidas afirmações não verificadas da versão antiga: "mais de 160 videoaulas", "acesso por 2 anos", "2 bônus", "garantia de 7 dias", parcelamentos e autor. Podem voltar quando confirmadas na Kiwify.
- **Preços ocultos** (`precoConfirmado: false`) até a confirmação na Kiwify.
- Google Fonts removido (fontes nativas: mais rápido e sem envio de IP ao Google sem consentimento).
- GA4 com consentimento: `qr_visit`, `offer_click`; nada carrega antes do "Aceitar".
- Página inteira: ~27 KB, sem bibliotecas externas.

## Testes automáticos (`node ferramentas/testar.js`) — todos passaram

- 360, 390 e 768 px, com e sem UTMs: sem rolagem horizontal, 3 ofertas, links exatos com `afid`, sem erros de console.
- Sem ID do GA4: nenhuma requisição ao Google e nenhum aviso de cookies.
- Com ID de teste (`G-TESTE123`, só no teste, requisições interceptadas):
  - aviso aparece; tag não carrega antes do consentimento;
  - recusa: nenhuma requisição, nenhum cookie `_ga`, escolha lembrada, botão para rever;
  - aceite + URL do QR: tag carregada uma vez, `qr_visit` uma vez, não duplica ao recarregar;
  - clique: `offer_click` com `offer_id=shopee`, `traffic_origin=qr`; nova aba abre exatamente o link de afiliado, sem UTMs extras;
  - acesso sem marcador: sem `qr_visit`; nenhum `purchase`.
- `privacidade.html` abre sem erros.
- QR: decodificado por software (OpenCV) no PNG do código e na arte renderizada a 300 dpi e reduzida a ~90 dpi → resultado exato: `https://rendaextra.nexusjpc.com.br/?utm_source=ponto_onibus&utm_medium=qr&utm_campaign=renda_extra`. QR versão 8, correção Q (~25%), margem de 4 módulos, preto sobre branco, sem logo. Na arte 10x15 cm o código tem ~6 cm (≈1,2 mm por módulo).

## Não realizado (sem acesso ou sem evidência)

- Lighthouse e teste em rede móvel real: não executados.
- Conferência dos links, preços e afiliação na Kiwify.
- Deploy na Hostinger, HTTPS, verificação de URL pública e dos outros sites.
- Teste com GA4 real e escaneamento físico com Android/iPhone.

## Pendências da proprietária (em ordem)

1. Confirmar na Kiwify: afiliação ativa, os 3 links e os preços. Se o preço estiver certo, trocar `precoConfirmado` para `true` em `offers.js`.
2. Fazer o inventário do hPanel e confirmar a URL definitiva (DEPLOY-HOSTINGER.md, passos 0–1).
3. Criar o subdomínio exclusivo, verificar SSL, fazer backup e publicar o zip (passos 2–4).
4. Criar o fluxo GA4 e colocar o `G-...` em `config.js` (passo 5).
5. Informar o link institucional da Nexus JPC (opcional) em `config.js`.
6. Verificação pós-deploy (passo 6). Se a URL final for diferente, regenerar QR e arte.
7. Imprimir uma prova 10x15 cm, escanear em Android e iPhone e só então imprimir o lote.
8. Obter autorização da administração de cada ponto antes de afixar.
