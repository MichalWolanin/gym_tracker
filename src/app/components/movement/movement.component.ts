import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import { drawPose } from '../../utils/pose-utils';

@Component({
    selector: 'app-movement',
    standalone: true,
    imports: [],
    templateUrl: './movement.component.html',
    styleUrl: './movement.component.scss'
})
export class MovementComponent implements OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  mediaStream!: MediaStream;
  detector!: posedetection.PoseDetector;
  isLoading = false;
  private isDetecting = false;

  async startCamera() {
    this.isLoading = true;
    try {
      await this.loadModel();
      console.log("Startuje kamere");
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true});
      this.isLoading = false;

      this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.videoElement.nativeElement.onloadedmetadata = () => {
        this.adjustCanvasSize();
      };
      await this.videoElement.nativeElement.play();

      this.detectPose();
    } catch (error) {
      this.isLoading = false;
      console.error("Blad dostepu do kamery",error);
    } 
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

  adjustCanvasSize() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
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
        this.drawOnCanvas(poses);
      }
  
      requestAnimationFrame(detect);
    };
  
    detect();
  }

  drawOnCanvas(poses: posedetection.Pose[]) {
    const ctx = this.canvasElement.nativeElement.getContext('2d');
    if (ctx) {
      const video = this.videoElement.nativeElement;
      drawPose(poses, ctx, video.videoWidth, video.videoHeight);
    }
  }
  
  stopPoseDetection() {
    this.isDetecting = false;
  }
  
  clearCanvas() {
    const ctx = this.canvasElement.nativeElement.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      console.log("Zatrzymuje kamere");
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.videoElement.nativeElement.srcObject = null;
      this.mediaStream = null as unknown as MediaStream;
      this.stopPoseDetection();
      this.clearCanvas();
      this.isLoading = false;
    }
  }
  
    ngOnDestroy(): void {
      this.stopCamera();
    }
}
