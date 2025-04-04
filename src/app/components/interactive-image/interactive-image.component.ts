import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GenderService } from '../../services/gender.service';
import { map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interactive-image',
  standalone: true,
  imports: [RouterLink, ButtonModule, CommonModule],
  templateUrl: './interactive-image.component.html',
  styleUrl: './interactive-image.component.scss'
})
export class InteractiveImageComponent {
  genderService = inject(GenderService);
  imageSource = toObservable(this.genderService.gender).pipe(
    map(gender => gender === 'man' ? 'assets/boy.png' : 'assets/girl.png')
  );

  currentImage: string | null = null;
  currentGender: 'man' | 'woman' = 'man';

  constructor() {
    toObservable(this.genderService.gender).subscribe((gender) => {
      this.currentGender = gender;
    });
  }
}
