import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTableConfigComponent } from './resource-table-config.component';

describe('ResourceTableConfigComponent', () => {
  let component: ResourceTableConfigComponent;
  let fixture: ComponentFixture<ResourceTableConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceTableConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceTableConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
