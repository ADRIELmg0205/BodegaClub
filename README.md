# Bodega Club

O **Bodega Club** é uma loja virtual de bebidas com catálogo de produtos, carrinho de compras, pedidos e planos de assinatura. O sistema também inclui recursos para clientes e uma área administrativa para gerenciar produtos, pedidos e assinaturas.

## Funcionalidades

- Catálogo com busca, categorias, detalhes dos produtos e favoritos.
- Carrinho e acompanhamento dos pedidos.
- Pagamento via Pix com integração ao Mercado Pago e fluxo de boleto.
- Planos de assinatura, gerenciamento de assinaturas e cancelamento.
- Cadastro e edição de produtos e gestão de pedidos na área administrativa.
- Conta do cliente, endereços e preferências.

## Tecnologias

- Next.js 14 e React 18, com TypeScript.
- Tailwind CSS para estilos.
- Clerk para autenticação.
- Supabase para dados e persistência.
- Mercado Pago para pagamentos Pix.

## Requisitos

- Node.js 26.x, conforme definido em `package.json`.
- npm.
- Credenciais e serviços configurados para Clerk, Supabase e Mercado Pago.

## Executar localmente

1. Instale as dependências:

   ```bash
   npm ci
   ```

2. Crie um arquivo `.env.local` na raiz do projeto e configure as variáveis listadas abaixo. Não compartilhe nem versione esse arquivo.

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   No PowerShell do Windows, se necessário, use `npm.cmd`:

   ```powershell
   npm.cmd ci
   npm.cmd run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Configure estas variáveis no arquivo `.env.local` para desenvolvimento:

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Chave pública do Clerk usada pelo cliente. |
| `CLERK_SECRET_KEY` | Chave secreta do Clerk, usada no servidor. |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave privilegiada do Supabase; mantenha somente no servidor. |
| `MERCADOPAGO_ACCESS_TOKEN` | Token usado pelo servidor para criar pagamentos Pix. |

A rota `/api/check-user` também lê `POSTGRES_CONNECTION_STRING`. Configure-a caso esse endpoint seja utilizado.

As variáveis com o prefixo `NEXT_PUBLIC_` ficam disponíveis no navegador. Nunca coloque chaves secretas sob esse prefixo, nem adicione valores reais de credenciais ao README ou ao repositório.

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a versão otimizada para produção. |
| `npm start` | Inicia a aplicação já compilada. |
| `npm run lint` | Executa as verificações de lint do Next.js. |

## Banco de dados

Os scripts SQL e referências do esquema estão na pasta [`BANCO DE DADOS`](./BANCO%20DE%20DADOS/).
