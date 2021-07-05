import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthorizationServiceRepository } from "../../services/authorization/authorization.service.repository";
import { AuthViewModel } from "../../models/auth.view.model";
import { HttpErrorResponse } from "@angular/common/http";
import {UserRole} from "../../enums/user-role";

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  authenticationForm: FormGroup;
  errorMessage: string;

  constructor(
    private router: Router,
    private authorizationService: AuthorizationServiceRepository
  ) {
    this.authenticationForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit() {
  }

  onLogin(formValue) {
    this.authorizationService.signIn(
      formValue.username,
      formValue.password
    ).subscribe((response: AuthViewModel) => {
      this.errorMessage = null;
      this.redirectUser(response.user.role);
    }, (error: HttpErrorResponse) => {
      this.errorMessage = error.error.message;
    });
  }

  private redirectUser(role: string) {
    if (role == UserRole.ADMIN) {
      this.router.navigateByUrl('/administrator/conturi');
    }
    else if (role == UserRole.TAX_OFFICE) {
      this.router.navigateByUrl('/birou-taxe/studenti');
    }
    else {
      this.router.navigateByUrl('/student/studii-active');
    }
  }
}
