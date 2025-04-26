// Verificar se o navegador suporta service workers
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Primeiro, tenta desregistrar qualquer service worker antigo
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (let registration of registrations) {
                console.log('Desregistrando service worker antigo:', registration.scope);
                registration.unregister().then((success) => {
                    console.log('Service worker desregistrado com sucesso:', success);
                }).catch(err => {
                    console.error('Erro ao desregistrar service worker:', err);
                });
            }

            // Depois registra o novo service worker
            setTimeout(() => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('Service Worker registrado com sucesso:', registration.scope);

                        // Verificação periódica para atualização
                        setInterval(() => {
                            registration.update();
                            console.log('Verificando atualizações do Service Worker');
                        }, 60 * 60 * 1000); // A cada hora
                    })
                    .catch((error) => {
                        console.error('Falha ao registrar Service Worker:', error);
                    });
            }, 1000); // Aguarda 1 segundo após desregistrar
        });
    });
} 