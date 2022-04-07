from re import L
from shutil import ExecError
from typing import Any
from django.shortcuts import render
import io
from rest_framework import exceptions, serializers
from rest_framework import parsers
from rest_framework.parsers import JSONParser

from .serializers import *
from .models import *
# from .serializers import GroupsSerializer, UserGroupsInfoSerializer
# from .serializers import UserGroupsSerializer, GroupsSerializerForSave, GroupPostsSerializer, TempPostSerializer, GroupPostCommentsSerializer, GroupPostCommentsSerializerGetInfo
# from .serializers import GroupPostCommentsSerializerGetInfo
from django.http import JsonResponse, response
from django.views.decorators.csrf import csrf_exempt
# from .models import GroupsModel, TempPostModel, UserModelGroupsModel, GroupPostsModel, GroupPostCommentsModel
# useing function base api view & class base api view
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view
import os


# Create your views here.

@csrf_exempt
def create_group(request):
    if request.method == 'POST':
        json_data = request.body
        stream = io.BytesIO(json_data)
        py_data = JSONParser().parse(stream)
        print(py_data)
        print('group name : ')
        print(py_data.get('group_name'))
        group_serializer = GroupsSerializerForSave(data=py_data)
        if group_serializer.is_valid():
            group_serializer.save()
            group_obj = GroupsModel.objects.filter(
                group_name=py_data.get('group_name'))
            for obj in group_obj:
                group_id = obj.id
            py_data['group_id'] = group_id
            py_data['primary'] = True
            user_group_serializer = UserGroupsSerializer(data=py_data)
            if user_group_serializer.is_valid():
                UserModelGroupsModel.objects.filter(user=py_data.get(
                    'user_id'), primary=True).update(primary=False)
                user_group_serializer.save()
                resp = {'resp': py_data.get(
                    'group_name')+' is created successfully...!'}
            else:
                print(user_group_serializer.errors)
                resp = {'resp': 'Error : many to many table problem...!'}
        else:
            print('Error : '+str(group_serializer.errors))
            resp = {'resp': group_serializer.errors}
        return JsonResponse(resp, content_type='application/json')
    resp = {'resp': 'Error : Only POST request allowed...!'}
    return JsonResponse(resp, content_type='application/json')


@csrf_exempt
def set_primary_group(request):
    if request.method == 'PATCH':
        json_data = request.body
        stream = io.BytesIO(json_data)
        py_data = JSONParser().parse(stream)
        print('Setting Primary Group : '+str(py_data))
        UserModelGroupsModel.objects.filter(user=py_data.get(
            'user_id'), primary=True).update(primary=False)
        UserModelGroupsModel.objects.filter(user=py_data.get(
            'user_id'), group=py_data.get('group_id')).update(primary=True)
        resp = {'resp': str(py_data.get('group_id'))+' set to primary.'}
    else:
        resp = {'resp': 'Error : Only PATCH request allowed..!'}
    return JsonResponse(resp, content_type='application/json')


@api_view(['PUT'])
def delete_group_member(request):
    try:
        UserModelGroupsModel.objects.filter(user=request.data.get('user_id'), group=request.data.get('group_id')).delete()
        
        resp = {'resp':'Group member removed...!'}
    except Exception as e :
        print('delete group member Exception : ',e)
        resp = {'resp':'Group Member remove failed...!'}
    return Response(resp)


# @csrf_exempt
# def delete_group_member(request):
#     print('Request = ')
#     print(request.method)
#     if request.method == 'PUT':  # 'DELETE'
#         json_data = request.body
#         stream = io.BytesIO(json_data)
#         py_data = JSONParser().parse(stream)
#         print('Deleting group (member) : '+str(py_data))
#         UserModelGroupsModel.objects.filter(user=py_data.get(
#             'user_id'), group=py_data.get('group_id')).delete()
#         resp = {'resp': 'You are not member of ' +
#                 str(py_data.get('group_id'))+'.'}
#     else:
#         resp = {'resp': 'Error : Delete group operation f..!'}
#     return JsonResponse(resp, content_type='application/json')


