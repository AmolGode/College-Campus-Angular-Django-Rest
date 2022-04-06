import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './UserAccount/signup/signup.component';
import { SigninComponent } from './UserAccount/signin/signin.component';
import { FooterComponent } from './UserAccount/footer/footer.component';
import { HeaderComponent } from './UserAccount/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewsFeedComponent } from './MainNewsFeed/news-feed/news-feed.component';
import { BottomNavigationBarComponent } from './MainNewsFeed/bottom-navigation-bar/bottom-navigation-bar.component';
import { PostsComponent } from './MainNewsFeed/posts/posts.component';
import { AddCommentComponent } from './MainNewsFeed/add-comment/add-comment.component';
import { AddReplayComponent } from './MainNewsFeed/add-replay/add-replay.component';
import { CommentComponent } from './MainNewsFeed/comment/comment.component';
import { NotificationComponent } from './MainNewsFeed/notification/notification.component';
import { ReplayComponent } from './MainNewsFeed/replay/replay.component';
import { AddReplayToReplayComponent } from './MainNewsFeed/add-replay-to-replay/add-replay-to-replay.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    FooterComponent,
    HeaderComponent,
    NewsFeedComponent,
    BottomNavigationBarComponent,
    PostsComponent,
    AddCommentComponent,
    AddReplayComponent,
    CommentComponent,
    NotificationComponent,
    ReplayComponent,
    AddReplayToReplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,

    HttpClientModule,

    ReactiveFormsModule,
    FormsModule,

    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,




  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
