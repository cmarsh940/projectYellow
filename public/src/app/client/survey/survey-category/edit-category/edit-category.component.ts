import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../../global/models/client';
import { SurveyCategory } from '../../../../global/models/survey-category';
import { SurveyCategoryService } from '../survey-category.service';
import { ClientService } from '../../../client.service';


@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  category = new SurveyCategory();
  currentClient: Client;
  amenities_list: Array<SurveyCategory>;
  subscription: Subscription;

  constructor(
    private _categoryService: SurveyCategoryService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    // this.getCategories();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  validateSession(): void {
    if (!this.currentClient) {
      this._router.navigateByUrl('/');
    }
  }

  // getCategories() {
  //   this.subscription = this._activatedRoute.params.subscribe(
  //     params => this._categoryService.getAsset(params.id, res => this.category = res)
  //   );
  // }

  updateCategory() {
    this._categoryService.updateAsset(this.category, res => {
      this._router.navigate(['/survey_categories']);
    });
  }

}
