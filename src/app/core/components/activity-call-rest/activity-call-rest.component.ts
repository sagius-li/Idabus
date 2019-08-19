import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CallRestActivity } from '../../models/dataContract.model';

@Component({
  selector: 'app-activity-call-rest',
  templateUrl: './activity-call-rest.component.html',
  styleUrls: ['./activity-call-rest.component.scss']
})
export class ActivityCallRestComponent implements OnInit {
  attActivity: CallRestActivity;
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

  constructor() {}

  ngOnInit() {}

  onAddHeader(item: CallRestActivity) {
    item.headerexpressions.push({ key: '', value: '' });
  }
  onDeleteHeader(items: [{ key: string; value: string }], index: number) {
    items.splice(index, 1);
  }

  onAddQuery(item: CallRestActivity) {
    item.queryexpressions.push({ key: '', value: '' });
  }
  onDeleteQuery(items: [{ key: string; value: string }], index: number) {
    items.splice(index, 1);
  }

  onAddExpression(item: CallRestActivity) {
    item.expressions.push({ key: '', value: '' });
  }
  onDeleteExpression(items: [{ key: string; value: string }], index: number) {
    items.splice(index, 1);
  }
}
