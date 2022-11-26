import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { UserService } from '../service/user.service';
import { StoreService } from '../service/store.service';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import {Title} from '@angular/platform-browser';
// import { LoaderComponent } from './../components/loader/loader.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
     form = new FormGroup({
            "email": new FormControl("", [Validators.required, Validators.email]),
            "password": new FormControl("", [Validators.required, Validators.minLength(5)]),
    });

  constructor(
       private userService: UserService,
       private storeService: StoreService,
       private loader: LoadingBarService,
       private router: Router,
       // public myLoader: LoaderComponent,
       private toast: ToastService,
       private title: Title
 ) { }


  public error: any = []
  public showLoader: boolean = false
  public message: string = ''
  ngOnInit(): void
  {
       this.title.setTitle('Login in to your dashboard')
  }

  onSubmit()
  {
       this.showLoader = true
       this.loader.start()
      this.userService.login({email: this.form.value.email!, password: this.form.value.password!}).subscribe(
           (response) => {
                this.loader.complete()
                this.showLoader = false
                // this.toast.info(response.message)
                if (response.statusCode === 303) {
                     sessionStorage.setItem('email', this.form.value.email!)
                     this.router.navigate(['/verify-account'])
                }
                if (response.status != false && response.statusCode === 200) {
                     this.storeService.setuser(response.user, response.token)
                     this.storeService.setTopicAndResult(response.topics, response.results)
                     sessionStorage.setItem('totalResults', response.countedResult)
                     sessionStorage.setItem('totalTopics', response.countTopics)
                     sessionStorage.setItem('top3Topics', JSON.stringify(response.top3))
                     this.router.navigate(['/user/dashboard'])
                }
                this.message = response.message
           },

           (error) => {
                this.loader.complete()
                this.toast.warn(error.error.message)
                this.error = error.error.errors
           }
      )
  }
}
