import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product, getLowStockProducts, saveProduct } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import EditModal from "@/components/EditModal";

const ShoppingList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Carregar produtos quando o componente montar ou quando for atualizado
        loadProducts();
    }, []);

    const loadProducts = () => {
        const lowStockProducts = getLowStockProducts();
        setProducts(lowStockProducts);
    };

    const handleEdit = (product: Product) => {
        setEditProduct(product);
        setIsEditOpen(true);
    };

    const handleBackToHome = () => {
        navigate('/produtos');
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-[#333333]">
            <h1 className="text-3xl font-bold text-white mb-8 mt-8">Lista de Compras</h1>

            {products.length > 0 ? (
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
                            <div className="mt-2 text-sm">
                                <p>Local: {product.location}</p>
                                <p>Validade: {product.expiryDate}</p>
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
                onSave={() => {
                    setIsEditOpen(false);
                    loadProducts(); // Recarregar a lista após edição
                    toast({
                        title: "Sucesso",
                        description: "Produto atualizado com sucesso",
                    });
                }}
                onDelete={() => {
                    setIsEditOpen(false);
                    loadProducts(); // Recarregar a lista após exclusão
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