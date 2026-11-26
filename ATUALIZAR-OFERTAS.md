# Atualizar ofertas

Trocar curso, link ou preço **não exige novo QR Code**. Edite somente `public/offers.js` e envie esse arquivo.

## Passo a passo

1. Abra `public/offers.js` (no GitHub: lápis "Edit", ou no Gerenciador de Arquivos da Hostinger, pasta do subdomínio).
2. Altere apenas o valor entre aspas do campo desejado:
   - `link`: cole o link de afiliado completo copiado da Kiwify, **com o `afid`**. Não acrescente UTMs.
   - `preco` + `precoConfirmado: true`: só depois de conferir o preço na página da Kiwify. Com `false`, o preço fica oculto.
   - `ativo: false`: esconde a oferta (por exemplo, se a afiliação for encerrada).
   - `ordem`: menor número aparece primeiro (hoje: Canva 1, PVA 2, Shopee 3 — do menor para o maior preço).
3. Não altere o campo `id` (`shopee`, `pva`, `canva`): ele identifica o curso no Google Analytics.
4. Para um curso novo, copie um bloco `{ ... },` inteiro, troque o `id` por um nome novo e simples e preencha os campos.
   Imagem: use apenas imagem autorizada pelo produtor ou ilustração própria, salva em `public/img/`.
5. Salve e envie para a Hostinger **somente** `offers.js` (e a imagem nova, se houver), sobrescrevendo o arquivo da pasta do subdomínio.
6. Abra a página no celular, toque em cada botão e confira se abre o curso certo.

## Cuidados

- Uma vírgula ou aspas faltando quebra a lista. Se as ofertas sumirem, restaure a cópia anterior de `offers.js`.
- Não publique descontos, bônus, garantias, depoimentos ou resultados que não estejam confirmados na página do produtor.
- O `.htaccess` manda o navegador revalidar `offers.js`, então a troca aparece na hora. Se a Hostinger tiver cache (LiteSpeed/CDN) ligado, limpe o cache do subdomínio no hPanel.
- Se mudar o texto `nome`, os relatórios do GA4 passam a mostrar o novo `offer_name`; o `offer_id` continua o mesmo.
