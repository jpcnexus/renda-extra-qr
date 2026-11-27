# Publicação isolada na Hostinger

Regra principal: **tocar somente na pasta exclusiva deste projeto**. Nenhum outro site, pasta, DNS, e-mail, SSL ou redirecionamento global é alterado.

O Claude não teve acesso ao hPanel nesta sessão. Os passos abaixo são manuais e devem ser feitos pela proprietária.

## 0. Inventário (somente leitura, antes de qualquer mudança)

No hPanel, anote sem editar nada:

- [ ] **Sites → lista de sites**: domínios e subdomínios existentes.
- [ ] **Domínios → Subdomínios** de `nexusjpc.com.br`: já existe algum de renda extra? Qual pasta ele usa?
- [ ] **Gerenciador de Arquivos**: pastas dentro de `public_html` e de `domains/` — quais pertencem a quais sites.
- [ ] Abra no navegador cada site listado e confirme que carrega (repetir no passo 6).
- [ ] Se já existir uma versão publicada de renda extra, baixe a pasta inteira e compare com `public/` deste repositório antes de substituir. Se ela tiver algo que não está aqui, **não publique** e avise.

## 1. Escolher o endereço

- Se já existe uma URL pública funcional de renda extra, preserve-a e regenere o QR com ela (ver README).
- Senão, crie **somente** o subdomínio `rendaextra.nexusjpc.com.br`:
  hPanel → **Domínios → Subdomínios** → criar `rendaextra`.
  - Marque/aceite uma **pasta própria** (ex.: `public_html/rendaextra` ou `domains/nexusjpc.com.br/public_html/rendaextra`). Nunca a raiz `public_html` do domínio principal.
  - Se o DNS do domínio não estiver na Hostinger, crie apenas o registro do subdomínio indicado pelo hPanel. Não altere outros registros.
- Não crie outro subdomínio para redirecionamento.

## 2. HTTPS

hPanel → **Segurança → SSL**: confirme que `rendaextra.nexusjpc.com.br` tem certificado ativo (pode levar até algumas horas após criar o subdomínio). Abra `https://rendaextra.nexusjpc.com.br` e confirme o cadeado.

## 3. Backup

- Se a pasta do subdomínio já tiver arquivos: selecione todos (incluindo ocultos, como `.htaccess`) → **Compactar** → baixe o `.zip` com data no nome, ex.: `backup-rendaextra-2026-11-26.zip`. Abra o zip no computador para confirmar que está completo.
- Se a pasta for nova e vazia, anote isso — o rollback é simplesmente esvaziá-la.

## 4. Publicar

Arquivos a enviar (todos estão em `publicar/renda-extra-ponto-site.zip`):

```
index.html  privacidade.html  offers.js  config.js  app.js  styles.css  .htaccess
img/canva.svg  img/pva.svg  img/shopee.svg
```

Não enviar: `.git`, `material/`, `ferramentas/`, `relatorios/`, arquivos `.md`.

1. Gerenciador de Arquivos → entre **na pasta do subdomínio** (confira o caminho na barra superior).
2. **Upload** do `renda-extra-ponto-site.zip` → botão direito → **Extrair** → extrair para a pasta atual (`.`).
3. Confirme que `index.html` ficou diretamente na pasta do subdomínio (não em uma subpasta) e apague só o `.zip` enviado.
4. Antes de imprimir, edite `config.js` com o Measurement ID do GA4 (ver abaixo).

Opcional (pasta de teste): extrair primeiro em `rendaextra/teste/` e abrir `https://rendaextra.nexusjpc.com.br/teste/`; depois apagar a pasta `teste`.

## 5. GA4 (fluxo exclusivo)

1. analytics.google.com → Administrador → **Criar propriedade** (ou novo **fluxo da Web** em uma propriedade só deste projeto) com a URL `https://rendaextra.nexusjpc.com.br`. Não altere o Analytics de outros sites.
2. Copie o **ID da métrica** (`G-XXXXXXX`).
3. Em `config.js`, troque `ga4MeasurementId: ''` por `ga4MeasurementId: 'G-XXXXXXX'` e envie só esse arquivo.
4. (Opcional, para relatórios) Administrador → **Definições personalizadas** → criar dimensões de evento `offer_id`, `offer_name`, `traffic_origin`.
5. Teste: abra a URL do QR no celular → **Aceitar** → GA4 **Tempo real** deve mostrar `page_view` e `qr_visit`; toque em um curso → `offer_click`.
6. Consulta diária: Relatórios → Engajamento → Eventos (`qr_visit`, `offer_click`); Explorar → dimensão `offer_id`.
   Recusas de cookies e bloqueadores reduzem as contagens. Clique não é venda: comissões ficam na Kiwify.

## 6. Verificação pós-deploy

- [ ] `https://rendaextra.nexusjpc.com.br/` abre (URL limpa).
- [ ] `https://rendaextra.nexusjpc.com.br/?utm_source=ponto_onibus&utm_medium=qr&utm_campaign=renda_extra` abre.
- [ ] As 3 ofertas aparecem e cada botão abre o curso certo na Kiwify.
- [ ] `privacidade.html` abre; aviso de cookies aparece (com GA4 configurado), Aceitar e Recusar funcionam.
- [ ] Escanear `material/renda-extra-ponto-qr.png` na tela abre a URL acima.
- [ ] **Todos os outros sites do inventário continuam abrindo.**

## 7. QR e impressão

Somente após o passo 6 OK. Ver `material/` e o relatório de testes. Imprima uma prova 10x15 cm e escaneie com Android e iPhone, luz natural e artificial, 30 cm a 1 m.

## Rollback

- Pasta era nova: apagar os arquivos enviados **dessa pasta**.
- Pasta tinha versão anterior: apagar os arquivos enviados dessa pasta e extrair o backup do passo 3 no mesmo lugar.
- Conferir o endereço e os demais sites. Nunca restaurar backup da conta Hostinger inteira por causa deste projeto.

## Atualizações futuras

Trocar ofertas: ver [ATUALIZAR-OFERTAS.md](ATUALIZAR-OFERTAS.md). A URL pública e o QR nunca mudam.
