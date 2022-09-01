import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Aeroporto } from '../modelli/Aeroporto';
import { Biglietto } from '../modelli/Biglietto';
import { Pagina } from '../modelli/Pagina';
import { Volo } from '../modelli/Volo';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
 
  private host = environment.apiUrl;

  constructor(private http:HttpClient) {}

  public ottieniVoliDiretti(volo : Volo, page : number = 0, size : number = 10) : Observable<Pagina>{
      return this.http.post<Pagina>(`${this.host}/voli/diretti/${page}/${size}`, volo);

  }

  public ottieniVoliConScalo(volo : Volo, page : number = 0, size : number = 10) : Observable<Pagina>{
    return this.http.post<Pagina>(`${this.host}/voli/conScalo/${page}/${size}`, volo);

}

  public ottieniVoliConDoppioScalo(volo : Volo, page : number = 0, size : number = 10) : Observable<Pagina>{
    return this.http.post<Pagina>(`${this.host}/voli/conDoppioScalo/${page}/${size}`, volo);
  }

  public prenota(voli : Volo[]) : Observable<Volo[]>{
    return this.http.post<Volo[]>(`${this.host}/voli/prenota`,voli);
  }

  public ottieniBiglietti(page : number = 0, size : number = 10):Observable<Pagina>{
    return this.http.get<Pagina>(`${this.host}/biglietti/validi?page=${page}&size=${size}`);
  }

  public ottieniViaggi(page : number = 0, size : number = 10):Observable<Pagina>{
    return this.http.get<Pagina>(`${this.host}/biglietti/scaduti?page=${page}&size=${size}`);
  }

  public ottieniAeroporti():Observable<Aeroporto[]>{
    return this.http.get<Aeroporto[]>(`${this.host}/aeroporti`);
  }

  
}
