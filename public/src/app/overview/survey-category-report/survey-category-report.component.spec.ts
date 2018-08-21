import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyCategoryReportComponent } from './survey-category-report.component';

describe('SurveyCategoryReportComponent', () => {
  let component: SurveyCategoryReportComponent;
  let fixture: ComponentFixture<SurveyCategoryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyCategoryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyCategoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
