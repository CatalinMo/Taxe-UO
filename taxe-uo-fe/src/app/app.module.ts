import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutModule } from "./layout/main-layout/main-layout.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizationModule } from "./shared/modules/authorization/authorization.module";
import { ConfigLoaderFactory } from "./shared/modules/configuration/configuration.factory";
import { ConfigurationService } from "./shared/modules/configuration/services/configuration.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    AuthorizationModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoaderFactory,
      deps: [ConfigurationService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
