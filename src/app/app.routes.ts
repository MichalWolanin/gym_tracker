import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArmsComponent } from './pages/arms/arms.component';
import { AchievementsComponent } from './pages/achievements/achievements.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'arms', component: ArmsComponent },
    { path: 'achievements', component: AchievementsComponent},
    { path: '++', redirectTo: '' }
];
 