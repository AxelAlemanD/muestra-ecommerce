import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-faq-block',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './faq-block.component.html',
  styleUrl: './faq-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqBlockComponent {

  @Input() title: string = '';
  @Input({ required: true }) items!: any[];
  
}
