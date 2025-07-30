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

  constructor(private usuarioService: UsuarioService) {
    this.usuarioService.obtenerConfiguracionPublica().subscribe({
      next: (response: any) => {
        this.config_global = response.data;
        console.log(this.config_global)
      }
    })
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public someRange: number[] = [100, 700];
 

  changeSomeRange(index: number, value: number) {
    let newRange = [this.someRange[0], this.someRange[1]];
    newRange[index] = newRange[index] + value;
    this.someRange = newRange;
  }
}
