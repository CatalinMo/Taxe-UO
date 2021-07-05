import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {UserViewModel} from "../../../../shared/modules/authorization/models/user.view.model";
import {AccountServiceRepository} from "../../../../shared/services/account.service.repository";
import {AuthorizationServiceRepository} from "../../../../shared/modules/authorization/services/authorization/authorization.service.repository";
import {AccountModel} from "../../../../shared/models/account.model";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  account = new AccountModel();
  filter = new FormControl('');
  accountForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]),
    secondNewPassword: new FormControl('', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')])
  }, {validators: this.checkPasswords});
  user: UserViewModel;

  constructor(
    private accountServiceRepository: AccountServiceRepository,
    private modalService: NgbModal
  )
  {
    this.user = AuthorizationServiceRepository.getCurrentUserValue();
    this.getAccount();
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true}).result.then(() => {}, () => {this.accountForm.reset()});
  }

  changeAccountPassword(formValue) {
    this.accountServiceRepository.changePassword(this.account.id, formValue.newPassword).subscribe();
    window.location.reload();
  }

  private checkPasswords(group: FormGroup) {
    const password = group.value.newPassword;
    const confirmPassword = group.value.secondNewPassword;
    return password === confirmPassword ? null : { notSame: true }
   }

  private getAccount() {
    if (this.user.cnp) {
      this.accountServiceRepository.getAccountByCnp(this.user.cnp).subscribe(account => {
        this.account = account as AccountModel;
      });
    }
    else {
      this.accountServiceRepository.getAccountByEmail(this.user.email).subscribe(account => {
        this.account = account as AccountModel;
      });
    }
  }
}
