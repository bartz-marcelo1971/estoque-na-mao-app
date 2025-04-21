import { createClient } from '@supabase/supabase-js'

// Obter as variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificar se as variáveis estão definidas
if (!supabaseUrl) {
    console.error('ERRO: VITE_SUPABASE_URL não está definido!')
    console.error('Certifique-se de que o arquivo .env está na pasta correta (estoque-na-mao-app/.env)')
    console.error('E que contém a linha: VITE_SUPABASE_URL=sua_url_do_supabase')
}

if (!supabaseAnonKey) {
    console.error('ERRO: VITE_SUPABASE_ANON_KEY não está definido!')
    console.error('Certifique-se de que o arquivo .env está na pasta correta (estoque-na-mao-app/.env)')
    console.error('E que contém a linha: VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase')
}

// Criar o cliente Supabase com valores padrão se estiverem ausentes (isso ainda vai gerar erro, mas pelo menos mostra mensagens mais úteis)
export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)

// Tipos para as tabelas do Supabase
export interface Product {
    id: string // UUID armazenado como string
    name: string
    quantity: number
    location: string
    expiry_date: string | null
    minimum_stock: number
    user_id: string
    created_at: string
}

export interface ShoppingListItem {
    id: string // UUID armazenado como string
    product_id: string // UUID armazenado como string
    user_id: string
    quantity_needed: number
    created_at: string
    product: Product
}

// Interface para o usuário
export interface User {
    id: string
    email: string
} 