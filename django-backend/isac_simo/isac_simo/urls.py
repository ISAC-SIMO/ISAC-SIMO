"""isac_simo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from main import views
from api import views as api
from rest_framework import routers
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,)

router = routers.DefaultRouter()
# router.register('language', views.LanguageView)

urlpatterns = [
    # API
    path('api/auth/', TokenObtainPairView.as_view(), name='auth'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('api/', include(router.urls)),
    # WEB
    path('admin/', admin.site.urls),
    path('', views.login_user),
    path('login/', views.login_user, name="login"),
    path('login/<int:id>', views.login_user, name="loginpost"),
    path('register/', views.register, name="register"),
    path('logout/',  views.logout_user, name="logout"),
    path('dashboard', views.home, name="dashboard"),
    path('users/', include('main.urls')),
    path('projects/', include('projects.urls')),
    path('app/', include('api.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)