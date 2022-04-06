import { Component, OnInit } from '@angular/core';

import { FormBuilder,FormControl,FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormGroupDirective, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  constructor(private formbuilder :FormBuilder, private userService : UserService , private router : Router ,private _snackBar: MatSnackBar) { }

  // Global Variables
  url = ' ../../assets/images/select_profile.jpeg';
  selected_pic:any;
  user_pass= '';
  confirm_pass = '';


  signupForm:FormGroup = this.formbuilder.group({
    first_name : new FormControl('',[Validators.required]),
    last_name : new FormControl('',[Validators.required]),
    college_name :new FormControl('',[Validators.required]),
    // faculty:new FormControl('',[Validators.required]),
    gender : new FormControl('',[Validators.required]),
    // email : new FormControl('',[Validators.required]),
    user_id:new FormControl('',[Validators.required]),
    user_password:new FormControl('',[Validators.required]),
    confirm_password:new FormControl('',[Validators.required])
  });



  // get first_name_validate()
  // {
  //   return this.signupForm.get('first_name');
  // } 
  // get last_name_validate()
  // {
  //   return this.signupForm.get('last_name');
  // }
  // get college_name_validate()
  // {
  //   return this.signupForm.get('college_name');
  // } 
  // get gender_validate()
  // {
  //   return this.signupForm.get('gender');
  // }
  // get user_id_validate()
  // {
  //   return this.signupForm.get('user_id');
  // } 
  // get user_password_validate()
  // {
  //   return this.signupForm.get('user_password');
  // }
  // get confirm_password_validate()
  // {
  //   return this.signupForm.get('confirm_password');
  // }

  get f() { return this.signupForm.controls; }
  

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();

  myControl = new FormControl();
  options: string[] = ['Bachelor Of Computer Science', 'Msc Computer Science', 'MCA'];
  filteredOptions: any;

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }



  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  onFileSelectProfilePic(event:any)
  {
    console.log(event);
    if(event.target.files)
    {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event:any)=>{
        this.url = event.target.result;
      }
    }
    this.url = this.selected_pic = event.target.files[0];
  }

  hide = true;
  c_hide = true;

  result:any;
  spinnerFlag = false;
  submitData(data:any)
  {
    this.spinnerFlag = true;
    const fd = new FormData();
    fd.append('first_name',data.first_name);
    fd.append('last_name',data.last_name);
    if (this.selected_pic != undefined) {
      fd.append('profile_pic', this.selected_pic, this.selected_pic.name);
    }
    fd.append('gender',data.gender);
    fd.append('college_name',data.college_name);
    fd.append('user_id',data.user_id);
    fd.append('college_name',data.college_name);
    fd.append('user_id',data.user_id);
    fd.append('user_password',data.user_password);
    // const data_obj =
    // {
    //   'first_name':data.first_name,
    //    'last_name':data.last_name,
    //    'profile_pic':data.gender+'.img',
    //    'gender':data.gender,
    //    'college_name':data.college_name,
    //    'user_id':data.user_id,
    //    'user_password':data.user_password
    // }
    // console.warn(data);
    this.userService.create_user(fd).subscribe((response:any)=>
      {
        
        this.spinnerFlag = false;
        console.warn(response.resp);
        this.result = response;
        console.warn(this.result.resp);
        if(this.result.resp.resp === "Task Failed")
        {
          this._snackBar.open(this.result.resp,"Close");
        }else
        {
          this._snackBar.open("Account Created Successfully...! Please Login .","Ok");
          this.router.navigate(['/signin']);
        }

      },
      error=>{
        this.spinnerFlag = false;
        this._snackBar.open("Error : Something wents wrong...!","Close");
        console.warn(error);
      });

  }

}

