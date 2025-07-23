import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { BehaviorSubject, tap } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string
  private usuarioSubject = new BehaviorSubject<string | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    this.url= GLOBAL.url;
    const usuario = JSON.parse(localStorage.getItem('userData') || '{}')
    if (usuario) this.usuarioSubject.next(usuario);
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

  setUsuario(usuario: string) {
    localStorage.setItem('userData', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  login(data: any){
    console.log(data)
    let headers= new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post(this.url + 'login', data, {headers: headers}).pipe(
      tap((response: any)=> {
        localStorage.setItem('token', response.token)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('_id', response.data._id)
        localStorage.setItem('email', response.data.email)
        //localStorage.setItem('userData', response.data)
        this.setUsuario(response.data)
      })
    )
  }

  logout(){
    localStorage.removeItem('_id')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('email')
    localStorage.removeItem('userData')
    localStorage.clear()
    this.usuarioSubject.next('');
  }
}
