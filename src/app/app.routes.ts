import { Routes } from '@angular/router';
import { DrawflowComponent } from './modules/drawflow/drawflow.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskDashboardComponent } from './task-dashboard/task-dashboard.component';

export const routes: Routes = [
    {
        path: 'workflow',
        component: DrawflowComponent
    },
    {
        path: '',
        component: TaskDashboardComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    }
];
