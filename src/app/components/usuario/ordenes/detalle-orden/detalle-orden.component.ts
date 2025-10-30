import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdenesService } from 'src/app/services/ordenes.service';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit {

  id: string | null = null
  detalle: any[] = []
  orden: any;

  constructor(private acivatedRoute: ActivatedRoute, private ordenesservice: OrdenesService) {

  }

  ngOnInit(): void {
    this.acivatedRoute.paramMap.subscribe(params => {      
      this.id= params.get('id');
      if(this.id!=null){
        this.ordenesservice.obtenerVentaPorId(this.id).subscribe({
          next: (response: any) => {
            
            this.orden = response.venta;
            console.log('orde', this.orden)
            this.detalle = response.detalles;
            console.log('Detalle ', this.detalle)
          }
        })
      }
    })
  }

}
