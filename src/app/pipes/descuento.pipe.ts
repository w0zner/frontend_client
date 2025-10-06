import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descuento'
})
export class DescuentoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): number {
    const descuento = Number(value) - (Number(value) * Number(args[0])/100)

    return descuento;
  }

}
