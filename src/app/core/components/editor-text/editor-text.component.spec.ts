import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTextComponent } from './editor-text.component';

describe('EditorTextComponent', () => {
  let component: EditorTextComponent;
  let fixture: ComponentFixture<EditorTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
