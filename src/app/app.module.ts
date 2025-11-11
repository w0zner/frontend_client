import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { SidebarComponent } from './components/usuario/sidebar/sidebar.component';
import { IndexProductosComponent } from './components/productos/index-productos/index-productos.component';
import { NouisliderModule } from "ng2-nouislider";
import { registerLocaleData } from '@angular/common';
import localePy from '@angular/common/locales/es-PY';
import { ShowProductoComponent } from './components/productos/show-producto/show-producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { DescuentoPipe } from './pipes/descuento.pipe';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexOrdenesComponent } from './components/usuario/ordenes/index-ordenes/index-ordenes.component';
import { DetalleOrdenComponent } from './components/usuario/ordenes/detalle-orden/detalle-orden.component';
import { IndexReviewComponent } from './components/usuario/reviews/index-review/index-review.component';

registerLocaleData(localePy, 'es-PY');

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    PerfilComponent,
    SidebarComponent,
    IndexProductosComponent,
    ShowProductoComponent,
    CarritoComponent,
    DireccionesComponent,
    DescuentoPipe,
    ContactoComponent,
    IndexOrdenesComponent,
    DetalleOrdenComponent,
    IndexReviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NouisliderModule,
    NgbModule
],
  providers: [
     { provide: LOCALE_ID, useValue: 'es-PY' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
