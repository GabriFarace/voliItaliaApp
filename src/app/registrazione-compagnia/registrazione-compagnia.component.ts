import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompagniaAerea } from '../modelli/CompagniaAerea';
import { AutenticazioneService } from '../servizi/autenticazione.service';
import { NotificaService } from '../servizi/notifica.service';
import { TipoDiNotifica } from '../tipo-di-notifica.enum';

@Component({
  selector: 'app-registrazione-compagnia',
  templateUrl: './registrazione-compagnia.component.html',
  styleUrls: ['./registrazione-compagnia.component.css']
})
export class RegistrazioneCompagniaComponent implements OnInit {

  
  public showLoading!: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private servizioAutenticazione: AutenticazioneService,
              private servizioNotifica: NotificaService) {}

  ngOnInit(): void {
    if (this.servizioAutenticazione.isUserLoggedIn()) {
      if(this.servizioAutenticazione.isUtente()){
        this.router.navigateByUrl('/utente');
      }else{
        this.router.navigateByUrl('/compagnia');
      }
    }
  }

  public onRegister(compagnia: CompagniaAerea): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.servizioAutenticazione.registrazioneCompagnia(compagnia).subscribe(
        (response: CompagniaAerea) => {
          this.showLoading = false;
          this.sendNotification(TipoDiNotifica.SUCCESS, `Un nuovo account è stato creato per ${response.nome}.
          Effettuare il login con le credenziali create`);
          this.router.navigateByUrl('/login');
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(TipoDiNotifica.ERROR, errorResponse.error.messaggio);
          this.showLoading = false;
        }
      )
    );
  }

  private sendNotification(tipoDiNotifica: TipoDiNotifica, message: string): void {
    if (message) {
      this.servizioNotifica.notify(tipoDiNotifica, message);
    } else {
      this.servizioNotifica.notify(tipoDiNotifica, 'Si è verificato un errore. Riprovare');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
