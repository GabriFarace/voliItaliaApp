import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagina } from '../modelli/Pagina';
import { Volo } from '../modelli/Volo';

@Injectable({
  providedIn: 'root'
})
export class CompagniaAereaService {

  private host = environment.apiUrl;

  constructor(private http:HttpClient) {}

  public aggiungiVolo(volo : Volo): Observable<Volo>{
    return this.http.post<Volo>(`${this.host}/voli/aggiungiVolo`,volo);
  }

  public ottieniVoliPartiti(page : number = 0, size : number = 10):Observable<Pagina>{
    return this.http.get<Pagina>(`${this.host}/voli/compagnia/partiti?page=${page}&size=${size}`);
  }

  public ottieniVoliNonPartiti(page : number = 0, size : number = 10):Observable<Pagina>{
    return this.http.get<Pagina>(`${this.host}/voli/compagnia/nonPartiti?page=${page}&size=${size}`);
  }

  public modificaVolo(volo:Volo):Observable<Volo>{
    return this.http.put<Volo>(`${this.host}/voli/modificaVolo`,volo);
  }


}
