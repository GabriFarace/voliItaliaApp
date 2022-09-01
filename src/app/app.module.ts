import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UtenteComponent } from './utente/utente.component';
import { CompagniaAereaComponent } from './compagnia-aerea/compagnia-aerea.component';
import { LoginComponent } from './login/login.component';
import { RegistrazioneUtenteComponent } from './registrazione-utente/registrazione-utente.component';
import { RegistrazioneCompagniaComponent } from './registrazione-compagnia/registrazione-compagnia.component';
import { NotificationModule } from './notification.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CompagniaAereaService } from './servizi/compagnia-aerea.service';
import { UtenteService } from './servizi/utente.service';
import { AutenticazioneService } from './servizi/autenticazione.service';
import { AutenticazioneGuard } from './guardie/autenticazione.guard';
import { NotificaService } from './servizi/notifica.service';
import { AutenticazioneInterceptor } from './interceptor/autenticazione.interceptor';
import { NgSelectizeModule } from 'ng-selectize';

@NgModule({
  declarations: [
    AppComponent,
    UtenteComponent,
    CompagniaAereaComponent,
    LoginComponent,
    RegistrazioneUtenteComponent,
    RegistrazioneCompagniaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NotificationModule,
    FormsModule,
    HttpClientModule,
    NgSelectizeModule
  ],
  providers: [NotificaService, AutenticazioneGuard, AutenticazioneService, UtenteService, CompagniaAereaService,
    { provide: HTTP_INTERCEPTORS, useClass: AutenticazioneInterceptor, multi: true } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
