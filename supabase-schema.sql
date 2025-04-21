-- Habilitar extensão UUID (já deve estar habilitada por padrão no Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar e criar tabela de produtos apenas se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        -- Tabela de produtos
        CREATE TABLE products (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          location TEXT,
          expiry_date DATE,
          minimum_stock INTEGER NOT NULL DEFAULT 0,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          -- Garantir que cada usuário não tenha produtos duplicados
          UNIQUE(name, user_id)
        );

        -- Adicionar RLS (Row Level Security) para a tabela de produtos
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;

        -- Índices
        CREATE INDEX idx_products_user_id ON products(user_id);
        CREATE INDEX idx_products_name ON products(name);
    END IF;
END
$$;

-- Criar políticas RLS para products (são ignoradas se já existirem)
DROP POLICY IF EXISTS "Usuários podem ver seus próprios produtos" ON products;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios produtos" ON products;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios produtos" ON products;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios produtos" ON products;

-- Políticas para produtos - permitir que usuários vejam e modifiquem apenas seus próprios dados
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

-- Verificar e criar tabela de lista de compras apenas se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'shopping_list') THEN
        -- Tabela para lista de compras
        CREATE TABLE shopping_list (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          quantity_needed INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          -- Garantir que cada usuário não tenha itens duplicados na lista
          UNIQUE(product_id, user_id)
        );

        -- Adicionar RLS para a tabela de lista de compras
        ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

        -- Índices
        CREATE INDEX idx_shopping_list_user_id ON shopping_list(user_id);
        CREATE INDEX idx_shopping_list_product_id ON shopping_list(product_id);
    END IF;
END
$$;

-- Criar políticas RLS para shopping_list (são ignoradas se já existirem)
DROP POLICY IF EXISTS "Usuários podem ver sua própria lista de compras" ON shopping_list;
DROP POLICY IF EXISTS "Usuários podem inserir itens em sua própria lista de compras" ON shopping_list;
DROP POLICY IF EXISTS "Usuários podem atualizar sua própria lista de compras" ON shopping_list;
DROP POLICY IF EXISTS "Usuários podem deletar itens de sua própria lista de compras" ON shopping_list;

-- Políticas para lista de compras
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

-- Verificar e criar função trigger apenas se não existir
DROP FUNCTION IF EXISTS update_shopping_list CASCADE;

-- Função para atualizar automaticamente a lista de compras quando um produto ficar abaixo do estoque mínimo
CREATE OR REPLACE FUNCTION update_shopping_list() RETURNS TRIGGER AS $$
BEGIN
  -- Se a quantidade ficar abaixo do mínimo e o mínimo for maior que zero
  IF NEW.quantity < NEW.minimum_stock AND NEW.minimum_stock > 0 THEN
    -- Inserir na lista de compras se não existir
    INSERT INTO shopping_list (product_id, user_id, quantity_needed)
    VALUES (NEW.id, NEW.user_id, NEW.minimum_stock - NEW.quantity)
    ON CONFLICT (product_id, user_id) 
    DO UPDATE SET quantity_needed = NEW.minimum_stock - NEW.quantity;
  ELSE
    -- Remover da lista de compras se a quantidade for suficiente
    DELETE FROM shopping_list 
    WHERE product_id = NEW.id AND user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS update_shopping_list_trigger ON products;

-- Criar trigger para atualizar a lista de compras quando um produto for atualizado
CREATE TRIGGER update_shopping_list_trigger
AFTER INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_shopping_list(); 