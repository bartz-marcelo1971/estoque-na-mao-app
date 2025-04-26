import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { signIn, signUp, checkSupabaseConfig } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNavigate } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, InfoIcon } from 'lucide-react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [configStatus, setConfigStatus] = useState<{ success: boolean, message: string } | null>(null)
    const [checkingConfig, setCheckingConfig] = useState(true)
    const { toast } = useToast()
    const navigate = useNavigate()

    // Verificar configuração do Supabase ao carregar o componente
    useEffect(() => {
        const verifyConfig = async () => {
            try {
                setCheckingConfig(true)
                const result = await checkSupabaseConfig()
                setConfigStatus(result)

                if (!result.success) {
                    toast({
                        title: 'Erro de configuração',
                        description: result.message,
                        variant: 'destructive',
                    })
                }
            } catch (error: any) {
                setConfigStatus({
                    success: false,
                    message: error.message || 'Erro desconhecido ao verificar configuração'
                })
                toast({
                    title: 'Erro na verificação',
                    description: 'Não foi possível verificar a configuração do Supabase',
                    variant: 'destructive',
                })
            } finally {
                setCheckingConfig(false)
            }
        }

        verifyConfig()
    }, [toast])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await signIn(email, password)
            console.log('Resultado do login:', result)

            toast({
                title: 'Login bem-sucedido',
                description: 'Você foi autenticado com sucesso.',
            })
            navigate('/')
        } catch (error: any) {
            console.error('Erro completo do login:', error)
            toast({
                title: 'Erro no login',
                description: error.message || 'Não foi possível fazer login.',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await signUp(email, password)
            console.log('Resultado do cadastro:', result)

            if (result.user && !result.session) {
                toast({
                    title: 'Conta criada',
                    description: 'Verifique seu e-mail para confirmar seu cadastro.',
                })
            } else if (result.user && result.session) {
                toast({
                    title: 'Conta criada',
                    description: 'Sua conta foi criada e você já está logado.',
                })
                navigate('/')
            } else {
                toast({
                    title: 'Resultado inesperado',
                    description: 'Sua conta pode ter sido criada, mas ocorreu um erro inesperado.',
                    variant: 'destructive',
                })
            }
        } catch (error: any) {
            console.error('Erro completo do cadastro:', error)

            // Mensagens amigáveis para erros comuns
            let errorMessage = error.message || 'Não foi possível criar sua conta.';

            // Erro de email já em uso
            if (error.message?.includes('already registered')) {
                errorMessage = 'Este email já está em uso. Tente fazer login.';
            }
            // Erro de senha fraca
            else if (error.message?.includes('password')) {
                errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
            }

            toast({
                title: 'Erro no cadastro',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Stock na Mão</CardTitle>
                    <CardDescription className="text-center">
                        Faça login ou crie uma conta para acessar o sistema
                    </CardDescription>
                </CardHeader>

                {checkingConfig ? (
                    <CardContent>
                        <div className="flex justify-center my-4">
                            <p>Verificando configuração...</p>
                        </div>
                    </CardContent>
                ) : (
                    <>
                        {configStatus && !configStatus.success && (
                            <CardContent>
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Erro de configuração</AlertTitle>
                                    <AlertDescription>
                                        {configStatus.message}
                                        <p className="mt-2 text-xs">
                                            Verifique se o arquivo .env está configurado corretamente e se o servidor Supabase está acessível.
                                        </p>
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        )}

                        <CardContent>
                            <Tabs defaultValue="login" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="login">Login</TabsTrigger>
                                    <TabsTrigger value="register">Cadastro</TabsTrigger>
                                </TabsList>
                                <TabsContent value="login">
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="seu@email.com"
                                                className="bg-white"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Senha</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Digite sua senha"
                                                className="bg-white"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={loading || !configStatus?.success}>
                                            {loading ? 'Entrando...' : 'Entrar'}
                                        </Button>
                                    </form>
                                </TabsContent>
                                <TabsContent value="register">
                                    <form onSubmit={handleSignUp} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="register-email">Email</Label>
                                            <Input
                                                id="register-email"
                                                type="email"
                                                placeholder="seu@email.com"
                                                className="bg-white"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="register-password">Senha</Label>
                                            <Input
                                                id="register-password"
                                                type="password"
                                                placeholder="Digite sua senha"
                                                className="bg-white"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                A senha deve ter pelo menos 6 caracteres
                                            </p>
                                        </div>
                                        <Button type="submit" className="w-full" disabled={loading || !configStatus?.success}>
                                            {loading ? 'Criando conta...' : 'Criar conta'}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </>
                )}

                <CardFooter className="flex justify-center">
                    <p className="text-xs text-muted-foreground text-center">
                        Ao continuar, você concorda com nossos termos de serviço e política de privacidade.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login 