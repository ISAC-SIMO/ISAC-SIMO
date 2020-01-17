from django.urls import path
from . import views

urlpatterns = [
    path('image', views.images, name="images"),
    path('image/add', views.addImage, name="images.add"),
    path('image/update/<int:id>', views.updateImage, name="images.update"),
    path('image/delete/<int:id>', views.deleteImage, name="images.delete"),
]