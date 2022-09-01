import { Utente } from "./Utente";
import { Volo } from "./Volo";

export interface Biglietto{
    dettagli:string;
    utente:Utente|null;
    volo:Volo|null;
    dataAcquisto:string;

}