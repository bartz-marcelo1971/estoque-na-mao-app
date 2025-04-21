import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AppProduct, saveProduct, getProductByName, deleteProduct, getProducts } from "@/lib/storage";
import { signOut } from "@/lib/auth";
import SearchModal from "@/components/SearchModal";
import EditModal from "@/components/EditModal";
import { applyDateMask } from "@/lib/utils";

const Products = () => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [minimumStock, setMinimumStock] = useState("");

  const [searchProduct, setSearchProduct] = useState<AppProduct | null>(null);
  const [editProduct, setEditProduct] = useState<AppProduct | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [products, setProducts] = useState<AppProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Carregar produtos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const loadedProducts = await getProducts();
        setProducts(loadedProducts);
        console.log("Produtos carregados:", loadedProducts.length);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  useEffect(() => {
    let timer: number;
    if (showSaveMessage) {
      timer = window.setTimeout(() => setShowSaveMessage(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showSaveMessage]);

  useEffect(() => {
    let timer: number;
    if (showDeleteMessage) {
      timer = window.setTimeout(() => setShowDeleteMessage(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showDeleteMessage]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do produto é obrigatório",
      });
      return;
    }

    try {
      setLoading(true);
      const product: AppProduct = {
        name: productName,
        quantity,
        location,
        expiryDate,
        minimumStock,
      };

      await saveProduct(product);
      setShowSaveMessage(true);
      clearForm();

      // Recarregar produtos depois de salvar
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);

      toast({
        title: "Sucesso",
        description: "Produto salvo com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o produto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!productName.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome do produto para pesquisar",
      });
      return;
    }

    try {
      setLoading(true);
      const product = await getProductByName(productName);
      if (product) {
        setSearchProduct(product);
        setIsSearchOpen(true);

        // Não preencher o formulário com o produto encontrado
        // Mantém apenas o nome do produto para referência

        toast({
          title: "Produto encontrado",
          description: `Produto: ${product.name}`,
        });
      } else {
        toast({
          title: "Produto não encontrado",
          description: "Nenhum produto com esse nome foi encontrado",
        });
      }
    } catch (error) {
      console.error("Erro ao pesquisar produto:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao pesquisar o produto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!productName.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome do produto para editar",
      });
      return;
    }

    try {
      setLoading(true);
      const product = await getProductByName(productName);
      if (product) {
        setEditProduct(product);
        setIsEditOpen(true);
      } else {
        toast({
          title: "Produto não encontrado",
          description: "Nenhum produto com esse nome foi encontrado",
        });
      }
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar o produto para edição",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productName.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome do produto para deletar",
      });
      return;
    }

    try {
      setLoading(true);
      const product = await getProductByName(productName);
      if (product) {
        const result = await deleteProduct(productName);
        if (result) {
          setShowDeleteMessage(true);
          clearForm();
          // Recarregar produtos depois de deletar
          const updatedProducts = await getProducts();
          setProducts(updatedProducts);

          toast({
            title: "Sucesso",
            description: "Produto excluído com sucesso",
          });
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível excluir o produto",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Produto não encontrado",
          description: "Nenhum produto com esse nome foi encontrado",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o produto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExit = async () => {
    try {
      setLoading(true);
      // Fazer logout do usuário
      await signOut();
      // Redirecionar para a tela de login
      navigate('/login');
      toast({
        title: "Desconectado",
        description: "Você saiu do sistema com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao sair do sistema",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setProductName("");
    setQuantity("");
    setLocation("");
    setExpiryDate("");
    setMinimumStock("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-[#333333]">
      <h1 className="text-3xl font-bold text-white mb-8 mt-8">Seu Estoque</h1>

      {loading && (
        <div className="mb-4 text-primary">Carregando...</div>
      )}

      <div className="w-full max-w-md space-y-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full p-3 rounded bg-[#444444] text-white"
              placeholder="Produto"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full p-3 rounded bg-[#444444] text-white"
              placeholder="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full p-3 rounded bg-[#444444] text-white"
              placeholder="Local de Armazenamento"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full p-3 rounded bg-[#444444] text-white"
              placeholder="Data de Validade"
              value={expiryDate}
              onChange={(e) => {
                // Usar a função de máscara de data centralizada
                setExpiryDate(applyDateMask(e.target.value));
              }}
              maxLength={10}
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full p-3 rounded bg-[#444444] text-white"
              placeholder="Limite Mínimo de Estoque"
              value={minimumStock}
              onChange={(e) => {
                // Aceitar apenas números
                const value = e.target.value.replace(/\D/g, '');
                setMinimumStock(value);
              }}
              disabled={loading}
            />
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={handleSearch}
              className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
              disabled={loading}
            >
              {loading ? "Pesquisando..." : "Pesquisar"}
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
              disabled={loading}
            >
              {loading ? "Carregando..." : "Editar"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
              disabled={loading}
            >
              {loading ? "Excluindo..." : "Deletar"}
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
              disabled={loading}
            >
              {loading ? "Saindo..." : "Sair"}
            </button>
            <button
              type="button"
              onClick={() => navigate('/lista-compras')}
              className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
            >
              Lista de Compras
            </button>
          </div>
        </form>
      </div>

      {showSaveMessage && (
        <div className="fixed top-10 inset-x-0 flex justify-center">
          <div className="bg-[#444444] px-6 py-3 rounded-md shadow-lg">
            <p className="text-3xl font-bold text-white">Produto salvo com sucesso!</p>
          </div>
        </div>
      )}

      {showDeleteMessage && (
        <div className="fixed top-10 inset-x-0 flex justify-center">
          <div className="bg-[#444444] px-6 py-3 rounded-md shadow-lg">
            <p className="text-xl font-bold text-white">Produto excluído com sucesso!</p>
          </div>
        </div>
      )}

      <SearchModal
        product={searchProduct}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <EditModal
        product={editProduct}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={() => {
          setShowSaveMessage(true);
          clearForm();
          // Recarregar produtos após salvar
          const loadAgain = async () => {
            try {
              const updatedProducts = await getProducts();
              setProducts(updatedProducts);
            } catch (error) {
              console.error("Erro ao recarregar produtos:", error);
            }
          };
          loadAgain();
        }}
        onDelete={() => {
          setShowDeleteMessage(true);
          clearForm();
          // Recarregar produtos após deletar
          const loadAgain = async () => {
            try {
              const updatedProducts = await getProducts();
              setProducts(updatedProducts);
            } catch (error) {
              console.error("Erro ao recarregar produtos:", error);
            }
          };
          loadAgain();
        }}
      />
    </div>
  );
};

export default Products;
