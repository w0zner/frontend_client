import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string

  constructor(private http: HttpClient) {
    this.url= GLOBAL.url;
  }

  getToken():any {
    return localStorage.getItem('token')
  }

  getEmailLogged():any {
    return localStorage.getItem('usuario')
  }

  getHeaders() {
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.getToken()})
    return headers;
  }

  login(data: any){
    console.log(data)
    let headers= new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post(this.url + 'login', data, {headers: headers}).pipe(
      tap((response: any)=> {
        localStorage.setItem('token', response.token)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('_id', response.data._id)
        localStorage.setItem('usuario', response.data.email)
      })
    )
  }
}
