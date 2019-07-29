import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTextConfigComponent } from './editor-text-config.component';

describe('EditorTextConfigComponent', () => {
  let component: EditorTextConfigComponent;
  let fixture: ComponentFixture<EditorTextConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorTextConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTextConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
