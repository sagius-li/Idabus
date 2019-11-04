import { Injectable, Output, EventEmitter } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { BroadcastEvent } from '../models/dataContract.model';

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

  /** Communication between components for broadcasting */
  private broadcastedSource = new BehaviorSubject({});
  broadcasted = this.broadcastedSource.asObservable();

  /** Communication between components for editor value change */
  private editorValueChangedSource = new BehaviorSubject(null);
  editorValueChanged = this.editorValueChangedSource.asObservable();

  /** Communication between components for editor config change */
  private editorConfigChangedSource = new BehaviorSubject(null);
  editorConfigChanged = this.editorConfigChangedSource.asObservable();

  /** Communication between components for showing / hiding editor */
  private editorDisplayChangedSource = new BehaviorSubject(null);
  editorDisplayChanged = this.editorDisplayChangedSource.asObservable();

  /** Indicate global page edit mode */
  isEditMode = false;
  get editMode() {
    return this.isEditMode;
  }
  set editMode(value: boolean) {
    this.isEditMode = value;
  }

  /** @ignore */
  constructor() {}

  /**
   * Emit the event for window resized
   * @param size Window size
   */
  resizeWindow(size: string) {
    this.windowResized.emit(size);
  }

  /**
   * Common broadcast event
   * @param event Broadcast event
   */
  broadcast(event: BroadcastEvent) {
    this.broadcastedSource.next(event);
  }

  /**
   * Prpagate editor value change
   * @param attributeName Attrubte name of the editor
   */
  propagateEditorValueChanged(attributeName: string) {
    this.editorValueChangedSource.next(attributeName);
  }

  /**
   * Prpagate editor config change
   * @param attributeName Attrubte name of the editor
   */
  propagateEditorConfigChanged(attributeName: string) {
    this.editorConfigChangedSource.next(attributeName);
  }

  /**
   * Prpagate editor display change
   * @param attributeName Attrubte name of the editor
   */
  propagateEditorDisplayChanged(option: {
    attributeName: string;
    usedFor: string;
    optionValue: boolean;
  }) {
    this.editorDisplayChangedSource.next(option);
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
