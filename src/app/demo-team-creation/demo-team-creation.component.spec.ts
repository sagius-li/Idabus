import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTeamCreationComponent } from './demo-team-creation.component';

describe('DemoTeamCreationComponent', () => {
  let component: DemoTeamCreationComponent;
  let fixture: ComponentFixture<DemoTeamCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoTeamCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoTeamCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
