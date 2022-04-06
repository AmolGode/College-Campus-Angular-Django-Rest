import { Component, Input, OnInit, TemplateRef } from '@angular/core';
// import { ToastService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { PostsComponent } from '../posts/posts.component';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  @Input() post_obj:any={};

  // Global Variables
  comment_notification_show = false;
  // autohide = true;
  notification_message = '';
  // durationInSeconds = 2;
  post_btn_loding = false;

  constructor(private userService:UserService,  public post:PostsComponent) { }

  ngOnInit(): void {
  }

  show_notification(message:string)
  {
    this.comment_notification_show = true;
    this.notification_message = message;
  }

  close_notification()
  {
    this.comment_notification_show = false;
  }





  add_comment(comment_text:any)
  {
    const comment = comment_text;
    this.post_btn_loding = true;
    const user_id:any = localStorage.getItem('uid');
    const fd = new FormData()
    fd.append('comment_text',comment)
    fd.append('comment_by_user_id',user_id)
    fd.append('post_id_id',this.post_obj.post_id);
    console.log('Comment adding : '+comment);
    this.userService.add_comment(fd).subscribe(
      (response:any)=>{
        this.post_btn_loding = false;
        console.log('Comment resp '+response.resp);
        this.show_notification(response.resp);  
        console.log("Added comment : "+response.comment_obj.first_name);
        this.post.post_comments_obj.unshift(response.comment_obj);
        this.post_obj.comments_count++;
        
      },
      (error)=>
      {
        console.log('Error : '+error);
      }
    )
  }

}
