import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit {

  @Input('appLazyImage') imageUrl: string = '';
  @Input() defaultImage: string = 'assets/images/logo.png'; // Puedes poner la ruta de tu imagen por defecto

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const imgElement: HTMLImageElement = this.el.nativeElement;

    // Paso 1: Mostrar imagen por defecto
    this.renderer.setAttribute(imgElement, 'src', this.defaultImage);

    // Paso 2: Crear objeto de imagen para precargar la real
    const img = new Image();
    img.src = this.imageUrl;

    // Paso 3: Cuando se cargue correctamente, se reemplaza
    img.onload = () => {
      this.renderer.setAttribute(imgElement, 'src', this.imageUrl);
    };

    // Paso 4: (Opcional) en caso de error, mantener la default
    img.onerror = () => {
      console.warn('No se pudo cargar la imagen:', this.imageUrl);
    };
  }
}