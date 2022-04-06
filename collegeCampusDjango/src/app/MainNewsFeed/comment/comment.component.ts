// import { flatten } from '@angular/compiler';
// import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { PostsComponent } from '../posts/posts.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() comment_obj:any;

  // Global Variables
  logged_in_user = localStorage.getItem('uid');
  api_url = this.userService.api_url;
  replay_show = false;
  profile_img_url  = '';
  time_difference:any;
  time:any;
  replay_arr_obj:any;
  replay_msg_loading = false;
  save_edit_btn_loding = false;
  delete_btn_loding = false;

  
  

  constructor(private userService:UserService, private modalService: NgbModal,private post:PostsComponent) { }

  ngOnInit(): void {
    if(this.comment_obj.replay_count == undefined)
    {
      this.comment_obj.replay_count = 0;
    }


    this.profile_img_url = this.api_url+"/media/"+this.comment_obj.profile_pic;
    // console.log("@@@@@===>"+this.comment_obj.profile_pic);

    if(this.comment_obj.profile_pic == '')
    {
      // console.log('null image...!')
      this.profile_img_url = this.api_url+'/media/static/'+this.comment_obj.gender+'_avatar.png';
      // console.log(this.profile_img_url);
    }

    // var date = (new Date(this.comment_obj.time_stamp));
    // this.time = ""+date.getDay()+"/"+date.getMonth()+"/"+date.getFullYear();
    // console.log("time diff : "+this.comment_obj.time_stamp);

    var str:string = ""+this.comment_obj.time_stamp;
    this.time = str.substring(0, 10);



  }

  add_comment_like(comment_id:any)
  {
    console.warn('adding comment like........!')
    this.comment_obj.likes++;
    const fd = new FormData();
    fd.append('comment_id',comment_id);
    this.userService.add_comment_like(fd).subscribe(
      (response:any)=>{
        console.log(response.resp);
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  get_comment_replay(comment_id:number)
  {
    if(this.replay_arr_obj != undefined)
    {
      this.replay_arr_obj = undefined;
      return;
    }
    this.replay_msg_loading = true;
    this.userService.get_comment_replay(comment_id).subscribe(
      (response:any)=>{
        console.log(response);
        this.replay_arr_obj = response.replay_arr_obj;
        this.replay_msg_loading = false;
      },
      (error)=>{
        this.replay_msg_loading = false;
        console.log(error);
      }
    )
  }

  

  replay_toggle()
  {
    this.replay_show = !this.replay_show;
  }

  openVerticallyCentered(content:any) {
    this.modalService.open(content, { centered: true });
  }

  save_edited_comment(comment_text:any)
  {
    this.save_edit_btn_loding = true;
    const fd = new FormData();
    fd.append('comment_text',comment_text);
    fd.append('comment_id',this.comment_obj.id);
    this.userService.save_edited_comment(fd).subscribe(
      (response)=>{
        console.log(response);
        this.comment_obj.comment_text = comment_text;
        this.save_edit_btn_loding = false;
      },
      (error)=>{
        console.log(error);
        this.save_edit_btn_loding = false;
      }
    )
  }

  delete_comment(comment_id:any)
  {
    console.warn('adding delete comment........!')
    this.delete_btn_loding = true;
    // const fd = new FormData();
    // fd.append('comment_id',comment_id);
    this.userService.delete_comment(comment_id).subscribe(
      (response)=>{
        console.log(response);
        this.delete_btn_loding = false;
        this.RemoveElementFromObjectArray(comment_id);

        this.post.userPostObj.comments_count--;
      },
      (error)=>{
        console.log(error);
        this.delete_btn_loding = false;
      }
    )
  }

  RemoveElementFromObjectArray(id: number) 
  {
    this.post.post_comments_obj.forEach((value:any,index:any)=>{
        if(value.id==id) this.post.post_comments_obj.splice(index,1);
    });
  } 

  // bootstrap model code start

  
  
  // bootstrap model code end
}