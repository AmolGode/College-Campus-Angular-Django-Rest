from django.db import models
from django.db.models.deletion import CASCADE
from user_api.models import UserModel

import os

# Create your models here.


class GroupsModel(models.Model):
    group_name = models.CharField(max_length=20, unique=True)
    group_description = models.CharField(max_length=50)
    group_joining_link = models.CharField(max_length=50, default='', unique=True)
    user_id = models.ManyToManyField(UserModel, through='UserModelGroupsModel', related_name='u_g')

    class Meta:
        db_table = 'groups'


class UserModelGroupsModel(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    group = models.ForeignKey(GroupsModel, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=10)
    primary = models.BooleanField()

    class Meta:
        unique_together = [['user', 'group']]
        db_table = 'user_groups'

# class UserPostModel(models.Model):
#     post_text = models.CharField(max_length=100)
#     post_type = models.CharField(max_length=20)
#     image = models.ImageField(blank=True, null=True, upload_to='post_images/')
#     document = models.FileField(blank=True,null=True, upload_to='post_documents/')
#     user = models.ForeignKey(UserModel, on_delete=models.CASCADE)

#     class Meta:
#         db_table = 'user_post'

class GroupPostsModel(models.Model):
    post_text = models.CharField(max_length=1000)
    post_type = models.CharField(max_length=20)
    image = models.ImageField(blank=True, null=True, upload_to='post_images/')
    document = models.FileField(blank=True,null=True, upload_to='post_documents/')
    likes = models.IntegerField(default=0)
    time_stamp = models.DateTimeField(auto_now=True)
    group = models.ForeignKey(GroupsModel, on_delete=models.CASCADE)
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)

    def delete(self):
       if self.image:
          if os.path.isfile(self.image.path):
             os.remove(self.image.path)

       if self.document:
          if os.path.isfile(self.document.path):
             os.remove(self.document.path)
       
       super().delete()


    class Meta:
        db_table = 'group_posts'



class GroupPostCommentsModel(models.Model):
    comment_text = models.CharField(max_length=1000)
    likes = models.IntegerField(default=0)
    time_stamp = models.DateTimeField(auto_now=True)
    comment_by_user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    post_id = models.ForeignKey(GroupPostsModel, on_delete=models.CASCADE)

    class Meta:
        db_table = 'group_posts_comments'

class PostCommentReplayModel(models.Model):
    replay_text = models.CharField(max_length=1000)
    time_stamp = models.DateTimeField(auto_now=True)
    likes = models.IntegerField(default=0)
    replay_by_user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    # replay_to_user = models.CharField(max_length=20)
    comment = models.ForeignKey(GroupPostCommentsModel, on_delete=CASCADE)

    class Meta:
        db_table = 'comment_replay'


class TempPostModel(models.Model):
    image = models.ImageField(blank=True, null=True, upload_to='temp_images/')

    class Meta:
        db_table = 'temp_post'
