import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { SwiperModule } from 'angular2-useful-swiper';
import { QRCodeModule } from 'angular2-qrcode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { TicketHolderComponent } from './components/ticket-holder/ticket-holder.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { StartupComponent } from './components/startup/startup.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HeaderComponent } from './components/header/header.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SettingComponent } from './components/setting/setting.component';
import { MainComponent } from './components/main/main.component';
import { AuthRegisterComponent } from './components/auth-register/auth-register.component';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import { AuthConfirmComponent } from './components/auth-confirm/auth-confirm.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignOutComponent } from './components/sign-out/sign-out.component';
import { SasakiService } from './service/sasaki/sasaki.service';
import { AuthGuardService } from './service/auth-guard/auth-guard.service';
import { TimeFormatPipe } from './pipe/time-format/time-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TicketHolderComponent,
    TicketComponent,
    StartupComponent,
    NavigationComponent,
    HeaderComponent,
    PurchaseComponent,
    NotFoundComponent,
    SettingComponent,
    MainComponent,
    AuthRegisterComponent,
    AuthLoginComponent,
    AuthConfirmComponent,
    SignInComponent,
    SignOutComponent,
    TimeFormatPipe
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    MomentModule,
    SwiperModule,
    AppRoutingModule,
    ReactiveFormsModule,
    QRCodeModule
  ],
  providers: [
    SasakiService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
