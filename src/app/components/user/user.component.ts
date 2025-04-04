import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from '../../services/dialog.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { GenderService } from '../../services/gender.service';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ DialogModule, ButtonModule, SelectButtonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent{
  dialogService = inject(DialogService);
  genderService = inject(GenderService);
  visible = this.dialogService.visible;
  stateOptions: any[] = [{ label: 'Man', value: 'man' },{ label: 'Woman', value: 'woman' }];
  value: 'man' | 'woman' = this.genderService.gender();

  hideDialog() {
    this.dialogService.hideDialog();
  }

  handleVisibleChange(event: boolean) {
    if (!event) {
      this.dialogService.hideDialog();
    }
  }

  saveSettings() {
    this.genderService.setGender(this.value);
    this.dialogService.hideDialog(); // Zamknij dialog po zapisaniu
}
}
