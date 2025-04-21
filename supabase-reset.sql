-- Script para excluir todas as tabelas e recomeçar
-- CUIDADO: Isso excluirá todos os dados existentes

-- Remover triggers primeiro
DROP TRIGGER IF EXISTS update_shopping_list_trigger ON products;

-- Remover funções
DROP FUNCTION IF EXISTS update_shopping_list CASCADE;

-- Remover tabelas na ordem correta (para evitar problemas de chave estrangeira)
DROP TABLE IF EXISTS shopping_list;
DROP TABLE IF EXISTS products;

-- Agora você pode executar o supabase-schema.sql para criar as tabelas novamente 