import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UpdateActivity } from '../../models/dataContract.model';

import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-activity-update',
  templateUrl: './activity-update.component.html',
  styleUrls: ['./activity-update.component.scss']
})
export class ActivityUpdateComponent implements OnInit {
  attActivity: UpdateActivity;
  @Input()
  get activity() {
    return this.attActivity;
  }
  set activity(value) {
    this.attActivity = value;
    this.activityChange.emit(this.attActivity);
  }
  @Output()
  activityChange = new EventEmitter();

  constructor(private dragula: DragulaService) {
    try {
      this.dragula.createGroup('QUERIES', {
        moves: (el, container, handle) => {
          return (
            handle.classList.contains('queryhandle') ||
            (handle.parentNode as Element).classList.contains('queryhandle')
          );
        }
      });
      this.dragula.createGroup('UPDATES', {
        moves: (el, container, handle) => {
          return (
            handle.classList.contains('updatehandle') ||
            (handle.parentNode as Element).classList.contains('updatehandle')
          );
        }
      });
    } catch {}
  }

  ngOnInit() {}

  onAddQuery(item: UpdateActivity) {
    item.xpathqueries.push({ key: '', value: '' });
  }

  onDeleteQuery(queries: [{ key: string; value: string }], index: number) {
    queries.splice(index, 1);
  }

  onAddUpdate(item: UpdateActivity) {
    item.updateresourcesentries.push({ target: '', valueexpression: '', allownull: false });
  }

  onDeleteUpdate(
    updates: [{ target: string; valueexpression: string; allownull: boolean }],
    index: number
  ) {
    updates.splice(index, 1);
  }
}
