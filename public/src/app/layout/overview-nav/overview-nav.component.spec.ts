
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { OverviewNavComponent } from './overview-nav.component';

describe('OverviewNavComponent', () => {
  let component: OverviewNavComponent;
  let fixture: ComponentFixture<OverviewNavComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatSidenavModule],
      declarations: [OverviewNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
