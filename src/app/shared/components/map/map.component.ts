import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MapboxService } from '../../../services/mapbox.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() isClickable: boolean = true;
  @Input() direction: any | null = {
    address: '',
    lat: 0,
    lng: 0,
    zip_code: '',
    city: '',
    state: '',
    country: '',
  };
  @Output() onAddressChange: EventEmitter<any> = new EventEmitter();

  lat = 25.675896;
  lng = -100.319276;
  private subscription!: Subscription;

  constructor(
    private readonly _mapboxService: MapboxService,
  ) { }

  ngOnInit() {
    this.subscription = this._mapboxService.selectedAddress.subscribe(
      (addressDetails) => {
        if (addressDetails) {
          this.direction = addressDetails || this.direction;
          this.onAddressChange.emit(this.direction);
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this._mapboxService.clearAddress();
  }

  ngAfterViewInit(): void {
    this.init();
  }

  async init() {
    await this._mapboxService.createMapSelectUbication(
      this.direction?.lat || this.lat,
      this.direction?.lng || this.lng,
      this.isClickable
    );
    this._mapboxService.addMarker({
      coords: [
        this.direction?.lng || this.lng,
        this.direction?.lat || this.lat,
      ]
    });

    if (this.isClickable) {
      this._mapboxService.map.on('click', this.onMapClick.bind(this));
    }
  }

  onMapClick(e: any) {
    this._mapboxService.setMarker(e.lngLat);
    this._mapboxService
      .reverseGeocode({
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      })
      .subscribe();
  }
}
