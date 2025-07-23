import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registroForm: FormGroup;
  showPassword= false;
  public showRegistro= false;
  loading=false;

  constructor(private fb: FormBuilder, private router: Router, private notificacionService: NotificacionService, private authService: AuthService, private usuarioService: UsuarioService){
    this.loginForm= this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    })

    this.registroForm= this.fb.group({
      cedula: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      this.router.navigate(['/'])
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loguearse(){
    if(this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response:any)=> {
          console.log(response)
          this.notificacionService.notificarExito("Bienvenido")
          this.router.navigate(['/'])
        },
        error: (err)=> {
          this.notificacionService.notificarError(err)
        }
      })
    } else {
      //console.error('Faltan campos por completar')
      this.notificacionService.notificarError(null, "Faltan campos por completar")
    }
  }

  registrarse(){
    if(this.registroForm.valid) {
      this.loading=true
      console.log('Datos enviados: ')
      console.log(this.loginForm.value)

      this.usuarioService.registro(this.registroForm.value).subscribe({
        next: (response:any)=> {
          this.loading=false
          console.log(response)
          this.notificacionService.notificarExito(response.message)
          this.showRegistro=!this.showRegistro
          this.router.navigate(['/login'])
        },
        error: (err)=> {
          this.loading=false
          this.notificacionService.notificarError(err)
        }
      })
    } else {
      //console.error('Faltan campos por completar')
      this.notificacionService.notificarError(null, "Faltan campos por completar")
    }
  }

}
