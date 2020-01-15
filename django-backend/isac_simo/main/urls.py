from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_all_users, name="allusers"),
    path('add', views.admin_userAddForm, name="admin_adduser"),
    path('update/<int:id>', views.admin_userAddForm, name="update_user"),
    path('delete/<int:id>', views.deleteUserByAdmin, name="admin_deleteuser"),

]