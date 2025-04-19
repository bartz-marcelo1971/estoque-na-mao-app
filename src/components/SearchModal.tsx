
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/lib/storage";

interface SearchModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ product, isOpen, onClose }: SearchModalProps) => {
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
            <p className="text-3xl font-bold">{product.location}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Data de Validade:</h3>
            <p className="text-3xl font-bold">{product.expiryDate}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
