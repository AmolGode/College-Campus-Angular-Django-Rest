# from typing_extensions import Required
from django.db.models import fields
from rest_framework import serializers

# from Clg_Camp_Rest.groups_api.views import post
from .models import GroupsModel, GroupPostsModel, PostCommentReplayModel, TempPostModel
from .models import UserModelGroupsModel, GroupPostCommentsModel
from user_api.models import UserModel


class GroupsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    group_name = serializers.CharField(max_length=20)
    group_description = serializers.CharField(max_length=50)
    group_joining_link = serializers.CharField(max_length=50,)
    # user_id = serializers.ManyToManyField(UserModel, through='UserModelGroupsModel')

    def create(self, validated_data):
        return GroupsModel.objects.create(**validated_data)

class GroupsSerializerForSave(serializers.Serializer):
    group_name = serializers.CharField(max_length=20)
    group_description = serializers.CharField(max_length=50)
    group_joining_link = serializers.CharField(max_length=50,)
    # user_id = serializers.ManyToManyField(UserModel, through='UserModelGroupsModel')

    def create(self, validated_data):
        return GroupsModel.objects.create(**validated_data)


class UserGroupsSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    group_id = serializers.IntegerField()
    user_type = serializers.CharField(max_length=10)
    primary = serializers.BooleanField()

    def create(self, validated_data):
        return UserModelGroupsModel.objects.create(**validated_data)

# class UserGroupsInfoSerializer(serializers.Serializer):
#     id = serializers.IntegerField()
#     group_name = serializers.CharField(max_length=20)
#     group_description = serializers.CharField(max_length=50)
#     group_joining_link = serializers.CharField(max_length=50)
    # user_type = serializers.CharField(max_length=10)
    # primary = serializers.BooleanField()

class GroupPostsSerializer(serializers.Serializer):
    # id = serializers.IntegerField()
    post_text = serializers.CharField(max_length=1000)
    post_type = serializers.CharField(max_length=20)
    image = serializers.ImageField(default='')
    document = serializers.FileField(default='')
    likes = serializers.IntegerField(default=0)
    group_id = serializers.IntegerField()
    user_id = serializers.IntegerField()

    def create(self, validated_data): #When serializers.Serializer
        return GroupPostsModel.objects.create(**validated_data)


class PostsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    post_text = serializers.CharField(max_length=1000)
    post_type = serializers.CharField(max_length=20)
    image = serializers.ImageField(default='')
    document = serializers.FileField(default='')
    likes = serializers.IntegerField(default=0)
    group_id = serializers.IntegerField()
    user_id = serializers.IntegerField()

    def update(self, validated_data): #When serializers.Serializer
        return GroupPostsModel.objects.update(**validated_data)

    # class Meta:#When serializers.ModelSerializer (Not Worked)
    #     model = GroupPostsModel
    #     fields = ('id','post_type','post_text','image','document','group_id')
        # fields = '__all__'


class GroupPostCommentsSerializer(serializers.Serializer):
    comment_text = serializers.CharField(max_length=1000)
    likes = serializers.IntegerField(default=0)
    time_stamp = serializers.DateTimeField(default='')
    comment_by_user_id = serializers.IntegerField()
    post_id_id = serializers.IntegerField()

    def create(self, validated_data): #When serializers.Serializer
        return GroupPostCommentsModel.objects.create(**validated_data)


class PostCommentReplaySerializer(serializers.Serializer):
    replay_text = serializers.CharField(max_length=1000)
    time_stamp = serializers.DateTimeField(default='')
    replay_by_user_id = serializers.IntegerField()
    # replay_to_user = serializers.CharField(max_length=20)
    comment_id = serializers.IntegerField()

    def create(self, validated_data): #When serializers.Serializer
        return PostCommentReplayModel.objects.create(**validated_data)



# class GroupPostCommentsSerializerGetInfo(serializers.Serializer):
#     id = serializers.IntegerField()
#     comment_text = serializers.CharField(max_length=1000)
#     likes = serializers.IntegerField(default=0)
#     time_stamp = serializers.DateTimeField(default='')
#     comment_by_user_id = serializers.IntegerField()
#     post_id_id = serializers.IntegerField()


# class GroupPostCommentUserInfoSerializer(serializers.Serializer):
#     id = serializers.IntegerField()
#     first_name = serializers.CharField(max_length=20)
#     last_name = serializers.CharField(max_length=20)
#     profile_pic = serializers.ImageField(default='')


class TempPostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()

    class Meta:
        model = TempPostModel
        fields = ('id','image')

