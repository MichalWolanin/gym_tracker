import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MenubarModule } from 'primeng/menubar';
import { DialogService } from '../../services/dialog.service';
import { TimerComponent } from "../timer/timer.component";
import { TrainingData } from '../../interfaces/TrainingData';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ButtonModule, ButtonGroupModule, MenubarModule, TimerComponent, DialogModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  dialogService = inject(DialogService);

  trainingTime: number = 0;
  dailyTrainingData: TrainingData[] = [];
  dialogVisible: boolean = false;

  onTimeElapsed(time: number) {
    this.trainingTime = time;
  }

  onTrainingFinished(data: any) {
    this.dailyTrainingData.push({
      trainingTime: data.trainingTime,
      pauseTime: data.pauseTime
    });
    localStorage.setItem('dailyTrainingData', JSON.stringify(this.dailyTrainingData));
  }
    showDialog() {
      this.dialogService.showDialog();
    }
}
