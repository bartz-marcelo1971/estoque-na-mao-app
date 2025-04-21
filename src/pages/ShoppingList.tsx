import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppProduct, getLowStockProducts, getProducts } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import EditModal from "@/components/EditModal";

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
            setProducts(lowStockProducts);

            if (lowStockProducts.length === 0) {
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
            setAllProducts(productsList);
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

            <button
                className="mt-8 w-full max-w-md py-3 bg-[#444444] text-white text-xl font-bold rounded"
                onClick={handleBackToHome}
            >
                Voltar para Produtos
            </button>

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
