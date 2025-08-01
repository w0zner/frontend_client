import { Component, OnInit, ViewChild } from '@angular/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-index-productos',
  templateUrl: './index-productos.component.html',
  styleUrls: ['./index-productos.component.scss']
})
export class IndexProductosComponent implements OnInit {

  public config_global: any = {}
  public someRange: number[] = [100, 700];
  nombre_categoria: string = '';

  constructor(private usuarioService: UsuarioService) {
    this.obtenerConfiguracionPublica();
  }

  ngOnInit(): void {
  }

  obtenerConfiguracionPublica() {
    this.usuarioService.obtenerConfiguracionPublica().subscribe({
      next: (response: any) => {
        this.config_global = response.data;
        console.log(this.config_global)
      }
    })
  }
 

  changeSomeRange(index: number, value: number) {
    let newRange = [this.someRange[0], this.someRange[1]];
    newRange[index] = newRange[index] + value;
    this.someRange = newRange;
  }

  buscarCategorias() {
    console.log(this.nombre_categoria);
    if (this.nombre_categoria) {
      const search = new RegExp(this.nombre_categoria, 'i');
      this.config_global.categorias = this.config_global.categorias.filter((item:any) => search.test(item.titulo))
    } else {
      this.obtenerConfiguracionPublica();
    }
  }
}
