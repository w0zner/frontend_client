import { Injectable } from '@angular/core';
declare const iziToast: any ;

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor() { }

  notificarExito(mensaje: string, position?: string) {
    iziToast.success({
      title: 'Exito',
      message: mensaje,
      //color: 'green',
      position: position || 'topRight'
    })
  }

  notificarError(err?: any, mensaje?:string){
    if(err) {
      if(err.status==0) {
        iziToast.error({
          title: 'Error',
          message: 'No hay respuesta del servidor',
          //color: 'red',
          position: 'topRight'
        })
      } else {
        iziToast.error({
          title: 'Error',
          message: mensaje || err.error.message,
          //color: 'red',
          position: 'topRight'
        })
      }
    } else {
      iziToast.error({
        title: 'Error',
        message: mensaje,
        //color: 'red',
        position: 'topRight'
      })
    }
  }

  notificarAlerta(mensaje?:string, position?: string){
      iziToast.warning({
        title: 'Alerta',
        message: mensaje,
        //color: 'red',
        position: position || 'topRight'
      })
  }

  alertConfirmation(callback: () => void,message?: any, successMessage?: string, errorMessage?: string){
    iziToast.question({
      timeout: 20000,
      close: false,
      overlay: true,
      displayMode: 'once',
      id: 'question',
      zindex: 999,
      title: 'Atención',
      message: message || 'Estás seguro de eliminar el registro?',
      position: 'center',
      buttons: [
          ['<button><b>YES</b></button>',  (instance: { hide: (arg0: { transitionOut: string; }, arg1: any, arg2: string) => void; }, toast: any) => {
            try {
              callback();
              if(successMessage) {
                this.notificarExito(successMessage);
              }
            } catch (error) {
              if(errorMessage) {
                this.notificarError(error, errorMessage);
              } else {
                this.notificarError(error);
              }
            }
              instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

          }, true],
          ['<button>NO</button>', function (instance: { hide: (arg0: { transitionOut: string; }, arg1: any, arg2: string) => void; }, toast: any) {
            console.log('NO')
              instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

          }],
      ],
      onClosing: function(instance: any, toast: any, closedBy: string){
          console.info('Closing | closedBy: ' + instance + toast + closedBy);
      },
      onClosed: function(instance: any, toast: any, closedBy: string){
          console.info('Closed | closedBy: ' + closedBy);
      }
  });
  }
}
