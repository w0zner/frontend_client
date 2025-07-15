import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  id: any

  constructor(private usuarioService: UsuarioService){
    this.id = localStorage.getItem('_id')
  }

  ngOnInit(): void {
    this.usuarioService.getById(this.id).subscribe({
      next: (response:any)=> {
        console.log(response)
      }
    })
  }
}
