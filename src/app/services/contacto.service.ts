import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private url: string;
  private headers: any

  constructor(private http: HttpClient, private authService: AuthService) {
    this.url = GLOBAL.url + 'contacto';
    this.headers = this.authService.getHeaders()
  }

  enviarMensaje(data: any){
    return this.http.post(this.url, data, {headers: this.headers})
  }
}
