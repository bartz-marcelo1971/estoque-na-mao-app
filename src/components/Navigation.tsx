import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signOut, getCurrentUser, isAuthenticated } from "@/lib/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Package, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Navigation = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { toast } = useToast();

    const handleLogout = async () => {
        if (isLoggingOut) return; // Prevenir múltiplos cliques

        try {
            setIsLoggingOut(true);

            // Mostrar toast de logout
            toast({
                title: "Saindo...",
                description: "Desconectando da sua conta"
            });

            // Notificar o service worker sobre o logout para limpar caches
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'LOGOUT'
                });
            }

            // Fazer logout do usuário
            await signOut();

            // Limpar o localStorage para garantir que todas as informações de sessão sejam removidas
            localStorage.clear();

            // Limpar cookies de sessão
            document.cookie.split(";").forEach(function (c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            // Curto atraso para garantir que todas as operações assíncronas terminem
            setTimeout(() => {
                // Verificar se o usuário ainda está autenticado
                if (!isAuthenticated()) {
                    // Forçar redirecionamento usando window.location para a tela de login
                    window.location.replace(`${window.location.origin}/login`);
                } else {
                    // Tentar novamente se ainda estiver autenticado
                    console.error("Ainda autenticado após logout, tentando novamente");
                    // Forçar uma atualização completa
                    window.location.href = `${window.location.origin}/login?t=${Date.now()}`;
                }
            }, 300);
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao sair, recarregando a página",
                variant: "destructive"
            });

            // Mesmo em caso de erro, forçar redirecionamento para a tela de login
            setTimeout(() => {
                window.location.replace(`${window.location.origin}/login?error=true`);
            }, 1000);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <nav className="bg-background border-b p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-1">
                    <Link to="/" className="font-bold text-xl flex items-center">
                        <Package className="mr-2 h-5 w-5" />
                        Stok na Mão
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                            <DropdownMenuLabel className="text-xs font-normal text-gray-500">
                                {user?.email}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-red-500"
                                disabled={isLoggingOut}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 