import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SurveyService } from '../../client/survey/survey.service';
import { Survey } from '../../global/models/survey';

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.css']
})
export class ViewSurveyComponent implements OnInit {

  survey$: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: SurveyService
  ) { }

  ngOnInit() {
    this.survey$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getAsset(params.get('_id')))
    );
  }

}
