import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ShoppingList from "./pages/ShoppingList";
import NotFound from "./pages/NotFound";

// Função para limpar o cache do navegador
const clearBrowserCache = async () => {
  if ('caches' in window) {
    try {
      // Obtém todas as chaves de cache
      const cacheKeys = await window.caches.keys();
      
      // Exclui cada cache
      await Promise.all(
        cacheKeys.map(cacheKey => window.caches.delete(cacheKey))
      );
      
      console.log('Cache do navegador limpo com sucesso');
    } catch (error) {
      console.error('Erro ao limpar o cache:', error);
    }
  }
};

const queryClient = new QueryClient();

const App = () => {
  // Efeito para limpar o cache quando o aplicativo inicia
  useEffect(() => {
    clearBrowserCache();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/lista-compras" element={<ShoppingList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
