import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  // state!: Subject<boolean>;
  state: boolean = false;

  constructor(public loadingService: LoadingService) { }

  ngOnInit(): void {
    // this.state = this.loadingService.getState;
    this.loadingService.getState.subscribe(state => {
      this.state = state;
    });
    this.loadingService.show();
    // this.loadingService.hide();
  }

}