@csrf_exempt
def delete_group_admin(request):
    print('Request = ')
    print(request.method)
    if request.method == 'PUT':  # 'DELETE'
        json_data = request.body
        stream = io.BytesIO(json_data)
        py_data = JSONParser().parse(stream)
        print('Deleting group (admin) : '+str(py_data))
        # UserModelGroupsModel.objects.filter(group=py_data.get('group_id')).delete()
        # temp = GroupPostsModel.objects.filter(group=py_data.get('group_id')).delete()
        # print('delete response : ',temp)
        for instance in GroupPostsModel.objects.filter(group=py_data.get('group_id')):
            instance.delete()

        GroupsModel.objects.filter(id=py_data.get('group_id')).delete()
        resp = {'resp': 'Group is deleted ' +
                str(py_data.get('group_id'))+'.'}
    else:
        resp = {'resp': 'Error : Delete Faild.!'}
    return JsonResponse(resp, content_type='application/json')


@api_view(['GET'])
def get_group_list(request, user_pk):
    data = GroupsModel.objects.filter(usermodelgroupsmodel__user_id=user_pk)
    # serializer = UserGroupsInfoSerializer(data, many=True)
    group_list = []
    for d in data:
        user_group = UserModelGroupsModel.objects.filter(
            user_id=user_pk) & UserModelGroupsModel.objects.filter(group_id=d.id)
        data_dict = {
            'group_id': str(d.id),
            'group_name': str(d.group_name),
            'group_description': str(d.group_description),
            'group_joining_link': str(d.group_joining_link),
            'primary': str(user_group[0].primary),
            'user_type': str(user_group[0].user_type)
        }
        group_list.append(data_dict)
    resp = {
        'group_list': group_list
    }
    return Response(resp)


@csrf_exempt
def get_group_info(request, group_name):
    data = GroupsModel.objects.filter(group_name=group_name)
    serializer = GroupsSerializer(data, many=True)
    return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def get_user_type(request, user_id, group_id):
    data = UserModelGroupsModel.objects.filter(
        user=user_id) & UserModelGroupsModel.objects.filter(group=group_id)
    serializer = UserGroupsSerializer(data, many=True)
    print(serializer)
    return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def join_group(request):
    if request.method == 'POST':
        json_data = request.body
        stream = io.BytesIO(json_data)
        py_data = JSONParser().parse(stream)
        print(py_data)
        # user_id = py_data.get('user_id')
        user_type = 'Member'
        group_obj = GroupsModel.objects.filter(
            group_joining_link=py_data.get('group_joining_link'))
        group_id = 0
        for obj in group_obj:
            group_id = obj.id
            group_name = obj.group_name
        if group_id > 0:
            py_data['user_type'] = user_type
            py_data['group_id'] = group_id
            py_data['primary'] = True
            user_group_serializer = UserGroupsSerializer(data=py_data)
            if user_group_serializer.is_valid():
                try:
                    UserModelGroupsModel.objects.filter(user=py_data.get(
                        'user_id'), primary=True).update(primary=False)  # set all grp to primary false

                    if user_group_serializer.save():
                        resp = {'resp': 'You joined to ' +
                                group_name+' successfully..!'}
                except Exception as e:
                    resp = {
                        'resp': 'You have already joined group  '+group_name+'.'}
                    UserModelGroupsModel.objects.filter(user=py_data.get('user_id'),group=group_id).update(primary=True)#Seting  group which have joining link as given to prmary 
                    print('Exception in join_group : '+str(e))
                else:
                    print('Something wents wrong....!')
            else:
                print('user_group_serializer error : ' +
                      str(user_group_serializer.errors))
                resp = {'resp': 'Error : Serializer Not Vaid...'}
        else:
            resp = {'resp': 'Invalid Link'}

    else:
        resp = {
            'resp': 'only POST request is allowed..!'
        }
    return JsonResponse(resp, content_type='application/json')


# @csrf_exempt
# def save_post(request):
#     if request.method == 'POST':
#         json_data = request.body
#         stream = io.BytesIO(json_data)
#         py_data = JSONParser().parse(stream)
#         print(py_data)
#         user_post_serializer = GroupPostsSerializer(data=py_data)
#         if user_post_serializer.is_valid():
#             try:
#                 if user_post_serializer.save():
#                     resp = {'resp': 'Post is sended successfully..!'}
#                 else:
#                     print('Something wents wrong....!')
#             except Exception as e:
#                 resp = {'resp': 'Exception in save_post : '+str(e)}
#                 print('Exception in save_post : '+str(e))
#         else:
#             print('Serializer Error : '+str(user_post_serializer.errors))
#             resp = {'resp': 'Error : Serializer Not Vaid...'}
#     else:
#         resp = {
#             'resp': 'only POST request is allowed..!'
#         }
#     return JsonResponse(resp, content_type='application/json')


