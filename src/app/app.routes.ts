import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArmsComponent } from './pages/arms/arms.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'arms', component: ArmsComponent },
    { path: '++', redirectTo: '' }
];
