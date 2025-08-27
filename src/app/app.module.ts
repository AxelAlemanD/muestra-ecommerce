import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// Third-party modules
import { ModalModule } from 'ngx-bootstrap/modal';
// Own Modules
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { BranchRepo } from './shared/repositories/branch.repository'
import { MobileNavbarComponent } from './shared/components/mobile-navbar/mobile-navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoadingService } from './services/loading.service';
import { RequestInterceptor } from './shared/interceptor/request.interceptor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '../environments/environment';
import { CustomButtonComponent } from './shared/components/custom-button/custom-button.component';
import { OrderStatusPipe } from './shared/pipes/order-status.pipe';

@NgModule({
  declarations: [AppComponent],
  imports: [
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    NgxStripeModule.forRoot(environment._stripeKey),
    SweetAlert2Module.forRoot(),
    NavbarComponent,
    MobileNavbarComponent,
    FooterComponent,
    HttpClientModule,
    LoadingComponent,
    CustomButtonComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    BranchRepo,
    LoadingService,
    OrderStatusPipe,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
