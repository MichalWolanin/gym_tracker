import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InteractiveImageComponent } from "../../components/interactive-image/interactive-image.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, InteractiveImageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}
