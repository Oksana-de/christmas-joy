import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Toy } from 'src/app/core/components/interfaces/toy.interface';

@Component({
  selector: 'app-toy-item',
  templateUrl: './toy-item.component.html',
  styleUrls: ['./toy-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToyItemComponent {
  @Input() item!: Toy;
  @Output() deleted = new EventEmitter();
  @Output() edited = new EventEmitter();

  onEdit(): void {
    this.edited.emit(this.item.id);
  }

  onDelete(): void {
    this.deleted.emit(this.item.id);
  }

  srcImg(): string {
    return `./assets/img/toys/${this.item.picture}`;
  }
}
