import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { UserService } from './../../service/user.service';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(
       private userService: UserService,
       private loader: LoadingBarService,
       private router: Router,
       private toast: ToastService,
       private title: Title
 ) {
      this.title.setTitle("Assessment result statistics")
 }
  public results: Array<any> = JSON.parse(sessionStorage.getItem('results')!)
  public user: any = JSON.parse(sessionStorage.getItem('user')!)

  ngOnInit(): void
  {
       this.loader.start()
       this.userService.getResults(this.user.id).subscribe(
            (response: any) => {
                 this.loader.complete()
                 this.results = response.results
                 sessionStorage.setItem('results', JSON.stringify(response.results))
            },
            (error) => {

            }
       )
  }
  trackByFn(index: number, result: any)

  {
        return result ? result.id : undefined;
  }
}
