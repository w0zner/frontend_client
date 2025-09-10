import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {

  direccionForm: FormGroup
  departamentos: any
  ciudades: any[] = []
  direcciones: any[] = []

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private notificacionService: NotificacionService){
    this.direccionForm = this.fb.group({
      usuario: [localStorage.getItem('_id')],
      destinatario: [''],
      cedula: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      numero_casa: [0],
      pais: [''],
      departamento: [''],
      ciudad: [''],
      telefono: ['', [Validators.required]],
      principal: [false]
    })  

    this.usuarioService.obtenerCiudades().subscribe({
      next: (response:any) => {
        console.log(response)
        this.departamentos = response
      }
    })
  }

  ngOnInit(): void {
    this.obtenerDirecciones()
  }

  obtenerDirecciones() { 
    this.usuarioService.obtenerDireccciones(localStorage.getItem('_id')).subscribe({
      next: (response:any)=> {
        console.log(response)
        this.direcciones = response.data
      }
    })
  }

  onDepartamentoChange(dept: any) {
    console.log(dept.target.value)
    console.log(this.departamentos[dept.target.value])
    this.ciudades = this.departamentos[dept.target.value] || [];
    // Resetea la ciudad al cambiar de departamento
    this.direccionForm.get('ciudad')?.setValue('');
  }

  guardar() {
    if(this.direccionForm.valid) {
        this.notificacionService.alertConfirmation(
          () => {
            this.usuarioService.registrarDireccion(this.direccionForm.value).subscribe({
              next: (response)=>{
                this.obtenerDirecciones()
                this.direccionForm.reset({
                  destinatario: '',
                  cedula: '',
                  direccion: '',
                  numero_casa: 0,
                  pais: '',
                  departamento: '',
                  ciudad: '',
                  telefono: '',
                  principal: false
                })
              }
            })
          },
          'Confirma que desea guardar esta dirección?',
          'Dirección guardada exitosamente!',
          'Error al guardar los datos'
        );
      } else {
        this.notificacionService.notificarError(null, 'Por favor, complete todos los campos requeridos.')
      }
  }

  actualizarEstadoDireccion(id: any, data: any) {
    this.usuarioService.actualizarEstadoDireccion(id, data).subscribe({
      next: (response:any)=>{
        this.obtenerDirecciones()
        this.notificacionService.notificarExito('Se ha actualizado la dirección')
      }
    })
  }

  eliminarDireccion(id:any) {
    this.usuarioService.eliminarDireccion(id).subscribe({
      next: (response:any) => {
        this.obtenerDirecciones()
      }
    })
  }

}
