import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import 'ionicons';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomButtonComponent {

  @Input() text = '';
  @Input() color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark' = 'primary';
  @Input() fill: 'solid' | 'clear' | 'outline' | 'opacity' = 'solid';
  @Input() icon = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() isDisabled = false;
  @Input() isLoading = false;
  @Output() onClick = new EventEmitter();

  emitClick() {
    if (this.isDisabled) {
      return;
    }
    this.onClick.emit();
  }
}


