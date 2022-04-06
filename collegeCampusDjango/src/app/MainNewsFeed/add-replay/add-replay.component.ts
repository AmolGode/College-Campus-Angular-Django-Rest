import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-add-replay',
  templateUrl: './add-replay.component.html',
  styleUrls: ['./add-replay.component.css']
})
export class AddReplayComponent implements OnInit {
  @Input() comment_obj:any={};

  // Global Variables
  replay_notification_show = false;
  autohide = true;
  notification_message = '';
  durationInSeconds = 2;
  post_btn_loding = false;

  constructor(private userService:UserService, private comment:CommentComponent) { }

  ngOnInit(): void {
  }

  add_replay(replay_text:any)
  {
    this.post_btn_loding = true;
    const user_id:any = localStorage.getItem('uid');
    const fd = new FormData();
    fd.append('replay_text',replay_text);
    fd.append('replay_by_user_id',user_id);
    if(this.comment_obj.comment_id == undefined)// means replaying to replay...!
    {
      fd.append('comment_id',this.comment_obj.id);//When comment_obj is comment_obj (user for replay to comment...!)
    }else{
      fd.append('comment_id',this.comment_obj.comment_id);//when comment_obj is replay_obj (user for replay to replay)
    }
    

  
    console.log(this.comment_obj);

    this.userService.add_comment_replay(fd).subscribe(
      (response:any)=>
      {
        console.log(response);
        if(this.comment_obj.replay_count != undefined)//replay_obj does not have replay_count only comment_obj have...!
        this.comment_obj.replay_count++;
        if(this.comment.replay_arr_obj != undefined)
        {
          this.comment.replay_arr_obj.push(response.replay_obj);
        }
        this.post_btn_loding = false;
        this.userService.show_add_replay = false;
        this.comment.replay_show = false;
        // this.replay.replay_show = false;
      },
      (error)=>
      {
        this.post_btn_loding = false;
        console.log(error);
      }
    )
  }


  // replay_text = serializers.CharField(max_length=1000)
  //   time_stamp = serializers.DateTimeField(auto_now=True)
  //   replay_by_user = serializers.IntegerField()
  //   replay_to_user = serializers.CharField(max_length=20)
  //   comment_id = serializers.IntegerField()

  show_notification(message:string)
  {
    this.replay_notification_show = true;
    this.notification_message = message;
  }

  close_notification()
  {
    this.replay_notification_show = false;
  }
}