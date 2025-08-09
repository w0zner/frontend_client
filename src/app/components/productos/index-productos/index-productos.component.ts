import { Component, OnInit, ViewChild } from '@angular/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-index-productos',
  templateUrl: './index-productos.component.html',
  styleUrls: ['./index-productos.component.scss']
})
export class IndexProductosComponent implements OnInit {

  public config_global: any = {}
  public productos: Array<any> = []
  public someRange: number[] = [100000, 3000000];
  public url: any;
  nombre_categoria: string = '';
  filter_productos: string=""
  loading: boolean = false;
  mostrarLimpiar = false;

  constructor(private usuarioService: UsuarioService) {
    this.url = GLOBAL.url + 'productos/obtenerPortada/'
    this.obtenerConfiguracionPublica();
    this.obtenerListadoProductos();
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

  obtenerListadoProductos() {
    this.loading = true;
    this.usuarioService.listarProductos(this.filter_productos).subscribe({
      next: (response: any) => {
        console.log(response)
        this.productos = response.data
        setTimeout(() => {
          this.loading = false;
        }, 1000);
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

  filtrarPorPrecio() {
    if(this.someRange[0] && this.someRange[1]){
      this.mostrarLimpiar=true
      const min = this.someRange[0]  
      const max = this.someRange[1]

      this.productos = this.productos.filter(producto => producto.precio >= min && producto.precio <= max) 
    }
  }

  limpiarFiltroPrecio() {
    this.mostrarLimpiar=false
    this.obtenerListadoProductos()
  }
}
