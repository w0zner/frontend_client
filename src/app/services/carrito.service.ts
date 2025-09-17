import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private url: string;
  private headers: any

  constructor(private http: HttpClient, private authService: AuthService) {
    this.url = GLOBAL.url + 'carrito'
    //this.authService.getHeaders() = this.authService.getHeaders()
  }

  listarProductos(filtro: any) {
    let headers= new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get(GLOBAL.url + "productos/listar-productos/" + filtro, {headers: headers})
  }

  agregarAlCarrito(data: any) {
    return this.http.post(this.url + '/agregar', data, {headers: this.authService.getHeaders()})
  }

  obtenerCarritoPorUsuario(id: any) {
    return this.http.get(this.url + '/obtener-carrito/' + id, {headers: this.authService.getHeaders()})
  }

  eliminarItemCarrito(id: any) {
    return this.http.delete(this.url + '/eliminar/' + id, {headers: this.authService.getHeaders()})
  }

  obtenerMetodosDeEnvio() {
    return this.http.get('./assets/data/metodos_envio.json')
  }

  registrarVenta(data: any) {
    return this.http.post(GLOBAL.url + 'ventas/registrar', data, {headers: this.authService.getHeaders()})
  }
}
