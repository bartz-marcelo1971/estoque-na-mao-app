import { supabase, Product, ShoppingListItem } from './supabase'
import { getCurrentUser, isAuthenticated } from './auth'
import { formatExpiryDate, isValidDate, convertToISODate, convertFromISODate } from './utils'

// Converter tipos entre a aplicação e o Supabase
const convertToAppProduct = (dbProduct: Product): AppProduct => {
  return {
    name: dbProduct.name,
    quantity: dbProduct.quantity.toString(),
    location: dbProduct.location,
    expiryDate: dbProduct.expiry_date ? convertFromISODate(dbProduct.expiry_date) : '',
    minimumStock: dbProduct.minimum_stock.toString()
  }
}

const convertToDbProduct = (appProduct: AppProduct): Omit<Product, 'id' | 'created_at'> => {
  // Converter a data para formato ISO antes de enviar para o banco
  const expiryDate = appProduct.expiryDate && appProduct.expiryDate.trim() !== ''
    ? convertToISODate(appProduct.expiryDate)
    : null;

  return {
    name: appProduct.name,
    quantity: parseInt(appProduct.quantity) || 0,
    location: appProduct.location,
    expiry_date: expiryDate,
    minimum_stock: parseInt(appProduct.minimumStock) || 0,
    user_id: getCurrentUser()?.id || ''
  }
}

// Interface de produto para a aplicação (mantendo compatibilidade)
export interface AppProduct {
  name: string;
  quantity: string;
  location: string;
  expiryDate: string;
  minimumStock: string;
}

// Salvar produto no Supabase
export const saveProduct = async (product: AppProduct): Promise<void> => {
  if (!isAuthenticated()) {
    throw new Error('Usuário não autenticado')
  }

  const dbProduct = convertToDbProduct(product)

  // Verificar se o produto já existe
  const { data: existingProducts } = await supabase
    .from('products')
    .select('*')
    .eq('name', product.name)
    .eq('user_id', getCurrentUser()?.id || '')

  if (existingProducts && existingProducts.length > 0) {
    // Atualizar produto existente
    await supabase
      .from('products')
      .update(dbProduct)
      .eq('id', existingProducts[0].id)
  } else {
    // Inserir novo produto
    await supabase
      .from('products')
      .insert(dbProduct)
  }

  // Atualizar lista de compras
  await updateShoppingList()
}

// Obter todos os produtos
export const getProducts = async (): Promise<AppProduct[]> => {
  if (!isAuthenticated()) {
    return []
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', getCurrentUser()?.id || '')
    .order('name')

  if (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }

  return (data || []).map(convertToAppProduct)
}

// Obter produto pelo nome
export const getProductByName = async (name: string): Promise<AppProduct | undefined> => {
  if (!isAuthenticated()) {
    return undefined
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('name', name)
    .eq('user_id', getCurrentUser()?.id || '')
    .single()

  if (error || !data) {
    return undefined
  }

  return convertToAppProduct(data)
}

// Excluir produto
export const deleteProduct = async (name: string): Promise<boolean> => {
  if (!isAuthenticated()) {
    return false
  }

  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('name', name)
    .eq('user_id', getCurrentUser()?.id || '')
    .single()

  if (!product) {
    return false
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', product.id)

  if (error) {
    console.error('Erro ao excluir produto:', error)
    return false
  }

  return true
}

// Obter produtos com estoque baixo
export const getLowStockProducts = async (): Promise<AppProduct[]> => {
  if (!isAuthenticated()) {
    return []
  }

  // Obter todos os produtos do usuário
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', getCurrentUser()?.id || '')
    .gt('minimum_stock', 0)

  if (error || !data) {
    console.error('Erro ao buscar produtos com estoque baixo:', error)
    return []
  }

  // Filtrar produtos com estoque abaixo do mínimo manualmente
  const lowStockProducts = data.filter(product =>
    product.quantity < product.minimum_stock
  )

  return lowStockProducts.map(convertToAppProduct)
}

// Atualizar lista de compras
export const updateShoppingList = async (): Promise<void> => {
  if (!isAuthenticated()) {
    return
  }

  // Com o trigger no banco de dados, a lista de compras será atualizada automaticamente
  // Esta função existe para compatibilidade com o código anterior
}