# @api_view(['POST'])
# def save_post(request):
#     if request.method == 'POST':
#         serializer = GroupPostsModel(request.data)
#         print('image == ')
#         print(request.data.get('image'))
#         if serializer.is_valid():
#            serializer.save()
#             resp = {
#                 'resp': 'Post Saved Successfully..!'
#             }
#         else:
#             resp = {
#                 'resp': 'Invalid data...!'
#             }
#         return Response(resp)
#     return Response({'resp': 'Only Post Request is allowed...!'})


@csrf_exempt
def post(request):
    image = request.POST.get('image')
    print(image)
    TempPostModel.objects.create(
        image=image)
    # json_data = request.body
    # stream = io.BytesIO(json_data)
    # py_data = JSONParser().parse(stream)
    # print(py_data)
    # print('Data ==>  ')
    # print(request.body)
    # s = TempPostSerializer(data=py_data)
    # if s.is_valid():
    #     s.save()
    #     resp = {
    #         'resp': 'Post uploaded..!'
    #     }
    # else:
    #     print("serializer errors ===>  ")
    #     print(s.errors)
    #     resp = {
    #         'resp': 'Fail'
    #     }

    resp = {
        'resp': 'Post uploaded using create..!'
    }
    return JsonResponse(resp, content_type='application/json')


# Easy Methods

# class base api view
class FileUploadView(APIView):
    parser_class = (FileUploadParser,)

    def post(self, request, *args, **kwargs):

        file_serializer = TempPostSerializer(data=request.data)

        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# function base api view
@api_view(['POST'])
def temp_save_post(request):
    if request.method == 'POST':
        serializer = TempPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            resp = {
                'msg': 'saved..!'
            }
        else:
            resp = {
                'msg': 'not valid'
            }
        return Response(resp)


@api_view(['POST'])
def save_post(request):
    if(request.method == 'POST'):
        print('data ==> ')
        print(request.data)
        group_posts_serializer = GroupPostsSerializer(data=request.data)
        if group_posts_serializer.is_valid():
            group_posts_serializer.save()
            try:
                post = GroupPostsModel.objects.filter(
                group_id=request.data.get('group_id'), post_type=request.data.get('post_type')).order_by('-time_stamp')[:1]
                comments_count = GroupPostCommentsModel.objects.filter(
                post_id=post[0].id).count()
                print('post id = '+str(post[0].id))
                post_dict = {
                    'post_id': str(post[0].id),
                    'post_text': str(post[0].post_text),
                    'post_type': str(post[0].post_type),
                    'image': str(post[0].image),
                    'document': str(post[0].document),
                    'likes': str(post[0].likes),
                    'group_id': str(post[0].group.id),
                    'user_id': str(post[0].user.id),
                    'time_stamp': str(post[0].time_stamp),
                    'profile_pic': str(post[0].user.profile_pic),
                    'first_name': str(post[0].user.first_name),
                    'last_name': str(post[0].user.last_name),
                    'gender': str(post[0].user.gender),
                    'comments_count': str(comments_count)
                }
                resp = {
                    'resp': 'Post Saved..!',
                    'added_post': post_dict
                }   
                # post_arr_obj.append(post_dict)
            except Exception as e:
                print('save_post exception : '+str(e))
                resp = {
                    'resp': 'An error occure..!'
                }
            
        else:
            print('Error ==> ')
            print(group_posts_serializer.errors)
            resp = {
                'resp': 'invalid data..!'
            }
        return Response(resp)
        # ---------------

        # GroupPostsModel.objects.create(post_text=request.POST.get('post_text'), post_type=request.POST.get('post_type'), image=request.POST.get('image'),
        #                                document=request.POST.get('document'),group_id=request.POST.get('group_id'),)
        # return Response({'resp':'Saved using create'})##Not saving file and image... NOT Work

# @csrf_exempt


