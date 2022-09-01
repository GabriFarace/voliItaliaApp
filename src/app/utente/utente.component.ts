import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, VirtualTimeScheduler } from 'rxjs';
import { Aeroporto } from '../modelli/Aeroporto';
import { CompagniaAerea } from '../modelli/CompagniaAerea';
import { Pagina } from '../modelli/Pagina';
import { RispostaHttp } from '../modelli/RispostaHttp';
import { Utente } from '../modelli/Utente';
import { Volo } from '../modelli/Volo';
import { AutenticazioneService } from '../servizi/autenticazione.service';
import { NotificaService } from '../servizi/notifica.service';
import { UtenteService } from '../servizi/utente.service';
import { TipoDiNotifica } from '../tipo-di-notifica.enum';

@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.css']
})
export class UtenteComponent implements OnInit,OnDestroy {
  private sottoScrizioni: Subscription[] = [];
  public refreshing: boolean = false;

  public utente: Utente;
  public biglietti:Pagina = undefined;
  public viaggi:Pagina = undefined;

  public paginaVoliDiretti:Pagina = undefined;
  public pagineCorrenti:number[]=[0,0,0,0,0]; //[voliDiretti,voliConScalo,voliConDoppioScalo,biglietti,viaggi]
  public messaggiErrore:string[] = ['Errore','',''];
  public paginaVoliConSingoloScalo:Pagina = undefined;
  public paginaVoliConDoppioScalo:Pagina = undefined;

  public voliSelezionati:Volo[]=undefined;
  public indiceVoliSelezionati:number;
  public voloCorrente:Volo = undefined;

  public aeroporti:Aeroporto[]=[];
  public citta: any[]=[];
  public config = {
    labelField: 'label',
    valueField: 'value',
    searchField: ['label', 'value'],
    highlight: false,
    create:false,
    persist:true,
    plugins: ['dropdown_direction', 'remove_button'],
    dropdownDirection: 'down',
    maxItems: 1
  }
  public cittaPartenza:string;
  public cittaDestinazione:string;
  

  constructor(private router : Router, private servizioAutenticazione : AutenticazioneService,
              private servizioNotifica : NotificaService, private servizioUtente : UtenteService) {}       

  public onLogOut(): void {
    this.servizioAutenticazione.logOut();
    this.router.navigate(['/login']);
    this.sendNotification(TipoDiNotifica.SUCCESS, `Log out effettuato con successo`);
  }

  ngOnInit(): void {
    console.log("Nuovo componente");
    this.utente=this.servizioAutenticazione.getUserFromLocalCache() as Utente;
    this.ottieniAeroporti();
  }

  public onGetVoli(form: NgForm){
    this.voloCorrente=this.costruisciVolo(form);
    this.clickButton('direct');
  
  }

  public refresh(tipo:string){
    if(tipo === 'biglietti'){
      this.ottieniBiglietti(0);
    }
    else if(tipo === 'viaggi'){
      this.ottieniViaggi(0);
    }
    else if(this.voloCorrente == undefined){
      this.sendNotification(TipoDiNotifica.WARNING,'Devi effettuare una ricerca prima di caricare i dati');
    }else{
      if(tipo === 'direct'){
        this.ottieniVoliDiretti(0);
      }
      else if(tipo === 'single'){
        this.ottieniVoliConScalo(0);
      }
      else if(tipo === 'double'){
        this.ottieniVoliConDoppioScalo(0);
      }
    }

  }

  public ottieniVoliDiretti(page:number){
    this.paginaVoliDiretti=undefined;
    this.refreshing = true;
    this.sottoScrizioni.push(
      this.servizioUtente.ottieniVoliDiretti(this.voloCorrente,page).subscribe(
        (response: Pagina) => {
          if(response.numPagine>0 && response.numPagine<page+1){
            this.ottieniVoliDiretti(response.numPagine-1);
          }
          else{
            this.pagineCorrenti[0]=page;
            this.paginaVoliDiretti=response;
            this.refreshing = false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.messaggiErrore[0]=errorResponse.error.messaggio;
          this.refreshing = false;
        }
      )
    );
  }

  public ottieniVoliConScalo(page:number){
    this.paginaVoliConSingoloScalo=undefined;
    this.refreshing = true;
    this.sottoScrizioni.push(
      this.servizioUtente.ottieniVoliConScalo(this.voloCorrente,page).subscribe(
        (response: Pagina) => {
          if(response.numPagine>0 && response.numPagine<page+1){
            this.ottieniVoliConScalo(response.numPagine-1);
          }
          else{
            this.pagineCorrenti[1]=page;
            this.paginaVoliConSingoloScalo=response;
            this.refreshing = false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.messaggiErrore[1]=errorResponse.error.messaggio;
          this.refreshing = false;
        }
      )
    );
  }

  public ottieniVoliConDoppioScalo(page:number){
    this.paginaVoliConDoppioScalo=undefined;
    this.refreshing = true;
    this.sottoScrizioni.push(
      this.servizioUtente.ottieniVoliConDoppioScalo(this.voloCorrente,page).subscribe(
        (response: Pagina) => {
          if(response.numPagine>0 && response.numPagine<page+1){
            this.ottieniVoliConDoppioScalo(response.numPagine-1);
          }
          else{
            this.pagineCorrenti[2]=page;
            this.paginaVoliConDoppioScalo=response;
            this.refreshing = false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.messaggiErrore[2]=errorResponse.error.messaggio;
          this.refreshing = false;
        }
      )
    );
  }

  public ottieniAeroporti(){
    this.sottoScrizioni.push(
      this.servizioUtente.ottieniAeroporti().subscribe(
        (response: Aeroporto[]) => {
          this.aeroporti=response;
          for(var i=0;i<this.aeroporti.length;i++){
            if(!this.citta.includes(this.aeroporti[i].citta)){
              this.citta.push({label:this.aeroporti[i].citta,value:this.aeroporti[i].citta});
            }
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(TipoDiNotifica.ERROR, errorResponse.error.messaggio);
        }
      )
    );
  }

  public ottieniBiglietti(page:number){
    this.biglietti=undefined;
    this.sottoScrizioni.push(
      this.servizioUtente.ottieniBiglietti(page).subscribe(
        (response: Pagina) => {
          if(response.numPagine>0 && response.numPagine<page+1){
            this.ottieniBiglietti(response.numPagine-1);
          }
          else{
            this.pagineCorrenti[3]=page;
            this.biglietti=response;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(TipoDiNotifica.ERROR, errorResponse.error.messaggio);
        }
      )
    );
  }

  public ottieniViaggi(page:number){
    this.viaggi=undefined;
    this.sottoScrizioni.push(
      this.servizioUtente.ottieniViaggi(page).subscribe(
        (response: Pagina) => {
          if(response.numPagine>0 && response.numPagine<page+1){
            this.ottieniViaggi(response.numPagine-1);
          }
          else{
            this.pagineCorrenti[4]=page;
            this.viaggi=response;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(TipoDiNotifica.ERROR, errorResponse.error.messaggio);
        }
      )
    );
  }

  public dettagliVolo(voli:Volo[]){
    this.voliSelezionati=voli;
    this.clickButton('details-open');

  }

  public prenotaVoli(){
    this.clickButton('prenota-submit');
    this.clickButton('prenota-close');
  }

  public prenota(indice:number,voli:Volo[]){
    this.voliSelezionati=voli;
    this.indiceVoliSelezionati=indice;
    this.clickButton('prenota-open');

  }

  public onPrenota(formPrenotazione:NgForm){
    formPrenotazione.reset();
    this.sottoScrizioni.push(
      this.servizioUtente.prenota(this.voliSelezionati).subscribe(
        (response: Volo[]) => {
          this.sendNotification(TipoDiNotifica.SUCCESS,'Voli prenotati con successo. Controllare il proprio profilo per i dettagli dei biglietti acquistati');
          if(this.voliSelezionati.length == 1){
            this.paginaVoliDiretti.elementi[this.indiceVoliSelezionati]=response;
          }else if(this.voliSelezionati.length == 2){
            this.paginaVoliConSingoloScalo.elementi[this.indiceVoliSelezionati]=response;
          }else{
            this.paginaVoliConDoppioScalo.elementi[this.indiceVoliSelezionati]=response;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(TipoDiNotifica.ERROR, errorResponse.error.messaggio);
          if(this.voliSelezionati.length == 1){
            this.ottieniVoliDiretti(this.pagineCorrenti[0]);
          }else if(this.voliSelezionati.length == 2){
            this.ottieniVoliConScalo(this.pagineCorrenti[1]);
          }else{
            this.ottieniVoliConDoppioScalo(this.pagineCorrenti[2]);
          }
        }
      )
    );

  }

  public ricercaVoli(){
    this.clickButton('ricerca-submit');
    this.clickButton('search-close');
  }

  public cambioOpzione($event: any){
    console.log("Opzioni cambiate, ", $event);
  }



  costruisciVolo(form: NgForm): Volo{
    const volo=new Volo();
    if(form.value.dataPartenza !== null && form.value.dataPartenza !== undefined && form.value.dataPartenza!==''){
      volo.dataPartenza=form.value.dataPartenza+' 00:00:00';
    }

    if(form.value.prezzoBiglietto !== null && form.value.prezzoBiglietto !== undefined){
      volo.prezzoBiglietto=form.value.prezzoBiglietto;
    }

    const compagniaAerea=new CompagniaAerea();
    if(form.value.nomeCompagnia !== null && form.value.nomeCompagnia !== undefined){
      compagniaAerea.nome=form.value.nomeCompagnia;
    }
    volo.compagniaAerea=compagniaAerea;

    const aeroportoPartenza=new Aeroporto();
    if(this.cittaPartenza){
      aeroportoPartenza.citta=this.cittaPartenza;
    }
    volo.aeroportoPartenza=aeroportoPartenza;

    const aeroportoDestinazione=new Aeroporto();
    if(this.cittaDestinazione){
      aeroportoDestinazione.citta=this.cittaDestinazione;
    }
    volo.aeroportoDestinazione=aeroportoDestinazione;

    return volo;
  }


  private sendNotification(tipoDiNotifica: TipoDiNotifica, messaggio: string): void {
    if (messaggio) {
      this.servizioNotifica.notify(tipoDiNotifica, messaggio);
    } else {
      this.servizioNotifica.notify(tipoDiNotifica, 'Si è verificato un errore. Riprovare');
    }
  }

  private clickButton(buttonId: string): void {
      document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.sottoScrizioni.forEach(sub => sub.unsubscribe());
  }


}
