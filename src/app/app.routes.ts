import { Routes } from '@angular/router';
import { DrawflowComponent } from './modules/drawflow/drawflow.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './common/login/login.component';


export const routes: Routes = [
    {
        path: 'workflow',
        component: DrawflowComponent
    },
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    }
];
