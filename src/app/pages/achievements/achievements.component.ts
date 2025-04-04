import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RepsService } from '../../services/reps.service';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})
export class AchievementsComponent {
  public repsService = inject(RepsService);
}
