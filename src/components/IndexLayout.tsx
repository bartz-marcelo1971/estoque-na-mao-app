import { useEffect } from 'react';
import PWAInstallPrompt from './PWAInstallPrompt';

interface LayoutProps {
    children: React.ReactNode;
}

const IndexLayout = ({ children }: LayoutProps) => {
    // Verificar status de instalação ao montar
    useEffect(() => {
        // Verificar se o app está sendo executado como PWA
        const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone;

        if (isPWA) {
            console.log('Aplicativo sendo executado como PWA');
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {children}
            </main>
            <PWAInstallPrompt />
        </div>
    );
};

export default IndexLayout; 