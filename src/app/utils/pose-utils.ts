import * as posedetection from '@tensorflow-models/pose-detection';

export const POSE_CONNECTIONS: [string, string][] = [
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
        ctx.arc(mirroredX, scaledY, 3, 0, 2 * Math.PI);
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

// Funkcja obliczająca kąt
export function calculateAngle(firstPoint: posedetection.Keypoint, midPoint: posedetection.Keypoint, lastPoint: posedetection.Keypoint): number {
  const radians =
    Math.atan2(lastPoint.y - midPoint.y, lastPoint.x - midPoint.x) -
    Math.atan2(firstPoint.y - midPoint.y, firstPoint.x - midPoint.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  angle = angle > 180 ? 360 - angle : angle;
  return angle;
}

export function checkForRep(
  poses: posedetection.Pose[],
  ANGLE_UP_THRESHOLD: number,
  ANGLE_DOWN_THRESHOLD: number,
  SCORE_THRESHOLD: number,
  leftArmIsUp: boolean,
  rightArmIsUp: boolean,
  leftArmReps: number,
  rightArmReps: number,
  setLeftArmReps: (value: number) => void, 
  setRightArmReps: (value: number) => void,
  setLeftAngle: (value: number | null) => void, 
  setRightAngle: (value: number | null) => void, 
  setLeftArmIsUp: (value: boolean) => void,
  setRightArmIsUp: (value: boolean) => void 
): { leftArmReps: number; rightArmReps: number; leftArmIsUp: boolean; rightArmIsUp: boolean; }
{
  if (poses.length === 0) return { leftArmReps, rightArmReps, leftArmIsUp, rightArmIsUp};

  const keypoints = poses[0].keypoints;

  const leftWrist = keypoints.find((point) => point.name === 'left_wrist');
  const leftElbow = keypoints.find((point) => point.name === 'left_elbow');
  const leftShoulder = keypoints.find((point) => point.name === 'left_shoulder');
  const rightWrist = keypoints.find((point) => point.name === 'right_wrist');
  const rightElbow = keypoints.find((point) => point.name === 'right_elbow');
  const rightShoulder = keypoints.find((point) => point.name === 'right_shoulder');

  if (rightWrist && rightElbow && rightShoulder &&
    typeof rightWrist.score === 'number' && rightWrist.score > SCORE_THRESHOLD &&
    typeof rightElbow.score === 'number' && rightElbow.score > SCORE_THRESHOLD &&
    typeof rightShoulder.score === 'number' && rightShoulder.score > SCORE_THRESHOLD) {

    const rightAngleValue = calculateAngle(rightWrist, rightElbow, rightShoulder);
    setRightAngle(rightAngleValue);

    if (rightAngleValue < ANGLE_UP_THRESHOLD && !rightArmIsUp) {
        rightArmIsUp = true;
        setRightArmIsUp(true);
        rightArmReps++;
        setRightArmReps(rightArmReps);
        console.log("Prawa reka", rightArmReps);
    }
    if (rightAngleValue > ANGLE_DOWN_THRESHOLD && rightArmIsUp) {
        rightArmIsUp = false;
        setRightArmIsUp(false);
    }
} else {
    setRightAngle(null);
}

  if (leftWrist && leftElbow && leftShoulder &&
    typeof leftWrist.score === 'number' && leftWrist.score > SCORE_THRESHOLD &&
    typeof leftElbow.score === 'number' && leftElbow.score > SCORE_THRESHOLD &&
    typeof leftShoulder.score === 'number' && leftShoulder.score > SCORE_THRESHOLD) {

    const leftAngleValue = calculateAngle(leftWrist, leftElbow, leftShoulder);
    setLeftAngle(leftAngleValue);

    if (leftAngleValue < ANGLE_UP_THRESHOLD && !leftArmIsUp) {
        leftArmIsUp = true;
        setLeftArmIsUp(true);
        leftArmReps++;
        setLeftArmReps(leftArmReps);
        console.log("Lewa reka", leftArmReps);
    }
    if (leftAngleValue > ANGLE_DOWN_THRESHOLD && leftArmIsUp) {
        leftArmIsUp = false;
        setLeftArmIsUp(false);
    }
} else {
    setLeftAngle(null);
}

  return { leftArmReps, rightArmReps, leftArmIsUp, rightArmIsUp }; 
}
