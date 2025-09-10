import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { AuthService } from 'src/app/services/auth.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var Cleave: new (arg0: string, arg1: { creditCard?: boolean; date?: boolean; datePattern?: any; onCreditCardTypeChanged?: (type: any) => void; }) => any;
declare var StickySidebar: new (arg0: string, arg1: { topSpacing: number; }) => any;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  userLogged: any = undefined
  carrito: any[] = []
  direccion: any = null
   public socket = io('http://localhost:5000')

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

        this.usuarioService.obtenerDirecccionPrincipal(usuario._id).subscribe({
          next:(response: any) => {
            this.direccion = response.data
          }
        })
      }
    });

    setTimeout(() => {
      new Cleave('#cc-number', {
          creditCard: true,
          onCreditCardTypeChanged: function (type:any) {
              // update UI ...
          }
      });

      new Cleave('#cc-exp-date', {
          date: true,
          datePattern: ['m', 'y']
      });
    }, 100);

    var sidebar = new StickySidebar('.sidebar-sticky', {topSpacing: 20});
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
        this.socket.emit('delete-carrito', {data: response.data})
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
