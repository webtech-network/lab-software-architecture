# Atividade pre-workshop

## Preparacao

Requisitos: Node.js 20 ou mais recente e npm.

```bash
npm install
npm test
```

Os testes iniciais devem passar. Se quiser executar a API:

```bash
npm run dev
```

A API estara em `http://localhost:3000`.

## A solicitacao do negocio

A loja quer lancar uma oferta para estudantes. Implemente as seguintes regras:

1. Cliente com `type: "student"` recebe 10% de desconto.
2. A API passa a aceitar `payment.method: "pix"`. PIX da mais 5% de desconto, calculado
   depois dos descontos de cliente e cupom. PIX nao cobra taxa e fica com status `paid`.
3. A entrega e gratis quando o valor das mercadorias **depois de todos os descontos** for
   maior ou igual a R$ 100,00. A regra vale para qualquer tipo de cliente ou pagamento.

Nao mude os precos nem remova comportamentos existentes. Valores monetarios usam centavos.

## Como trabalhar na solucao

Voce esta livre para extrair funcoes, criar arquivos, renomear elementos ou reorganizar todo o
codigo. Tambem e perfeitamente valido fazer a menor alteracao possivel no endpoint atual.

Nao esperamos que voce conheca nomes de padroes, camadas ou uma estrutura "correta". Evite
pesquisar uma arquitetura apenas para tentar adivinhar o que esperamos. Queremos conhecer seu
raciocinio atual e usar as diferentes solucoes da turma como material para o workshop.

Execute os testes da atividade com:

```bash
npm run test:challenge
```

Ao terminar, confirme que nenhum comportamento antigo quebrou:

```bash
npm run test:all
```

## Envie sua solucao por pull request

Crie uma branch para sua solucao:

```bash
git switch -c feat/desafio-pre-workshop
```

Depois de implementar e testar as regras, registre e envie suas alteracoes:

```bash
git add .
git commit -m "feat: implementa regras do pre-workshop"
git push -u origin feat/desafio-pre-workshop
```

Abra um pull request no GitHub apontando sua branch para a branch principal do repositorio.
O GitHub carregara automaticamente um template com algumas perguntas. Responda com suas
proprias percepcoes: nao existem respostas certas e voce nao precisa usar vocabulario tecnico.

Se a pessoa facilitadora tiver fornecido outro fluxo de branches ou forks, siga essas
orientacoes no lugar dos comandos acima.
