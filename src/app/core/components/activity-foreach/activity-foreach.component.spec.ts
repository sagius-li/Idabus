import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityForeachComponent } from './activity-foreach.component';

describe('ActivityForeachComponent', () => {
  let component: ActivityForeachComponent;
  let fixture: ComponentFixture<ActivityForeachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityForeachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityForeachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
