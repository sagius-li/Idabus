import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCreatorComponent } from './activity-creator.component';

describe('ActivityCreatorComponent', () => {
  let component: ActivityCreatorComponent;
  let fixture: ComponentFixture<ActivityCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
