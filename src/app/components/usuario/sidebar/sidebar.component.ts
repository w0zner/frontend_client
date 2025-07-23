import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userLogged: any= null

  constructor(private authService: AuthService, private router: Router){
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario) => {
      this.userLogged = usuario;
    });
  }

  logout(){
    this.authService.logout()
    this.router.navigateByUrl('/login')
  }
}
