import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { authGuard } from './guards/auth.guard';
import { IndexProductosComponent } from './components/productos/index-productos/index-productos.component';
import { ShowProductoComponent } from './components/productos/show-producto/show-producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexOrdenesComponent } from './components/usuario/ordenes/index-ordenes/index-ordenes.component';
import { DetalleOrdenComponent } from './components/usuario/ordenes/detalle-orden/detalle-orden.component';
const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'login', component: LoginComponent},
  {path: 'productos', component: IndexProductosComponent },
  {path: 'productos/categoria/:categoria', component: IndexProductosComponent },
  {path: 'productos/:slug', component: ShowProductoComponent },

  {path: 'cuenta/perfil', component: PerfilComponent, canActivate: [authGuard]},
  {path: 'cuenta/direcciones', component: DireccionesComponent, canActivate: [authGuard]},
  {path: 'cuenta/ordenes', component: IndexOrdenesComponent, canActivate: [authGuard]},
  {path: 'cuenta/ordenes/:id', component: DetalleOrdenComponent, canActivate: [authGuard]},

  {path: 'carrito', component: CarritoComponent, canActivate: [authGuard]},

    {path: 'contacto', component: ContactoComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
