import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/Api.service';

@Component({
    selector: 'Sign-up',
    templateUrl: './app/sign_in/sign-in.component.html',
    styleUrls: ['./app/sign_in/sign-in.component.css']
})
export class SignInComponent implements OnInit {
    model: any = {};
    loading = false;

    ngOnInit() {
        // reset login status
        this.ApiService.logout();
 
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
}