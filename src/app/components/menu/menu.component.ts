// import { Component, OnInit } from '@angular/core';
// import { MegaMenu } from 'primeng/megamenu';
// import { ButtonModule } from 'primeng/button';
// import { CommonModule } from '@angular/common';
// import { AvatarModule } from 'primeng/avatar';
// import { MenuService } from '../../services/menu.service';
// import { MenuItem } from '../../interfaces/MenuItem';

// @Component({
//   selector: 'app-menu',
//   standalone: true,
//   imports: [MegaMenu, ButtonModule, CommonModule, AvatarModule],
//   templateUrl: './menu.component.html',
//   styleUrl: './menu.component.scss'
// })
// export class MenuComponent implements OnInit {
//   menuItems: MenuItem[] = [];

//   constructor(private menuService: MenuService) { }

//   ngOnInit() {
//     this.menuService.getMenuItems().subscribe(data => {
//       this.menuItems = data;
//     })
//   }
// }

