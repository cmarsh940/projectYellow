import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../client/survey/survey.service';
import { Survey } from '../../global/models/survey';

@Component({
  selector: 'app-list-surveys',
  templateUrl: './list-surveys.component.html',
  styleUrls: ['./list-surveys.component.css']
})
export class ListSurveysComponent implements OnInit {
  dataSource: Survey[];
  errorMessage;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['owner', 'name', 'action'];

  constructor(
    private _surveyService: SurveyService
  ) { }

  ngOnInit() {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this._surveyService.getAll()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(asset => {
          if(!asset.private) {
            tempList.push(asset);
          }
        });
        this.dataSource = tempList;
      })
      .catch((error) => {
        if (error) {
          this.errorMessage = error;
        }
      });
  }

  TrackById(index: number, survey: Survey) {
    return survey._id;
  }
}
