import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UserDataService } from 'src/app/services/user-data.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private formbuilder :FormBuilder, private userService : UserService, private userDataService:UserDataService , private router : Router ,private _snackBar: MatSnackBar) { }

  loginForm:FormGroup = this.formbuilder.group({
    user_id:new FormControl('amol_gode@17'),
    user_password:new FormControl('12341234'),
  });

  ngOnInit(): void {
  }

  hide=true;
  // c_hide = true;

spinnerFlag = false;
result:any;
loginData(data:any)
{
  console.warn(data);
  this.spinnerFlag = true;
    const data_obj = 
    {
       'user_id':data.user_id,
       'user_password':data.user_password
    }
    return this.userService.login_user(data_obj).subscribe((response:any)=>
      {
        this.spinnerFlag = false;
        this.result = response;
        console.warn(response);
        console.warn(this.result.data);
        if(this.result.resp == 'valid')
        {
          this._snackBar.open("Login Successfully...!","Ok");
          
          this.userDataService.userAccountDetails = this.result.data;
          
          const uid = this.userDataService.userAccountDetails.id;
          localStorage.setItem('uid',uid);
          localStorage.setItem('logged_in','yes');
          // console.warn("First Name : "+this.result.first_name)
          // console.warn(this.userDataService.userAccountDetail.first_name);
          this.router.navigate(['/news-feed']);
        }else
        {
          this._snackBar.open("Login Fail : Please Enter Valid login details :(","Close");
        }

      },
      (error:any)=>{
        this.spinnerFlag = false;
        this._snackBar.open("Error : Something wents wrong...!","Close");
        console.warn(error);
      });

}

}
