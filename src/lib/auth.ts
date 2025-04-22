import { supabase } from './supabase'
import { User } from './supabase'

// Estado do usuário atual
let currentUser: User | null = null

// Verificar se o usuário está autenticado ao iniciar
export const initAuth = async () => {
    console.log('Inicializando autenticação...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
        console.error('Erro ao obter sessão:', sessionError)
        return
    }

    if (session) {
        console.log('Sessão encontrada:', session.user.email)
        currentUser = {
            id: session.user.id,
            email: session.user.email || ''
        }
    } else {
        console.log('Nenhuma sessão encontrada')
    }

    // Configurar listener para mudanças de autenticação
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Evento de autenticação:', event)

        if (event === 'SIGNED_IN' && session) {
            console.log('Usuário conectado:', session.user.email)
            currentUser = {
                id: session.user.id,
                email: session.user.email || ''
            }
        } else if (event === 'SIGNED_OUT') {
            console.log('Usuário desconectado')
            currentUser = null
        }
    })
}

// Verificar configuração do Supabase
export const checkSupabaseConfig = async () => {
    try {
        // Tentar uma operação simples para verificar a conexão
        const { error } = await supabase.from('products').select('count', { count: 'exact', head: true })

        if (error) {
            console.error('Erro ao verificar conexão com Supabase:', error)
            return {
                success: false,
                message: `Erro de configuração: ${error.message}`
            }
        }

        return {
            success: true,
            message: 'Conexão com Supabase estabelecida com sucesso'
        }
    } catch (e: any) {
        console.error('Exceção ao verificar Supabase:', e)
        return {
            success: false,
            message: `Exceção: ${e.message}`
        }
    }
}

// Registro de novo usuário
export const signUp = async (email: string, password: string) => {
    console.log('Tentando cadastrar usuário:', email)

    try {
        // Verificar se o email ou a senha estão vazios
        if (!email || !password) {
            console.error('Email ou senha vazios')
            throw new Error('Email e senha são obrigatórios')
        }

        // Verificar se a senha tem pelo menos 6 caracteres
        if (password.length < 6) {
            console.error('Senha muito curta')
            throw new Error('A senha deve ter pelo menos 6 caracteres')
        }

        // Tentar criar o usuário
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Não redirecionar automaticamente (para testes)
                emailRedirectTo: window.location.origin
            }
        })

        if (error) {
            console.error('Erro no signUp:', error)
            throw error
        }

        // Verificar se o usuário foi criado
        if (data.user) {
            console.log('Usuário criado com sucesso:', data.user.id)
            console.log('Status de confirmação:', data.user.confirmed_at ? 'Confirmado' : 'Não confirmado')
            console.log('Sessão criada:', data.session ? 'Sim' : 'Não')

            // Se não houver sessão, provavelmente precisamos de confirmação de email
            if (!data.session) {
                console.log('Usuário criado, mas é necessário confirmar o email')
            }
        } else {
            console.error('Usuário não foi criado, resposta:', data)
            throw new Error('Falha ao criar usuário')
        }

        return data
    } catch (e: any) {
        console.error('Exceção no signUp:', e)
        throw e
    }
}

// Login
export const signIn = async (email: string, password: string) => {
    console.log('Tentando fazer login:', email)

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('Erro no login:', error)
            throw error
        }

        if (data.session) {
            console.log('Login bem-sucedido. Sessão criada para:', data.user?.email)
        } else {
            console.error('Login falhou: sessão não criada')
            throw new Error('Falha ao criar sessão')
        }

        return data
    } catch (e: any) {
        console.error('Exceção no login:', e)
        throw e
    }
}

// Logout
export const signOut = async () => {
    try {
        // Tentar fazer logout no Supabase
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Erro ao fazer logout:", error);
            throw error;
        }

        // Limpar o estado do usuário no cliente
        currentUser = null;

        // Remover token de acesso específico
        localStorage.removeItem('sb-access-token');
        sessionStorage.removeItem('sb-access-token');

        // Remover token de refresh específico
        localStorage.removeItem('sb-refresh-token');
        sessionStorage.removeItem('sb-refresh-token');

        return true;
    } catch (e) {
        console.error("Falha ao fazer logout:", e);
        // Mesmo com erro, limpar o estado atual
        currentUser = null;
        throw e;
    }
}

// Obter usuário atual
export const getCurrentUser = () => {
    return currentUser
}

// Verificar se usuário está autenticado
export const isAuthenticated = () => {
    return currentUser !== null
} 