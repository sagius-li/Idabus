import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceChartComponent } from './resource-chart.component';

describe('ResourceChartComponent', () => {
  let component: ResourceChartComponent;
  let fixture: ComponentFixture<ResourceChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
