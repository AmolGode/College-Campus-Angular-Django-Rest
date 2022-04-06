import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsFeedComponent } from './MainNewsFeed/news-feed/news-feed.component';
import { SigninComponent } from './UserAccount/signin/signin.component';
import { SignupComponent } from './UserAccount/signup/signup.component';

const routes: Routes = [
  {
    path : '',
    component : SigninComponent
  },
  {
    path:'signup',
    component:SignupComponent,
    pathMatch:'full',
  },
  {
    path:'signin',
    component:SigninComponent,
    pathMatch:'full',
  },
  {
    path:'signup/signin',
    redirectTo:'signin',
    pathMatch:'full',
  },
  {
    path:'signin/signup',
    redirectTo:'signup',
    pathMatch:'full',
  },
  {
    path:'news-feed',
    component:NewsFeedComponent,
    pathMatch:'full'
  },
  {
    path:'news-feed/signin',
    redirectTo:'signin',
    pathMatch:'full',
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
