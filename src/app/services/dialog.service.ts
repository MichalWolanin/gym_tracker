import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  visible = signal(false);

  showDialog() {
    this.visible.set(true);
  }

  hideDialog() {
    this.visible.set(false);
  }
}