@api_view(['GET'])
def get_post(request, group_id, post_type, post_limit):
    if request.method == 'GET':
        print('group id = ')
        print(group_id)
        # data = GroupPostsModel.objects.filter(
        #     group_id=group_id) & GroupPostsModel.objects.filter(post_type=post_type).order_by('-time_stamp')

        try:
            data = GroupPostsModel.objects.filter(
                group_id=group_id, post_type=post_type).order_by('-time_stamp')[post_limit:post_limit+3]
            # data = data[0:3]
            post_arr_obj = []
            for post in data:
                comments_count = GroupPostCommentsModel.objects.filter(
                post_id=post.id).count()
                print('post id = '+str(post.id))
                post_dict = {
                    'post_id': str(post.id),
                    'post_text': str(post.post_text),
                    'post_type': str(post.post_type),
                    'image': str(post.image),
                    'document': str(post.document),
                    'likes': str(post.likes),
                    'group_id': str(post.group.id),
                    'user_id': str(post.user.id),
                    'time_stamp': str(post.time_stamp),
                    'profile_pic': str(post.user.profile_pic),
                    'first_name': str(post.user.first_name),
                    'last_name': str(post.user.last_name),
                    'gender': str(post.user.gender),
                    'comments_count': str(comments_count)
                }
                post_arr_obj.append(post_dict)
        except Exception as e:
            print('get_post exception : '+str(e))

        resp = {
            'resp': post_arr_obj
        }
        # group_post_serializer = GroupPostsSerializer(data, many=True)
        return Response(resp)
    else:
        return Response({'msg': 'Only GET request allowed..!'})


@api_view(['GET'])
def get_user_primary_group(request, user_id):
    if request.method == 'GET':
        print('user_id => ')
        print(user_id)
        data = UserModelGroupsModel.objects.filter(
            user_id=user_id) & UserModelGroupsModel.objects.filter(primary=True)
        user_group_serializer = UserGroupsSerializer(data, many=True)
        print(user_group_serializer.data)
        resp = {
            'resp': user_group_serializer.data
        }
        # return JsonResponse(resp ,safe=False)
        return Response(user_group_serializer.data)
    else:
        return JsonResponse({'msg': 'Only GET request allowed..!'}, safe=False)


@api_view(['PATCH'])
def add_like(request):
    if request.method == 'PATCH':
        print(request.data)
        post_id = request.data.get('post_id')
        print(post_id)
        data = GroupPostsModel.objects.filter(id=post_id)
        print(data)
        for obj in data:
            likes = obj.likes
        likes += 1
        GroupPostsModel.objects.filter(id=post_id).update(likes=likes)
    return Response({'resp': 'Your like is added..!', 'likes': likes})


@api_view(['POST'])
def add_comment(request):
    if request.method == 'POST':
        print('data =====================> ')
        print(request.data)
        print('=================')
        comment_serializer = GroupPostCommentsSerializer(data=request.data)
        if comment_serializer.is_valid():
            comment_serializer.save()
            comment = GroupPostCommentsModel.objects.last()
            user = comment.comment_by_user
            comment_dict = {
                'id': str(comment.id),
                'comment_text': str(comment.comment_text),
                'likes': str(comment.likes),
                'time_stamp': str(comment.time_stamp),
                'post_id_id': str(comment.post_id_id),
                'comment_by_user': str(user.id),
                'first_name': str(user.first_name),
                'last_name': str(user.last_name),
                'profile_pic': str(user.profile_pic),
                'gender': str(user.gender)
            }
            # comment_info.append(comment_dict)

            print('Comment Saved...!')
            resp = {
                'resp': 'Comment is added successfully..!',
                'comment_obj': comment_dict
            }
        else:
            print('serializer error : '+str(comment_serializer.errors))
            resp = {
                'resp': 'Serailizers error : '+str(comment_serializer.errors)
            }
        return Response(resp)
    return Response({'resp': 'Only Post request is allowed..!'})


# @api_view(['GET'])
# def get_post_comments11(request, post_id):
#     if request.method == 'GET':
#         comments = GroupPostCommentsModel.objects.filter(post_id=post_id)
#         comments_serializer = GroupPostCommentsSerializerGetInfo(comments, many=True)
#         print(comments_serializer.data)

#         user_arr_obj = []

#         user = comments[0].comment_by_user
#         user_serializer = GroupPostCommentUserInfoSerializer(user, many=True)
#         user_arr_obj.append(user_serializer.data)

#         print(user_serializer.data)
#         resp = {
#             'comment_obj' : comments_serializer.data,
#             'user_arr_obj' : user_arr_obj
#         }

#         return Response(resp)
#     return Response({'resp':'Only Post request is allowed..!'})


