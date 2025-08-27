import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ICategory } from '../../../interfaces/category.interface';
import { UploadsPipe } from '../../pipes/uploads.pipe';
import { LazyImageDirective } from '../../directives/lazy-image.directive';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [
    CommonModule,
    UploadsPipe,
    LazyImageDirective
  ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCardComponent {

    @Input({ required: true }) category!: ICategory;
    @Output() onClick: EventEmitter<any> = new EventEmitter();

    emitClick() {
      this.onClick.emit(this.category);
    }
}
