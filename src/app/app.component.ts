import { Component } from '@angular/core';
import { MovementComponent } from './components/movement/movement.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MovementComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
}