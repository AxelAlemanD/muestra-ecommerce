import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IBrand } from '../../../../../interfaces/brand.interface';
import { UploadsPipe } from '../../../../pipes/uploads.pipe';
import { RouterModule } from '@angular/router';
import { LazyImageDirective } from '../../../../directives/lazy-image.directive';

@Component({
  selector: 'app-image-grid',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UploadsPipe,
    LazyImageDirective
  ],
  templateUrl: './image-grid.component.html',
  styleUrl: './image-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGridComponent {

  @Input() items: IBrand[] = [];

  ngOnInit() { }

}
