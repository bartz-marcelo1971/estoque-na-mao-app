import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppProduct, saveProduct, deleteProduct } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { applyDateMask } from "@/lib/utils";

interface EditModalProps {
  product: AppProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const EditModal = ({ product, isOpen, onClose, onSave, onDelete }: EditModalProps) => {
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState("");

  // Apenas armazena o nome do produto para referência
  useEffect(() => {
    if (product && isOpen) {
      // Limpar os campos a cada abertura do modal
      setQuantity("");
      setLocation("");
      setExpiryDate("");
      setMinimumStock("");

      // Salvar apenas o nome do produto para saber qual estamos editando
      setProductName(product.name);
    }
  }, [product, isOpen]);

  // Limpar campos quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      setQuantity("");
      setLocation("");
      setExpiryDate("");
      setMinimumStock("");
    }
  }, [isOpen]);

  if (!product) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveProduct({
        name: productName,
        quantity,
        location,
        expiryDate,
        minimumStock,
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct(productName);
      onDelete();
      onClose();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Editar Produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Produto:</h3>
            <p className="text-3xl font-bold">{productName}</p>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-xl font-bold text-red-500">
              Quantidade:
            </label>
            <input
              id="quantity"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantidade"
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-xl font-bold text-red-500">
              Local de Armazenamento:
            </label>
            <input
              id="location"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Local de Armazenamento"
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-xl font-bold text-red-500">
              Data de Validade:
            </label>
            <input
              id="expiryDate"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={expiryDate}
              onChange={(e) => {
                // Usar a função de máscara de data centralizada
                setExpiryDate(applyDateMask(e.target.value));
              }}
              maxLength={10}
              placeholder="Data de Validade (ex: 31/12/2024)"
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="minimumStock" className="block text-xl font-bold text-red-500">
              Limite Mínimo de Estoque:
            </label>
            <input
              id="minimumStock"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={minimumStock}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setMinimumStock(value);
              }}
              placeholder="Limite Mínimo de Estoque"
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <div className="flex justify-between pt-4">
            <Button
              className="bg-[#444444] text-white text-xl font-bold"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button
              className="bg-[#444444] text-white text-xl font-bold"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Excluindo..." : "Deletar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
