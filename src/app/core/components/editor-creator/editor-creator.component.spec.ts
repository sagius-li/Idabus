import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorCreatorComponent } from './editor-creator.component';

describe('EditorCreatorComponent', () => {
  let component: EditorCreatorComponent;
  let fixture: ComponentFixture<EditorCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
