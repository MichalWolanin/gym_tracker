import { Component } from '@angular/core';
import { MovementComponent } from "../../components/movement/movement.component";

@Component({
    selector: 'app-arms',
    standalone: true,
    imports: [MovementComponent],
    templateUrl: './arms.component.html',
    styleUrl: './arms.component.scss'
})
export class ArmsComponent {

}
