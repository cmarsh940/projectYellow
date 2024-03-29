import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SurveyCategoryService } from '../survey-category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  myForm: FormGroup;

  allAssets;
  private asset;
  errorMessage;

  name = new FormControl('', Validators.required);

  constructor(
    public serviceSurveyCategory: SurveyCategoryService,
    private _router: Router,
    fb: FormBuilder
  ) {
    this.myForm = fb.group({
      name: this.name,
    });
  }

  ngOnInit() {
  }


/**
 * Event handler for changing the checked state of a checkbox (handles array enumeration values)
 * @param {String} name - the name of the asset field to update
 * @param {any} value - the enumeration value for which to toggle the checked state
 */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

/**
 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
 * only). This is used for checkboxes in the asset updateDialog.
 * @param {String} name - the name of the asset field to check
 * @param {any} value - the enumeration value to check for
 * @return {Boolean} whether the specified asset field contains the provided value
 */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      'name': this.name.value,
    };

    this.myForm.setValue({
      'name': null,
    });

    return this.serviceSurveyCategory.addAsset(this.asset)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.resetForm();
      })
      .catch((error) => {
        if (error) {
          this.errorMessage = error;
        }
      });
  }


  resetForm(): void {
    this.myForm.setValue({
      'name': null,
    });
  }
}
