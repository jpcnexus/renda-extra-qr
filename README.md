# Renda Extra no Ponto

Landing page de uma página, aberta por um único QR Code permanente afixado em pontos de ônibus autorizados.
Fluxo: **QR impresso → página (com UTMs) → visitante escolhe um curso → link de afiliado Kiwify**.

Projeto da Nexus JPC — Soluções Digitais. HTML, CSS e JavaScript puros: sem build, sem dependências em produção.

## Estrutura

| Caminho | O que é | Vai para a Hostinger? |
|---|---|---|
| `public/index.html` | Página principal | Sim |
| `public/offers.js` | **Único arquivo das ofertas** (links, preços, ordem, ativo) | Sim |
| `public/config.js` | ID do GA4, link institucional, marcador do QR | Sim |
| `public/app.js` | Renderiza ofertas, consentimento, eventos GA4 | Sim |
| `public/styles.css` | Estilos | Sim |
| `public/privacidade.html` | Política de privacidade | Sim |
| `public/img/` | Imagens oficiais dos cursos (material dos produtores) | Sim |
| `public/.htaccess` | Cache curto, sem listagem, bloqueio de arquivos ocultos (só esta pasta) | Sim |
| `publicar/renda-extra-ponto-site.zip` | Pacote pronto com o conteúdo de `public/` | Enviar e extrair |
| `material/` | QR (SVG/PNG) e arte 10x15 cm (SVG/PDF/PNG) | **Não** |
| `ferramentas/` | Gerador de QR/arte e testes automáticos | **Não** |
| `relatorios/` | Relatório de testes e pendências | **Não** |

## Testar localmente

```bash
cd public && python3 -m http.server 8000
```

Abra `http://localhost:8000/?utm_source=ponto_onibus&utm_medium=qr&utm_campaign=renda_extra`.

Testes automáticos (Node + Playwright):

```bash
node ferramentas/testar.js
```

## Documentos

- [DEPLOY-HOSTINGER.md](DEPLOY-HOSTINGER.md) — publicação isolada, backup e rollback.
- [ATUALIZAR-OFERTAS.md](ATUALIZAR-OFERTAS.md) — trocar links, preços ou cursos sem reimprimir o QR.
- [TUTORIAL-ANALYTICS.md](TUTORIAL-ANALYTICS.md) — criar o Google Analytics passo a passo e ler os números.
- [relatorios/RELATORIO-TESTES.md](relatorios/RELATORIO-TESTES.md) — testes realizados e pendências reais.

## URL do QR (não alterar depois de imprimir)

```
https://rendaextra.nexusjpc.com.br/?utm_source=ponto_onibus&utm_medium=qr&utm_campaign=renda_extra
```

Endereço **proposto**, ainda não confirmado/publicado. Se a URL definitiva for outra, regenere o QR:

```bash
python3 ferramentas/gerar_qr.py "https://URL-DEFINITIVA/?utm_source=ponto_onibus&utm_medium=qr&utm_campaign=renda_extra" "url-curta-legivel"
```

```bash
node ferramentas/render_arte.js
```
