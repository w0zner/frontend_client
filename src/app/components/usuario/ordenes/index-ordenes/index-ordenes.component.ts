import { Component } from '@angular/core';
import { OrdenesService } from 'src/app/services/ordenes.service';

@Component({
  selector: 'app-index-ordenes',
  templateUrl: './index-ordenes.component.html',
  styleUrls: ['./index-ordenes.component.css']
})
export class IndexOrdenesComponent {

  constructor(private ordenesService: OrdenesService){
    this.obtenerOrdenes();
  }

  obtenerOrdenes() {
    this.ordenesService.obtenerListaOrdenes(localStorage.getItem('_id')).subscribe({
      next: (response:any) => {
        console.log(response)
      }
    })
  }

}
