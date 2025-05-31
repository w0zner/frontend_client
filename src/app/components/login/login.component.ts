import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificacionService } from 'src/app/services/notificacion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  registroForm: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private notificacionService: NotificacionService, private authService: AuthService){
    this.loginForm= this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    })

    this.registroForm= this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    
  }

  loguearse(){
    if(this.loginForm.valid) {
      console.log('Datos enviados: ')
      console.log(this.loginForm.value)

      this.authService.login(this.loginForm.value).subscribe({
        next: (response:any)=> {
          this.notificacionService.notificarExito("Bienvenido")
          this.router.navigate(['/'])
        },
        error: (err)=> {
          this.notificacionService.notificarError(err)
        }
      })

      

    } else {
      console.error('Faltan campos por completar')
      this.notificacionService.notificarError(null, "Faltan campos por completar")
    }
  }

}
