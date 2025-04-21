import PWAInstallPrompt from './PWAInstallPrompt';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {children}
            </main>
            <PWAInstallPrompt />
        </div>
    );
};

export default Layout; 