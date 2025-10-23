import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  private url: string;
  private headers: any

  constructor(private http: HttpClient, private authService: AuthService) {
    this.url = GLOBAL.url + 'ventas';
    this.headers = this.authService.getHeaders()
  }

  obtenerListaOrdenes(usuario:any){
    return this.http.get(this.url + '/obtener-ventas-usuario/' + usuario, {headers: this.headers})
  }
}
