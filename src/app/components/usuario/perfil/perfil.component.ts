import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: any;
  userLogged: any= null
  usuarioForm: FormGroup

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private authService: AuthService, private notificacionService: NotificacionService, private router: Router) {
    this.usuarioForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      fecha_nacimiento: [''],
      pais: [''],
      cedula: ['', [Validators.required]],
      genero: ['']
    })
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario) => {
      this.userLogged = usuario;

      this.usuarioForm.patchValue({
        nombres: this.userLogged.nombres,
        apellidos: this.userLogged.apellidos,
        email: this.userLogged.email,
        telefono: this.userLogged?.telefono,
        fecha_nacimiento: this.userLogged?.fecha_nacimiento,
        cedula: this.userLogged.cedula,
        genero: this.userLogged?.genero ?? '',
        pais: this.userLogged?.pais ?? ''
      })
    });
  }

  actualizar() {
      if(this.usuarioForm.valid) {

        this.notificacionService.alertConfirmation(
          () => {
            this.usuarioService.updateUsuarioCliente(this.userLogged._id, this.usuarioForm.value).subscribe({
              next: (response)=>{}
            })
          },
          'Confirma que desea actualizar los datos de su perfil?',
          'Datos guardados exitosamente!',
          'Error al guardar los datos'
        );
      } else {
        this.notificacionService.notificarError('Por favor, complete todos los campos requeridos.')
      }
  }

}
