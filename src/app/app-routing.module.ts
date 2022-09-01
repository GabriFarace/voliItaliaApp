import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompagniaAereaComponent } from './compagnia-aerea/compagnia-aerea.component';
import { AutenticazioneGuard } from './guardie/autenticazione.guard';
import { LoginComponent } from './login/login.component';
import { RegistrazioneCompagniaComponent } from './registrazione-compagnia/registrazione-compagnia.component';
import { RegistrazioneUtenteComponent } from './registrazione-utente/registrazione-utente.component';
import { UtenteComponent } from './utente/utente.component';

const routes: Routes = [  { path: 'login', component: LoginComponent },
{ path: 'registrazioneUtente', component: RegistrazioneUtenteComponent },
{ path: 'registrazioneCompagnia', component: RegistrazioneCompagniaComponent },
{ path: 'utente', component: UtenteComponent, canActivate: [AutenticazioneGuard] },
{ path: 'compagnia', component: CompagniaAereaComponent, canActivate: [AutenticazioneGuard] },
{ path: '', redirectTo: '/login', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
