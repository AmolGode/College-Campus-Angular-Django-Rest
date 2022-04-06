import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { CommentComponent } from '../comment/comment.component';
import { PostsComponent } from '../posts/posts.component';

@Component({
  selector: 'app-replay',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.css']
})
export class ReplayComponent implements OnInit {
  @Input() replay_obj:any;

  constructor(private userService:UserService, private modalService: NgbModal,private comment:CommentComponent) { }

  // Global Variable
  logged_in_user = localStorage.getItem('uid');
  profile_img_url = '';
  replay_show = false;
  api_url = this.userService.api_url;
  save_edit_btn_loding = false;
  delete_btn_loding = false;

  

  ngOnInit(): void 
  {
    this.profile_img_url = this.api_url+"/media/"+this.replay_obj.profile_pic;
    // console.log("@@@@@===>"+this.replay_obj.profile_pic);

    if(this.replay_obj.profile_pic == '')
    {
      // console.log('null image...!')
      this.profile_img_url = this.api_url+'/media/static/'+this.replay_obj.gender+'_avatar.png';
      // console.log(this.profile_img_url);
    }

  }


  add_replay_like(replay_id:any)
  {
    this.replay_obj.likes++;
    const fd = new FormData();
    fd.append('replay_id',replay_id);
    this.userService.add_replay_like(fd).subscribe(
    (response:any)=>{
      console.log(response)
    },
    (error)=>{
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

  save_edited_replay(replay_text:any)
  {
    this.save_edit_btn_loding = true;
    const fd = new FormData();
    fd.append('replay_text',replay_text);
    fd.append('replay_id',this.replay_obj.id);
    this.userService.save_edited_replay(fd).subscribe(
      (response)=>{
        console.log(response);
        this.replay_obj.replay_text = replay_text;
        this.save_edit_btn_loding = false;
      },
      (error)=>{
        console.log(error);
        this.save_edit_btn_loding = false;
      }
    )
  }

  delete_replay(replay_id:any)
  {
    this.delete_btn_loding = true;
    // const fd = new FormData();
    // fd.append('replay_id',replay_id);
    this.userService.delete_replay(replay_id).subscribe(
      (response)=>{
        console.log(response);
        this.delete_btn_loding = false;
        this.RemoveElementFromObjectArray(replay_id);

        this.comment.comment_obj.replay_count--;
      },
      (error)=>{
        console.log(error);
        this.delete_btn_loding = false;
      }
    )
  }

  RemoveElementFromObjectArray(id: number) 
  {
    this.comment.replay_arr_obj.forEach((value:any,index:any)=>{
        if(value.id==id) this.comment.replay_arr_obj.splice(index,1);
    });
  } 

}
