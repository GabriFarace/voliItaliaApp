import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { TipoDiNotifica } from '../tipo-di-notifica.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificaService {

  
  constructor(private notifier: NotifierService) {}

  public notify(tipo: TipoDiNotifica, messaggio: string) {
    this.notifier.notify(tipo, messaggio);
  }
}
