import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GuestService } from 'src/app/services/guest.service';
declare var tns: (arg0: { container: string; controlsText?: string[]; mode?: string; navContainer?: string; responsive: { 0: { controls: boolean; }; 991: { controls: boolean; }; } | { 0: { gutter: number; }; 400: { items: number; gutter: number; }; 520: { gutter: number; }; 768: { items: number; gutter: number; }; } | { 0: { items: number; gutter: number; }; 420: { items: number; gutter: number; }; 600: { items: number; gutter: number; }; 700: { items: number; gutter: number; }; 900: { items: number; gutter: number; }; 1200: { items: number; gutter: number; }; 1400: { items: number; gutter: number; }; } | { 0: { items: number; gutter: number; }; 480: { items: number; gutter: number; }; 700: { items: number; gutter: number; }; 1100: { items: number; gutter: number; }; } | { 0: { items: number; }; 380: { items: number; }; 550: { items: number; }; 750: { items: number; }; 1000: { items: number; }; 1250: { items: number; }; } | { 0: { items: number; }; 500: { items: number; }; 1200: { items: number; }; }; controls?: boolean; mouseDrag?: boolean; nav?: boolean; controlsContainer?: string; gutter?: number; }) => void;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public descuentoActivo: any = undefined
  public productos_nuevos: any[] = []
  public url: string;
  public urlProductos: string;

  constructor(private guestService: GuestService){
    this.url = GLOBAL.url + 'descuentos/obtenerPortada'
    this.urlProductos = GLOBAL.url + 'productos/obtenerPortada/'
  }

  ngOnInit(): void {
    this.guestService.obtenerDescuentosActivos().subscribe({
      next: (response: any) => {
        this.descuentoActivo = response.data[0];
      }
    })

    this.guestService.obtenerProductosNuevos().subscribe({
      next: (response:any) => {
        console.log("Productos nuevos: ", response.data)
        this.productos_nuevos = response.data
      }
    })

    setTimeout(()=>{
      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        mode: 'gallery',
        navContainer: '#pager',
        responsive: {
          0: { controls: false },
          991: { controls: true }
        }
      });

      tns({
        container: '.cs-carousel-inner-two',
        controls: false,
        responsive: {
          0: {
            gutter: 20
          },
          400: {
            items: 2,
            gutter: 20
          },
          520: {
            gutter: 30
          },
          768: {
            items: 3,
            gutter: 30
          }
        }

      });

      tns({
        container: '.cs-carousel-inner-three',
        controls: false,
        mouseDrag: !0,
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          420: {
            items: 2,
            gutter: 20
          },
          600: {
            items: 3,
            gutter: 20
          },
          700: {
            items: 3,
            gutter: 30
          },
          900: {
            items: 4,
            gutter: 30
          },
          1200: {
            items: 5,
            gutter: 30
          },
          1400: {
            items: 6,
            gutter: 30
          }
        }


      });

      tns({
        container: '.cs-carousel-inner-four',
        nav: false,
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        controlsContainer:'#custom-controls-trending',
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

      tns({
        container: '.cs-carousel-inner-five',
        controls: false,
        gutter: 30,
        responsive: {
          0: { items: 1 },
          380: { items: 2 },
          550: { items: 3 },
          750: { items: 4 },
          1000: { items: 5 },
          1250: { items: 6 }
        }

      });

      tns({
        container: '.cs-carousel-inner-six',
        controls: false,
        gutter: 15,
        responsive: {
          0: { items: 2 },
          500: { items: 3 },
          1200: { items: 3 }
        }

      });

    },500);
  }

}
