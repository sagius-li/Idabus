import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoNextgenComponent } from './demo-nextgen.component';

describe('DemoNextgenComponent', () => {
  let component: DemoNextgenComponent;
  let fixture: ComponentFixture<DemoNextgenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoNextgenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoNextgenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
