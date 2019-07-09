import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCreatorComponent } from './widget-creator.component';

describe('WidgetCreatorComponent', () => {
  let component: WidgetCreatorComponent;
  let fixture: ComponentFixture<WidgetCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
