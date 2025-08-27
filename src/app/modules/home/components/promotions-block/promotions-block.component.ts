import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IPromotion } from '../../../../interfaces/promotion.interface';
import { UploadsPipe } from '../../../../shared/pipes/uploads.pipe';
import { PromotionCardComponent } from '../../../../shared/components/promotion-card/promotion-card.component';

@Component({
  selector: 'app-promotions-block',
  standalone: true,
  imports: [
    CommonModule,
    UploadsPipe,
    PromotionCardComponent
  ],
  templateUrl: './promotions-block.component.html',
  styleUrl: './promotions-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionsBlockComponent {

  @Input({ required: true }) items: IPromotion[] = [];
  
}
