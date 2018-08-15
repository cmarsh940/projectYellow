import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../../global/models/client';
import { SurveyCategory } from '../../../../global/models/survey-category';
import { SurveyCategoryService } from '../survey-category.service';
import { ClientService } from '../../../client.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  category = new SurveyCategory();
  currentClient: Client;
  _routeSubscription: Subscription;
  categoryId: string = "";
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
        console.log("Category", res);
        this.category = res
      });
  }

  validateSession(): void {
    if (!this.currentClient) {
      this._router.navigateByUrl('/');
    }
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
        this._router.navigate(["/survey_categories"]);
      }
    });
  }

  cancel() {
    this.location.back();
  }

}
