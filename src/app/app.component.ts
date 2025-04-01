import { Component } from '@angular/core';
import { MovementComponent } from './components/movement/movement.component';
// import { MenuComponent } from "./components/menu/menu.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MovementComponent, /*MenuComponent*/],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
}