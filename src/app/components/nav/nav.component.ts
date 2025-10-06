import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { AuthService } from 'src/app/services/auth.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { GuestService } from 'src/app/services/guest.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  userLogged: any = undefined
  config_global: any = {}
  op_carrito= false;
  carrito: any[] = []
  public socket = io('http://localhost:5000')
  public descuentoActivo: any = undefined

  constructor(private authService: AuthService, private router: Router, private usuarioService: UsuarioService, private carritoService: CarritoService, private notificacionesService: NotificacionService, private guestService: GuestService) {
    this.obtenerConfiguracionPublica()
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario: any) => {
      console.log(usuario)
      if(usuario){
        this.userLogged = usuario;

/*         this.carritoService.obtenerCarritoPorUsuario(usuario._id).subscribe({
          next: (response:any) => {
            console.log(response)
            this.carrito = response.data;
          }
        }); */
        this.obtenerCarrito();
      }
    });

    this.socket.on('new-carrito', (data: any) => {
      console.log(data)
      this.obtenerCarrito();
    });

    this.socket.on('new-carrito-add', (data: any) => {
      console.log("new-carrito-add ",data)
      this.obtenerCarrito();
    });

    this.guestService.obtenerDescuentosActivos().subscribe({
      next: (response: any) => {
        this.descuentoActivo = response.data[0];
      }
    })
  }

  obtenerCarrito() {
    if(this.userLogged){
       this.carritoService.obtenerCarritoPorUsuario(this.userLogged._id).subscribe({
          next: (response:any) => {
            console.log(response)
            this.carrito = response.data;
          }
        });
    }
  }

  obtenerConfiguracionPublica() {
    this.usuarioService.obtenerConfiguracionPublica().subscribe({
      next: (response: any) => {
        this.config_global = response.data;
        console.log(this.config_global)
      }
    })
  }

  logout(){
    this.authService.logout()
    this.router.navigateByUrl('/login')
  }

  mostrarCarrito() {
    console.log(this.op_carrito)
    if(this.op_carrito){
      console.log(1)
      setTimeout(() => {
        this.op_carrito=false;
      }, 300);
    } else {
            console.log(2)
      this.op_carrito=true;
    }

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
