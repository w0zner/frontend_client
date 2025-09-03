import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  userLogged: any = undefined
  carrito: any[] = []

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private usuarioService: UsuarioService) {

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

  calcularTotalCarrito() {
    let total = 0;
    this.carrito.forEach(item => {
      total += item.producto.precio * item.cantidad
    });
    return total;
  }

}
