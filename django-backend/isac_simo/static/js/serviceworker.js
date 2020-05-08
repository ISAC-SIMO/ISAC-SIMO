/**
 * Version: 0.0.0.1
 */

const STATIC_CACHE = 'STATIC_CACHE_V1'
const OFFLINE_ERROR_RESPONSE = {'data':'', 'error':'No Internet Connection Available'}
const assets = [
    '/static/plugins/fontawesome-free/css/all.min.css','/static/plugins/pace-progress/themes/purple/pace-theme-minimal.css',
    '/static/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css', '/static/plugins/select2/css/select2.min.css',
    '/static/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css', '/static/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
    '/static/dist/img/favicon-32x32.png', '/static/dist/img/favicon-16x16.png', '/static/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
    '/static/plugins/jqvmap/jqvmap.min.css', '/static/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',
    '/static/dist/css/adminlte.min.css', '/static/plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
    '/static/plugins/daterangepicker/daterangepicker.css', '/static/plugins/summernote/summernote-bs4.css',
    '/static/plugins/jquery/jquery.min.js', '/static/plugins/jquery-ui/jquery-ui.min.js', '/static/plugins/bootstrap/js/bootstrap.bundle.min.js',
    '/static/plugins/sweetalert2/sweetalert2.min.js', '/static/plugins/select2/js/select2.min.js', '/static/plugins/pace-progress/pace.min.js',
    '/static/plugins/chart.js/Chart.min.js', '/static/plugins/sparklines/sparkline.js', '/static/plugins/jqvmap/jquery.vmap.min.js',
    '/static/plugins/jqvmap/maps/jquery.vmap.usa.js', '/static/plugins/jquery-knob/jquery.knob.min.js',
    '/static/plugins/moment/moment.min.js', '/static/plugins/daterangepicker/daterangepicker.js',
    '/static/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js', '/static/plugins/summernote/summernote-bs4.min.js',
    '/static/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js', '/static/plugins/datatables/jquery.dataTables.js',
    '/static/plugins/datatables-bs4/js/dataTables.bootstrap4.js', '/static/dist/js/adminlte.js', '/offline',
    '/static/dist/img/logo.png',
    'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js', 'https://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.css',
    'https://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.Default.css', 'https://leaflet.github.io/Leaflet.markercluster/dist/leaflet.markercluster-src.js',
    'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css', 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css', 
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css', 'https://cdn.jsdelivr.net/npm/vanilla-lazyload@15.1.1/dist/lazyload.min.js',
]
console.log('Service Woker First Installation Initialized')

self.addEventListener('install', evt => {
    // Precache static asset files
    evt.waitUntil(
        caches.open(STATIC_CACHE)
        .then(cache => {
            cache.addAll(assets).then(res => {
                console.log('sw is installed')
                console.log('prefetch cache OK')
            })
        })
        .catch(e => {
            console.log('failed to cache few assets')
        })
    );
})

self.addEventListener('activate', evt => {
    let cacheWhiteList = [STATIC_CACHE]
    let cacheCleared = 0
    evt.waitUntil(
        // USEFUL TO DELETE OLD CACHE //
        caches.keys()
            .then(names => {
                Promise.all(
                    names.map(cacheName => {
                        if(cacheWhiteList.indexOf(cacheName) === -1){
                            cacheCleared += 1
                            return caches.delete(cacheName)
                        }
                    })
                ).then(res => {
                    console.log(`${cacheCleared} Old Cache Cleared...`)
                })
            })
    )
})

function handleCacheAndRequest(evt,clonedReq,cache_type,hours=24){
    // console.log(clonedReq)
    let clearCache = false;
    return evt.respondWith(new Promise((resolve, reject) => {
        // FETCH FROM CACHE FOR FROM SERVER if/else
        caches.match(evt.request.clone()).then(function(cachedRes) {
            // If cache found
            if(cachedRes){
                console.log('asset from cache...')
                try{
                    let cached_at = new Date(cachedRes.clone().headers.get('date').replace(',','').split(/,/)[0])
                    let now = new Date()
                    if(Math.floor((now - cached_at) / (1000*60*60)) > hours){ // IF CACHE IS > hours(from param) old delete it
                        clearCache = true; // if true clears only if internet is OK and fetch is good
                    }else{
                        resolve(cachedRes)
                        return;
                    }
                }catch(e){
                    resolve(cachedRes)
                    return;
                }
            }
            // Else goes here
            fetch(clonedReq).then(res => {
                // If response from server was 200 then cache and resolve else only resolve
                if(res.status == 200){
                    if(clearCache && navigator.onLine){ // If clearCache is true (expired) and internet is OK then delete (also response is already 200 from fetch)
                        caches.delete(evt.request.clone()).then(function(r) {
                            console.log('Old asset cache was deleted')
                        });
                    }

                    // CACHE THE RESPONSE
                    caches.open(cache_type)
                        .then(cache => {
                            cache.put(evt.request.clone(), res.clone())
                            console.log('asset cache updated')
                            resolve(res)
                            return;
                        })
                }else{
                    resolve(res)
                    return;
                }
            }).catch(e => {
                reject(e)
                return;
            })
        });
    }))
}

self.addEventListener('fetch', evt => {
    const clonedReq = evt.request.clone()
    const url = new URL(clonedReq.url)
    // console.log(`Fetch Event Fired for: ${clonedReq.url}`)

    if(['style','script','empty','image'].indexOf(evt.request.clone().destination) > -1){
        if(assets.indexOf(url.pathname) > -1 || assets.indexOf(url.href) > -1){ // if is in asset
            return handleCacheAndRequest(evt,clonedReq,STATIC_CACHE,336) //ttl 336 hrs (14 days)
        }
    }

    // if(['document'].indexOf(evt.request.clone().destination) > -1){
    //     if(!navigator.onLine){
    //         evt.respondWith(new Promise((resolve, reject) => {
    //             caches.match('/offline').then(function(cachedRes) {
    //                 if(cachedRes){
    //                     console.log('offline document from cache...')
    //                     resolve(cachedRes)
    //                     return;
    //                 }
    //             })
    //         }))
    //     }
    // }

    if (evt.request.mode === 'navigate') {
        evt.respondWith((async () => {
            try {
                const preloadResponse = await evt.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }

                const networkResponse = await fetch(evt.request);
                return networkResponse;
            } catch (error) {
                console.log('offline document from cache...')
                const cachedResponse = await caches.match('/offline');
                return cachedResponse;
            }
        })());
    }
})