import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { UserService } from './../../service/user.service';
import { StoreService } from './../../service/store.service';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';
import { ToastService } from 'angular-toastify';
import {Title} from '@angular/platform-browser';
import { LoaderComponent } from './../../components/loader/loader.component';
import { SuccessComponent } from './../../components/success/success.component';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {

     form = new FormGroup({
            "code": new FormControl("", [Validators.required, Validators.minLength(5)]),
    });

  constructor(
       private userService: UserService,
     private storeService: StoreService,
     private loader: LoadingBarService,
     private router: Router,
     private route: ActivatedRoute,
     private toast: ToastService,
     private title: Title
 ) { }
  get code() { return this.form.get('code'); }
  error: any = []
  message: string = ''
  showLoader: boolean = false
  showSuccess: boolean = false
  successMessage: string = 'Account successfully created'

  ngOnInit(): void
  {
       this.title.setTitle("Verify your Account")
  }

  onSubmit(): void
  {
       this.loader.start()
       this.showLoader = true
       let sub = this.userService.verifyAccount({email: sessionStorage.getItem('email'), code: this.form.value.code}).subscribe(
            (response) => {
                 this.loader.complete()
                 this.showLoader = false
                 if (response.status) {
                      this.showSuccess = true
                      setTimeout(() => {
                           this.showSuccess = false
                           this.router.navigate(['/login'])
                      }, 2000)
                 }
            },
            (error) => {
                 this.loader.complete()
                 this.showLoader = false
                this.toast.warn(error.error.message)
                this.error = error.error.errors
            }
       )
  }

  resendCode()
  {
       this.loader.start()
       this.showLoader = true
       this.userService.resendVerificationCode(sessionStorage.getItem('email')!).subscribe(
            (response) => {
                 this.loader.complete()
                 this.showLoader = false
                 this.toast.info(response.message)
            },
            (error) => {
                 this.loader.complete()
                 this.showLoader = false
                this.toast.warn(error.error.message)
                this.error = error.error.errors
            }
       )
  }
}
