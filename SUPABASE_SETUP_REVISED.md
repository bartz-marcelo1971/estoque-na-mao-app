# Configuração Revisada do Supabase para o Estoque Na Mão

Este guia revisado ajudará você a configurar o Supabase sem erros, inicializando um banco de dados limpo.

## 1. Criar uma conta no Supabase

1. Acesse [https://supabase.com/](https://supabase.com/)
2. Clique em "Start for Free" e crie uma conta
3. Após o login, clique em "New Project"

## 2. Configurar um novo projeto

1. Escolha uma organização ou crie uma nova
2. Defina um nome para o projeto (ex: "estoque-na-mao")
3. Defina uma senha forte para o banco de dados
4. Escolha a região mais próxima de seus usuários
5. Clique em "Create New Project"

## 3. Configurar o banco de dados (passo a passo)

### 3.1 Limpar tabelas existentes (se necessário)

Se você já tentou criar tabelas antes e encontrou erros:

1. Vá para a seção "SQL Editor" no menu lateral
2. Clique em "New Query"
3. Cole o conteúdo do arquivo `supabase-reset.sql`
4. Execute o script clicando em "Run"

### 3.2 Criar as tabelas

1. Ainda no "SQL Editor", clique em "New Query"
2. Cole o conteúdo do arquivo `supabase-schema-simple.sql`
3. Execute o script clicando em "Run"

> **Importante**: O esquema usa UUIDs para as chaves primárias e estrangeiras para compatibilidade com o sistema de autenticação do Supabase.

## 4. Verificar a criação das tabelas

1. Vá para a seção "Table Editor" no menu lateral
2. Você deve ver duas tabelas: `products` e `shopping_list`
3. Clique em cada uma delas para verificar se as colunas foram criadas corretamente

## 5. Configurar a autenticação

1. Vá para a seção "Authentication" no menu lateral
2. Em "Providers", verifique se o método "Email" está habilitado
3. **Importante**: Em configurações de autenticação, habilite o "Confirm email" se desejar que os usuários confirmem o email
4. Você também pode desabilitar a confirmação de email para testes configurando "Confirm email" para "No verification"

## 6. Obter as credenciais de API

1. Vá para a seção "Project Settings" no menu lateral
2. Clique em "API"
3. Copie os valores de "URL" e "anon public" key

## 7. Configurar as variáveis de ambiente

1. Edite o arquivo `.env` na raiz do projeto
2. Atualize as seguintes variáveis:
   ```
   VITE_SUPABASE_URL=sua_url_copiada
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_copiada
   ```

## 8. Iniciar o aplicativo

Com o Supabase configurado e as variáveis de ambiente atualizadas, você pode iniciar o aplicativo:

```
npm run dev
```

## 9. Testar o aplicativo

1. Abra o aplicativo no navegador
2. Cadastre uma nova conta
3. Faça login
4. Comece a gerenciar seus produtos

## Depuração e solução de problemas

### Como ver os erros detalhados no Supabase

Se o script SQL falhar:

1. Vá para a seção "SQL Editor" no Supabase
2. Execute o script e observe a mensagem de erro no painel inferior
3. Os erros geralmente fornecem detalhes sobre o problema específico

### Problemas comuns e soluções

1. **Erro de chave estrangeira**: Certifique-se de que está usando o tipo UUID para todas as chaves
2. **Erro de tabela já existente**: Use o script reset para remover tabelas antes de criá-las novamente
3. **Erro de autenticação**: Certifique-se de que as chaves de API do Supabase estão corretas no arquivo .env

## Estrutura do banco de dados

### Tabela: products
- `id`: UUID - Identificador único do produto
- `name`: TEXT - Nome do produto
- `quantity`: INTEGER - Quantidade em estoque
- `location`: TEXT - Localização do produto
- `expiry_date`: DATE - Data de validade
- `minimum_stock`: INTEGER - Estoque mínimo
- `user_id`: UUID - ID do usuário proprietário
- `created_at`: TIMESTAMP - Data de criação

### Tabela: shopping_list
- `id`: UUID - Identificador único do item
- `product_id`: UUID - Referência ao produto
- `user_id`: UUID - ID do usuário proprietário
- `quantity_needed`: INTEGER - Quantidade necessária
- `created_at`: TIMESTAMP - Data de criação 