import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { OrdenesService } from 'src/app/services/ordenes.service';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit {

  public id: string | null = null
  detalles: any[] = []
  orden: any;
  public urlProducto: string;
  opcionResenha: string | undefined
  reviewForm: FormGroup

  constructor(private fb: FormBuilder, private acivatedRoute: ActivatedRoute, private ordenesservice: OrdenesService) {
    this.urlProducto = GLOBAL.url + 'productos/obtenerPortada/'
    this.reviewForm = this.fb.group({
      producto: [''],
      usuario: [''],
      venta: [''],
      mensaje: [''],
      opcion: ['']
    })
  }

  ngOnInit(): void {
    this.acivatedRoute.paramMap.subscribe(params => {      
      this.id= params.get('id');
      if(this.id!=null){
        this.ordenesservice.obtenerVentaPorId(this.id).subscribe({
          next: (response: any) => {
            
            this.orden = response.venta;
            console.log('orde', this.orden)
            this.detalles = response.detalles;
            console.log('Detalle ', this.detalles)
          }
        })
      }
    })
  }

  elegirResenha(opcion: string) {
    this.opcionResenha = opcion
    this.reviewForm.patchValue({
      opcion: opcion
    })
  }

  emitirResenha(){
    this.reviewForm.patchValue({
      
    })
  }

}
