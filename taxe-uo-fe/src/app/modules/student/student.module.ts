import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { ActiveFeesComponent } from "./pages/active-fees/active-fees.component";
import { StudentRoutingModule } from "./student-routing.module";
import { StudentStudiesComponent } from "./pages/student-studies/student-studies.component";
import {PaidFeesComponent} from "./pages/paid-fees/paid-fees.component";
import {AccountServiceRepository} from "../../shared/services/account.service.repository";
import {AccountAdapter} from "../../shared/model-adapter/account.adapter";
import {ActiveStudyAdapter} from "../../shared/model-adapter/active-study.adapter";
import {ActiveFeeAdapter} from "../../shared/model-adapter/active-fee.adapter";
import {PaidFeeAdapter} from "../../shared/model-adapter/paid-fee.adapter";

@NgModule({
  declarations: [
    ActiveFeesComponent,
    PaidFeesComponent,
    StudentStudiesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StudentRoutingModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    DecimalPipe,
    AccountServiceRepository,
    AccountAdapter,
    ActiveStudyAdapter,
    ActiveFeeAdapter,
    PaidFeeAdapter
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StudentModule {
}

