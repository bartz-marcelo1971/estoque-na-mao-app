// Nome do cache
const CACHE_NAME = 'stock-na-mao-v1';

// Lista de recursos para cache
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/login',  // Adicionar página de login para garantir que esteja em cache
];

// URLs de rotas principais
const APP_ROUTES = [
    '/',
    '/produtos',
    '/lista-compras',
    '/login'
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

// Interceptar navegação entre rotas principais do app para páginas do SPA
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Verificar se é uma navegação para uma rota principal da aplicação
    // para garantir que o SPA funcione corretamente
    if (event.request.mode === 'navigate' &&
        APP_ROUTES.some(route => url.pathname === route)) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('/index.html');
            })
        );
        return;
    }

    // Verificar se é uma solicitação de API ou autenticação - não fazer cache
    if (url.pathname.includes('/api/') ||
        url.pathname.includes('/auth/') ||
        url.hostname.includes('supabase')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({ error: 'Offline' }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // Para outros recursos, usar estratégia de network first com fallback para cache
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