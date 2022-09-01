import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticazioneService } from '../servizi/autenticazione.service';
import { NotificaService } from '../servizi/notifica.service';
import { TipoDiNotifica } from '../tipo-di-notifica.enum';

@Injectable({
  providedIn: 'root'
})
export class AutenticazioneGuard implements CanActivate {

  constructor(private servizioAutenticazione: AutenticazioneService, private router: Router,
    private servizioNotifica: NotificaService) {}

canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  return this.isUserLoggedIn();
}

private isUserLoggedIn(): boolean {
    if (this.servizioAutenticazione.isUserLoggedIn()) {
      return true;
  }
  this.router.navigate(['/login']);
  this.servizioNotifica.notify(TipoDiNotifica.ERROR, `Devi fare il login per accedere a questa pagina`);
  return false;
  }
}
