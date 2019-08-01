import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-view-configurator',
  templateUrl: './view-configurator.component.html',
  styleUrls: ['./view-configurator.component.scss']
})
export class ViewConfiguratorComponent implements OnInit {
  constructor(
    private dragula: DragulaService,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    try {
      this.dragula.createGroup('VIEWSECTIONS', {
        moves: (el, container, handle) => {
          return (
            handle.classList.contains('handle') ||
            (handle.parentNode as Element).classList.contains('handle')
          );
        }
      });
    } catch {}
  }

  ngOnInit() {}

  onAddTab() {
    this.data.sections.push({
      cols: 2,
      rows: 2,
      x: 0,
      y: 0,
      name: '',
      displayName: '',
      columnNumber: 1,
      attributes: []
    });
  }

  onRemoveTab(section: any) {
    const pos = this.data.sections.findIndex((s: any) => s.name === section.name);
    this.data.sections.splice(pos, 1);
  }

  sectionsInvalid(): boolean {
    return this.data.sections.findIndex((s: any) => !s.name || !s.displayName) >= 0;
  }
}
