import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IMegaMenuItem } from '../../../../../interfaces/megamenu-item.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-megamenu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './megamenu.component.html',
  styleUrl: './megamenu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MegamenuComponent {

  @Input() items: IMegaMenuItem[] = [];
}
