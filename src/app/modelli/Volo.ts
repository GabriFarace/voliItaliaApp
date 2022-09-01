import { Aeroporto } from "./Aeroporto";
import { CompagniaAerea } from "./CompagniaAerea";

export class Volo{
    public id:number|null; 
    public aeroportoPartenza:Aeroporto|null;
    public aeroportoDestinazione:Aeroporto|null;
    public scadenzaPrenotazione:string|null;
    public dataPartenza:string|null;
    public dataDestinazione:string|null;
    public compagniaAerea:CompagniaAerea|null;
    public numPosti:number|null;
    public prezzoBiglietto:number|null;
    public numBigliettiDisponibili:number|null;
    public incasso:number|null;

    constructor(){
        this.id=null;
        this.aeroportoPartenza=null;
        this.aeroportoDestinazione=null;
        this.scadenzaPrenotazione=null;
        this.dataDestinazione=null;
        this.dataPartenza=null;
        this.compagniaAerea=null;
        this.numPosti=null;
        this.prezzoBiglietto=null;
        this.numBigliettiDisponibili=null;
        this.incasso=null;

    }
}