
from cgitb import text
from django.contrib import admin
from django.urls import path
from user_api import views
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [
    path('create_user/', views.create_user),
    path('login_user/<str:user_id>/<str:user_password>/',views.login_user),
    path('get_profile_info/<str:uid>/',views.get_profile_info),
    path('save_edited_profile/',views.save_edited_profile),
    path('delete_profile/<int:uid>/',views.delete_profile),
]