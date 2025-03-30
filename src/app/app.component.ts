import { Component, ElementRef, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  mediaStream!: MediaStream;

  async startCamera() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true});

      this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.videoElement.nativeElement.play();
    } catch (error) {
      console.error("Blad dostepu do kamery",error);
    }
}

stopCamera() {
  if (this.mediaStream) {
    this.mediaStream.getTracks().forEach(track => track.stop());
    this.videoElement.nativeElement.srcObject = null;
    this.mediaStream = null as unknown as MediaStream;
  }
}

  ngOnDestroy(): void {
    this.stopCamera();
  }
}

