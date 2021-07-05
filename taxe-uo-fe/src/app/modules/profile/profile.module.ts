import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { ProfileRoutingModule } from "./profile-routing.module";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import {AccountServiceRepository} from "../../shared/services/account.service.repository";
import {AccountAdapter} from "../../shared/model-adapter/account.adapter";
import {ActiveStudyAdapter} from "../../shared/model-adapter/active-study.adapter";
import {ActiveFeeAdapter} from "../../shared/model-adapter/active-fee.adapter";
import {PaidFeeAdapter} from "../../shared/model-adapter/paid-fee.adapter";

@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    AccountServiceRepository,
    AccountAdapter,
    ActiveStudyAdapter,
    ActiveFeeAdapter,
    PaidFeeAdapter
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileModule {
}

