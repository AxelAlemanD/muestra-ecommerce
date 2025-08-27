/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _subject = new Subject<boolean>();
  private _renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }
  
  show() {
    this._subject.next(true);
    this._renderer.addClass(document.body, 'loading--open');
  }

  hide() {
    this._subject.next(false);
    this._renderer.removeClass(document.body, 'loading--open');
  }

  get getState() {
    return this._subject;
  }
}
