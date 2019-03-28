import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSurveyDialogComponent } from './share-survey-dialog.component';

describe('ShareSurveyDialogComponent', () => {
  let component: ShareSurveyDialogComponent;
  let fixture: ComponentFixture<ShareSurveyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareSurveyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareSurveyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
