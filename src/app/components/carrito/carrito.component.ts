import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { AuthService } from 'src/app/services/auth.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var Cleave: new (arg0: string, arg1: { creditCard?: boolean; date?: boolean; datePattern?: any; onCreditCardTypeChanged?: (type: any) => void; }) => any;
declare var StickySidebar: new (arg0: string, arg1: { topSpacing: number; }) => any;
declare var paypal: { Buttons: (arg0: { style: { layout: string; }; createOrder: (data: any, actions: any) => any; onApprove: (data: any, actions: any) => Promise<void>; onError: (err: any) => void; onCancel: (data: any, actions: any) => void; }) => { (): any; new(): any; render: { (arg0: any): void; new(): any; }; }; };

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  @ViewChild('paypalButton',{static:true}) paypalElement : ElementRef = {} as ElementRef;
  userLogged: any = undefined
  carrito: any[] = []
  direccion: any = null
  metodosEnvio: any[] = []
  //precio_envio: number
  ventaForm: FormGroup
  public socket = io('http://localhost:5000')

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private usuarioService: UsuarioService, private carritoService: CarritoService, private notificacionesService: NotificacionService) {
    this.ventaForm = this.fb.group({
      usuario: [''],
      direccion: [''],
      envio_titulo: [''],
      envio_precio: [0],
      subtotal: [''],
      transaccion: [''],
      cupon: [''],
      nota: [''],
    })

    this.carritoService.obtenerMetodosDeEnvio().subscribe({
      next: (response:any) => {
        console.log(response)
        this.metodosEnvio = response
      }
    })
    //this.precio_envio = 0
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario: any) => {
      console.log(usuario)
      if(usuario){
        this.userLogged = usuario;
        this.ventaForm.patchValue({
          usuario: usuario._id
        });

        this.carritoService.obtenerCarritoPorUsuario(usuario._id).subscribe({
          next: (response:any) => {
            console.log(response)
            this.carrito = response.data;
          }
        });

        this.usuarioService.obtenerDirecccionPrincipal(usuario._id).subscribe({
          next:(response: any) => {
            this.direccion = response.data
            this.ventaForm.patchValue({
              direccion: response.data._id
            });
          }
        })
      }
    });

    setTimeout(() => {
      new Cleave('#cc-number', {
          creditCard: true,
          onCreditCardTypeChanged: function (type:any) {
              // update UI ...
          }
      });

      new Cleave('#cc-exp-date', {
          date: true,
          datePattern: ['m', 'y']
      });
    }, 100);

    var sidebar = new StickySidebar('.sidebar-sticky', {topSpacing: 20});

    paypal.Buttons({
    style: {
        layout: 'horizontal'
    },
    createOrder: (data,actions)=>{

        return actions.order.create({
          purchase_units : [{
            description : 'Nombre del pago',
            amount : {
              currency_code : 'USD',
              value: 999
            },
          }]
        });

    },
    onApprove : async (data,actions)=>{
      const order = await actions.order.capture();
      console.log(order)


      this.ventaForm.patchValue({
        transaccion: order.purchase_units[0].payments.captures[0].id
      });
    },
    onError : err =>{

    },
    onCancel: function (data, actions) {

    }
  }).render(this.paypalElement.nativeElement);

    this.ventaForm.get('envio_precio')?.valueChanges.subscribe(() => {
      this.actualizarSubtotal();
    });
  }

  actualizarSubtotal() {
    const envio = this.ventaForm.get('envio_precio')?.value || 0;
    const totalCarrito = this.calcularTotalCarrito();
    const subtotal = totalCarrito + envio;

    this.ventaForm.patchValue(
      { subtotal },
      { emitEvent: false } // evita un loop infinito con valueChanges
    );
  }

  calcularTotalCarrito() {
    let total = 0;
    this.carrito.forEach(item => {
      total += item.producto.precio * item.cantidad
    });
    return total;
  }

  eliminarItemCarrito(id: any) {
    this.notificacionesService.alertConfirmation(
      () => {
        this.carritoService.eliminarItemCarrito(id).subscribe({
      next: (response:any) => {
        this.socket.emit('delete-carrito', {data: response.data})
        this.carrito = this.carrito.filter(item => item._id !== id);
      }
    });
      },
      'Confirma que desea eliminar este producto del carrito?',
      'El producto se ha eliminado correctamente',
      'Error al eliminar el producto del carrito'
    );
  }

  registrarCompra() {
    this.actualizarSubtotal();
/*     this.ventaForm.patchValue({
      subtotal:  this.calcularTotalCarrito() + ventaForm.get('envio_precio')?.value
    }); */

    console.log(this.ventaForm.value)
  }

}
