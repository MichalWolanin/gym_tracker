import * as posedetection from '@tensorflow-models/pose-detection';

const POSE_CONNECTIONS: [string, string][] = [
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "right_shoulder"],
  ["left_hip", "right_hip"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"]
];
export function drawPose(poses: posedetection.Pose[], ctx: CanvasRenderingContext2D, videoWidth: number, videoHeight: number) {
  if (poses.length === 0) return;

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  const scaleX = canvasWidth / videoWidth;
  const scaleY = canvasHeight / videoHeight;

  poses.forEach(poseData => {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    const keypointsMap: Record<string, posedetection.Keypoint> = {};

    poseData.keypoints.forEach(point => {
      if (point.score && point.score > 0.3 && point.name) {
        const mirroredX = canvasWidth - (point.x * scaleX);
        const scaledY = point.y * scaleY;

        keypointsMap[point.name] = { ...point, x: mirroredX, y: scaledY };

        ctx.beginPath();
        ctx.arc(mirroredX, scaledY, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    POSE_CONNECTIONS.forEach(([p1, p2]) => {
      if (keypointsMap[p1] && keypointsMap[p2]) {
        ctx.beginPath();
        ctx.moveTo(keypointsMap[p1].x, keypointsMap[p1].y);
        ctx.lineTo(keypointsMap[p2].x, keypointsMap[p2].y);
        ctx.stroke();
      }
    });
  });
}
