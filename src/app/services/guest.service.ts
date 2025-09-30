import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private url: string;
  private urlDescuentos: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.url = GLOBAL.url + 'productos/';
    this.urlDescuentos = GLOBAL.url + 'descuentos/';
  }

  obtenerProductoPorSlug(slug: any) {
    let headers= new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get( this.url + 'obtener-por-slug/' +  slug, {headers: headers})
  }

  obtenerProductosRecomendados(categoria: any) {
    let headers= new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get( this.url + 'listar-productos-recomendados/' +  categoria, {headers: headers})
  }

  obtenerDescuentosActivos() {
    let headers= new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get( this.urlDescuentos + 'obtener-descuentos', {headers: headers})
  }
}
