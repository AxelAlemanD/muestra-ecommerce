import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryManLocationService {

  private location = new BehaviorSubject<{ lat: number; lng: number } | null>(null);
  public currentLocation = this.location.asObservable();

  constructor() { }

  setLocation(newLocation: { lat: number; lng: number }) {
    this.location.next(newLocation)
  }

}
