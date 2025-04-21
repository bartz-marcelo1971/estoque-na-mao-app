-- Script para inspecionar as estruturas existentes no banco de dados

-- Listar todas as tabelas no esquema público
SELECT 
  table_name, 
  table_type
FROM 
  information_schema.tables
WHERE 
  table_schema = 'public'
ORDER BY 
  table_name;

-- Listar todas as políticas RLS
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
ORDER BY 
  tablename, policyname;

-- Listar detalhes das colunas da tabela produtos (se existir)
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'products'
) AS products_exists;

-- Se a tabela products existir, mostrar sua estrutura
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
    EXECUTE 'SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = ''public'' AND table_name = ''products'' ORDER BY ordinal_position';
  END IF;
END $$; 