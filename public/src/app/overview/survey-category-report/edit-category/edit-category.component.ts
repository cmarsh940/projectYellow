import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyCategoryService } from '../survey-category.service';
import { Location } from '@angular/common';
import { SurveyCategory } from '@shared/models/survey-category';


@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  category = new SurveyCategory();
  _routeSubscription: Subscription;
  categoryId: string = '';
  errors = [];

  constructor(
    private _categoryService: SurveyCategoryService,
    private _activatedRoute: ActivatedRoute,
    private location: Location,
    private _router: Router
  ) { }

  ngOnInit() {
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.categoryId = params['id'];
      this.getCategory();
    });
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }

  getCategory() {
    this._categoryService.getAsset(this.categoryId)
      .subscribe(res => {
        console.log('Category', res);
        this.category = res;
      });
  }


  updateCategory(): void {
    this.errors = [];
    this._categoryService.updateAsset(this.category, res => {
      if (res.errors) {
        for (const key of Object.keys(res.errors)) {
          const errors = res.errors[key];
          this.errors.push(errors.message);
        }
      } else {
        this._router.navigate(['/survey_categories']);
      }
    });
  }

  cancel() {
    this.location.back();
  }

}
