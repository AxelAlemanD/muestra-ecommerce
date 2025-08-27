import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidePanelService {

  private openSidePanel = new BehaviorSubject<'mobile-sidemenu' | 'mobile-side-filters' | null>(null);
  openSidePanel$ = this.openSidePanel.asObservable();
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  open(panel: 'mobile-sidemenu' | 'mobile-side-filters') {
    this.openSidePanel.next(panel);
    this.renderer.addClass(document.body, 'side-panel--open');
  }

  close() {
    this.openSidePanel.next(null);
    this.renderer.removeClass(document.body, 'side-panel--open');
  }
}
