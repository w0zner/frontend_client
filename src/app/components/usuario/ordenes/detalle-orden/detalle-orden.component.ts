import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { GLOBAL } from "src/app/services/GLOBAL";
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
  opcionResenha: string | undefined;
  reviewForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private acivatedRoute: ActivatedRoute,
    private ordenesService: OrdenesService,
  ) {
    this.urlProducto = GLOBAL.url + "productos/obtenerPortada/";
    this.reviewForm = this.fb.group({
      producto: [""],
      usuario: [""],
      venta: [""],
      mensaje: [""],
      opcion: [""],
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
          },
        });
      }
    });
  }

  setResenha(producto: any) {
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
            opcion: response?.data[0]?.opcion,
          });
          this.opcionResenha = response?.data[0]?.opcion;
          console.log(this.reviewForm.value);

          //VALIDACION DE FECHA PARA Reseña
          // const fechaCreacion = new Date("2025-11-11T01:49:02.535Z");
          //const ahora = new Date();

          // Crear una copia de la fecha de creación y sumarle 1 mes
          //const fechaMasUnMes = new Date(fechaCreacion);
          //fechaMasUnMes.setMonth(fechaMasUnMes.getMonth() + 1);

          // Comparar si la fecha actual es mayor o igual a un mes después
          //const haPasadoUnMes = ahora >= fechaMasUnMes;

          //console.log(haPasadoUnMes); // true o false
          //
          // O
          //
          //
          // const fechaCreacion = new Date("2025-11-11T01:49:02.535Z");
          //const ahora = new Date();

          //const unMesEnMs = 30 * 24 * 60 * 60 * 1000; // 30 días aprox.
          //const diferencia = ahora.getTime() - fechaCreacion.getTime();

          //const haPasadoUnMes = diferencia >= unMesEnMs;

          //console.log(haPasadoUnMes);
        },
      });
  }

  elegirResenha(opcion: string) {
    this.opcionResenha = opcion;
    this.reviewForm.patchValue({
      opcion: opcion,
    });
  }

  emitirResenha(producto: any) {
    this.reviewForm.patchValue({
      venta: this.orden._id,
      usuario: this.orden.usuario._id,
      producto: producto,
    });
    console.info(this.reviewForm.value);
    this.ordenesService.guardarResenha(this.reviewForm.value).subscribe({
      next: (response: any) => {
        console.info(response);
      },
    });
  }
}
