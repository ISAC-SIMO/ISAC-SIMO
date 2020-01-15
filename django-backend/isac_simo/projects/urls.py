from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.viewProjects, name="viewprojects"),
    path('add', views.addProject, name="addproject"),
    path('update/<int:id>', views.editProject, name="updateproject"),
    path('delete/<int:id>', views.deleteProject, name="deleteproject"),
]