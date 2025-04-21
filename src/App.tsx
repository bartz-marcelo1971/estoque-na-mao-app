import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ShoppingList from "./pages/ShoppingList";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import { initAuth, isAuthenticated } from "./lib/auth";

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

// Componente para rotas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

const queryClient = new QueryClient();

const App = () => {
  const [authInitialized, setAuthInitialized] = useState(false);

  // Efeito para inicializar a autenticação e limpar o cache
  useEffect(() => {
    const initialize = async () => {
      await initAuth();
      await clearBrowserCache();
      setAuthInitialized(true);
    };

    initialize();
  }, []);

  // Mostrar loading enquanto inicializa a autenticação
  if (!authInitialized) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/produtos" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/lista-compras" element={
              <ProtectedRoute>
                <ShoppingList />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
