import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTeamEditionComponent } from './demo-team-edition.component';

describe('DemoTeamEditionComponent', () => {
  let component: DemoTeamEditionComponent;
  let fixture: ComponentFixture<DemoTeamEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoTeamEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoTeamEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
