import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  userLogged: any = undefined
  carrito: any[] = []

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private usuarioService: UsuarioService, private carritoService: CarritoService, private notificacionesService: NotificacionService) {

  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario: any) => {
      console.log(usuario)
      if(usuario){
        this.userLogged = usuario;

        this.carritoService.obtenerCarritoPorUsuario(usuario._id).subscribe({
          next: (response:any) => {
            console.log(response)
            this.carrito = response.data;
          }
        });
      }
    });
  }

  calcularTotalCarrito() {
    let total = 0;
    this.carrito.forEach(item => {
      total += item.producto.precio * item.cantidad
    });
    return total;
  }

  eliminarItemCarrito(id: any) {
    this.notificacionesService.alertConfirmation(
      () => {
        this.carritoService.eliminarItemCarrito(id).subscribe({
      next: (response:any) => {
        this.carrito = this.carrito.filter(item => item._id !== id);
      }
    });
      },
      'Confirma que desea eliminar este producto del carrito?',
      'El producto se ha eliminado correctamente',
      'Error al eliminar el producto del carrito'
    );
  }

}
