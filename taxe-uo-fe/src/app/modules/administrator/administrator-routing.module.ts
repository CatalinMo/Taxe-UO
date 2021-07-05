import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StudyFeesComponent } from "./pages/study-fees/study-fees.component";
import { HostelFeesComponent } from "./pages/hostel-fees/hostel-fees.component";
import { OtherFeesComponent } from "./pages/other-fees/other-fees.component";
import { StudiesComponent } from "./pages/studies/studies.component";
import { AccountsComponent } from "./pages/accounts/accounts.component";

const routes: Routes = [
  {
    path: 'conturi',
    component: AccountsComponent
  },
  {
    path: 'studii',
    component: StudiesComponent
  },
  {
    path: 'taxe-studiu',
    component: StudyFeesComponent
  },
  {
    path: 'taxe-camin',
    component: HostelFeesComponent
  },
  {
    path: 'alte-taxe',
    component: OtherFeesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule {}
