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

## Verificação em produção — 26/11/2026

Publicado pela proprietária em `https://rendaextra.nexusjpc.com.br/` (pasta public_html do subdomínio). Verificado a partir deste ambiente:
- URL limpa e URL do QR: HTTP 200, HTTPS ativo (servidor `hcdn`).
- `index.html`, `privacidade.html`, `offers.js`, `config.js`, `app.js`, `styles.css`: **idênticos byte a byte** aos do repositório. Imagens 200.
- `.htaccess` protegido (403). Cabeçalhos ativos: `Cache-Control: no-cache`, `X-Content-Type-Options`, `Referrer-Policy`.
- Chromium real em 360/390/768 px: sem rolagem horizontal, 0 erros de console, 3 ofertas com links exatos; UTMs preservados na URL.
- Sem ID GA4: aviso de cookies oculto (esperado).
- QR decodificado (`material/renda-extra-ponto-qr.png`) → URL do QR → HTTP 200.
- Links de afiliado: os 3 redirecionam para o rastreamento de afiliado da Kiwify com `ref` igual ao `afid` e `product_id` distintos (links ativos). Nome do produto e preço não puderam ser lidos daqui.
- `nexusjpc.com.br` e `www.nexusjpc.com.br`: HTTP 200 (seguem no ar).

## Não realizado (sem acesso ou sem evidência)

- Lighthouse e teste em rede móvel real: não executados.
- Conferência dos links, preços e afiliação na Kiwify.
- Verificação dos demais sites da conta além de nexusjpc.com.br (lista não informada).
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

## Atualização de ofertas — 28/11/2026

A pedido da proprietária: Canva Lucrativo e PVA substituídos por MOV (`kiwify.app/cdH39sl?afid=F64hqxZa`) e Vídeos de IA que Vendem 2.0 (`kiwify.app/m7fQ44k?afid=oQhdXQjt`). Shopee mantido.

Conferido nas páginas oficiais dos produtores (destino final de cada link de afiliado):
- MOV — Método Orgânico Viral (Fabíola Casanova e Eloah): de R$ 197 por R$ 37; garantia de 7 dias; acesso imediato.
- Vídeos de IA que Vendem 2.0 (Andrea Januário): de R$ 197,00 por R$ 47 ou 10x de R$ 5,65; pagamento único; garantia de 7 dias.
- Método Lucrando com a Shopee (Alex Coelho): de R$ 149,99 por R$ 47 ou 9x de R$ 6,18 ("Black Friday, válida somente hoje"); 160+ videoaulas; acesso por 2 anos; suporte na área de membros. Garantia não mencionada na página → não exibida.

Página: tema escuro de alto contraste (paleta do briefing), atalhos com preço no topo, cards com imagem oficial, selo factual, preço de/por, CTA laranja e linha de confiança. Sem contadores, sem depoimentos de ganho, sem promessa de prazo de venda (mesmo quando a página do produtor promete).
Imagens oficiais usadas: mockup do produto (IA), mockup do app (MOV), "Plataforma por dentro" (Shopee). Prints de ganhos da página do produtor foram descartados.

QR: mesma URL e mesmo código (não precisa reimprimir por troca de curso). Arte 10x15 redesenhada (fundo escuro, moldura laranja "APONTE A CÂMERA AQUI"), QR preto no branco com margem de 4 módulos; decodificado a 300 e ~72 dpi.
Testes automáticos: todos passaram.

### Publicação — 28/11/2026 (autorizada pela proprietária)

Enviados pelo conector da Hostinger para `/home/u973852786/domains/rendaextra.nexusjpc.com.br/public_html` (site addon com pasta própria): `index.html`, `offers.js`, `app.js`, `styles.css`, `img/mov.webp`, `img/videos-ia.webp`, `img/shopee.webp`. Nada foi apagado (os `.svg` antigos ficaram sem uso na pasta). Os outros sites da conta (nexusjpc.com.br, rota360, bilhardourado, calma72, ceia) ficam em `domains/nexusjpc.com.br/public_html` e não foram tocados.

Verificado ao vivo: todos os arquivos publicados idênticos aos do repositório; Chromium em 360/390/768 px sem rolagem horizontal e sem erros; 3 ofertas com links exatos; 3 imagens carregadas; preços R$ 37 / R$ 47 / R$ 47. `nexusjpc.com.br` responde 200. Os subdomínios rota360, bilhardourado, calma72 e ceia não puderam ser abertos deste ambiente (rede).

Rollback: reenviar `index.html`, `offers.js`, `app.js` e `styles.css` do commit `5a336c5` (versão anterior, guardada no Git).
