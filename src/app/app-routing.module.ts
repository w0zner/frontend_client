import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { authGuard } from './guards/auth.guard';
const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'login', component: LoginComponent},

  {path: 'cuenta/perfil', component: PerfilComponent, canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
