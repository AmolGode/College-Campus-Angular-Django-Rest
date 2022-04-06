import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { NewsFeedComponent } from '../news-feed/news-feed.component';

@Component({
  selector: 'app-bottom-navigation-bar',
  templateUrl: './bottom-navigation-bar.component.html',
  styleUrls: ['./bottom-navigation-bar.component.css']
})
export class BottomNavigationBarComponent implements OnInit {

  constructor(private userService: UserService, private newsFeedComponent: NewsFeedComponent, private modalService: NgbModal,) { }

  ngOnInit(): void {
  }

  // Global Variables
  StudyPostIsActive = true;
  NoticeIsActive = false;
  DoubtSectionIsActive = false;
  CareerPortalIsActive = false;

  turnAllBtnOff() 
  {
    this.StudyPostIsActive = false;
    this.NoticeIsActive = false;
    this.DoubtSectionIsActive = false;
    this.CareerPortalIsActive = false;
  }

  get_group_post(post_type: String) {
    console.log('Post Type ==>' + post_type);
    // css for active class on button start
    this.turnAllBtnOff();

    if(post_type == 'Study Post')
    {
      this.StudyPostIsActive = true;
    }else if(post_type == 'Doubt Section')
    {
      this.DoubtSectionIsActive = true;
    }else if(post_type == 'Notice')
    {
      this.NoticeIsActive = true;
    }else{
      this.CareerPortalIsActive = true;
    }

    // css for active class on button end

    this.newsFeedComponent.get_group_post(post_type);
    //   const primaryGroupId:any = localStorage.getItem('primaryGroupId');
    //   this.userService.get_post(primaryGroupId,post_type).subscribe(
    //     (response)=>{
    //       console.log(post_type);
    //     },
    //     (error)=>{
    //       console.log(error);
    //     }
    //   )

  }

  // bootstrap model code start
  closeResult = '';
  open(content: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }
  // bootstrap model code end


}
