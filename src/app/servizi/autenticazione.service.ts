import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompagniaAerea } from '../modelli/CompagniaAerea';
import { Utente } from '../modelli/Utente';

@Injectable({
  providedIn: 'root'
})
export class AutenticazioneService {

  public host = environment.apiUrl;
  private token!: string | null;
  private usernameLoggato!: string | null;
  private jwtHelper = new JwtHelperService();
  private eUtente! : boolean;

  constructor(private http: HttpClient) {}

  public login(formData: FormData): Observable<HttpResponse<Utente | CompagniaAerea>> {
    return this.http.post<Utente | CompagniaAerea>(`${this.host}/appVoli/login`, formData, { observe: 'response' });
  }

  public registrazioneUtente(utente: Utente): Observable<Utente> {
    return this.http.post<Utente>(`${this.host}/appVoli/registrazioneUtente`, utente);
  }

  public registrazioneCompagnia(compagniaAerea: CompagniaAerea): Observable<CompagniaAerea> {
    return this.http.post<CompagniaAerea>(`${this.host}/appVoli/registrazioneCompagniaAerea`, compagniaAerea);
  }

  public logOut(): void {
    this.token = null;
    this.usernameLoggato = null;
    localStorage.removeItem('utente');
    localStorage.removeItem('token');
  }

  public saveToken(token: string | null): void {
    this.token = token;
    if(token !== null)
      localStorage.setItem('token', token);
  }

  public addUserToLocalCache(utente: Utente | CompagniaAerea | null): void {
    localStorage.setItem('utente', JSON.stringify(utente));
  }

  public getUserFromLocalCache(): Utente | CompagniaAerea {
    return JSON.parse(localStorage.getItem('utente')!);
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  public getToken(): string | null {
    return this.token;
  }

  public isUtente():  boolean{
    return this.eUtente;

  }


  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== ''){
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.usernameLoggato = this.jwtHelper.decodeToken(this.token).sub;
          this.eUtente = this.jwtHelper.decodeToken(this.token).permessi[0] === 'airline' ? false:true;
          return true;
        }else{
          this.logOut();
          return false;
        }
      }else{
        this.logOut();
        return false;
      }
    } else {
        this.logOut();
        return false;
    }
  }

  public creaFormPerLogin(username : string, password : string) : FormData{
    const formData = new FormData();
    formData.append('username',username);
    formData.append('password',password);
    return formData;
  }
}
