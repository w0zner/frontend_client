import { Component, OnInit } from '@angular/core';
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

  constructor(private acivatedRoute: ActivatedRoute, private ordenesservice: OrdenesService) {
    this.urlProducto = GLOBAL.url + 'productos/obtenerPortada/'
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

}
