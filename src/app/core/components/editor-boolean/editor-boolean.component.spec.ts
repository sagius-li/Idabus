import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorBooleanComponent } from './editor-boolean.component';

describe('EditorBooleanComponent', () => {
  let component: EditorBooleanComponent;
  let fixture: ComponentFixture<EditorBooleanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorBooleanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorBooleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
