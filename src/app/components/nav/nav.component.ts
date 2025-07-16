import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  userLogged: any= null

  constructor(private authService: AuthService){
    console.log(this.userLogged)
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario) => {
      this.userLogged = usuario;
    });
  }
}
