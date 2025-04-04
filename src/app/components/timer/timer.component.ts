import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  isRunning = false;
  trainingTime = 0;
  pauseTime = 0;
  private intervalSubscription: Subscription | undefined;
  private pauseStartTime: number | null = null;

  @Output() timeElapsed = new EventEmitter<number>();
  @Output() trainingFinished = new EventEmitter<any>(); 

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startTimer() {
    if (!this.isRunning) {
      this.isRunning = true;
      if (this.pauseStartTime !== null) {
        this.pauseTime += (Date.now() - this.pauseStartTime) / 1000; 
        this.pauseStartTime = null;
      }
      this.intervalSubscription = interval(1000).subscribe(() => {
        this.trainingTime++;
        this.timeElapsed.emit(this.trainingTime);
      });
    }
  }

  stopTimer() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    this.isRunning = false;
    this.pauseStartTime = Date.now(); 
  }

  resetTimer() {
    this.stopTimer();

    this.trainingFinished.emit({
      trainingTime: this.trainingTime,
      pauseTime: this.pauseTime,
      showDialog: true 
    });
    this.trainingTime = 0;
    this.pauseTime = 0;
    this.timeElapsed.emit(this.trainingTime);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
