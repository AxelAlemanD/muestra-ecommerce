import { Injectable } from '@angular/core';
import { Marker, Map } from 'mapbox-gl';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  map!: Map;
  geocoder!: MapboxGeocoder;
  style = 'mapbox://styles/mapbox/streets-v11';
  public ubicationPoint!: Marker;
  private direction = new BehaviorSubject<any | null>(null);
  public selectedAddress = this.direction.asObservable();

  constructor(private readonly httpClient: HttpClient) {
    this.geocoder = new MapboxGeocoder({
      accessToken: environment._mapBoxKey,
      mapboxgl: mapboxgl,
      reverseGeocode: true,
      marker: false,
    });
  }

  async createMapSelectUbication(
    lat: number = 0,
    lng: number = 0,
    isClickable: boolean = true
  ) {
    this.map = new Map({
      container: 'map',
      accessToken: environment._mapBoxKey,
      style: this.style,
      center: [lng, lat],
      zoom: 13,
    });

    const thiss = this;

    this.map.on('idle', function () {
      thiss.map.resize();
    });

    if (isClickable) {
      this.map.addControl(this.geocoder);
      this.geocoder.on('result', (event: any) => {
        thiss.setMarker(event.result.center);
        const coords = {
          lng: event.result.center[0],
          lat: event.result.center[1],
        };
        thiss.reverseGeocode(coords).subscribe();
      });
    }
  }

  setMarker(coords: any = null) {
    this.ubicationPoint.remove();
    this.ubicationPoint = new Marker().setLngLat(coords).addTo(this.map);
  }

  addMarker(options: {
    coords: mapboxgl.LngLatLike;
    icon?: HTMLDivElement;
    popup?: { title: string; description: string; };
  }): Marker {

    this.ubicationPoint = (options.icon)
      ? new Marker({ element: options.icon }).setLngLat(options.coords).addTo(this.map)
      : new Marker().setLngLat(options.coords).addTo(this.map);

    if (options.popup) {
      const html = `<h5 class="mb-1">${options.popup.title}</h5><p class="mb-1">${options.popup.description}</p>`
      this.ubicationPoint.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(html));
    }

    return this.ubicationPoint;
  }

  updateMarkerUbication(marker: Marker, coords: mapboxgl.LngLatLike) {
    marker.setLngLat(coords).addTo(this.map);
  }

  clearAddress() {
    this.direction.next(null);
  }

  reverseGeocode(coords: { lng: number; lat: number }) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?access_token=${environment._mapBoxKey}`;
    return this.httpClient.get(url).pipe(
      map((response: any) => {
        let details: any = {
          lat: coords.lat,
          lng: coords.lng,
          zip_code: '',
          city: '',
          state: '',
          country: '',
          address: '',
        };
        response.features.map((feature: any) => {
          switch (feature.id.split('.')[0]) {
            case 'postcode':
              details.zip_code = feature.text;
              break;
            case 'address':
              details.address = feature.place_name;
              break;
            case 'place':
              details.city = feature.text;
              break;
            case 'region':
              details.state = feature.properties.short_code;
              break;
            case 'country':
              details.country = feature.properties.short_code;
              break;
          }
        });
        this.direction.next(details);
        return details;
      })
    );
  }
}
