import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { GLOBAL } from "./GLOBAL";

@Injectable({
  providedIn: "root",
})
export class OrdenesService {
  private url: string;
  private urlReview: string;
  private headers: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.url = GLOBAL.url + "ventas";
    this.urlReview = GLOBAL.url + "review";
    this.headers = this.authService.getHeaders();
  }

  obtenerListaOrdenes(usuario: any) {
    return this.http.get(this.url + "/obtener-ventas-usuario/" + usuario, {
      headers: this.headers,
    });
  }

  obtenerVentaPorId(id: any) {
    return this.http.get(this.url + "/obtener-venta/" + id, {
      headers: this.headers,
    });
  }

  guardarResenha(data: any) {
    return this.http.post(this.urlReview, data, { headers: this.headers });
  }

  obtenerResenhaPorVentaProducto(venta: any, producto: any) {
    return this.http.get(this.urlReview + "/" + venta + "/" + producto, {
      headers: this.headers,
    });
  }

  actualizarResenha(id: any, data: any) {
    return this.http.put(this.urlReview + "/" + id, data, {
      headers: this.headers,
    });
  }
}
