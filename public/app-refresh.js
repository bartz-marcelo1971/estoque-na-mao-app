// Este script verifica atualizações do PWA e força o recarregamento quando necessário
(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js')
                .then(function (registration) {
                    // Verifica atualizações
                    registration.addEventListener('updatefound', function () {
                        const newWorker = registration.installing;

                        newWorker.addEventListener('statechange', function () {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Nova versão disponível
                                console.log('Nova versão disponível! Atualizando...');

                                // Limpa o cache do aplicativo
                                caches.keys().then(function (names) {
                                    return Promise.all(
                                        names.map(function (name) {
                                            return caches.delete(name);
                                        })
                                    );
                                }).then(function () {
                                    // Força o recarregamento da página
                                    window.location.reload();
                                });
                            }
                        });
                    });

                    // Verifica se há uma nova versão a cada 5 minutos
                    setInterval(function () {
                        registration.update();
                    }, 5 * 60 * 1000);
                })
                .catch(function (error) {
                    console.log('Falha ao registrar o service worker:', error);
                });
        });

        // Adiciona evento para lidar com mudanças de navegação
        window.addEventListener('popstate', function (event) {
            // Força a releitura da página atual ao navegar
            window.location.reload();
        });
    }
})(); 