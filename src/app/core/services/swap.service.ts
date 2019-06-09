import { Injectable, Output, EventEmitter } from '@angular/core';

/**
 * Service used to communicate between components
 */
@Injectable({
  providedIn: 'root'
})
export class SwapService {
  /** Event emitter for window resized */
  @Output()
  windowResized: EventEmitter<string> = new EventEmitter();

  /** Event emitter for editor value changed */
  @Output()
  editorValueChanged: EventEmitter<any> = new EventEmitter();

  /** @ignore */
  constructor() {}

  /**
   * Emit the event for window resized
   * @param size Window size
   */
  resizeWindow(size: string) {
    this.windowResized.emit(size);
  }

  /** Emit the event for editor value changed */
  changeEditorValue(config: any) {
    this.editorValueChanged.emit(config);
  }

  /**
   * Determin [window size]{@link https://github.com/angular/flex-layout/wiki/Responsive-API} (xs, sm, md, lg)
   */
  verifyWindowSize() {
    if (window.innerWidth < 600) {
      this.resizeWindow('xs');
    } else if (window.innerWidth <= 960 && window.innerWidth >= 600) {
      this.resizeWindow('sm');
    } else if (window.innerWidth >= 960 && window.innerWidth < 1600) {
      this.resizeWindow('md');
    } else {
      this.resizeWindow('lg');
    }
  }
}
