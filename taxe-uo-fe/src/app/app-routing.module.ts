import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainContentComponent} from "./layout/main-layout/components/main-content/main-content.component";
import { AuthGuard } from "./shared/modules/authorization/guards/auth/auth.guard";
import {RolesGuard} from "./shared/modules/authorization/guards/roles/roles.guard";
import {UserRole} from "./shared/modules/authorization/enums/user-role";

const routes: Routes = [
  {
    path: '',
    component: MainContentComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'student',
        loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule),
        canActivate: [RolesGuard],
        data: {
          roles: [UserRole.STUDENT]
        }
      },
      {
        path: 'birou-taxe',
        loadChildren: () => import('./modules/tax-office/tax-office.module').then(m => m.TaxOfficeModule),
        canActivate: [RolesGuard],
        data: {
          roles: [UserRole.TAX_OFFICE]
        }
      },
      {
        path: 'administrator',
        loadChildren: () => import('./modules/administrator/administrator.module').then(m => m.AdministratorModule),
        canActivate: [RolesGuard],
        data: {
          roles: [UserRole.ADMIN]
        }
      },
      {
        path: 'user',
        loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule)
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./shared/modules/authorization/authorization.module').then(m => m.AuthorizationModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
