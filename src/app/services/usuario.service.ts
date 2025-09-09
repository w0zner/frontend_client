import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url: string;
  private urlUsuarioCliente: string;
  private headers: any

  constructor(private http: HttpClient, private authService: AuthService) {
    this.url = GLOBAL.url + 'usuarios'
    this.urlUsuarioCliente = GLOBAL.url + 'usuarios/cliente'
    this.headers = this.authService.getHeaders()
  }

  listar(tipo: any, filtro: any) {
    return this.http.get(this.url + "/buscar/" + tipo + "/" + filtro, {headers: this.headers})
  }

  registrar(data: any) {
    return this.http.post(this.url, data, {headers: this.headers})
  }

  update(id: string, data:any) {
    return this.http.put(this.url + "/" + id, data,{headers: this.headers})
  }

  delete(id:any) {
    return this.http.delete(this.url + "/" + id, {headers: this.headers})
  }

  // getById(id: any) {
  //   return this.http.get(this.url + "/cliente/" + id, {headers: this.headers}).pipe(
  //     tap((response:any) => {
  //       localStorage.setItem('userData', JSON.stringify(response.data))
  //       if (response.data) this.usuarioSubject.next(response.data);
  //     })
  //   )
  // }

  updateUsuarioCliente(id: string, data:any) {
    return this.http.put(this.urlUsuarioCliente + "/" + id, data,{headers: this.headers})
  }

  registro(data: any){
    console.log(data)
    let headers= new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post(this.url + 'registro', data, {headers: headers})
  }

  obtenerConfiguracionPublica() {
    return this.http.get(GLOBAL.url + 'config', {headers: new HttpHeaders({'Content-Type': 'application/json'})})
  }

  obtenerCiudades() {
    return this.http.get('./assets/data/ciudades_paraguay.json')
  }

  registrarDireccion(data: any){
    return this.http.post(this.url + '/direccion', data, {headers: this.headers})
  }

  obtenerDireccciones(id: any) {
    return this.http.get(this.url + "/direccion/" + id, {headers: this.headers})
  }
}
