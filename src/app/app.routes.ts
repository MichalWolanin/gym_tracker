import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArmsComponent } from './pages/arms/arms.component';
import { AchievementsComponent } from './pages/achievements/achievements.component';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'arms', component: ArmsComponent, canActivate: [AuthGuard] },
    { path: 'achievements', component: AchievementsComponent, canActivate: [AuthGuard] },
    { path: '++', redirectTo: '' }
];
 