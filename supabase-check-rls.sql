-- Script para verificar e corrigir políticas RLS no Supabase

-- Verificar políticas existentes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM 
  pg_policies
WHERE 
  tablename IN ('products', 'shopping_list')
ORDER BY 
  tablename, policyname;

-- Habilitar RLS para as tabelas (caso não esteja habilitado)
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shopping_list ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para recriar
DROP POLICY IF EXISTS "Usuários podem ver seus próprios produtos" ON products;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios produtos" ON products;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios produtos" ON products;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios produtos" ON products;

DROP POLICY IF EXISTS "Usuários podem ver sua própria lista de compras" ON shopping_list;
DROP POLICY IF EXISTS "Usuários podem inserir itens em sua própria lista de compras" ON shopping_list;
DROP POLICY IF EXISTS "Usuários podem atualizar sua própria lista de compras" ON shopping_list;
DROP POLICY IF EXISTS "Usuários podem deletar itens de sua própria lista de compras" ON shopping_list;

-- Recriar políticas para a tabela products
CREATE POLICY "Usuários podem ver seus próprios produtos" 
  ON products FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios produtos" 
  ON products FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios produtos" 
  ON products FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios produtos" 
  ON products FOR DELETE 
  USING (auth.uid() = user_id);

-- Recriar políticas para a tabela shopping_list
CREATE POLICY "Usuários podem ver sua própria lista de compras" 
  ON shopping_list FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir itens em sua própria lista de compras" 
  ON shopping_list FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar sua própria lista de compras" 
  ON shopping_list FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar itens de sua própria lista de compras" 
  ON shopping_list FOR DELETE 
  USING (auth.uid() = user_id);

-- Verificar novamente as políticas após a recriação
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM 
  pg_policies
WHERE 
  tablename IN ('products', 'shopping_list')
ORDER BY 
  tablename, policyname; 