import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { NewsFeedComponent } from '../news-feed/news-feed.component';

import { FormsModule } from '@angular/forms';

// @NgModule({
//     imports: [
//          FormsModule      
//     ]})

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  @Input() userPostObj:any={};
  
  constructor(private userService:UserService, private modalService: NgbModal,private formBuilder: FormBuilder,private newsFeed: NewsFeedComponent) { }
  // Global Variables
  logged_in_user = localStorage.getItem('uid');
  api_url = this.userService.api_url;
  img_url = '';
  doc_url = '';
  documentExtension = '';
  profile_img_url = '';

  haveImage = true;
  haveDocument = true;
  post_likes = 0;
  post_comments_obj:any;
  comment_loader = false;
  primary_group_obj = this.newsFeed.primary_group_obj;

  edited_post_text_loader = false;
  edited_post_type_loader = false;
  delete_post_loader = false;
  edited_post_image_loader = false;
  edited_post_document_loader = false;


  editPostForm: FormGroup = this.formBuilder.group({
    image: new FormControl(),
    document: new FormControl(),
    post_text: new FormControl(),
    post_type: new FormControl(),
  });
  

  ngOnInit(): void {

    this.profile_img_url = this.api_url+"/media/"+this.userPostObj.profile_pic;
    if(this.userPostObj.profile_pic == '')
    {
      this.profile_img_url = this.api_url+'/media/static/'+this.userPostObj.gender+'_avatar.png';
    }
    this.post_likes = this.userPostObj.likes;

    console.log('Likes ===> '+this.userPostObj.likes);

    this.img_url = this.api_url+"/media/"+this.userPostObj.image;
    this.doc_url = this.api_url+"/media/"+this.userPostObj.document;


    if(this.userPostObj.image == '')
    {
      this.haveImage = false;
    }
    if(this.userPostObj.document == '')
    {
      this.haveDocument = false;
    }else
    {
      const index = this.doc_url.lastIndexOf('.');
      this.documentExtension = this.doc_url.substring(index);
    }
    // console.log('======> URL'+this.api_url+this.userPostObj.image);
    // if(this.userPostObj != undefined)
    // {
    //   this.url = this.api_url+this.userPostObj.image;
    // }

  }

  // download_file(fileName:any) 
  //   {
  //     const EXT = fileName.substr(fileName.lastIndexOf('.') + 1);
  //     this.userService.download_file({ 'fileName': fileName})
  //     .subscribe(data => {
  //       //save it on the client machine.
  //       saveAs(new Blob([data], {type: MIME_TYPES[EXT]}), fileName);
  //     })
  
  //   }

  // Copy paste
  // scrolable model

  openScrollableContent(longContent:any) {
    this.modalService.open(longContent, { scrollable: true });
  }

  // end copy paste

  image: any;
  onImageChange(event: any) {
    this.image = event.target.files[0];
  }
  document: any;
  onDocumentChange(event: any) {
    this.document = event.target.files[0];
  }

  save_edited_post_image()
  {
    this.edited_post_image_loader = true;
    const fd = new FormData();
    fd.append('post_id',this.userPostObj.post_id);
    console.log("image : "+this.image);
    if (this.image != undefined) 
    {
      fd.append('image', this.image,this.image.name);
    }else
    {
      console.log('No image is selected....!');
      this.edited_post_image_loader = false;
      return;
    }

    this.userService.save_edited_post_image(fd).subscribe(
      (response)=>
      {
        console.log(response);
        this.edited_post_image_loader = false;
      },
      (error)=>
      {
        console.log(error);
        this.edited_post_image_loader = false;
      }
    )
  }

  save_edited_post_document()
  {
    this.edited_post_document_loader = true; 
    const fd = new FormData();
    fd.append('post_id',this.userPostObj.post_id);
    console.log("document : "+this.document);
    if (this.document != undefined) 
    {
      fd.append('document', this.document,this.document.name);
    }else
    {
      console.log('No document is selected....!');
      this.edited_post_document_loader = false;
      return;
    }

    this.userService.save_edited_post_document(fd).subscribe(
      (response)=>
      {
        console.log(response);
        this.edited_post_document_loader = false;
      },
      (error)=>
      {
        this.edited_post_document_loader = false;
        console.log(error);
      }
    )
  }

  save_edited_post_text(post_text:any)
  {
    this.edited_post_text_loader = true;
    console.log(post_text);
    const fd = new FormData();
    fd.append('post_text',post_text);
    fd.append('post_id',this.userPostObj.post_id)
    this.userService.save_edited_post_text(fd).subscribe(
      (response)=>
      {
        console.log(response);
        this.userPostObj.post_text = post_text;
        this.edited_post_text_loader = false;
      },
      (error)=>
      {
        this.edited_post_text_loader = false;
        console.log(error);
      }
    )
  }


  save_edited_post_type()
  {
    this.edited_post_type_loader = true;
    console.log("Edited post type : "+this.userPostObj.post_type);
    const post_type = this.userPostObj.post_type;
    const fd = new FormData();
    fd.append('post_type',post_type);
    fd.append('post_id',this.userPostObj.post_id)
    this.userService.save_edited_post_type(fd).subscribe(
      (response)=>
      {
        console.log(response);
        this.userPostObj.post_type = post_type;
        this.edited_post_type_loader = false;
      },
      (error)=>
      {
        console.log(error);
        this.edited_post_type_loader = false;
      }
    )

  }

  delete_post()
  {
    this.newsFeed.spinner = true;
    this.delete_post_loader = true;
    this.userService.delete_post(this.userPostObj.post_id).subscribe(
      (response)=>
      {
        console.log(response);
        this.RemoveElementFromObjectArray(this.userPostObj.post_id);
        this.delete_post_loader = false;
        this.newsFeed.spinner = false;
      },
      (error)=>
      {
        console.log(error);
        this.delete_post_loader = false;
        this.newsFeed.spinner = false;
      }
    )

  }

  RemoveElementFromObjectArray(id: number) 
  {
    this.newsFeed.userPost.forEach((value:any,index:any)=>{
        if(value.post_id==id) this.newsFeed.userPost.splice(index,1);
    });
  }



  add_like(post_id:any) 
  {
    this.post_likes++;
    const fd = new FormData()
    fd.append('post_id',post_id)
    this.userService.add_like(fd).subscribe(
      (response:any)=>{
        // this.post_likes = response.likes;
        console.log(response);
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  get_post_comments(post_id:any)
  {
    this.comment_loader = true;
    this.userService.get_post_comments(post_id).subscribe(
      (response:any)=>{
        this.post_comments_obj = response.comments_arr_obj;
        this.comment_loader = false;
        console.log('comments ==>'+response)
      },
      (error)=>{
        this.comment_loader = false;
        console.log(error);
      }
    )
  }


}
