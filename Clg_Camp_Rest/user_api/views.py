import os
from django.shortcuts import render


from .models import *
from .serializers import *

from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from groups_api.models import GroupPostsModel
# Create your views here.


@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        resp = {
            'resp' : 'User creaated Successfully...!'
        }
        print('User created successfully..!')
    else :
        # print('Serializer error',serializer.errors)
        resp = {
            'resp' : 'Task Failed'
        }
    return Response(resp)


@api_view(['PUT'])
def save_edited_profile(request):
    print('user data : ',request.data)
    resp = {'resp' : 'Profile updated Fail!'}
    try:
        user = UserModel.objects.get(id=request.data.get('id'))
        try:
            if request.data.get('profile_pic') != None:
                os.remove(user.profile_pic.path)
        except Exception as e:
            print('No Profile pic for delete : ',e)

        if request.data.get('profile_pic') != None:
            user.profile_pic = request.FILES['profile_pic']
        user.first_name = request.data.get('first_name')
        user.last_name = request.data.get('last_name')
        user.user_id = request.data.get('user_id')
        user.gender = request.data.get('gender')
        if len(request.data.get('user_password')) >= 4:
            user.user_password = request.data.get('user_password')
        user.save()
        resp = {'resp' : 'Profile info updated..!'}
    except Exception as e:
        print('@@Exception : ',e)
    return Response(resp)

    
@api_view(['GET'])
def login_user(request,user_id, user_password):
    print('request = ',request)
    print(user_id)
    print(user_password)
    try :
        user = UserModel.objects.get(user_id=user_id,user_password=user_password)
        user_serializer = UserLoginSerializer(user)
        print(user_serializer.data)
        resp = {'resp' : 'valid', 'data' : user_serializer.data}
    except Exception as e:
        resp = {
                'resp' : 'Invalid'
            }
        print('Invalid data')
        print(e)
    return Response(resp)



@api_view(['GET'])
def get_profile_info(request,uid):
    print('request = ',request)
    try :
        user = UserModel.objects.get(id=uid)
        user_serializer = UserLoginSerializer(user)
        print(user_serializer.data)
        resp = user_serializer.data
    except Exception as e:
        resp = {
                'resp' : 'Invalid user_id'
            }
        print('Invalid data')
        print(e)
    return Response(resp)



@api_view(['DELETE'])
def delete_profile(request, uid):
    user = UserModel.objects.get(id=uid)
    try:
        os.remove(user.profile_pic.path)
        print('Profile pic deleted..! path = '+str(user.profile_pic))#post.image.path
    except Exception as e:
        print('No profile pic for delete '+str(e))
    try:
        for post in GroupPostsModel.objects.filter(user=uid):
            post.delete()
        user.delete()
        resp = {
            'resp': 'User Deleted successfully...!'
        }
    except Exception as e:
        print(e)
        resp = {
            'resp': 'User Delete failed...!'
        }
    return Response(resp)