@api_view(['GET'])
def get_post_comments(request, post_id):
    if request.method == 'GET':
        comments = GroupPostCommentsModel.objects.filter(
            post_id=post_id).order_by('-time_stamp')
        # comments_serializer = GroupPostCommentsSerializerGetInfo(comments, many=True)
        # getting user info for each comment
        comment_info = []
        for c in comments:
            replay_count = PostCommentReplayModel.objects.filter(
                comment=c.id).count()
            user = c.comment_by_user
            user_dict = {
                'id': str(c.id),
                'comment_text': str(c.comment_text),
                'likes': str(c.likes),
                'time_stamp': str(c.time_stamp),
                'post_id_id': str(c.post_id_id),
                'comment_by_user': str(user.id),
                'first_name': str(user.first_name),
                'last_name': str(user.last_name),
                'profile_pic': str(user.profile_pic),
                'gender': str(user.gender),
                'replay_count': str(replay_count)
            }
            comment_info.append(user_dict)

        resp = {
            'comments_arr_obj': comment_info
        }
        return Response(resp)
    return Response({'resp': 'Only GET request allowed..!'})


@api_view(['PATCH'])
def add_comment_like(request):
    comment_id = request.data.get('comment_id')
    try:
        data = GroupPostCommentsModel.objects.get(id=comment_id)
        likes = data.likes
        likes = 1 + likes
        GroupPostCommentsModel.objects.filter(
            id=comment_id).update(likes=likes)
        resp = {
            'resp': 'Like is added...!'
        }
    except Exception as e:
        print('An Exception occure : '+str(e))
        resp = {
            'resp': 'An error occure..! Adding like failed..!'
        }
    return Response(resp)


@api_view(['POST'])
def add_comment_replay(request):
    print(request.data)
    serializer = PostCommentReplaySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        rep = PostCommentReplayModel.objects.last()
        user = rep.replay_by_user
        data_dict = {
            'id': str(rep.id),
            'replay_text': str(rep.replay_text),
            'likes': str(rep.likes),
            'time_stamp': str(rep.time_stamp),
            'comment_id': str(rep.comment_id),
            'replay_by_user': str(user.id),
            'first_name': str(user.first_name),
            'last_name': str(user.last_name),
            'profile_pic': str(user.profile_pic),
            'gender': str(user.gender)
        }

        resp = {
            'resp': 'Adding replay successfully...!',
            'replay_obj': data_dict
        }
    else:
        print('adding comment replay failed..! serilizer error : ' +
              str(serializer.errors))
        resp = {
            'resp': 'Adding replay failed...! Invalid data..!'
        }
    return Response(resp)


@api_view(['GET'])
def get_comment_replay(request, comment_id):
    replays = PostCommentReplayModel.objects.filter(
        comment=comment_id)
    # comments_serializer = GroupPostCommentsSerializerGetInfo(comments, many=True)
    # getting user info for each comment
    replay_info = []
    for rep in replays:
        user = rep.replay_by_user
        user_dict = {
            'id': str(rep.id),
            'replay_text': str(rep.replay_text),
            'likes': str(rep.likes),
            'time_stamp': str(rep.time_stamp),
            'comment_id': str(rep.comment_id),
            'replay_by_user': str(user.id),
            'first_name': str(user.first_name),
            'last_name': str(user.last_name),
            'profile_pic': str(user.profile_pic),
            'gender': str(user.gender)
        }
        replay_info.append(user_dict)
        # print(rep.replay_text)

    resp = {
        'replay_arr_obj': replay_info
    }
    return Response(resp)


@api_view(['PATCH'])
def add_replay_like(request):
    replay_id = request.data.get('replay_id')
    try:
        data = PostCommentReplayModel.objects.get(id=replay_id)
        likes = data.likes
        likes = 1 + likes
        PostCommentReplayModel.objects.filter(
            id=replay_id).update(likes=likes)
        resp = {
            'resp': 'Like is added...!'
        }
    except Exception as e:
        print('An Exception occure : '+str(e))
        resp = {
            'resp': 'An error occure..! Adding like failed..!'
        }
    return Response(resp)


@api_view(['PATCH'])
def save_edited_comment(request):
    comment_id = request.data.get('comment_id')
    try:
        GroupPostCommentsModel.objects.filter(id=comment_id).update(
            comment_text=request.data.get('comment_text'))
        resp = {
            'resp': 'Comment Updated successfully...!'
        }
    except Exception as e:
        print(e)
        resp = {
            'resp': 'Comment Update failed...!'
        }
    return Response(resp)


@api_view(['DELETE'])
def delete_comment(request, comment_id):
    # comment_id = request.data.get('comment_id')
    print(comment_id)
    try:
        data = GroupPostCommentsModel.objects.filter(id=comment_id).delete()
        print(data)
        resp = {
            'resp': 'Comment Deleted successfully...!'
        }
    except Exception as e:
        print(e)
        resp = {
            'resp': 'Comment Delete failed...!'
        }
    return Response(resp)


