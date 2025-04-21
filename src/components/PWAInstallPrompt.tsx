import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

let deferredPrompt: any = null;

const PWAInstallPrompt = () => {
    const [isInstallable, setIsInstallable] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Verificar se já foi instalado
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return; // Já está instalado, não mostrar prompt
        }

        // Carregar preferência do usuário sobre não mostrar o prompt
        const hasUserDismissed = localStorage.getItem('pwaPromptDismissed') === 'true';
        if (hasUserDismissed) {
            setDismissed(true);
        }

        // Escutar pelo evento beforeinstallprompt
        const handler = (e: Event) => {
            // Impedir que o Chrome mostre o prompt padrão
            e.preventDefault();
            // Armazenar o evento para que possa ser acionado mais tarde
            deferredPrompt = e;
            // Atualizar UI para mostrar nosso próprio botão
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Mostrar o prompt
        deferredPrompt.prompt();

        // Esperar pela escolha do usuário
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} a instalação`);

        // Limpar o deferredPrompt
        deferredPrompt = null;

        // Esconder o botão
        setIsInstallable(false);
    };

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('pwaPromptDismissed', 'true');
    };

    if (!isInstallable || dismissed) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 bg-[#444444] p-4 rounded-lg shadow-lg text-white z-50">
            <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-white"
                aria-label="Fechar"
            >
                <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-2">Instalar Stok na Mão</h3>
            <p className="text-sm mb-4">Instale nosso aplicativo para uso offline e melhor experiência!</p>

            <div className="flex justify-center">
                <Button
                    onClick={handleInstall}
                    className="bg-white text-[#333333] hover:bg-gray-200"
                >
                    Instalar
                </Button>
            </div>
        </div>
    );
};

export default PWAInstallPrompt; 