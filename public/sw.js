// Nome do cache
const CACHE_NAME = 'stok-na-mao-v1';

// Lista de recursos para cache
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/login',
    '/login/',
];

// URLs que não devem ser armazenadas em cache (autenticadas)
const nonCachableUrls = [
    '/produtos',
    '/lista-compras'
];

// Instalar o service worker e criar cache
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Estratégia de cache: network first com fallback para cache
self.addEventListener('fetch', (event) => {
    // Não interferir com solicitações de API ou autenticação
    if (event.request.url.includes('/api/') ||
        event.request.url.includes('supabase') ||
        event.request.url.includes('auth') ||
        event.request.url.includes('/login')) {
        return;
    }

    // Verificar se a URL atual é uma que não deve ser armazenada em cache
    const shouldNotCache = nonCachableUrls.some(url =>
        event.request.url.includes(url)
    );

    if (shouldNotCache) {
        // Para URLs não cacheáveis, sempre buscar da rede
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Se a resposta for válida, armazenar no cache
                if (event.request.method === 'GET' && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                }
                return response;
            })
            .catch(() => {
                // Se falhar, tentar obter do cache
                return caches.match(event.request);
            })
    );
});

// Adicionar evento de mensagem para lidar com logout
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'LOGOUT') {
        console.log('[Service Worker] Recebido evento de logout');

        // Limpar caches específicos da sessão do usuário
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName.includes('user-data')) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    }
});

// Limpar caches antigos quando uma nova versão do SW for ativada
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando');
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