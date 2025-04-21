-- Esquema SQL simplificado para o Estoque Na Mão

-- Tabela de produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  location TEXT,
  expiry_date DATE,
  minimum_stock INTEGER NOT NULL DEFAULT 0,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para produtos
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_name ON products(name);

-- Ativar RLS para produtos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas para produtos
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

-- Tabela para lista de compras
CREATE TABLE shopping_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quantity_needed INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para lista de compras
CREATE INDEX idx_shopping_list_user_id ON shopping_list(user_id);
CREATE INDEX idx_shopping_list_product_id ON shopping_list(product_id);

-- Ativar RLS para lista de compras
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

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