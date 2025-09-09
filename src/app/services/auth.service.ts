import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { BehaviorSubject, lastValueFrom, tap } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string
  private usuarioSubject = new BehaviorSubject<string | null>(null);
  usuario$ = this.usuarioSubject.asObservable();
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.url= GLOBAL.url;
    const usuario = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData') || '{}') : undefined
    if (usuario) this.usuarioSubject.next(usuario);
  }

  getToken():any {
    return localStorage.getItem('token')
  }

  getEmailLogged():any {
    return localStorage.getItem('usuario')
  }

  getHeaders() {
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || ''})
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

  refreshToken(refreshToken: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post(this.url + 'login/refresh', {refreshToken: refreshToken}, {headers: headers}).pipe(
      tap((response:any) => {
        localStorage.setItem('token', response.token)
        localStorage.setItem('_id', response.data._id)
      })
    )
  }

  public async isAuthenticated(allowedRoles: string[]): Promise<boolean> {
    const token = localStorage.getItem('token') || ''
    if(!token) {
      return false
    }

    try {
      var decode = this.jwtHelper.decodeToken(token)
      if(!decode) {
        localStorage.removeItem('token')
        return false
      }

      const expired = this.jwtHelper.isTokenExpired(token)

      if(expired) {
        await lastValueFrom(this.refreshToken(localStorage.getItem('refreshToken')))
      }
    } catch (error) {
      localStorage.removeItem('token')
      return false
    }

    return allowedRoles.includes(decode['role'])
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
