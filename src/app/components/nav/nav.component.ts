import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  id: any
  userData: any= undefined
  userLogged: any= {}

  constructor(private usuarioService: UsuarioService){
    this.id = localStorage.getItem('_id')
  }

  ngOnInit(): void {
    if(localStorage.getItem('userData')){
      this.userLogged = JSON.parse(localStorage.getItem('userData') || '{}')
    } else {
      this.userLogged = undefined
    }

    this.usuarioService.getById(this.id).subscribe({
      next: (response:any)=> {
        this.userData = response.data
        console.log(this.userData)
        localStorage.setItem('userData', JSON.stringify(this.userData))
      },
      error: (err) => {
        this.userData = null
      }
    })
  }
}
