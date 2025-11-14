import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/services/ordenes.service';

@Component({
  selector: 'app-index-review',
  templateUrl: './index-review.component.html',
  styleUrls: ['./index-review.component.css']
})
export class IndexReviewComponent implements OnInit {
  items: any[] = []
  page=1
  pageSize=5
  stars = [1, 2, 3, 4, 5];

  constructor(private ordenesService: OrdenesService) {}

  ngOnInit(): void {
    this.ordenesService.obtenerResenhaPorUsuario(localStorage.getItem('_id')).subscribe({
      next: (response: any) => {
        console.log(response)
        this.items = response.data
      }
    })
  }
}
