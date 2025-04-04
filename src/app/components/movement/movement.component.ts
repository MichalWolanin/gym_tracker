import { Component, ElementRef, ViewChild, OnDestroy, signal } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import { drawPose, checkForRep } from '../../utils/pose-utils'; 
import { POSE_CONNECTIONS } from '../../utils/pose-utils';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-movement',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './movement.component.html',
  styleUrl: './movement.component.scss'
})
export class MovementComponent implements OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rightAngleElement') rightAngleElement!: ElementRef;
  @ViewChild('leftAngleElement') leftAngleElement!: ElementRef;

  mediaStream!: MediaStream;
  detector!: posedetection.PoseDetector;
  isLoading = signal(false);
  private isDetecting = false;

  leftArmReps = signal(0);
  rightArmReps = signal(0);
  leftAngle = signal<number | null>(null); 
  rightAngle = signal<number | null>(null);
  leftArmIsUp = false;
  rightArmIsUp = false;
  leftArmHighlight: boolean = false;
  rightArmHighlight: boolean = false; 
  pointSound = new Audio('assets/point-sound.mp3');
  playbackRate = 2;

  ANGLE_UP_THRESHOLD = 40;
  ANGLE_DOWN_THRESHOLD = 140;
  SCORE_THRESHOLD = 0.3;
  POSE_CONNECTIONS = POSE_CONNECTIONS;

  ngOnDestroy(): void {
    this.stopCamera();
  }

  async startCamera() {
    this.isLoading.set(true);
    try {
      await this.loadModel();
      console.log("Startuje kamere");
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true});
      this.isLoading.set(false);

      this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.videoElement.nativeElement.onloadedmetadata = () => {
        this.adjustCanvasSize();
      };
      await this.videoElement.nativeElement.play();

      this.detectPose();
    } catch (error) {
      this.isLoading.set(false);
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
      console.error("Błąd podczas ładowania modelu MoveNet:", error);
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

      if (poses && poses.length > 0) {
        checkForRep(
          poses,
          this.ANGLE_UP_THRESHOLD,
          this.ANGLE_DOWN_THRESHOLD,
          this.SCORE_THRESHOLD,
          this.leftArmIsUp,
          this.rightArmIsUp,
          this.leftArmReps(),
          this.rightArmReps(),
          (value) => { 
            this.leftArmReps.set(value);
            this.triggerHighlight('left');
            this.playSound();
          },
          (value) => { 
            this.rightArmReps.set(value);
            this.triggerHighlight('right');
            this.playSound();
          },
          (value) => this.leftAngle.set(value),
          (value) => this.rightAngle.set(value),
          (value) => this.leftArmIsUp = value,
          (value) => this.rightArmIsUp = value
        );
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
      this.isLoading.set(false);
    }
  }

  triggerHighlight(arm: 'left' | 'right') {
    if (arm === 'left') {
      this.leftArmHighlight = true;
      setTimeout(() => this.leftArmHighlight = false, 300); 
    } else {
      this.rightArmHighlight = true;
      setTimeout(() => this.rightArmHighlight = false, 300);
    }
  }

  playSound() {
    this.pointSound.playbackRate = this.playbackRate;
    this.pointSound.play();
  }
}
