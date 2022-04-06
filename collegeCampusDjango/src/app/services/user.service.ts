import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Global Variables
  api_url = 'http://127.0.0.1:8000';
  base_url = 'http://127.0.0.1:8000';
  show_add_replay:any;
  
  constructor(private http : HttpClient) { }

  create_user(data:any)
  {
    return this.http.post(this.base_url+'/user_api/create_user/',data)
  }
  login_user(data:any)
  {
    return this.http.get(this.base_url+'/user_api/login_user/'+data.user_id+'/'+data.user_password+'/')
  }
  get_profile_info(uid:any)
  {
    return this.http.get(this.base_url+'/user_api/get_profile_info/'+uid);
  }

  save_edited_profile(data:any)
  {
    return this.http.put(this.base_url+'/user_api/save_edited_profile/',data);
  }

  delete_profile(post_id:any)
  {
    return this.http.delete(this.base_url+'/user_api/delete_profile/'+post_id);
  }

  // *********groups_api

  save_post(data:any)
  {
    return this.http.post(this.base_url+'/groups_api/save_post/',data);
  }
  
  get_post(group_id:any,post_type:any,post_limit:any)
  {
    return this.http.get(this.base_url+'/groups_api/get_post/'+group_id+'/'+post_type+'/'+post_limit);
  }
  join_group(data:any)
  {
    return this.http.post(this.base_url+'/groups_api/join_group/',data);
  }
  create_group(data:any)
  {
    return this.http.post(this.base_url+'/groups_api/create_group/',data);
  }
  get_group_list(user_id:any)
  {
    return this.http.get(this.base_url+'/groups_api/get_group_list/'+user_id);
  }
  
  get_user_type(user_id:any, group_id:any)
  {
    return this.http.get(this.base_url+'/groups_api/get_user_type/'+user_id+'/'+group_id);
  }
  set_primary_group(data:any)
  {
    return this.http.patch(this.base_url+'/groups_api/set_primary_group/',data);
  }
  delete_group_member(data:any)
  {
    return this.http.put(this.base_url+'/groups_api/delete_group_member/',data);
  }
  delete_group_admin(data:any)
  {
    return this.http.put(this.base_url+'/groups_api/delete_group_admin/',data);
  }
  save_edited_post_image(data:any)
  {
    return this.http.patch(this.base_url+'/groups_api/save_edited_post_image',data);
  }
  save_edited_post_document(data:any)
  {
    return this.http.patch(this.base_url+'/groups_api/save_edited_post_document',data);
  }
  save_edited_post_text(data:any)
  {
    return this.http.patch(this.base_url+'/groups_api/save_edited_post_text',data);
  }
  save_edited_post_type(data:any)
  {
    return this.http.patch(this.base_url+'/groups_api/save_edited_post_type',data);
  }
  delete_post(post_id:any)
  {
    return this.http.delete(this.base_url+'/groups_api/delete_post/'+post_id);
  }
  add_like(data:any)
  {
    return this.http.patch(this.base_url+'/groups_api/add_like',data);
  }
  get_post_comments(post_id:any)
  {
    return this.http.get(this.base_url+'/groups_api/get_post_comments/'+post_id);
  }
  add_replay_like(data:any)
  {
    return this.http.patch(this.base_url+'/groups_api/add_replay_like',data);
  }
  save_edited_replay(data:any)
  {
    return this.http.patch(this.base_url+'/groups_api/save_edited_replay',data);
  }
  delete_replay(post_id:any)
  {
    return this.http.delete(this.base_url+'/groups_api/delete_replay/'+post_id);
  }

  add_comment_like(data:any)
  {
    return this.http.patch(this.base_url+'/groups_api/add_comment_like',data);
  }
  get_comment_replay(comment_id:any)
  {
    return this.http.get(this.base_url+'/groups_api/get_comment_replay/'+comment_id);
  }
  save_edited_comment(data:any)
  {
    return this.http.patch(this.base_url+'/groups_api/save_edited_comment',data);
  }
  delete_comment(comment_id:any)
  {
    return this.http.delete(this.base_url+'/groups_api/delete_comment/'+comment_id);
  }

  add_comment_replay(data:any)
  {
    return this.http.post(this.base_url+'/groups_api/add_comment_replay',data);
  }
  add_comment(data:any)
  {
    return this.http.post(this.base_url+'/groups_api/add_comment',data);
  }



}
