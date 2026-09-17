## O que foi feito?

Descreva brevemente sua solucao e as regras que voce implementou.

<!-- Sua resposta aqui. -->

## Verificacao

- [x] Executei `npm test`.
- [x] Executei `npm run test:challenge`.
- [x] Executei `npm run test:all` e todos os testes passaram.

## Uso de inteligencia artificial

Marque **uma** das opcoes:

- [ ] Nao utilizei inteligencia artificial nesta atividade.
- [x] Utilizei inteligencia artificial nesta atividade.

Se utilizou, informe qual ou quais agentes/ferramentas foram usados (por exemplo: GitHub
Copilot, Claude Code, Codex, Gemini ou outro):

<!-- Agentes/ferramentas utilizados. Escreva "nao se aplica" caso nao tenha usado IA. -->
Claude Code

Conte brevemente como a IA participou da sua solucao:

<!-- Por exemplo: tirar duvidas, explicar o codigo, sugerir implementacao, refatorar ou criar testes. -->
A IA explicou partes do código existente que eu nao tinha entendido, tirou dúvidas sobre sintaxe e conceitos de JavaScript (escopo de let, temporal dead zone, ternário), revisou os trechos que eu escrevi apontando bugs (ordem dos descontos, variável usada antes de declarada) e me ajudou a responder a pergunta #7 desse arquivo.

## Como foi trabalhar neste codigo?

Nao existem respostas certas. Responda com suas palavras e sem se preocupar em usar termos
tecnicos.

### 1. Quais partes do codigo voce precisou alterar?

<!-- Sua resposta aqui. -->
Alterações em app.js:

add 'pix' em payment.method (linha 37);

add desconto * 0,1 -> customer.type === 'student' (linha 76-79);

add desconto * 0,05 -> payment.method === 'pix' (linha 85-88);

add condição no if de calcular frete, para se tiver mais de 100 reais pos desconto nao entrar no if e frete=0: "&& (subtotalInCents - discountInCents) < 10000" (linha 91);

### 2. Alguma mudanca simples exigiu alteracoes em mais lugares do que voce esperava?

<!-- Sua resposta aqui. -->
Eu não tinha costume de utilizar js, fiquei procurando onde podia estar a classe 'student' ao adicionar o desconto. Quando fui criar o desconto do pix achei que nao ia adicionar nada, mas tive que [add 'pix' em payment.method (linha 37)]

### 3. Como voce decidiu a ordem em que descontos, frete e taxa de pagamento seriam calculados?

<!-- Sua resposta aqui. -->
Em ATIVIDADE.md fala que o desconto pix tem que ser adicionado em cima/depois de todos os outros descontos, por ser de metodo de pagamento, por isso ele vem por ultimo

### 4. Qual parte voce teve mais receio de quebrar? Por que?

<!-- Sua resposta aqui. -->
Ao zerar o frete com preço maior que 100, estava criando outro if e utilizando "amountBeforePaymentInCents" que foi criada algumas linhas abaixo. Essa parte deu erro "temporal dead zone", usar uma const antes dela existir, mas foi facil de entender o que ficaria melhor

### 5. Foi facil testar uma regra isoladamente, sem passar pelo endpoint inteiro?

<!-- Sua resposta aqui. -->
Não muito. Como toda a lógica está dentro do mesmo handler da rota '/orders', não tem como testar só "o desconto de estudante" ou só "o frete grátis" isoladamente

### 6. Voce decidiu refatorar? Se sim, o que mudou e o que motivou a decisao? Se nao, por que preferiu manter a estrutura?

<!-- Sua resposta aqui. -->
Não decidi refatorar, mas seria o mais adequado. Fazer o codigo seguir o seguinte principio: Open/Closed Principle (OCP — princípio aberto/fechado)

### 7. Imagine que os arrays sejam substituidos por um banco de dados. Que partes da sua solucao provavelmente mudariam?

<!-- Sua resposta aqui. -->
Hoje products e orders são arrays guardados na memória, e o código mexe neles direto (products.find(...), orders.push(...), alterar product.stock na mão). Se isso virasse um banco de dados, essas partes precisariam virar chamadas assíncronas (await db.find(...), por exemplo)


### 8. Se uma nova forma de pagamento fosse solicitada amanha, como voce se sentiria fazendo essa mudanca?

<!-- Sua resposta aqui. -->
Eu teria que fazer mudanças repetidas, que foram feitas para pix e seria perda de tempo
