import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import 'ionicons';
import { ITimelineItem } from '../../../interfaces/timeline.interface';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {

  @Input({ required: true }) items: ITimelineItem[] = [];
  @Input() currentItem!: ITimelineItem;

  ngOnInit() {
    if (!this.currentItem) {
      this.currentItem = this.items[0];
    }
  }

}
