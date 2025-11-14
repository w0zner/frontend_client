import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GLOBAL } from "src/app/services/GLOBAL";
import { NotificacionService } from "src/app/services/notificacion.service";
import { OrdenesService } from "src/app/services/ordenes.service";

@Component({
  selector: "app-detalle-orden",
  templateUrl: "./detalle-orden.component.html",
  styleUrls: ["./detalle-orden.component.css"],
})
export class DetalleOrdenComponent implements OnInit {
  public id: string | null = null;
  detalles: any[] = [];
  orden: any;
  public urlProducto: string;
  opcionResenha: number | undefined;
  reviewForm: FormGroup;
  public haPasadoUnMes= false;
  idReview: any= null;

  rating = 0;      // valor final guardado
  hoverRating = 0;
  stars = [1, 2, 3, 4, 5]; // cantidad de estrellas

  constructor(
    private fb: FormBuilder,
    private acivatedRoute: ActivatedRoute,
    private route: Router,
    private ordenesService: OrdenesService,
    private notificacionesService: NotificacionService
  ) {
    this.urlProducto = GLOBAL.url + "productos/obtenerPortada/";
    this.reviewForm = this.fb.group({
      producto: [""],
      usuario: [""],
      venta: [""],
      mensaje: [""],
      estrellas: [""],
    });
  }

  ngOnInit(): void {
    this.acivatedRoute.paramMap.subscribe((params) => {
      this.id = params.get("id");
      if (this.id != null) {
        this.ordenesService.obtenerVentaPorId(this.id).subscribe({
          next: (response: any) => {
            this.orden = response.venta;
            console.log("orde", this.orden);
            this.detalles = response.detalles;
            console.log("Detalle ", this.detalles);
            this.verificarFecha(this.orden.createdAt);
          },
        });
      }
    });
  }

  onHover(value: number) {
    this.hoverRating = value;
  }

  onLeave() {
    this.hoverRating = 0; // se borra hover, queda solo el rating final
  }

  onRate(value: number) {
    this.rating = value; // guarda para siempre
    this.reviewForm.patchValue({
      estrellas: value,
    });
    console.log("Valor seleccionado:", this.rating);
  }

  verificarFecha(fechaOrden: any) {
    const fechaCreacion = new Date(fechaOrden);
    const ahora = new Date();

    const fechaMasUnMes = new Date(fechaCreacion);
    fechaMasUnMes.setMonth(fechaMasUnMes.getMonth() + 1);

    // Comparar si la fecha actual es mayor o igual a un mes después
    this.haPasadoUnMes = ahora >= fechaMasUnMes;

    console.log(this.haPasadoUnMes); 
  }

  setResenha(producto: any) {
    console.log(producto)
    this.ordenesService
      .obtenerResenhaPorVentaProducto(this.orden._id, producto)
      .subscribe({
        next: (response: any) => {
          console.info("Reseña ", response);
          this.reviewForm.patchValue({
            venta: this.orden._id,
            usuario: this.orden.usuario._id,
            producto: producto,
            mensaje: response?.data[0]?.mensaje,
            estrellas: response?.data[0]?.opcion,
          });
          this.idReview = response.data[0]?._id;
          this.rating = response?.data[0]?.estrellas;
          console.log(this.reviewForm.value);
          console.log(this.idReview)
        },
      });
  }

  elegirResenha(opcion: number) {
    this.opcionResenha = opcion;
    this.reviewForm.patchValue({
      estrellas: opcion,
    });
  }

  emitirResenha() {
    // this.reviewForm.patchValue({
    //   venta: this.orden._id,
    //   usuario: this.orden.usuario._id,
    //   producto: producto,
    // });
    console.info(this.reviewForm.value);
    //const idReview = this.reviewForm.get('_id')?.value;
    if(this.idReview === null || this.idReview === undefined) {
      this.ordenesService.guardarResenha(this.reviewForm.value).subscribe({
        next: (response: any) => {
          console.info(response);
          this.notificacionesService.notificarExito("Reseña agregada correctamente!")
        },
      });
    } else {
      this.ordenesService.actualizarResenha(this.idReview, this.reviewForm.value).subscribe({
        next: (response: any) => {
          console.info(response);
          this.notificacionesService.notificarExito("Reseña actualizada correctamente!")
          this.idReview=null
        },
      });
    }
  }
}
