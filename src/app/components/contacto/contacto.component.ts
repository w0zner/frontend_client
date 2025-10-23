import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

  contactoForm: FormGroup

  constructor(private fb: FormBuilder){
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
    } else {
      console.error('invalido')
    }
  }

}
