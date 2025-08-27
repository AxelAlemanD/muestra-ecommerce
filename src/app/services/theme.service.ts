import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  init() {
    if (!this.theme) {
      this.set('light-theme');
    } else {
      this.set(this.theme);
    }
  }

  set(theme: 'light-theme' | 'dark-theme') {
    if (this.theme) {
      this.renderer.removeClass(document.body, this.theme);
      localStorage.removeItem(environment._theme);
    }
    this.renderer.addClass(document.body, theme);
    localStorage.setItem(environment._theme, theme);
  }

  get theme(): 'light-theme' | 'dark-theme' | null {
    return localStorage.getItem(environment._theme) as any;
  }
}
