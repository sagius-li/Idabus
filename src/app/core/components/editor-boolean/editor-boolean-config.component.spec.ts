import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorBooleanConfigComponent } from './editor-boolean-config.component';

describe('EditorBooleanConfigComponent', () => {
  let component: EditorBooleanConfigComponent;
  let fixture: ComponentFixture<EditorBooleanConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorBooleanConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorBooleanConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
