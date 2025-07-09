import { Routes } from '@angular/router';
import { TaskComponent } from './pages/task/task.component';
import { CanvasComponent } from './pages/canvas/canvas.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TaskDashboardComponent } from './pages/taskDashboard/taskDashboard.component';

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
