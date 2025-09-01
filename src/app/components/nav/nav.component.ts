import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(private authService: AuthService, private router: Router, private usuarioService: UsuarioService){
    this.obtenerConfiguracionPublica()
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario: any) => {
      console.log(usuario)
      if(usuario){
        this.userLogged = usuario;

        this.usuarioService.obtenerCarritoPorUsuario(usuario._id).subscribe({
          next: (response:any) => {
            console.log(response)
            this.carrito = response.data;
          }
        });
      }
    });
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
}
