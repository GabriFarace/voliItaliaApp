import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutenticazioneService } from '../servizi/autenticazione.service';

@Injectable()
export class AutenticazioneInterceptor implements HttpInterceptor {

  constructor(private servizioAutenticazione: AutenticazioneService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes(`${this.servizioAutenticazione.host}/appVoli/login`)) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(`${this.servizioAutenticazione.host}/appVoli/registrazioneUtente`)) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(`${this.servizioAutenticazione.host}/appVoli/registrazioneCompagniaAerea`)) {
      return httpHandler.handle(httpRequest);
    }
    this.servizioAutenticazione.loadToken();
    const token = this.servizioAutenticazione.getToken();
    const request = httpRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` }});
    return httpHandler.handle(request);
  }
}
