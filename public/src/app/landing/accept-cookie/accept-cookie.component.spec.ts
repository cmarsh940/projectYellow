import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptCookieComponent } from './accept-cookie.component';

describe('AcceptCookieComponent', () => {
  let component: AcceptCookieComponent;
  let fixture: ComponentFixture<AcceptCookieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptCookieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptCookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