@api_view(['PATCH'])
def save_edited_replay(request):
    replay_id = request.data.get('replay_id')
    try:
        PostCommentReplayModel.objects.filter(id=replay_id).update(
            replay_text=request.data.get('replay_text'))
        resp = {
            'resp': 'replay Updated successfully...!'
        }
    except Exception as e:
        print(e)
        resp = {
            'resp': 'replay Update failed...!'
        }
    return Response(resp)


@api_view(['DELETE'])
def delete_replay(request, replay_id):
    # replay_id = request.data.get('replay_id')
    print(replay_id)
    try:
        data = PostCommentReplayModel.objects.filter(id=replay_id).delete()
        print(data)
        resp = {
            'resp': 'replay Deleted successfully...!'
        }
    except Exception as e:
        print(e)
        resp = {
            'resp': 'replay Delete failed...!'
        }
    return Response(resp)


@api_view(['PATCH'])
def save_edited_post_image(request):
    image = request.data.get('image')
    print('image == ')
    print(request.data.get('image'))
    post_id = request.data.get('post_id')
    print('post id = '+str(post_id))
    im = request.FILES['image']
    print(im)
    try:
        post = GroupPostsModel.objects.get(id=post_id)
        try:
            os.remove(post.image.path)
            print('Old post image deleted...! path = '+str(post.image.path))
        except Exception as e:
            print('No image for delete '+str(e))

        post.image = request.FILES['image']  # Worked..
        image = request.data.get('image')
        #image.name = 'post_image_1203.png'
        #post.image = image
        # image = request.data.get('image')
        # print(image.path)#
        # print(image.url)#
        print(image.name)

        post.save()
        resp = {
            'resp': 'Post image updated...!'
        }
    except Exception as e:
        print(e)
        resp = {
            'resp': 'Error : Post image update failed...!'
        }
    return Response(resp)


@api_view(['PATCH'])
def save_edited_post_document(request):
    print('document == ')
    print(request.data.get('document'))
    post_id = request.data.get('post_id')
    print('post id = '+str(post_id))
    try:
        post = GroupPostsModel.objects.get(id=post_id)
        try:
            os.remove(post.document.path)
            print('Old post document deleted...! path = '+str(post.document.path))
        except Exception as e:
            print('No document for delete '+str(e))

        post.document = request.FILES['document']  # Worked..
        post.save()
        resp = {
            'resp': 'Post document updated...!'
        }
    except Exception as e:
        print(e)
        resp = {
            'resp': 'Error : Post document update failed...!'
        }
    return Response(resp)


@api_view(['PATCH'])
def save_edited_post_text(request):
    post_text = request.data.get('post_text')
    post_id = request.data.get('post_id')
    try:
        GroupPostsModel.objects.filter(id=post_id).update(post_text=post_text)
        resp = {
            'resp': 'Post text updated...!'
        }
    except Exception as e:
        print(e)
        resp = {
            'resp': 'Error : Post text update failed..!'
        }
    return Response(resp)


@api_view(['PATCH'])
def save_edited_post_type(request):
    post_type = request.data.get('post_type')
    post_id = request.data.get('post_id')
    try:
        GroupPostsModel.objects.filter(id=post_id).update(post_type=post_type)
        resp = {
            'resp': 'Post type updated...!'
        }
    except Exception as e:
        print(e)
        resp = {
            'resp': 'Error : Post type update failed..!'
        }
    return Response(resp)


@api_view(['DELETE'])
def delete_post(request, post_id):
    # comment_id = request.data.get('comment_id')
    print(post_id)

    # deleting doc and image from storage
    post = GroupPostsModel.objects.get(id=post_id)
    try:
        os.remove(post.image.path)
        print('Old post image deleted...! path = '+str(post.image.path))
    except Exception as e:
        print('No image for delete '+str(e))

    try:
        os.remove(post.document.path)
        print('Old post document deleted...! path = '+str(post.image.path))
    except Exception as e:
        print('No document for delete '+str(e))
    # deleting doc and image from storage END

    try:
        # data = GroupPostsModel.objects.filter(id=post_id).delete()
        post.delete()
        print(post)
        resp = {
            'resp': 'Post Deleted successfully...!'
        }
    except Exception as e:
        print(e)
        resp = {
            'resp': 'Post Delete failed...!'
        }
    return Response(resp)
