import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ActiveFeesComponent } from "./pages/active-fees/active-fees.component";
import {StudentStudiesComponent} from "./pages/student-studies/student-studies.component";
import {PaidFeesComponent} from "./pages/paid-fees/paid-fees.component";

const routes: Routes = [
  {
    path: 'taxe-active',
    component: ActiveFeesComponent
  },
  {
    path: 'taxe-platite',
    component: PaidFeesComponent
  },
  {
    path: 'studii-active',
    component: StudentStudiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}
