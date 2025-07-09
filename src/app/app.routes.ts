import { Routes } from '@angular/router';
import { TaskComponent } from './page/task/task.component';
import { CanvasComponent } from './page/canvas/canvas.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { TaskDashboardComponent } from './page/taskDashboard/taskDashboard.component';

export const routes: Routes = [
    {
        path: 'workflow/setup',
        component: CanvasComponent
    },
    {
        path: '',
        component: TaskDashboardComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'task/:id', // Use a colon to define a route parameter
        component: TaskComponent
    },
    {
        path: 'download',
        component: DashboardComponent
    }
];
