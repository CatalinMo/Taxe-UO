import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { TaxOfficeRoutingModule } from "./tax-office-routing.module";
import { LimitFeesComponent } from "./pages/limit-fees/limit-fees.component";
import { StudentsComponent } from "./pages/students/students.component";
import { AssignStudyFeesComponent } from "./components/assign-study-fees/assign-study-fees.component";
import { AssignHostelFeesComponent } from "./components/assign-hostel-fees/assign-hostel-fees.component";
import { AssignOtherFeesComponent } from "./components/assign-other-fees/assign-other-fees.component";
import { StudentActiveFeesComponent } from "./components/student-active-fees/student-active-fees.component";
import { StudentPaidFeesComponent } from "./components/student-paid-fees/student-paid-fees.component";
import { ActiveStudyComponent } from "./components/active-study/active-study.component";
import {AccountServiceRepository} from "../../shared/services/account.service.repository";
import {AccountAdapter} from "../../shared/model-adapter/account.adapter";
import {ActiveStudyAdapter} from "../../shared/model-adapter/active-study.adapter";
import {ActiveFeeAdapter} from "../../shared/model-adapter/active-fee.adapter";
import {PaidFeeAdapter} from "../../shared/model-adapter/paid-fee.adapter";
import {StudyServiceRepository} from "../../shared/services/study.service.repository";
import {StudyAdapter} from "../../shared/model-adapter/study.adapter";
import {StudyFeeAdapter} from "../../shared/model-adapter/study-fee.adapter";
import {TaxOfficeService} from "./service/tax-office.service";
import {StudyFeeServiceRepository} from "../../shared/services/study-fee.service.repository";
import {HostelFeeServiceRepository} from "../../shared/services/hostel-fee.service.repository";
import {HostelFeeAdapter} from "../../shared/model-adapter/hostel-fee.adapter";
import {OtherFeeServiceRepository} from "../../shared/services/other-fee.service.repository";
import {OtherFeeAdapter} from "../../shared/model-adapter/other-fee.adapter";
import {BacklogFeesComponent} from "./pages/backlog-fees/backlog-fees.component";

@NgModule({
  declarations: [
    StudentsComponent,
    LimitFeesComponent,
    AssignStudyFeesComponent,
    AssignHostelFeesComponent,
    AssignOtherFeesComponent,
    StudentActiveFeesComponent,
    StudentPaidFeesComponent,
    ActiveStudyComponent,
    BacklogFeesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaxOfficeRoutingModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    DecimalPipe,
    AccountServiceRepository,
    StudyServiceRepository,
    StudyFeeServiceRepository,
    HostelFeeServiceRepository,
    OtherFeeServiceRepository,
    TaxOfficeService,
    AccountAdapter,
    ActiveStudyAdapter,
    ActiveFeeAdapter,
    PaidFeeAdapter,
    StudyAdapter,
    StudyFeeAdapter,
    HostelFeeAdapter,
    OtherFeeAdapter
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaxOfficeModule {
}

