import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CustomHttpResponse } from '../interfaces/custom-http-response.interface';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  private _pathApi = environment._APIUrl;

  constructor(private http: HttpClient) { }

  getOne<T>(ruta: string, id: number | string): Observable<CustomHttpResponse<T>> {
    return this.http.get<CustomHttpResponse<T>>(this._pathApi + ruta + '/' + id);
  }

  getAll<T>(ruta: string): Observable<CustomHttpResponse<T>> {
    return this.http.get<CustomHttpResponse<T>>(this._pathApi + ruta);
  }

  delete<T>(ruta: string, id: number | string): Observable<CustomHttpResponse<T>> {
    if (id) {
      return this.http.delete<CustomHttpResponse<T>>(this._pathApi + ruta + '/' + id);
    } else {
      return this.http.delete<CustomHttpResponse<T>>(this._pathApi + ruta);
    }
  }

  update<T>(ruta: string, id: number, data: any): Observable<CustomHttpResponse<T>> {
    return this.http.patch<CustomHttpResponse<T>>(this._pathApi + ruta + '/' + id, data);
  }

  patch<T>(ruta: string, data: any): Observable<CustomHttpResponse<T>> {
    return this.http.patch<CustomHttpResponse<T>>(this._pathApi + ruta, data);
  }

  put<T>(ruta: string, data: any): Observable<CustomHttpResponse<T>> {
    return this.http.put<CustomHttpResponse<T>>(this._pathApi + ruta, data);
  }

  post<T>(ruta: string, data: any): Observable<CustomHttpResponse<T>> {
    return this.http.post<CustomHttpResponse<T>>(this._pathApi + ruta, data);
  }

  postWhitImage(ruta: string, data: FormData) {
    return this.http.put(this._pathApi + ruta, data);
  }
}