# Tutorial: Google Analytics 4 para a Renda Extra no Ponto

Você só precisa **criar a conta e copiar um código**. A instalação na página fica com o Claude (ou você troca uma linha em `config.js`).
O Google muda os nomes dos menus de vez em quando; se algo estiver diferente, procure o nome mais parecido.

## Parte 1 — Criar (uns 10 minutos, no computador)

1. Abra **https://analytics.google.com** e entre com a conta Google da empresa.
2. **Primeira vez no Analytics?** Clique em **"Começar a medir"**.
   **Já usa para outro site?** Clique na **engrenagem ⚙ "Administrador"** (canto inferior esquerdo) → botão azul **"+ Criar"** → **"Propriedade"**.
   > Não mexa nas propriedades dos outros sites. Esta será uma propriedade nova, só deste projeto.
3. **Conta** (só se pedir): nome `Nexus JPC`. Deixe as caixas de compartilhamento como estão → **Avançar**.
4. **Propriedade**:
   - Nome: `Renda Extra no Ponto`
   - Fuso horário: **Brasil – Horário de Brasília**
   - Moeda: **Real brasileiro (R$)**
   → **Avançar**.
5. **Detalhes da empresa**: setor "Compras" ou "Educação" (tanto faz), tamanho "Pequena" → **Avançar**.
6. **Objetivos**: marque **"Gerar leads"** ou **"Entender o tráfego da Web"** → **Criar**. Aceite os termos.
7. **Coleta de dados** → escolha **"Web"**:
   - URL do site: `https://rendaextra.nexusjpc.com.br`
   - Nome do stream: `Renda Extra no Ponto`
   - Deixe a "Medição otimizada" ligada → **Criar e continuar** (ou "Criar stream").
8. Vai aparecer uma tela com **"ID da métrica"** começando com **G-** (ex.: `G-AB12CD34EF`).
   **Copie esse código e mande para o Claude.**
   Se aparecer uma tela de "instruções de instalação", pode fechar: não precisa instalar nada.

> Perdeu a tela? Engrenagem ⚙ **Administrador** → **Streams de dados** → clique em "Renda Extra no Ponto" → o **ID da métrica** fica no canto superior direito.

## Parte 2 — Testar (depois que o código estiver na página)

1. No Analytics, abra **Relatórios → Tempo real**.
2. No celular, escaneie o QR (ou abra `https://rendaextra.nexusjpc.com.br/?utm_source=ponto_onibus&utm_medium=qr&utm_campaign=renda_extra`).
3. Toque em **"Aceitar"** no aviso de cookies e depois em um curso.
4. Em até 1 minuto devem aparecer, no cartão **"Contagem de eventos"**: `page_view`, `qr_visit` e `offer_click`.

## Parte 3 — Consultar no dia a dia

- **Quantas pessoas vieram pelo QR:** Relatórios → **Engajamento → Eventos** → linha **`qr_visit`**.
- **Quantos cliques nos cursos:** mesma tela → linha **`offer_click`**.
- **Qual curso foi mais clicado** (opcional, uma vez só):
  1. Engrenagem ⚙ **Administrador** → **Definições personalizadas** → **Criar dimensões personalizadas**.
  2. Nome `Curso`, escopo **Evento**, parâmetro do evento `offer_id` → **Salvar**.
  3. Após 24–48 h: Relatórios → Engajamento → Eventos → clique em `offer_click` → veja a lista por **Curso** (`mov`, `videos_ia`, `shopee`).
- Os relatórios normais levam **até 24–48 horas** para mostrar dados novos. Para conferir na hora, use **Tempo real**.

## Leia os números assim

- `qr_visit` = visitas que vieram do QR **e aceitaram cookies**. Quem recusa ou usa bloqueador não é contado; o número real é maior.
- `offer_click` = cliques no botão de um curso. **Clique não é venda.** Vendas e comissões ficam na **Kiwify**.
- Não é preciso configurar "conversões" nem "compras" no Analytics.
