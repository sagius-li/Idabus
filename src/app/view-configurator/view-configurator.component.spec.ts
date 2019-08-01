import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConfiguratorComponent } from './view-configurator.component';

describe('ViewConfiguratorComponent', () => {
  let component: ViewConfiguratorComponent;
  let fixture: ComponentFixture<ViewConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewConfiguratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
