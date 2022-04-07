import { Component, OnInit } from '@angular/core';

import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { UserDataService } from 'src/app/services/user-data.service';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { ToastService } from 'src/app/services/toast-service.service';
import { MyErrorStateMatcher } from 'src/app/UserAccount/signup/signup.component';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';//for navigate to other components

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private mediaObserver: MediaObserver, private userService: UserService,
    private userDataService: UserDataService, private modalService: NgbModal, config: NgbModalConfig, private _snackBar: MatSnackBar, private router : Router) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  editProfileForm:FormGroup = this.formBuilder.group({
    first_name : new FormControl('',[Validators.required]),
    last_name : new FormControl('',[]),
    college_name :new FormControl('',[]),
    // faculty:new FormControl('',[]),
    gender : new FormControl('',[]),
    // email : new FormControl('',[ ]),
    user_id:new FormControl('',[]),
    user_password:new FormControl('',[ ]),
    confirm_password:new FormControl('',[ ])
  });

  createGroupForm: FormGroup = this.formBuilder.group({
    group_name: new FormControl(),
    group_description: new FormControl()
  });

  savePostForm: FormGroup = this.formBuilder.group({
    image: new FormControl(),
    document: new FormControl(),
    post_text: new FormControl(),
    post_type: new FormControl(),
  });

  joinGroupForm: FormGroup = this.formBuilder.group({
    group_joining_link: new FormControl('', [Validators.required])
  });



  tempPostForm: FormGroup = this.formBuilder.group({
    image: new FormControl()
  });

  file: any;;
  fileSelected(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
  }

  temp_post(data: any) {
    console.log('data ==>' + data);
    const fd = new FormData();
    fd.append('image', data, data.name);
    const d = {
      'image': this.file
    }
    this.userService.save_post(fd).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();




  // Global variable...
  userProfileInfo:any;
  groupList: any;
  group_list_count: number = 0;
  spinner: boolean = false;
  group_list_loader: boolean = false;
  userPost: any = new Array();
  primaryGroupId: any;
  postType = 'Study Post';
  post_loader = false;
  profile_pic_url='';
  api_url = this.userService.api_url;
  hide = true;//passwprd
  c_hide = true;//comfirm password
  // primary_group = '';
  primary_group_user_type = '';
  edit_profile_loader = false;
  delete_profile_loader = false;
  post_limit = 0;
  Entered_Text="";

  primary_group_obj:any;

  mediaSub: any;
  deviceIsXsOrSm: boolean = false;
  sidebarMode: any = 'side';
  opened = true;


  myControl = new FormControl();
  options: string[] = ['MCA', 'BSA', 'MSC-CS vc'];
  filteredOptions:any;

  


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  ngOnInit() {

    this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      console.log(result.mqAlias);
      this.deviceIsXsOrSm = result.mqAlias === 'xs' || result.mqAlias === 'sm' ? true : false;
      if (result.mqAlias === 'xs' || result.mqAlias === 'sm') {
        this.sidebarMode = 'over'
        this.opened = false;
      } else {
        this.sidebarMode = 'side'
        this.opened = true;
      }

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      );
    });
    

    // get primary group of user
    // this.get_user_primary_group();

    //       load group list
    this.get_group_list();
 
    //     get profile info
    this.get_profile_info();

    // Getting Post
    // this.get_group_post(this.postType);

  }


  selected_profile_pic = this.profile_pic_url;
  selected_pic:any;
  onFileSelectProfilePic(event:any)
  {
    console.log(event);
    if(event.target.files)
    {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event:any)=>{
        this.profile_pic_url = event.target.result;
      }
    }
    this.profile_pic_url = this.selected_pic =  event.target.files[0];
  }


  editProfile(data:any)
  {
    this.edit_profile_loader = true;
    console.log(data);
    const uid:any = localStorage.getItem('uid');
    const fd = new FormData()
    fd.append('id',uid);
    // fd.append('profile_pic',this.profile_pic_url);
    if (this.selected_pic != undefined) {
      fd.append('profile_pic', this.selected_pic, this.selected_pic.name);
    }
    fd.append('first_name',data.first_name);
    fd.append('last_name',data.last_name);
    fd.append('college_name',data.college_name);
    fd.append('user_id',data.user_id);
    fd.append('gender',data.gender);
    fd.append('user_password',data.user_password);

    this.userService.save_edited_profile(fd).subscribe(
      (response)=>{
        console.log(response);
        this.edit_profile_loader = false;
      },
      (error)=>{
        console.log(error);
        this.edit_profile_loader = false;
      }
    )
  }

  delete_profile()
  {
    this.delete_profile_loader = true;
    const uid = localStorage.getItem('uid');
    console.warn('deleting user : '+uid);
    this.userService.delete_profile(uid).subscribe(
      (response:any)=>{
        console.warn(response);
        localStorage.clear();
        this.router.navigate(['/signin']);
      },
      (error:any)=>{
        console.warn(error);
      }
      );
    this.delete_profile_loader = false;
  }

  get_group_post(post_type: any) {
    // this.spinner = true;
    if(this.primaryGroupId == undefined)
    {
      this.openSnackBar('No primary group found..! Please join to group using joining link..!','OK');
      return;
    }
    this.post_loader = true;
    const group_id: any = this.primaryGroupId;
    if(this.postType !== post_type)
    {
      this.userPost = [];
      this.post_limit = 0;
    }
    this.postType = post_type;
    console.log('groupp id ==>' + group_id);
    console.log('post type : ' + post_type);
    console.log('post limit : ' + this.post_limit);
    
    this.userService.get_post(group_id, post_type,this.post_limit).subscribe(
      (response:any) => {
        // this.userPost.push(response.resp[0]);
        console.warn("posts : "+response.resp);
        let posts = response.resp;
        console.warn('old post ob length = '+this.userPost.length);
        if(this.userPost.length == 0)
        {
          // console.warn("yes");
          this.userPost = response.resp;
        }else
        {
          console.warn("pushing post  object..");
          for(let i = 0 ; i < posts.length ; i++)
          {
            console.log(posts[i]);
            this.userPost.push(posts[i]);
          }
        }
        
        this.spinner = false;
        this.post_loader = false;
        if(posts.length == 0)
        {
          this.openSnackBar('No more post found..!','OK');
        }else
        {
          this.post_limit += posts.length;
        }
        
      },
      (error) => {
        this.spinner = false;
        this.post_loader = false;
        this.openSnackBar('An server error otccured..!', 'Error,OK');
        console.log(error);
      }
    )
  }

  // get_latest_post(post_type:any)
  // {
  //   this.post_loader = true;
  //   const group_id: any = this.primaryGroupId;
    
  //   this.postType = post_type;
  //   console.log('========>' + group_id);
  //   console.log('post type : ' + post_type);
  //   this.userService.get_latest_post(group_id, post_type,this.post_limit).subscribe(
  //     (response:any) => {
  //       this.userPost.push(response.resp);
        
  //       this.spinner = false;
  //       this.post_loader = false;
  //       this.post_limit++;
               
  //     },
  //     (error) => {
  //       this.spinner = false;
  //       this.post_loader = false;
  //       this.openSnackBar('An server error occured..!', 'Error,OK');
  //       console.log(error);
  //     }
  //   )
  // }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  joinGroup(data: any) {
    const data_obj = {
      'group_joining_link': data.group_joining_link,
      'user_id': localStorage.getItem('uid')
    }
    this.userService.join_group(data_obj).subscribe(
      (response) => {
        console.log(response);
        const obj: any = response;
        this.openSnackBar(obj.resp, 'OK');
        // this.get_user_primary_group();
        this.get_group_list();

      },
      (error) => {
        console.log(error);
      }
    )
  }

  createGroup(data: any) {
    this.spinner = true;
    console.warn(data)
    const data_obj = {
      'group_name': data.group_name,
      'group_description': data.group_description,
      'group_joining_link': data.group_name,
      'user_id': localStorage.getItem('uid'),
      'user_type': 'Admin'
    }

    return this.userService.create_group(data_obj).subscribe(
      (response) => {
        console.warn(response);
        const obj: any = response;
        this.openSnackBar(obj.resp, 'OK');
        // this.get_user_primary_group();
        this.spinner = false;
        this.get_group_list();
      },
      (error) => {
        console.warn(error);
        this.spinner = false;
      }
    );
  }


  //   load group list
  get_group_list() {
    this.group_list_loader = true;

    const uid = localStorage.getItem('uid');
    this.userService.get_group_list(uid).subscribe((response:any)=>{
        console.warn('goup list : ' + response);
        this.groupList = response.group_list;
        this.group_list_count = this.groupList.length;
        // this.get_group_list_count();
        this.group_list_loader = false;
        for(let i = 0 ; i < this.group_list_count ; i++)
        {
          if(this.groupList[i].primary == 'True')
          {
            // this.primary_group = this.groupList[i].group_name;
            // this.primary_group_user_type = this.groupList[i].user_type;
            this.primaryGroupId = this.groupList[i].group_id;
            this.primary_group_obj = this.groupList[i];
          }
        }
        console.log("primary grp id : "+this.primaryGroupId);
        if(this.primaryGroupId != undefined)
        {
          this.userPost = [];//**
          this.post_limit = 0;//** */
          
          this.get_group_post(this.postType);
        }

        
        // this.groupList.forEach((element: any) => {
        //   console.log(element);
        //   if(element.primary)
        //   {
        //     console.log('Primary ==> '+element.group_name);
        //   }
        // });

      },(error:any) => {
        console.warn('group list error : '+error);
        this.group_list_loader = false;
      }
    );
  }

 

  // get user primary group
  // get_user_primary_group() {
  //   const user_id: any = localStorage.getItem('uid');
  //   this.userService.get_user_primary_group(user_id).toPromise().then(response => {
  //     const primary_grp: any = response;
  //     console.log(response);
  //     // console.log('===='+primary_grp.length());
  //     console.log('====='+primary_grp.length);
  //     if(primary_grp.length > 0) 
  //     {
  //       this.primaryGroupId = primary_grp[0].group_id;
  //       // localStorage.setItem('primaryGroupId',this.primaryGroupId);
  //       console.log('primary group : ' + response);
  //       console.log('primary group ==> ' + this.primaryGroupId);
  //       this.get_group_post(this.postType);
  //     } else 
  //     {
  //       this.openSnackBar('No post found..!','OK');
  //       return;
  //     }

  //   }).catch(error => {
  //     console.log(error);
  //   })
  //   // this.userService.get_user_primary_group(user_id).subscribe(
  //   // (response)=>{
  //   //   const primary_grp:any = response;
  //   //   this.primaryGroupId = primary_grp[0].user_id;
  //   //   console.log('primary group : '+response);
  //   //   console.log('primary group ==> '+this.primaryGroupId);
  //   //   },
  //   //   (error)=>{
  //   //     console.log(error);
  //   //   }
  //   // )
  // }


  //  get profile info
  get_profile_info() {
    this.userService.get_profile_info(localStorage.getItem('uid')).subscribe(
      (response:any) => {
        console.warn("profile info : "+response.gender);
        this.userProfileInfo = response;
        // userProfileInfo[0] : [0] removed - 3
        if(this.userProfileInfo.profile_pic == null)
        {
          this.profile_pic_url = this.api_url+this.profile_pic_url+'/media/static/'+this.userProfileInfo.gender+'_avatar.png';
        }else
        {
          this.profile_pic_url = this.api_url+this.userProfileInfo.profile_pic;
        }
        console.log('pic url =='+this.profile_pic_url);
      },
      (error) => {
        console.warn(error);
      }
    );
  }

  sidebarToggle() {
    this.opened = !this.opened;
  }

  // bootstrap model code start
  closeResult = '';
  open(content: any) {
    console.log('content Type ===> ' + typeof (content))
    if (this.deviceIsXsOrSm) {
      this.sidebarToggle();
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // bootstrap model code end

  groupInfo: any;
  group_info_loding = false;
  get_group_info(group_obj: any) {
    this.group_info_loding = true;

    this.groupInfo = group_obj;
    this.group_info_loding = false;


    // this.userService.get_group_info(group_name).subscribe(
    //   (response) => {
    //     this.groupInfo = response;
    //     console.log('Group Info : ' + this.groupInfo[0].id);
    //     const user_id = localStorage.getItem('uid');
    //     this.myFun(user_id, this.groupInfo[0].id);
    //     this.group_info_loding = false;
    //   },
    //   (error) => {
    //     this.group_info_loding = false;
    //     console.log(error);
    //     this.openSnackBar('An error occure..!', 'Error,OK');
    //   }
    // );
  }

  myFun(uid: any, gid: any) {
    this.get_user_type(uid, gid);
  }
  user_type: any;
  obj: any;
  get_user_type(user_id: any, group_id: any) {
    this.userService.get_user_type(user_id, group_id).subscribe(
      (response) => {
        this.obj = response;
        console.log(this.obj);
        console.log('user type obj : ' + this.obj[0].user_type);
        this.user_type = this.obj[0].user_type;
        // console.log('user type : '+this.obj)

      },
      (error) => {
        console.log('user type error' + error);
        this.openSnackBar("Sorry an error occur." + error, 'OK');
      }
    );
  }

  set_primary_group(group_id: number, group_name: string) {
    this.spinner = true;
    console.log('setting primary ' + group_id);
    const user_id = localStorage.getItem('uid');
    const data = {
      'user_id': user_id,
      'group_id': group_id
    };
    this.userService.set_primary_group(data).subscribe(
      (response) => {
        console.log(response);
        this.primaryGroupId = group_id;

        this.userPost = [];//added**
        this.post_limit = 0;//** */

        this.get_group_post(this.postType);
        this.openSnackBar(group_name + " is set to primary.", 'OK');
        this.get_group_list();
        this.spinner = false;
      },
      (error) => {
        console.log(error);
        this.openSnackBar("Sorry an error occur." + error, 'OK');
        this.spinner = false;
      }
    );


  }

  delete_group_member(group_id: number, group_name: string, user_type: string) {
    this.spinner = true;
    const user_id = localStorage.getItem('uid');
    const data = {
      'user_id': user_id,
      'group_id': group_id
    };
    console.warn(user_type)
    if (user_type === 'Admin') {
      console.warn('deleting admin..');
      this.delete_group_admin(data, group_name);
      return;
    }
    
    this.userService.delete_group_member(data).subscribe(
      (response) => {
        console.log(response);
        //       load group list
        this.openSnackBar("You are no longer member of " + group_name + ".", 'OK');
        // this.userPost = undefined;

        
        if(group_id == this.primaryGroupId)
        {
          console.log("YESYES....!")
          this.primaryGroupId = undefined;
          this.userPost = null;
        }
        this.spinner = false;
        this.get_group_list();
      },
      (error) => {
        console.log(error);
        this.openSnackBar("Sorry an error occur." + error, 'OK');
        this.spinner = false;
      }
    );
  }

  delete_group_admin(data: any, group_name: string) {

    this.userService.delete_group_admin(data).subscribe(
      (response) => {
        console.log(response);
        //       load group list
        this.getDismissReason('cancel click');
        this.openSnackBar("The " + group_name + " is deleted successfully.", 'OK');

        if(data.group_id == this.primaryGroupId)
        {
          this.primaryGroupId = undefined;
          this.userPost = null;
        }
        this.spinner = false;
        this.get_group_list();

      },
      (error) => {
        console.log(error);
        this.openSnackBar("Sorry an error occur." + error, 'OK');
        this.spinner = false;
      }
    );
  }

  logout()
  {
    localStorage.clear();
    this.router.navigate(['/signin']);
  }

  image: any;
  onImageChange(event: any) {
    this.image = event.target.files[0];
  }
  document: any;
  onDocumentChange(event: any) {
    this.document = event.target.files[0];
  }


  save_post(data: any) {
    this.spinner = true;
    console.warn('post text : '+data.post_text);
    console.warn('post type : '+data.post_type);
    if( data.post_text == "")// data.post_text == null 
    {
      this.openSnackBar('Post Text Should not be empty..!','OK');
      this.spinner = false;
      return;
    }
    if(data.post_type == null)
    {
      this.openSnackBar('Please select the post type..!','OK');
      this.spinner = false;
      return;
    }
    
    const group_id: any = this.primaryGroupId;
    const formData = new FormData();
    formData.append('post_text', data.post_text);
    formData.append('post_type', data.post_type);
    formData.append('group_id', group_id);
    const user_id:any = localStorage.getItem('uid');
    formData.append('user_id',user_id);

    if (this.image != undefined) {
      formData.append('image', this.image, this.image.name);
    }

    if (this.document != undefined) {
      formData.append('document', this.document, this.document.name);
    }

    this.image = undefined;
    this.document = undefined;

    this.userService.save_post(formData).subscribe(
      (response: any) => {
        this.spinner = false;
        this.Entered_Text = "";
        this.openSnackBar('' + response.resp, 'OK');
        console.log(response);
        if(this.postType == response.added_post.post_type)
          {
            this.userPost.push(response.added_post);
            this.post_limit++;
          }
      },
      (error:any) => {
        this.spinner = false;
        this.openSnackBar('' + error, 'Error,OK');
        console.log(error);
      }
    )
  }



  ngOnDestroy() {

  }

}
