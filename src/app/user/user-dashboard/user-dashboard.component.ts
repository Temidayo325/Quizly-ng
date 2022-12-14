import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastService } from 'angular-toastify';
import { StoreService } from './../../service/store.service';
import { ShareService } from './../../services/share.service';
import { UserService } from './../../service/user.service';
import { Router, ChildrenOutletContexts } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { slideInAnimation } from './../animations';
import {Title} from '@angular/platform-browser';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { LoaderComponent } from './../../components/loader/loader.component';
import { SuccessComponent } from './../../components/success/success.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  animations: [
       slideInAnimation,
     trigger('onOff', [
            transition(':enter', [style({
                   opacity: 0,
                   transform: 'translateX(-100%)'
                 }),
                 animate(200)
               ])
     ]),
     trigger('onOff', [
            transition(':leave', [style({
                   opacity: 0,
                   transform: 'translateX(-100%)'
                 }),
                 animate(200)
               ])
     ])
  ]
})
export class UserDashboardComponent implements OnInit {

  constructor(
      private storeService: StoreService,
      private loader: LoadingBarService,
      private toast: ToastService,
      private router: Router,
      private userService: UserService,
      private contexts: ChildrenOutletContexts,
      private title: Title,
      private shareService: ShareService,
      private cdr: ChangeDetectorRef
 ) { }

  public navigation: boolean = false
  public user = JSON.parse(sessionStorage.getItem('user')!)
  public imageSource: string = `https://avatars.dicebear.com/api/initials/${this.user.nickname}.svg?mood[]=happy`
  headerMessage: Subject<string> =  new Subject
  showLoader: boolean = false
  showConfirm: boolean = false
  priority: any = {yes: '', no: 'bg-yellow-600', text: 'Do you want to logout?'}

  ngOnInit(): void
  {
       this.headerMessage = new BehaviorSubject(`Hello ${this.user.nickname} !`)
       this.router.navigate(['/user/dashboard/home'])
       this.title.setTitle("Your dashboard home")
       this.shareService.getNewHeader().subscribe(
            (response) => {
                 this.headerMessage = response
            }
       )
  }
  ngAfterContentChecked()
  {
     this.cdr.detectChanges();
  }

  getRouteAnimationData()
  {
       return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  toggleNavigation(): void
  {
       this.navigation = !this.navigation
  }

  location(link: string)
  {
       this.router.navigate([link])
       this.toggleNavigation()
  }

   largeScreenLocation(link: string)
  {
       this.router.navigate([link])
  }

  confirmStatus($event: boolean)
  {
     if($event)
     {
          this.logout()
     }
     this.showConfirm = false
  }

  initLogout()
  {
       this.toggleNavigation()
      this.showConfirm = true
  }
  desktopinitLogout()
  {
      this.showConfirm = true
  }
  logout()
  {
            this.loader.start()
            this.showLoader = true
            let user = JSON.parse(sessionStorage.getItem('user')!)
            this.userService.logout(user.id).subscribe(
                 (response: any) => {
                      this.loader.complete()
                      if (response.status) {
                           this.toast.info("You have signed out from your account")
                           sessionStorage.clear()
                           localStorage.clear()
                           this.showLoader = false
                           this.router.navigate(['/login'])
                      }
                 },
                 (error) => {
                      this.loader.complete()
                      this.toast.error(error.message)
                 }
          )
  }
}
