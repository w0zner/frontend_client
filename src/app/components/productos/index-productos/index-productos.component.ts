import { Component, OnInit, ViewChild } from '@angular/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { CarritoService } from 'src/app/services/carrito.service';

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
  filter_categorias: string = 'todos'
  loading: boolean = false;
  mostrarLimpiar = false;
  page=1
  pageSize=3
  sortBy: string = 'defecto'
  public carritoForm: FormGroup


  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private route: ActivatedRoute, private notificacionesService: NotificacionService, private carritoService: CarritoService) {
    this.url = GLOBAL.url + 'productos/obtenerPortada/'
    this.obtenerConfiguracionPublica();

    this.carritoForm = this.fb.group({
      producto: [''],
      usuario: [''],
      cantidad: [1],
      variedad: ['']
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const route_categoria = params['categoria']
      if(route_categoria){
        this.carritoService.listarProductos(this.filter_productos).subscribe({
          next: (response: any) => {
            this.productos = response.data
            this.productos = this.productos.filter(producto => producto.categoria.toLowerCase() == route_categoria.toLowerCase())
          }
        })
      } else {
        this.obtenerListadoProductos()
      }
    })
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
    this.carritoService.listarProductos(this.filter_productos).subscribe({
      next: (response: any) => {
        this.productos = response.data;
        this.loading = false;
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

  buscarPorCategoria() {
    if(this.filter_categorias == 'todos'){
      this.obtenerListadoProductos()
    }else{
      this.carritoService.listarProductos(this.filter_productos).subscribe({
        next: (response: any) => {
          this.productos = response.data
          this.productos = this.productos.filter(producto => producto.categoria == this.filter_categorias)
        }
      })
    }
  }

  resetListadoProductos() {
    this.filter_productos=''
    this.obtenerListadoProductos();
  }

  ordernarPor() {
    console.log(this.sortBy)
    if(this.sortBy == 'defecto') {
      this.obtenerListadoProductos()
    }
    if(this.sortBy == 'popularidad') {
      this.productos.sort(function (a, b) {
        if (a.nventas < b.nventas) {
          return 1;
        }
        if (a.nventas > b.nventas) {
          return -1;
        }
        return 0;
      })
    }
    if(this.sortBy == 'precio asc') {
      this.productos.sort(function (a, b) {
        if (a.precio > b.precio) {
          return 1;
        }
        if (a.precio < b.precio) {
          return -1;
        }
        return 0;
      })
    }
    if(this.sortBy == 'precio desc') {
      this.productos.sort(function (a, b) {
        if (a.precio < b.precio) {
          return 1;
        }
        if (a.precio > b.precio) {
          return -1;
        }
        return 0;
      })
    }
    if(this.sortBy == 'nombre asc') {
      this.productos.sort(function (a, b) {
        if (a.titulo > b.titulo) {
          return 1;
        }
        if (a.titulo < b.titulo) {
          return -1;
        }
        return 0;
      })
    }
    if(this.sortBy == 'nombre desc') {
      this.productos.sort(function (a, b) {
        if (a.titulo < b.titulo) {
          return 1;
        }
        if (a.titulo > b.titulo) {
          return -1;
        }
        return 0;
      })
    }
  }

    agregarAlCarrito(producto: any){
    this.carritoForm.patchValue({
      producto: producto._id,
      usuario: localStorage.getItem('_id'),
      variedad: producto.variedades.length > 0 ? producto.variedades[0].titulo : ''
    })

    console.log(this.carritoForm.value)

    if(!this.carritoForm.valid){
      this.notificacionesService.notificarAlerta('Debe completar todos los campos')
      return
    }

    if(this.carritoForm.value.cantidad > producto.stock){
      this.notificacionesService.notificarAlerta('La cantidad seleccionada supera el stock disponible')
      return
    }

     this.carritoService.agregarAlCarrito(this.carritoForm.value).subscribe({
      next: (response:any) => {
        if(response.data === undefined){
          this.notificacionesService.notificarError(null, 'El producto ya se encuentra en el carrito')
          return
        }
        console.log(response)
        this.notificacionesService.notificarExito('Producto agregado al carrito')
      },
      error: (err) => {
        console.log(err)
        this.notificacionesService.notificarError(null,'Error al agregar el producto al carrito')
      }
    })
  }
}
