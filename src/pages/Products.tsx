import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Product, saveProduct, getProductByName, deleteProduct } from "@/lib/storage";
import SearchModal from "@/components/SearchModal";
import EditModal from "@/components/EditModal";

const Products = () => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [minimumStock, setMinimumStock] = useState("");

  const [searchProduct, setSearchProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do produto é obrigatório",
      });
      return;
    }

    const product: Product = {
      name: productName,
      quantity,
      location,
      expiryDate,
      minimumStock,
    };

    saveProduct(product);
    setShowSaveMessage(true);
    clearForm();
  };

  const handleSearch = () => {
    if (!productName.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome do produto para pesquisar",
      });
      return;
    }

    const product = getProductByName(productName);
    if (product) {
      setSearchProduct(product);
      setIsSearchOpen(true);
    } else {
      toast({
        title: "Produto não encontrado",
        description: "Nenhum produto com esse nome foi encontrado",
      });
    }
  };

  const handleEdit = () => {
    if (!productName.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome do produto para editar",
      });
      return;
    }

    const product = getProductByName(productName);
    if (product) {
      setEditProduct(product);
      setIsEditOpen(true);
    } else {
      toast({
        title: "Produto não encontrado",
        description: "Nenhum produto com esse nome foi encontrado",
      });
    }
  };

  const handleDelete = () => {
    if (!productName.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome do produto para deletar",
      });
      return;
    }

    const product = getProductByName(productName);
    if (product) {
      deleteProduct(productName);
      setShowDeleteMessage(true);
      clearForm();
    } else {
      toast({
        title: "Produto não encontrado",
        description: "Nenhum produto com esse nome foi encontrado",
      });
    }
  };

  const handleExit = () => {
    navigate('/');
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

      <div className="w-full max-w-md space-y-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full p-3 rounded bg-[#444444] text-white"
              placeholder="Produto"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full p-3 rounded bg-[#444444] text-white"
              placeholder="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full p-3 rounded bg-[#444444] text-white"
              placeholder="Local de Armazenamento"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full p-3 rounded bg-[#444444] text-white"
              placeholder="Data de Validade"
              value={expiryDate}
              onChange={(e) => {
                // Remove caracteres não numéricos da entrada
                const numbersOnly = e.target.value.replace(/\D/g, '');

                // Aplica a máscara DD/MM/AAAA
                let formattedDate = '';
                if (numbersOnly.length > 0) {
                  formattedDate += numbersOnly.substring(0, 2);
                }
                if (numbersOnly.length > 2) {
                  formattedDate += '/' + numbersOnly.substring(2, 4);
                }
                if (numbersOnly.length > 4) {
                  formattedDate += '/' + numbersOnly.substring(4, 8);
                }

                setExpiryDate(formattedDate);
              }}
              maxLength={10}
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
            />
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={handleSearch}
              className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
            >
              Pesquisar
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
            >
              Deletar
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="w-full py-3 bg-[#444444] text-white text-xl font-bold rounded"
            >
              Sair
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
            <p className="text-xl font-bold text-white">Produto removido!</p>
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
        }}
        onDelete={() => {
          setShowDeleteMessage(true);
          clearForm();
        }}
      />
    </div>
  );
};

export default Products;
