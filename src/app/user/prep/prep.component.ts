import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AssesmentService } from './../../service/assesment.service';
// import { StoreService } from './../../service/store.service';
import { Router,  ActivatedRoute, ParamMap } from '@angular/router';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'app-prep',
  templateUrl: './prep.component.html',
  styleUrls: ['./prep.component.css']
})
export class PrepComponent implements OnInit, OnDestroy {

     form = new FormGroup({
            "faculty": new FormControl("", [Validators.required, Validators.minLength(4)]),
            "department": new FormControl("", [Validators.required, Validators.minLength(4)]),
            "topic_id": new FormControl("", [Validators.required, Validators.minLength(1)]),
     });

     constructor(
       private assesementService: AssesmentService,
    // private storeService: StoreService,
         private loader: LoadingBarService,
         private router: Router,
         private toast: ToastService
      ) { }
      get faculty() { return this.form.get('faculty'); }
      get department() { return this.form.get('department'); }
      get topic_id() { return this.form.get('topic_id'); }

      error: any = []
      topics: Array<any> = []
      departments: Array<string> = []

      ngOnInit(): void
      {
           const topics = sessionStorage.getItem('topics')
           this.topics = topics === null ? [] : JSON.parse(topics)
           this.departments = this.distinctValues(this.topics)
      }

      onSubmit()
      {
           this.loader.start()
           const topic_id: any = this.form.value.topic_id
           console.log(topic_id)
           this.assesementService.requestAssesment(topic_id).subscribe(
                (response) => {
                     this.loader.complete()
                     if (response.status) {
                          sessionStorage.setItem('questions', JSON.stringify(response.data.questions))
                          sessionStorage.setItem('duration', response.data.duration)
                          setTimeout(() => {
                               this.router.navigate(['/user/assessment', {topic_id: topic_id}])
                          }, 5000)
                     }
                },

                (error) => {
                     this.loader.complete()
                     this.error = error.errors
                }
           )
      }

      distinctValues(values: Array<any>): Array<string>
      {
           let newArray: Array<string> = []
           values.forEach( (item, index) => {
                if (newArray.indexOf(item.department) === -1) {
                     newArray.push(item.department)
                }
           })
           return newArray
      }

      trackByFn(index: number, topic: any)
      {
          return topic ? topic.id : undefined;
      }

      ngOnDestroy(): void
      {
           //Called once, before the instance is destroyed.
           //Add 'implements OnDestroy' to the class.

      }
}