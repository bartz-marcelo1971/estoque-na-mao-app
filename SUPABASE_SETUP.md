# Configuração do Supabase para o Estoque Na Mão

Este guia ajudará você a configurar o Supabase como backend para o aplicativo Estoque Na Mão, substituindo o armazenamento local por um banco de dados na nuvem com autenticação.

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

## 3. Configurar o esquema do banco de dados

1. Vá para a seção "SQL Editor" no menu lateral
2. Clique em "New Query"
3. Cole o conteúdo do arquivo `supabase-schema.sql` deste projeto
4. Execute o script clicando em "Run"

> **Nota**: O esquema atualizado usa UUIDs para as chaves primárias e estrangeiras para compatibilidade com o Supabase. Isso é importante para garantir a integração correta com o sistema de autenticação.

## 4. Configurar a autenticação

1. Vá para a seção "Authentication" no menu lateral
2. Em "Providers", verifique se o método "Email" está habilitado
3. Se desejar, você pode personalizar os templates de e-mail em "Email Templates"

## 5. Obter as credenciais de API

1. Vá para a seção "Project Settings" no menu lateral
2. Clique em "API"
3. Copie os valores de "URL" e "anon public" key

## 6. Configurar as variáveis de ambiente

1. Edite o arquivo `.env` na raiz do projeto
2. Atualize as seguintes variáveis:
   ```
   VITE_SUPABASE_URL=sua_url_copiada
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_copiada
   ```

## 7. Configurar Row Level Security (RLS)

O script SQL já configura as políticas de segurança (RLS) para garantir que cada usuário acesse apenas seus próprios dados. Isto é essencial para a segurança do aplicativo.

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

## Resolução de problemas comuns

### Erro de tipos incompatíveis

Se você encontrar um erro como "foreign key constraint cannot be implemented" ou "Key columns are of incompatible types", isso geralmente indica uma incompatibilidade entre os tipos de dados das colunas. O script SQL foi atualizado para usar UUIDs, que é o padrão do Supabase para chaves primárias.

### Tabelas já existem

O script SQL foi projetado para ser idempotente e verificará se as tabelas já existem antes de tentar criá-las. As políticas de segurança serão recriadas a cada execução.

## Estrutura do banco de dados

### Tabela: products
- `id`: Identificador único do produto (UUID)
- `name`: Nome do produto
- `quantity`: Quantidade em estoque
- `location`: Localização do produto
- `expiry_date`: Data de validade
- `minimum_stock`: Estoque mínimo
- `user_id`: ID do usuário proprietário (UUID)
- `created_at`: Data de criação

### Tabela: shopping_list
- `id`: Identificador único do item (UUID)
- `product_id`: Referência ao produto (UUID)
- `user_id`: ID do usuário proprietário (UUID)
- `quantity_needed`: Quantidade necessária
- `created_at`: Data de criação

## Recursos adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Autenticação do Supabase](https://supabase.com/docs/guides/auth)
- [Banco de dados do Supabase](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 