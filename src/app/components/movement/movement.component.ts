import { Component, ElementRef, ViewChild, OnDestroy, signal, inject } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import { drawPose, checkForRep } from '../../utils/pose-utils'; 
import { POSE_CONNECTIONS } from '../../utils/pose-utils';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { RepsService } from '../../services/reps.service';

@Component({
  selector: 'app-movement',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressBarModule],
  templateUrl: './movement.component.html',
  styleUrl: './movement.component.scss'
})
export class MovementComponent implements OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rightAngleElement') rightAngleElement!: ElementRef;
  @ViewChild('leftAngleElement') leftAngleElement!: ElementRef;
  public repsService = inject(RepsService);

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
      alert("Wystąpił problem z dostępem do kamery. Sprawdź, czy kamera jest podłączona i czy masz uprawnienia do korzystania z niej.")
    }
  }

  async loadModel() {
    await tf.setBackend('webgl');
    await tf.ready();

    try {
      this.detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING
    });
    } catch (error) {
      alert("Wystąpił problem z ładowaniem modelu MoveNet. Spróbuj odświeżyć stronę.")
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

    let leftReps = this.repsService.leftArmReps();
    let rightReps = this.repsService.rightArmReps();

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
          leftReps,
          rightReps,
          (value) => { 
            leftReps = value;
            this.repsService.checkAndSetReps(leftReps, rightReps)
            this.triggerHighlight('left');
            this.playSound();
          },
          (value) => { 
            rightReps = value;
            this.repsService.checkAndSetReps(leftReps, rightReps)
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

  async stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.videoElement.nativeElement.srcObject = null;
      this.mediaStream = null as unknown as MediaStream;
      this.stopPoseDetection();
      this.clearCanvas();
      this.isLoading.set(false);
      await this.repsService.saveReps();
      this.repsService.resetReps();
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
