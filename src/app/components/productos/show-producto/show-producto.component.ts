import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { io } from 'socket.io-client';
import { OrdenesService } from 'src/app/services/ordenes.service';
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
  public socket = io('https://api.mystore.mom')
  public descuentoActivo: any = undefined
  public reviews: any[] = []
  stars = [1, 2, 3, 4, 5];

  public countFiveStart=0;
  public countFourStart=0;
  public countThreeStart=0;
  public countTwoStart=0;
  public countOneStart=0;

  public totalPuntosReview=0;
  public porcentajeReview = 0;
  puntos_rating=0

  cinco_porcent = 0
  cuatro_porcent = 0
  tres_porcent = 0
  dos_porcent = 0
  uno_porcent = 0

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private guestService: GuestService, private usuarioService: UsuarioService, private notificacionesService: NotificacionService, private carritoService: CarritoService, private ordenesService: OrdenesService) {
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
            next: (resp:any) => {
              console.log(resp.data)
              this.productosRecomendados = resp.data;
            }
          })

          this.ordenesService.obtenerResenhasPorProducto(this.producto._id).subscribe({
            next: (response:any) => {
              console.log('reseñas ', response)
              this.reviews = response.data;
              this.reviews.forEach((element:any) => {
                console.log(element)
                if(element.estrellas == 5) {
                  this.countFiveStart = this.countFiveStart + 1;
                } else if(element.estrellas == 4) {
                  this.countFourStart = this.countFourStart + 1;
                } else if(element.estrellas == 3) {
                  this.countThreeStart = this.countThreeStart + 1;
                } else if(element.estrellas == 2) {
                  this.countTwoStart = this.countTwoStart + 1;
                } else if(element.estrellas == 1) {
                  this.countOneStart = this.countOneStart + 1;
                }
              })

              this.cinco_porcent = (this.countFiveStart*100)/response.data.length;
              this.cuatro_porcent = (this.countFourStart*100)/response.data.length;
              this.tres_porcent = (this.countThreeStart*100)/response.data.length;
              this.dos_porcent = (this.countTwoStart*100)/response.data.length;
              this.uno_porcent = (this.countOneStart*100)/response.data.length;

              let puntos_cinco=0
              let puntos_cuatro=0
              let puntos_tres=0
              let puntos_dos=0
              let puntos_uno=0

              puntos_cinco= this.countFiveStart*5;
              puntos_cuatro= this.countFourStart*4;
              puntos_tres= this.countThreeStart*3;
              puntos_dos= this.countTwoStart*2;
              puntos_uno= this.countOneStart*1;

              this.totalPuntosReview = puntos_cinco + puntos_cuatro + puntos_tres + puntos_dos + puntos_uno;
              let max_puntos= response.data.length * 5;

              this.porcentajeReview = (this.totalPuntosReview*100)/max_puntos;
              this.puntos_rating=(this.porcentajeReview*5)/100
              console.log(this.porcentajeReview)
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
