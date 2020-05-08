from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Map Google Admin Routes
    path('check', views.check, name="map.check"),
    path('fetch', views.fetch, name="map.fetch"),
    path('test', views.test, name="map.test"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)