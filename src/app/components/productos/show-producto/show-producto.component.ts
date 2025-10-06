import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { io } from 'socket.io-client';
declare var tns: any;
declare var lightGallery: any;

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {

  public producto: any= {}
  public url: any;
  public productosRecomendados: any[]= [];
  public carritoForm: FormGroup
  public socket = io('http://localhost:5000')
  public descuentoActivo: any = undefined


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private guestService: GuestService, private usuarioService: UsuarioService, private notificacionesService: NotificacionService, private carritoService: CarritoService) {
    this.url = GLOBAL.url + 'productos/obtenerPortada/'

    this.carritoForm = this.fb.group({
      producto: [''],
      usuario: [''],
      cantidad: [1],
      variedad: ['']
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug']
      this.guestService.obtenerProductoPorSlug(slug).subscribe({
        next: (response:any) => {
          this.producto = response.data;

          this.guestService.obtenerProductosRecomendados(this.producto.categoria).subscribe({
            next: (response:any) => {
              console.log(response.data)
              this.productosRecomendados = response.data;
            }
          })
        }
      })
    })

    setTimeout(()=> {
      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        navContainer: "#cs-thumbnails",
        navAsThumbnails: true,
        gutter: 15,
      });

      var e = document.querySelectorAll(".cs-gallery");
      if (e.length){
        for (var t = 0; t < e.length; t++){
          lightGallery(e[t], { selector: ".cs-gallery-item", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
        }
      }

      tns({
        container: '.cs-carousel-inner-two',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        controlsContainer: "#custom-controls-related",
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          480: {
            items: 2,
            gutter: 24
          },
          700: {
            items: 3,
            gutter: 24
          },
          1100: {
            items: 4,
            gutter: 30
          }
        }
      });
    }, 500)

    this.guestService.obtenerDescuentosActivos().subscribe({
      next: (response: any) => {
        this.descuentoActivo = response.data[0];
      }
    })
  }

  agregarAlCarrito(){
    this.carritoForm.patchValue({
      producto: this.producto._id,
      usuario: localStorage.getItem('_id')
    })

    console.log(this.carritoForm.value)

    if(!this.carritoForm.valid){
      this.notificacionesService.notificarAlerta('Debe completar todos los campos')
      return
    }

    if(this.carritoForm.value.cantidad > this.producto.stock){
      this.notificacionesService.notificarAlerta('La cantidad seleccionada supera el stock disponible')
      return
    }

     this.carritoService.agregarAlCarrito(this.carritoForm.value).subscribe({
      next: (response:any) => {
        if(response.data === undefined){
          this.notificacionesService.notificarError(null, 'El producto ya se encuentra en el carrito')
          return
        }
        this.socket.emit('add-carrito', {data: true})

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
