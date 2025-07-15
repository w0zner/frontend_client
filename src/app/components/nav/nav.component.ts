import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  id: any
  userLogged: any= undefined

  constructor(private usuarioService: UsuarioService){
    this.id = localStorage.getItem('_id')
  }

  ngOnInit(): void {
    this.usuarioService.getById(this.id).subscribe({
      next: (response:any)=> {
        this.userLogged = response.data
      },
      error: (err) => {
        this.userLogged = null
      }
    })
  }
}
