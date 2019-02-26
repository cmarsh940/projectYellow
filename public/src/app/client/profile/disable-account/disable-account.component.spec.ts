import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableAccountComponent } from './disable-account.component';

describe('DisableAccountComponent', () => {
  let component: DisableAccountComponent;
  let fixture: ComponentFixture<DisableAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisableAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisableAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
