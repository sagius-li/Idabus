import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceChartConfigComponent } from './resource-chart-config.component';

describe('ResourceChartConfigComponent', () => {
  let component: ResourceChartConfigComponent;
  let fixture: ComponentFixture<ResourceChartConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceChartConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceChartConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
