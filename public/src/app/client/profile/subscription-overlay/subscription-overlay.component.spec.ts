import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionOverlayComponent } from './subscription-overlay.component';

describe('SubscriptionOverlayComponent', () => {
  let component: SubscriptionOverlayComponent;
  let fixture: ComponentFixture<SubscriptionOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
