import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LimitFeesComponent } from "./pages/limit-fees/limit-fees.component";
import { StudentsComponent } from "./pages/students/students.component";
import {BacklogFeesComponent} from "./pages/backlog-fees/backlog-fees.component";

const routes: Routes = [
  {
    path: 'studenti',
    component: StudentsComponent
  },
  {
    path: 'taxe-limita',
    component: LimitFeesComponent
  },
  {
    path: 'taxe-restante',
    component: BacklogFeesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxOfficeRoutingModule {}
