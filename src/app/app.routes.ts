import { Routes } from '@angular/router';
import { DrawflowComponent } from './modules/drawflow/drawflow.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'workflow',
        component: DrawflowComponent
    },
    {
        path: '',
        component: DashboardComponent
    }
];
