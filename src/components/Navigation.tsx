import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Package, User } from "lucide-react";

const Navigation = () => {
    const user = getCurrentUser();

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
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 