import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridsterViewComponent } from './gridster-view.component';

describe('GridsterViewComponent', () => {
  let component: GridsterViewComponent;
  let fixture: ComponentFixture<GridsterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridsterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridsterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
