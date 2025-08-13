import { Component, OnInit } from '@angular/core';
declare var tns: (arg0: { container: string; controlsText: string[]; navPosition: string; controlsPosition: string; mouseDrag: boolean; speed: number; autoplayHoverPause: boolean; autoplayButtonOutput: boolean; navContainer: string; navAsThumbnails: boolean; gutter: number; }) => void;

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {


  ngOnInit(): void {
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
  }

}
