import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule } from '@angular/http';

import { ApiService } from './shared/Api.service';
import { AppComponent }  from './app.component';
import { SignInComponent } from './sign_in/sign-in.component';
import { SignUpComponent } from './sign_up/sign-up.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page_not_found/page-not-found.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [ BrowserModule,
             RouterModule.forRoot([{ path: 'home', component: HomeComponent}, 
                                   { path: 'sign-in', component: SignInComponent},
                                   { path: 'sign-up', component: SignUpComponent},
                                   { path: '', redirectTo: 'home', pathMatch: 'full'},
                                   { path: '**', component: PageNotFoundComponent}],
                                   { useHash: true}),
             HttpModule 
            ],
  declarations: [ AppComponent, SignUpComponent, SignInComponent, PageNotFoundComponent, HomeComponent ],
  providers: [ ApiService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }