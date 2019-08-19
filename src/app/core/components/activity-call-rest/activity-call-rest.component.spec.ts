import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCallRestComponent } from './activity-call-rest.component';

describe('ActivityCallRestComponent', () => {
  let component: ActivityCallRestComponent;
  let fixture: ComponentFixture<ActivityCallRestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCallRestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCallRestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
