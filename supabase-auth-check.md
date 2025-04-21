# Configuração de Autenticação no Supabase

## 1. Verifique as configurações de autenticação

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá para "Authentication" > "Providers"
4. Certifique-se de que o Email provider está habilitado

## 2. Desabilite a confirmação de email para testes

1. Vá para "Authentication" > "Settings"
2. Role até a seção "Email Auth"
3. Em "Confirm Email", selecione "No Email Confirmation Required"
4. Clique em "Save"

## 3. Verifique as configurações de redirecionamento

1. Ainda em "Authentication" > "URL Configuration"
2. Configure o "Site URL" para `http://localhost:5173` (ou a URL do seu aplicativo)
3. Isso é importante para redirecionamentos de autenticação

## 4. Verifique as políticas de segurança

1. Ajuste a política de segurança para permitir a comunicação entre seu aplicativo e o Supabase
2. Em "Authentication" > "Policies", permita redirecionamentos para seu domínio

## 5. Teste a autenticação diretamente no Supabase

1. Vá para "Authentication" > "Users"
2. Clique em "Add User"
3. Adicione um usuário de teste manualmente para verificar se a autenticação está funcionando

Se você conseguir adicionar um usuário manualmente, mas não através do aplicativo, o problema está no código. Caso contrário, o problema está nas configurações do Supabase. 