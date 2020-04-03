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
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework import routers
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from api import views as api
from api.views import ImageView, ProfileView, UserView, VideoFrameView
from main import views

router = routers.DefaultRouter()
router.register('register', UserView)
router.register('image', ImageView)
router.register('profile', ProfileView)
router.register('video', VideoFrameView)

urlpatterns = [
    # API
    path('api/user/', include('rest_framework.urls')), # REST_FRAMEWORK_URL_FOR_TEST
    path('api/auth/', TokenObtainPairView.as_view(), name='auth'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('api/', include(router.urls)),
    # WEB
    path('', views.index, name="index"),
    path('login/', views.login_user, name="login"),
    path('login/<int:id>', views.login_user, name="loginpost"),
    path('register/', views.register, name="register"),
    path('logout/',  views.logout_user, name="logout"),
    path('dashboard', views.home, name="dashboard"),
    path('pull', views.pull, name="pull"), # Pull used by circleci trigger to deploy
    path('users/', include('main.urls')),
    path('projects/', include('projects.urls')),
    path('app/', include('api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += path('admin/', admin.site.urls),
