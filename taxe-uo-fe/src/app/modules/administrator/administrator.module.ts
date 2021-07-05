import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { AdministratorRoutingModule } from "./administrator-routing.module";
import { StudyFeesComponent } from "./pages/study-fees/study-fees.component";
import { HostelFeesComponent } from "./pages/hostel-fees/hostel-fees.component";
import { OtherFeesComponent } from "./pages/other-fees/other-fees.component";
import { StudiesComponent } from "./pages/studies/studies.component";
import { AccountsComponent } from "./pages/accounts/accounts.component";
import { AddStudyComponent } from "./components/add-study/add-study.component";
import { ActiveStudyComponent } from "./components/active-study/active-study.component";
import {AccountServiceRepository} from "../../shared/services/account.service.repository";
import {AccountAdapter} from "../../shared/model-adapter/account.adapter";
import {ActiveStudyAdapter} from "../../shared/model-adapter/active-study.adapter";
import {ActiveFeeAdapter} from "../../shared/model-adapter/active-fee.adapter";
import {PaidFeeAdapter} from "../../shared/model-adapter/paid-fee.adapter";
import {StudyAdapter} from "../../shared/model-adapter/study.adapter";
import {StudyServiceRepository} from "../../shared/services/study.service.repository";
import {AdministratorService} from "./service/administrator.service";
import {StudyFeeAdapter} from "../../shared/model-adapter/study-fee.adapter";
import {StudyFeeServiceRepository} from "../../shared/services/study-fee.service.repository";
import {HostelFeeServiceRepository} from "../../shared/services/hostel-fee.service.repository";
import {HostelFeeAdapter} from "../../shared/model-adapter/hostel-fee.adapter";
import {OtherFeeServiceRepository} from "../../shared/services/other-fee.service.repository";
import {OtherFeeAdapter} from "../../shared/model-adapter/other-fee.adapter";

@NgModule({
  declarations: [
    AccountsComponent,
    StudiesComponent,
    StudyFeesComponent,
    HostelFeesComponent,
    OtherFeesComponent,
    AddStudyComponent,
    ActiveStudyComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdministratorRoutingModule,
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
    AdministratorService,
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
export class AdministratorModule {
}

