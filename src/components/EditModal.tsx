
import { useState } from "react";
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
  const [quantity, setQuantity] = useState(product?.quantity || "");
  const [location, setLocation] = useState(product?.location || "");
  const [expiryDate, setExpiryDate] = useState(product?.expiryDate || "");

  if (!product) return null;

  const handleSave = () => {
    if (product) {
      saveProduct({
        name: product.name,
        quantity,
        location,
        expiryDate,
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
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="Data de Validade"
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
