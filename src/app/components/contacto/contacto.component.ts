import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ContactoService } from 'src/app/services/contacto.service';
import { NotificacionService } from 'src/app/services/notificacion.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

  contactoForm: FormGroup

  constructor(private fb: FormBuilder, private contactoService: ContactoService, private notificacionesService: NotificacionService, private router: Router){
    this.contactoForm = this.fb.group({
      cliente: [''],
      asunto: [''],
      mensaje: [''],
      telefono: [''],
      correo: ['', [Validators.email]]
    })
  }

  enviarContacto(){
    if(this.contactoForm.valid){
      console.log(this.contactoForm.value)
      this.contactoService.enviarMensaje(this.contactoForm.value).subscribe({
        next: (response: any) => {
          this.contactoForm.reset()
          this.notificacionesService.notificarExito('Mensaje enviado con exito!', 'topRight')
          //this.router.navigateByUrl('/')
        }
      })
    } else {
      console.error('invalido')
    }
  }

}
