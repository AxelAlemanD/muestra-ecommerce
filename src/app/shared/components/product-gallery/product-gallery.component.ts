import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IMedia } from '../../../interfaces/media.interface';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { UploadsPipe } from '../../pipes/uploads.pipe';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { LazyImageDirective } from '../../directives/lazy-image.directive';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [
    CommonModule,
    SlickCarouselModule,
    CustomButtonComponent,
    UploadsPipe,
    LazyImageDirective
  ],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGalleryComponent implements OnInit {

  currentIndex: number = 0;
  activeMedia!: IMedia;

  thumbnailOptions: any;

  mainOptions = {
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    dots: true,
    arrows: false,
    speed: 700,
  };

  @Input() medias: IMedia[] = [];
  @Input() thumbnailsToShow: number = 4;

  @ViewChild('mainOwlCarousel', { static: false }) mainOwlCarousel!: SlickCarouselComponent;
  @ViewChild('thumbnailsOwlCarousel', { static: false }) thumbnailsOwlCarousel!: SlickCarouselComponent;
  
  ngOnInit() {
    this.activeMedia = this.medias[0];
    this.thumbnailOptions = {
      infinite: false,
      slidesToShow: this.thumbnailsToShow,
      slidesToScroll: 1,
      autoplay: false,
      arrows: false,
      speed: 700,
      responsive: [
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 3
          }
        },
      ]
    };
  }

  changeByIndex(index: number) {
    if (index >= 0 && index < this.medias.length) {
      this.currentIndex = index;
      this.activeMedia = this.medias[index];
      this.mainOwlCarousel.slickGoTo(index);
      this.thumbnailsOwlCarousel.slickGoTo(index);
    }
  }

  changeActiveMedia(media: IMedia) {
    this.activeMedia = media;
    this.currentIndex = this.medias.findIndex(media => this.activeMedia.id == media.id);
    this.mainOwlCarousel.slickGoTo(this.currentIndex);
    this.thumbnailsOwlCarousel.slickGoTo(this.currentIndex);
  }

}
