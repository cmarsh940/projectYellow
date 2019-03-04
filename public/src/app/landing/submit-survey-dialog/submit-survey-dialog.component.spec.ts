import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitSurveyDialogComponent } from './submit-survey-dialog.component';

describe('SubmitSurveyDialogComponent', () => {
  let component: SubmitSurveyDialogComponent;
  let fixture: ComponentFixture<SubmitSurveyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitSurveyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitSurveyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
