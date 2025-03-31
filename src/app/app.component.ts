import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  mediaStream!: MediaStream;
  detector!: posedetection.PoseDetector;
  isDetecting = false;

  async ngAfterViewInit() {
    await this.loadModel();
    this.startCamera();
  }

  async loadModel() {
    console.log("Inicjalizacja TensorFlow.js...");
    await tf.setBackend('webgl');
    await tf.ready();

    console.log("Ładowanie modelu MoveNet...");
    try {
      this.detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING
    });
    console.log("Model MoveNet został załadowany.");
    } catch (error) {
      console.error("Błąd podczas ładowania modelu MoveNet:", error);
    }
  }
  
  async startCamera() {
    try {
      console.log("Startuje kamere");
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true});

      this.videoElement.nativeElement.srcObject = this.mediaStream;
      await this.videoElement.nativeElement.play();

      this.detectPose();
    } catch (error) {
      console.error("Blad dostepu do kamery",error);
    }
}

async detectPose() {
  if (!this.detector) return;

  this.isDetecting = true;
  const video = this.videoElement.nativeElement;
  const canvas = this.canvasElement.nativeElement;
  const ctx = canvas.getContext('2d');

  const detect = async () => {
    if (!this.isDetecting) return;

    const poses = await this.detector.estimatePoses(video);
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    if (poses && poses.length > 0) {
      this.drawPose(poses[0], ctx!)
    }

    requestAnimationFrame(detect);
  };

  detect();
}


drawPose(pose: posedetection.Pose, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'red';
  pose.keypoints.forEach(point => {
    if (point.score && point.score > 0.3) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}

stopCamera() {
  if (this.mediaStream) {
    console.log("Zatrzymuje kamere");
    this.mediaStream.getTracks().forEach(track => track.stop());
    this.videoElement.nativeElement.srcObject = null;
    this.mediaStream = null as unknown as MediaStream;
  }
}

  ngOnDestroy(): void {
    this.stopCamera();
  }
}

