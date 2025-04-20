import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product, saveProduct, deleteProduct } from "@/lib/storage";
import { Button } from "@/components/ui/button";

interface EditModalProps {
  product: Product | null;
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

  // Atualiza os campos quando o produto muda ou o modal é aberto
  useEffect(() => {
    if (product && isOpen) {
      setQuantity(product.quantity || "");
      setLocation(product.location || "");
      setExpiryDate(product.expiryDate || "");
      setMinimumStock(product.minimumStock || "");
    }
  }, [product, isOpen]);

  if (!product) return null;

  const handleSave = () => {
    if (product) {
      saveProduct({
        name: product.name,
        quantity,
        location,
        expiryDate,
        minimumStock,
      });
      onSave();
      onClose();
    }
  };

  const handleDelete = () => {
    if (product) {
      deleteProduct(product.name);
      onDelete();
      onClose();
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
            <p className="text-3xl font-bold">{product.name}</p>
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
              placeholder="DD/MM/AAAA"
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
            />
          </div>
          <div className="flex justify-between pt-4">
            <Button
              className="bg-[#444444] text-white text-xl font-bold"
              onClick={handleSave}
            >
              Salvar Alterações
            </Button>
            <Button
              className="bg-[#444444] text-white text-xl font-bold"
              onClick={handleDelete}
            >
              Deletar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
