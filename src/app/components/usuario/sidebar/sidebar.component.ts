import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userLogged: any= null

  constructor(private authService: AuthService){
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario) => {
      this.userLogged = usuario;
    });
  }

}
