import { Injectable } from '@angular/core';
import * as posedetection from '@tensorflow-models/pose-detection';

@Injectable({
  providedIn: 'root'
})
export class PoseService {
  private detector!: posedetection.PoseDetector;

  async loadModel() {
    this.detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet);
  }

  async estimatePoses(video: HTMLVideoElement) {
    if (!this.detector) return null;
    return this.detector.estimatePoses(video);
  }
}
