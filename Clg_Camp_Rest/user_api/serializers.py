# from typing_extensions import Required
from django.db.models import fields
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=20)
    last_name = serializers.CharField(max_length=20)
    gender = serializers.CharField(max_length=6)
    college_name = serializers.CharField(max_length=50)
    user_id = serializers.CharField(max_length=30)
    user_password = serializers.CharField(max_length=20)
    profile_pic = serializers.ImageField(default='')

    def create(self, validated_data):
        return UserModel.objects.create(**validated_data)

class UserUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=20)
    last_name = serializers.CharField(max_length=20)
    gender = serializers.CharField(max_length=6)
    college_name = serializers.CharField(max_length=50)
    user_id = serializers.CharField(max_length=30)
    user_password = serializers.CharField(max_length=20)
    profile_pic = serializers.ImageField(default='')

    def update(self, instance, validated_data): #When serializers.Serializer
        return UserModel.objects.update(**validated_data)


class UserLoginSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField(max_length=20)
    last_name = serializers.CharField(max_length=20)
    gender = serializers.CharField(max_length=6)
    college_name = serializers.CharField(max_length=50)
    user_id = serializers.CharField(max_length=30)
    user_password = serializers.CharField(max_length=20)
    profile_pic = serializers.ImageField(default='')
