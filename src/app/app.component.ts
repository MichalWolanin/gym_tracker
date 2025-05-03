import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserComponent } from './components/user/user.component';
import { FooterComponent } from "./components/footer/footer.component";
import { AuthService } from '@auth0/auth0-angular';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, UserComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    auth = inject(AuthService);
    router = inject(Router);

    ngOnInit() {
        this.auth.isAuthenticated$.subscribe(isAuth => {
          if (isAuth) {
            this.router.navigate(['/']); 
          } else {
            this.router.navigate(['/']);
          }
        });
      }
}