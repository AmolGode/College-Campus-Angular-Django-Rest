from cgitb import text
from django.contrib import admin
from django.urls import path
from groups_api import views
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [
    path('create_group/', views.create_group),
    path('get_group_list/<int:user_pk>', views.get_group_list),
    path('get_group_info/<str:group_name>', views.get_group_info),
    path('get_user_type/<int:user_id>/<int:group_id>/', views.get_user_type),
    path('join_group/',views.join_group),
    path('set_primary_group/',views.set_primary_group),
    path('delete_group_member/',views.delete_group_member),
    path('delete_group_admin/',views.delete_group_admin),
    path('save_post/',views.save_post),
    path('post/',views.post),
    # path('post/', FileUploadView.as_view()),
    path('post/',views.temp_save_post),
    path('get_post/<int:group_id>/<str:post_type>/<int:post_limit>',views.get_post),
    path('get_user_primary_group/<int:user_id>',views.get_user_primary_group),
    path('add_like',views.add_like),
    path('add_comment',views.add_comment),
    path('get_post_comments/<int:post_id>',views.get_post_comments),
    path('add_comment_like',views.add_comment_like),
    path('add_comment_replay',views.add_comment_replay),
    path('get_comment_replay/<int:comment_id>',views.get_comment_replay),
    path('add_replay_like',views.add_replay_like),
    path('save_edited_comment',views.save_edited_comment),
    path('delete_comment/<int:comment_id>',views.delete_comment),
    path('save_edited_replay',views.save_edited_replay),
    path('delete_replay/<int:replay_id>',views.delete_replay),
    path('save_edited_post_image',views.save_edited_post_image),
    path('save_edited_post_text',views.save_edited_post_text),
    path('save_edited_post_type',views.save_edited_post_type),
    path('delete_post/<int:post_id>',views.delete_post),
    path('save_edited_post_document',views.save_edited_post_document),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# if settings.DEBUG:
