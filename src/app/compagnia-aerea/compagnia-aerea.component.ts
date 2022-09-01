import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Aeroporto } from '../modelli/Aeroporto';
import { CompagniaAerea } from '../modelli/CompagniaAerea';
import { Pagina } from '../modelli/Pagina';
import { Volo } from '../modelli/Volo';
import { AutenticazioneService } from '../servizi/autenticazione.service';
import { CompagniaAereaService } from '../servizi/compagnia-aerea.service';
import { NotificaService } from '../servizi/notifica.service';
import { UtenteService } from '../servizi/utente.service';
import { TipoDiNotifica } from '../tipo-di-notifica.enum';

@Component({
  selector: 'app-compagnia-aerea',
  templateUrl: './compagnia-aerea.component.html',
  styleUrls: ['./compagnia-aerea.component.css']
})
export class CompagniaAereaComponent implements OnInit,OnDestroy {
  private sottoScrizioni: Subscription[] = [];

  public compagnia: CompagniaAerea;
  public paginaVoliPartiti:Pagina = undefined;
  public paginaVoliNonPartiti:Pagina = undefined;
  public pagineCorrenti:number[]=[0,0];

  public indiceVoloCorrente:number;

  public aeroporti:Aeroporto[]=[];
  public nomiAeroporti: any[]=[];
  public config = {
    labelField: 'label',
    valueField: 'value',
    searchField: ['label', 'value'],
    highlight: false,
    create:false,
    persist:true,
    plugins: ['dropdown_direction', 'remove_button'],
    dropdownDirection: 'down',
    minItems: 1,
    maxItems: 1
  }
  public nomeAeroportoPartenza:string;
  public nomeAeroportoDestinazione:string;
  

  constructor(private router : Router, private servizioAutenticazione : AutenticazioneService,
              private servizioNotifica : NotificaService, private servizioCompagnia : CompagniaAereaService,
              private servizioUtente : UtenteService) {}       

  public onLogOut(): void {
    this.servizioAutenticazione.logOut();
    this.router.navigate(['/login']);
    this.sendNotification(TipoDiNotifica.SUCCESS, `Log out effettuato con successo`);
  }

  ngOnInit(): void {
    this.compagnia=this.servizioAutenticazione.getUserFromLocalCache() as CompagniaAerea;
    this.ottieniAeroporti();
  }

  public ottieniVoliNonPartiti(page:number){
    this.paginaVoliNonPartiti=undefined;
    this.sottoScrizioni.push(
      this.servizioCompagnia.ottieniVoliNonPartiti(page).subscribe(
        (response: Pagina) => {
          if(response.numPagine > 0 && response.numPagine<page+1){
            this.ottieniVoliNonPartiti(response.numPagine-1);
          }else{
            this.pagineCorrenti[0]=page;
            this.paginaVoliNonPartiti=response;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(TipoDiNotifica.ERROR, errorResponse.error.messaggio);
        }
      )
    );
  }

  public ottieniVoliPartiti(page:number){
    this.paginaVoliPartiti=undefined;
    this.sottoScrizioni.push(
      this.servizioCompagnia.ottieniVoliPartiti().subscribe(
        (response: Pagina) => {
          if(response.numPagine > 0 && response.numPagine<page+1){
            this.ottieniVoliPartiti(response.numPagine-1);
          }
          else{
            this.pagineCorrenti[1]=page;
            this.paginaVoliPartiti=response;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(TipoDiNotifica.ERROR, errorResponse.error.messaggio);
        }
      )
    );
  }

  public aggiungiVolo(form: NgForm){
    const volo=this.costruisciVolo(form);
    this.sottoScrizioni.push(
      this.servizioCompagnia.aggiungiVolo(volo).subscribe(
        (response: Volo) => {
          this.sendNotification(TipoDiNotifica.SUCCESS,'Volo inserito con successo, controllare i prossimi voli per maggiori dettagli');
        },
        (errorResponse: HttpErrorResponse) => {   
          this.sendNotification(TipoDiNotifica.ERROR, errorResponse.error.messaggio);  
        }
      )
    );
  }

  public addVolo(){
    this.clickButton('aggiungi-submit');
    this.clickButton('aggiungi-close');
  }


  public ottieniAeroporti(){
    this.sottoScrizioni.push(
      this.servizioUtente.ottieniAeroporti().subscribe(
        (response: Aeroporto[]) => {
          this.aeroporti=response;
          for(var i=0;i<this.aeroporti.length;i++){   
            this.nomiAeroporti.push({label:this.aeroporti[i].nome,value:this.aeroporti[i].nome});  
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(TipoDiNotifica.ERROR, errorResponse.error.messaggio);
        }
      )
    );
  }

  public cambiaPrezzo(form: NgForm){
    var nuovoVolo : Volo=JSON.parse(JSON.stringify(this.paginaVoliNonPartiti.elementi[this.indiceVoloCorrente]));
    nuovoVolo.prezzoBiglietto=form.value.nuovoPrezzo;
    this.sottoScrizioni.push(
      this.servizioCompagnia.modificaVolo(nuovoVolo).subscribe(
        (response: Volo) => {
          this.paginaVoliNonPartiti.elementi[this.indiceVoloCorrente]=response;
          this.sendNotification(TipoDiNotifica.SUCCESS,'Volo modificato con successo');
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(TipoDiNotifica.ERROR,errorResponse.error.messaggio);
        }
      )
    );
  }

  public cambia(){
    this.clickButton('update-submit');
    this.clickButton('update-close');
  }

  public modificaVolo(indice:number){
    this.indiceVoloCorrente=indice;
    this.clickButton('update-open');
  }

  costruisciVolo(form: NgForm): Volo{
    const volo=new Volo();


    const dataPartenza: string = form.value.dataPartenza;
    const dataP=dataPartenza.substring(0,dataPartenza.indexOf("T"))+' '+dataPartenza.substring(dataPartenza.indexOf("T")+1);
    volo.dataPartenza=dataP+':00';

    const dataDestinazione: string = form.value.dataDestinazione;
    const dataD=dataDestinazione.substring(0,dataDestinazione.indexOf("T"))+' '+dataDestinazione.substring(dataDestinazione.indexOf("T")+1);
    volo.dataDestinazione=dataD+':00';

    const scadenzaPrenotazione: string = form.value.scadenzaPrenotazione;
    const dataS=scadenzaPrenotazione.substring(0,scadenzaPrenotazione.indexOf("T"))+' '+scadenzaPrenotazione.substring(scadenzaPrenotazione.indexOf("T")+1);
    volo.scadenzaPrenotazione=dataS+':00';
    

    
    volo.prezzoBiglietto=form.value.prezzoBiglietto; 

    volo.numPosti=form.value.numPosti;

    const aeroportoPartenza=new Aeroporto();
    aeroportoPartenza.nome=this.nomeAeroportoPartenza;
     volo.aeroportoPartenza=aeroportoPartenza;

    const aeroportoDestinazione=new Aeroporto();
    aeroportoDestinazione.nome=this.nomeAeroportoDestinazione;
    volo.aeroportoDestinazione=aeroportoDestinazione;

    return volo;
  }

  public cambioOpzione($event: any){
    console.log("Opzioni cambiate, ", $event);
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
