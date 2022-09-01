import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompagniaAerea } from '../modelli/CompagniaAerea';
import { Utente } from '../modelli/Utente';
import { AutenticazioneService } from '../servizi/autenticazione.service';
import { NotificaService } from '../servizi/notifica.service';
import { TipoDiNotifica } from '../tipo-di-notifica.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public showLoading!: boolean;
  private sottoscrizioni: Subscription[] = [];

  constructor(private router: Router, private servizioAutenticazione: AutenticazioneService,
              private servizioNotifica: NotificaService) {}

  ngOnInit(): void {
    if (this.servizioAutenticazione.isUserLoggedIn()) {
      if(this.servizioAutenticazione.isUtente()){
          this.router.navigateByUrl('/utente');
      }else{
        this.router.navigateByUrl('/compagnia');
      }
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  public onLogin(utente: Utente): void {
    this.showLoading = true;
    const formData = this.servizioAutenticazione.creaFormPerLogin(utente.username,utente.password);
    this.sottoscrizioni.push(
      this.servizioAutenticazione.login(formData).subscribe(
        (response: HttpResponse<Utente | CompagniaAerea>) => {
          const token = response.headers.get("Jwt-Token");
          this.servizioAutenticazione.saveToken(token);
          this.servizioAutenticazione.addUserToLocalCache(response.body);
          this.servizioAutenticazione.isUserLoggedIn();
          if(this.servizioAutenticazione.isUtente()){
            this.router.navigateByUrl('/utente');
          }
          else{
            this.router.navigateByUrl('/compagnia');
          }
          this.showLoading = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(TipoDiNotifica.ERROR, errorResponse.error.messaggio);
          this.showLoading = false;
        }
      )
    );
  }

  private sendErrorNotification(tipoNotifica: TipoDiNotifica, messaggio: string): void {
    if (messaggio) {
      this.servizioNotifica.notify(tipoNotifica, messaggio);
    } else {
      this.servizioNotifica.notify(tipoNotifica, 'Si è verificato un errore. Riprovare');
    }
  }

  ngOnDestroy(): void {
    this.sottoscrizioni.forEach(sub => sub.unsubscribe());
  }
 

}
