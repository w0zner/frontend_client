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

  userLogged: any= null

  constructor(private authService: AuthService, private router: Router){

  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario) => {
      this.userLogged = usuario;
    });
  }

  logout(){
    this.authService.logout()
    this.router.navigateByUrl('/login')
  }

}
