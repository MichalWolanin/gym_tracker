import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MenubarModule } from 'primeng/menubar';
import { DialogService } from '../../services/dialog.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ButtonModule, ButtonGroupModule, MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  dialogService = inject(DialogService);
  showDialog() {
    this.dialogService.showDialog();
  }
}
