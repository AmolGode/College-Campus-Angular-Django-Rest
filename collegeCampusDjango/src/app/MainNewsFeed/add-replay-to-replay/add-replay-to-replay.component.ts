import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CommentComponent } from '../comment/comment.component';
import { ReplayComponent } from '../replay/replay.component';

@Component({
  selector: 'app-add-replay-to-replay',
  templateUrl: './add-replay-to-replay.component.html',
  styleUrls: ['./add-replay-to-replay.component.css']
})
export class AddReplayToReplayComponent implements OnInit {
  @Input() replay_obj:any={};
  // Global variables...
  post_btn_loding = false;


  constructor(private userService:UserService, private replay:ReplayComponent, private comment:CommentComponent) { }


  ngOnInit(): void {
  }

  add_replay(replay_text:any)
  {
    this.post_btn_loding = true;
    const user_id:any = localStorage.getItem('uid');
    const fd = new FormData();
    fd.append('replay_text',replay_text);
    fd.append('replay_by_user_id',user_id);
    fd.append('comment_id',this.replay_obj.comment_id);

    this.userService.add_comment_replay(fd).subscribe(
      (response:any)=>
      {
        console.log(response);
        this.comment.comment_obj.replay_count++;
        if(this.comment.replay_arr_obj != undefined)
        {
          this.comment.replay_arr_obj.push(response.replay_obj);
        }
        this.post_btn_loding = false;
        
        this.userService.show_add_replay = false;
        // this.comment.replay_show = false;
        this.replay.replay_show = false;
      },
      (error)=>
      {
        this.post_btn_loding = false;
        console.log(error);
      }
    )
  }

}
