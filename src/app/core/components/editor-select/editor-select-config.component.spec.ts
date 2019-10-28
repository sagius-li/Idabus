import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSelectConfigComponent } from './editor-select-config.component';

describe('EditorSelectConfigComponent', () => {
  let component: EditorSelectConfigComponent;
  let fixture: ComponentFixture<EditorSelectConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorSelectConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSelectConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
