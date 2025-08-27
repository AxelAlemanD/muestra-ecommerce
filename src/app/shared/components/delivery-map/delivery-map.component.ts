import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Marker } from 'mapbox-gl';
import { MapboxService } from '../../../services/mapbox.service';

@Component({
  selector: 'app-delivery-map',
  standalone: true,
  templateUrl: './delivery-map.component.html',
  styleUrls: ['./delivery-map.component.scss'],
})
export class DeliveryMapComponent implements OnInit, AfterViewInit {

  @Input() clientAddress!: { lat: number; lng: number };
  @Input() deliveryAddress!: { lat: number; lng: number };
  private deliveryMarker!: Marker;

  constructor(
    private readonly _mapBoxS: MapboxService,
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['deliveryAddress'] && !changes['deliveryAddress'].firstChange) {
      this.updateDeliveryMarker();
    }
  }

  ngAfterViewInit(): void {
    this.init();
  }

  async init() {
    await this._mapBoxS.createMapSelectUbication(
      this.clientAddress.lat,
      this.clientAddress.lng,
      false
    );
    this._mapBoxS.addMarker({
      coords: [this.clientAddress.lng, this.clientAddress.lat],
      popup: { title: 'Tú', description: '' }
    });
    this.addDeliveryMarker();
  }

  addDeliveryMarker() {
    if (!this.deliveryMarker && this.deliveryAddress) {
      this.deliveryMarker = this._mapBoxS.addMarker({
        coords: [this.deliveryAddress.lng, this.deliveryAddress.lat],
        icon: this.getMarkerIcon('../../../../assets/images/delivery.png'),
        popup: { title: 'Repartidor', description: '' }
      });
    }
  }

  updateDeliveryMarker() {
    this.addDeliveryMarker();
    if (this.deliveryMarker) {
      const coords = {
        lat: this.deliveryAddress.lat,
        lng: this.deliveryAddress.lng
      }
      this._mapBoxS.updateMarkerUbication(this.deliveryMarker, coords);
    }
  }

  private getMarkerIcon(imageUrl: string): HTMLDivElement {
    const icon = document.createElement('div');
    icon.className = 'marker';
    icon.style.backgroundImage = `url(${imageUrl})`;
    icon.style.width = '2.5rem';
    icon.style.height = '2.5rem';
    icon.style.backgroundSize = '100%';
    return icon;
  }
}
