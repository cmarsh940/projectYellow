import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionErrorComponent } from './subscription-error.component';

describe('SubscriptionErrorComponent', () => {
  let component: SubscriptionErrorComponent;
  let fixture: ComponentFixture<SubscriptionErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
