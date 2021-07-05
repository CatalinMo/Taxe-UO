import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorizationRoutingModule } from "./authorization-routing.module";
import { AuthenticationComponent } from "./pages/authentication/authentication.component";
import {AuthGuard} from "./guards/auth/auth.guard";
import {AuthorizationServiceRepository} from "./services/authorization/authorization.service.repository";
import {AuthAdapter} from "./model-adapters/auth.adapter";
import {UserAdapter} from "./model-adapters/user.adapter";
import {AuthorizationInterceptor} from "./interceptors/authorization.interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthViewAdapter} from "./model-adapters/auth.view.adapter";
import {RolesGuard} from "./guards/roles/roles.guard";
import {UserViewAdapter} from "./model-adapters/user.view.adapter";

@NgModule({
  declarations: [
    AuthenticationComponent
  ],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthorizationInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true
    },
    AuthorizationServiceRepository,
    AuthAdapter,
    AuthViewAdapter,
    UserAdapter,
    UserViewAdapter,
    AuthGuard,
    RolesGuard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthorizationModule {
}

