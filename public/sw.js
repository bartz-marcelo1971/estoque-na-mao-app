// Nome do cache
const CACHE_NAME = 'stock-na-mao-v3';

// Lista de recursos para cachear inicialmente
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/login',
    '/produtos',
    '/lista-compras'
];

// Instalação do service worker - cria o cache inicial
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando');

    // Força a ativação imediata do novo service worker
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Ativação do service worker - limpa caches antigos
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando');

    // Toma controle imediato de todas as páginas na aplicação
    event.waitUntil(clients.claim());

    // Limpa caches antigos
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[Service Worker] Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptação de requisições fetch
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const request = event.request;

    // Console para depuração
    console.log('[Service Worker] Interceptando fetch para:', url.pathname);

    // Ignora requisições de API e autenticação
    if (url.pathname.includes('/api/') ||
        url.pathname.includes('/auth/') ||
        url.hostname.includes('supabase')) {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    return new Response(JSON.stringify({ error: 'Você está offline' }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
        return;
    }

    // Para requisições de navegação
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    return caches.match('/index.html');
                })
        );
        return;
    }

    // Para todos os outros recursos (assets, scripts, estilos, etc.)
    event.respondWith(
        caches.match(request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(request)
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    });
            })
    );
}); 