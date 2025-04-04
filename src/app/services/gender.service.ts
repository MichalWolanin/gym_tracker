import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenderService {
  gender = signal<'man' | 'woman'>('man');

  setGender(gender: 'man' | 'woman') {
    this.gender.set(gender);
  }
}
