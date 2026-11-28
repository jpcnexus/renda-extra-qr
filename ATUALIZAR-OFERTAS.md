# Atualizar ofertas

Trocar curso, link ou preço **não exige novo QR Code**. Edite somente `public/offers.js` e envie esse arquivo.

## Passo a passo

1. Abra `public/offers.js` (no GitHub: lápis "Edit", ou no Gerenciador de Arquivos da Hostinger, pasta do subdomínio).
2. Altere apenas o valor entre aspas do campo desejado:
   - `link`: cole o link de afiliado completo copiado da Kiwify, **com o `afid`**. Não acrescente UTMs.
   - `preco`, `precoDe`, `parcelas` + `precoConfirmado: true`: só depois de conferir na página oficial do curso. Com `false`, o preço fica oculto.
     `precoDe` (preço riscado) só se o próprio produtor mostrar esse valor. Atualize também `OFFERS_CHECKED_AT` com a data da conferência.
   - `garantia: true` só se a página oficial anunciar garantia de 7 dias.
   - `selo`, `gancho` e `itens`: textos curtos e verdadeiros, tirados da página oficial. Nada de ganhos, prazos de venda ou depoimentos.
   - `ativo: false`: esconde a oferta (por exemplo, se a afiliação for encerrada).
   - `ordem`: menor número aparece primeiro (hoje: MOV 1, Vídeos de IA 2, Shopee 3 — do menor para o maior preço).
3. Não altere o campo `id` (`mov`, `videos_ia`, `shopee`): ele identifica o curso no Google Analytics.
4. Para um curso novo, copie um bloco `{ ... },` inteiro, troque o `id` por um nome novo e simples e preencha os campos.
   Imagem: use material oficial do produtor (mockup do curso), em `.webp` com até ~720 px de largura, salvo em `public/img/`. Não use prints de ganhos.
5. Salve e envie para a Hostinger **somente** `offers.js` (e a imagem nova, se houver), sobrescrevendo o arquivo da pasta do subdomínio.
6. Abra a página no celular, toque em cada botão e confira se abre o curso certo.

## Cuidados

- Uma vírgula ou aspas faltando quebra a lista. Se as ofertas sumirem, restaure a cópia anterior de `offers.js`.
- Não publique descontos, bônus, garantias, depoimentos ou resultados que não estejam confirmados na página do produtor.
- O `.htaccess` manda o navegador revalidar `offers.js`, então a troca aparece na hora. Se a Hostinger tiver cache (LiteSpeed/CDN) ligado, limpe o cache do subdomínio no hPanel.
- Se mudar o texto `nome`, os relatórios do GA4 passam a mostrar o novo `offer_name`; o `offer_id` continua o mesmo.

## Atenção aos preços promocionais

Em 28/11/2026 o Método Lucrando com a Shopee anunciava "oferta Black Friday, válida somente hoje" (de R$ 149,99 por R$ 47).
Confira o preço com frequência. Se voltar a R$ 149,99, atualize `preco`, `precoDe` e `parcelas` (ou use `precoConfirmado: false`).
