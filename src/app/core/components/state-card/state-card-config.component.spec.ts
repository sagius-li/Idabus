import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateCardConfigComponent } from './state-card-config.component';

describe('StateCardConfigComponent', () => {
  let component: StateCardConfigComponent;
  let fixture: ComponentFixture<StateCardConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateCardConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateCardConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
