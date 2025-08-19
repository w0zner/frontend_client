import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private url: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.url = GLOBAL.url + 'productos/';
  }

  obtenerProductoPorSlug(slug: any) {
    let headers= new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get( this.url + 'obtener-por-slug/' +  slug, {headers: headers})
  }
}
