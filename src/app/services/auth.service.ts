import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { GenericService } from './generic.service';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { CartRepo } from '../shared/repositories/cart.repository';
import { CustomerRepo } from '../shared/repositories/customer.repository';
import { HttpEntitiesEnum } from '../shared/enums/http-entities.enum';
import { IAuthResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _accessToken: string = '';
  private _userId: string = '';
  private readonly _authenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly _customerRepo: CustomerRepo,
    private readonly _cartRepo: CartRepo,
    private readonly _genericService: GenericService,
    private readonly _router: Router,
  ) {
    if (this.accessToken) {
      this._authenticatedSubject.next(true);
    }
  }

  set accessToken(token: string) {
    localStorage.setItem(environment._accessToken, token);
  }

  get accessToken(): string {
    return this._accessToken || (localStorage.getItem(environment._accessToken) ?? '');
  }

  set userId(token: string) {
    localStorage.setItem(environment._userId, token);
  }

  get userId(): string {
    return this._userId || (localStorage.getItem(environment._userId) ?? '');
  }

  get authenticated$(): Observable<boolean> {
    return this._authenticatedSubject.asObservable();
  }

  get authenticatedValue(): boolean {
    return this._authenticatedSubject.value;
  }

  setToLocal(res: IAuthResponse) {
    localStorage.setItem(
      environment._accessToken,
      res.token
    );

    localStorage.setItem(
      environment._userId,
      res.cliente_info.id + ''
    );
  }

  login(data: { clientes: string; password: string }, remember: boolean = true) {
    return this._genericService
      .post<any[]>(`${HttpEntitiesEnum.CUSTOMERS}/login`, data)
      .pipe(
        tap((resp) => {
          if (resp.message === 404) {
            throw new Error(resp.data[0]);
          }
          if (remember) {
            this.accessToken = resp.data[0].token;
            this.userId = resp.data[0].cliente_info.id + '';
          }
          this._accessToken = resp.data[0].token;
          this._userId = resp.data[0].cliente_info.id + '';
          this._authenticatedSubject.next(true);
          this._customerRepo.setCustomer(resp.data[0].cliente_info);
        })
      );
  }

  async logout() {
    sessionStorage.clear();
    localStorage.clear();
    this._accessToken = '';
    this._userId = '';
    this._customerRepo.resetCustomer();
    this._cartRepo.resetCart();
    this._authenticatedSubject.next(false);
    this._router.navigate(['/']);
  }
}
