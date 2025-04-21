import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signOut, getCurrentUser } from "@/lib/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Home, Package, ShoppingCart, LogOut, User } from "lucide-react";

const Navigation = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/login");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
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
                    <Link to="/" className="flex items-center space-x-1 text-sm font-medium">
                        <Home className="h-4 w-4" />
                        <span>Início</span>
                    </Link>

                    <Link to="/produtos" className="flex items-center space-x-1 text-sm font-medium">
                        <Package className="h-4 w-4" />
                        <span>Produtos</span>
                    </Link>

                    <Link to="/lista-compras" className="flex items-center space-x-1 text-sm font-medium">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Lista de Compras</span>
                    </Link>

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
                            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 