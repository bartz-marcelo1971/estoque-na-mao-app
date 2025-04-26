import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppProduct, getLowStockProducts, getProducts } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import EditModal from "@/components/EditModal";
import { signOut } from "@/lib/auth";

const ShoppingList = () => {
    const [products, setProducts] = useState<AppProduct[]>([]);
    const [allProducts, setAllProducts] = useState<AppProduct[]>([]);
    const [editProduct, setEditProduct] = useState<AppProduct | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSimpleList, setShowSimpleList] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Carregar produtos quando o componente montar ou quando for atualizado
        loadProducts();
        loadAllProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const lowStockProducts = await getLowStockProducts();
            console.log("Produtos com estoque baixo:", lowStockProducts);
            // Ordenar produtos por nome
            const sortedProducts = [...lowStockProducts].sort((a, b) =>
                a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
            );
            setProducts(sortedProducts);

            if (sortedProducts.length === 0) {
                toast({
                    title: "Informação",
                    description: "Não há produtos com estoque abaixo do mínimo."
                });
            }
        } catch (error) {
            console.error("Erro ao carregar lista de compras:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar a lista de compras",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const loadAllProducts = async () => {
        try {
            const productsList = await getProducts();
            // Ordenar todos os produtos por nome
            const sortedProducts = [...productsList].sort((a, b) =>
                a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
            );
            setAllProducts(sortedProducts);
        } catch (error) {
            console.error("Erro ao carregar todos os produtos:", error);
        }
    };

    const handleEdit = (product: AppProduct) => {
        setEditProduct(product);
        setIsEditOpen(true);
    };

    const handleBackToHome = () => {
        navigate('/produtos');
    };

    const handleExit = async () => {
        try {
            setLoading(true);

            // Fazer logout do usuário
            await signOut();

            // Limpar o estado do usuário (mantendo apenas configurações PWA)
            const pwaPromptDismissed = localStorage.getItem('pwaPromptDismissed');
            localStorage.clear();
            if (pwaPromptDismissed) {
                localStorage.setItem('pwaPromptDismissed', pwaPromptDismissed);
            }

            // Limpar qualquer cache do service worker para a página atual
            if ('caches' in window) {
                try {
                    const cachesAvailable = await window.caches.keys();
                    for (const cacheName of cachesAvailable) {
                        const cache = await window.caches.open(cacheName);
                        // Remover a página atual do cache
                        await cache.delete(window.location.href);
                        // Remover também a página de lista de compras do cache
                        await cache.delete(`${window.location.origin}/lista-compras`);
                    }
                } catch (err) {
                    console.error("Erro ao limpar cache:", err);
                }
            }

            // Usar o navigate do React Router para ir para a página de login
            navigate('/login', { replace: true });

            // Se a navegação falhar, tentar recarregar a página
            setTimeout(() => {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }, 100);

        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            // Fallback: redirecionar diretamente
            window.location.href = '/login';
        } finally {
            setLoading(false);
        }
    };

    const getNeededQuantity = (product: AppProduct) => {
        const current = parseInt(product.quantity) || 0;
        const minimum = parseInt(product.minimumStock) || 0;
        return Math.max(0, minimum - current);
    };

    const toggleSimpleList = () => {
        setShowSimpleList(!showSimpleList);
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-[#333333]">
            <h1 className="text-3xl font-bold text-white mb-4 mt-8">Lista de Compras</h1>

            <div className="w-full max-w-md mb-4">
                <button
                    className="w-full py-2 bg-[#555555] text-white font-bold rounded mb-4"
                    onClick={toggleSimpleList}
                >
                    {showSimpleList ? "Mostrar Lista de Compras" : "Mostrar Lista de Produtos Cadastrados"}
                </button>
            </div>

            {loading ? (
                <div className="text-white text-xl">Carregando...</div>
            ) : showSimpleList ? (
                // Lista simplificada apenas com nomes e quantidades
                <div className="w-full max-w-md bg-[#444444] rounded-md shadow-md p-4 mb-8">
                    <h2 className="text-xl font-bold text-white border-b border-gray-600 pb-2 mb-4">Lista Simplificada</h2>
                    {allProducts.length > 0 ? (
                        <ul className="space-y-2">
                            {allProducts.map((product, index) => (
                                <li key={index} className="flex justify-between items-center text-white py-2 border-b border-gray-600">
                                    <span>{product.name}</span>
                                    <span className="font-bold">{product.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-white">Nenhum produto cadastrado.</p>
                    )}
                </div>
            ) : products.length > 0 ? (
                // Lista de compras detalhada original
                <div className="w-full max-w-md space-y-4">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="p-4 bg-[#444444] text-white rounded-md shadow-md"
                            onClick={() => handleEdit(product)}
                        >
                            <h2 className="text-xl font-bold">{product.name}</h2>
                            <div className="flex justify-between">
                                <span>Quantidade Atual: {product.quantity}</span>
                                <span>Mínimo: {product.minimumStock}</span>
                            </div>
                            <div className="mt-2 text-red-400 font-bold">
                                Comprar: {getNeededQuantity(product)} unidades
                            </div>
                            <div className="mt-2 text-sm">
                                <p>Local: {product.location}</p>
                                {product.expiryDate && <p>Validade: {product.expiryDate}</p>}
                            </div>
                            <button
                                className="mt-2 w-full py-2 bg-[#555555] rounded text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(product);
                                }}
                            >
                                Editar Produto
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-white text-xl">
                    Não há produtos com estoque baixo no momento.
                </div>
            )}

            <div className="w-full max-w-md space-y-4 mt-8">
                <button
                    className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
                    onClick={handleBackToHome}
                >
                    Voltar para Produtos
                </button>

                <button
                    className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
                    onClick={handleExit}
                    disabled={loading}
                >
                    {loading ? "Saindo..." : "Sair"}
                </button>
            </div>

            <EditModal
                product={editProduct}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSave={async () => {
                    setIsEditOpen(false);
                    await loadProducts(); // Recarregar a lista após edição
                    await loadAllProducts(); // Recarregar todos os produtos
                    toast({
                        title: "Sucesso",
                        description: "Produto atualizado com sucesso",
                    });
                }}
                onDelete={async () => {
                    setIsEditOpen(false);
                    await loadProducts(); // Recarregar a lista após exclusão
                    await loadAllProducts(); // Recarregar todos os produtos
                    toast({
                        title: "Sucesso",
                        description: "Produto removido com sucesso",
                    });
                }}
            />
        </div>
    );
};

export default ShoppingList;
