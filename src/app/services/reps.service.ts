import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RepsService {
  leftArmReps = signal(0);
  rightArmReps = signal(0);
  savedLeftArmReps = signal(this.getLeftArmReps());
  savedRightArmReps = signal(this.getRightArmReps());

  async updateReps(leftReps: number | null, rightReps: number| null) {
    this.leftArmReps.set(leftReps ?? 0);
    this.rightArmReps.set(rightReps ?? 0);
  }

async saveReps() {
  try {
    localStorage.setItem('leftArmReps', this.leftArmReps().toString());
    localStorage.setItem('rightArmReps', this.rightArmReps().toString());
  } catch (error) {
    console.error('Error saving reps:', error);
  }
  this.savedLeftArmReps.set(this.leftArmReps());
  this.savedRightArmReps.set(this.rightArmReps());
}

  resetReps() {
    this.leftArmReps.set(0);
    this.rightArmReps.set(0);
  }

  getLeftArmReps(): number {
    const value = localStorage.getItem('leftArmReps');
    return value ? parseInt(value, 10) : 0;
  }

  getRightArmReps(): number {
    const value = localStorage.getItem('rightArmReps');
    return value ? parseInt(value, 10) : 0;
  }

  checkAndSetReps(leftReps: number | null, rightReps: number | null) {
    this.updateReps(leftReps, rightReps);
  }
}
