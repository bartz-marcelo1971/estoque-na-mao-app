import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppProduct } from "@/lib/storage";
import { useEffect, useState } from "react";
import { formatExpiryDate } from "@/lib/utils";

interface SearchModalProps {
  product: AppProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ product, isOpen, onClose }: SearchModalProps) => {
  const [expiryDate, setExpiryDate] = useState<string>("Não especificada");

  useEffect(() => {
    if (product && product.expiryDate) {
      // Usar a função de formatação de data centralizada
      setExpiryDate(formatExpiryDate(product.expiryDate));
    } else {
      setExpiryDate("Não especificada");
    }
  }, [product, isOpen]);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Detalhes do Produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Produto:</h3>
            <p className="text-3xl font-bold">{product.name}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Quantidade:</h3>
            <p className="text-3xl font-bold">{product.quantity}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Local de Armazenamento:</h3>
            <p className="text-3xl font-bold">{product.location || "Não especificado"}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Data de Validade:</h3>
            <p className="text-3xl font-bold">{expiryDate}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Limite Mínimo de Estoque:</h3>
            <p className="text-3xl font-bold">{product.minimumStock}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
