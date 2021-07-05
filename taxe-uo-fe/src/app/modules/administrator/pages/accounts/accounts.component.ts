import {Component, OnInit} from '@angular/core';
import { Observable } from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { map, startWith, switchMap } from "rxjs/operators";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountModel } from "../../../../shared/models/account.model";
import { ActiveStudyModel } from "../../../../shared/models/active-study.model";
import { AccountServiceRepository } from "../../../../shared/services/account.service.repository";
import { AccountRequest } from "../../../../shared/models/request/account.request";
import {AdministratorService} from "../../service/administrator.service";
import {ActiveStudyRequest} from "../../../../shared/models/request/active-study.request";
import {ActiveFeeRequest} from "../../../../shared/models/request/active-fee.request";
import {PaidFeeRequest} from "../../../../shared/models/request/paid-fee.request";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  initialAccounts$: Observable<Array<AccountModel>>;
  filteredAccounts$: Observable<Array<AccountModel>>;
  filter = new FormControl('');
  accountForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    cnp: new FormControl('', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(13), Validators.maxLength(13)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')])
  });
  changePasswordForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]),
    secondNewPassword: new FormControl('', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')])
  }, {validators: this.checkPasswords})
  id: number;

  constructor(
    private accountServiceRepository: AccountServiceRepository,
    private administratorService: AdministratorService,
    private modalService: NgbModal
  )
  {
    this.getAccounts();
    this.filterAccounts();
  }

  ngOnInit(): void {
  }

  open(content: any, isLarge: boolean) {
    if (isLarge) {
      this.modalService.open(content, {centered: true, size: "xl"}).result.then(() => {}, () => {this.accountForm.reset(); this.changePasswordForm.reset()});
    }
    else {
      this.modalService.open(content, {centered: true}).result.then(() => {}, () => {this.accountForm.reset(); this.changePasswordForm.reset()});
    }
  }

  createAccount(formValue) {
    const newAccount = this.convertFormToAccount(formValue);
    this.accountServiceRepository.createAccount(newAccount).subscribe();
    window.location.reload();
  }

  updateAccount(formValue) {
    const changedAccount = this.convertFormToAccount(formValue);
    this.accountServiceRepository.updateAccount(this.id, changedAccount).subscribe();
    window.location.reload();
  }

  changeAccountPassword(formValue) {
    this.accountServiceRepository.changePassword(this.id, formValue.newPassword).subscribe();
    window.location.reload();
  }

  deleteAccountById() {
    this.accountServiceRepository.deleteAccount(this.id).subscribe();
    window.location.reload();
  }

  setId(id: number) {
    this.id = id;
  }

  setForm(account: AccountModel) {
    this.accountForm.patchValue({
      firstName: account.firstName,
      lastName: account.lastName,
      cnp: account.cnp,
      email: account.email,
      phone: account.phone
    });
  }

  setAccountId(id: number) {
    this.administratorService.setAccountId(id)
  }

  setAccountRequest(account: AccountModel) {
    const newAccount = this.convertToAccountRequest(account);
    this.administratorService.setAccountRequest(newAccount);
  }

  setAccount(account: AccountModel) {
    this.administratorService.setAccount(account);
  }

  private checkPasswords(group: FormGroup) {
    const password = group.value.newPassword;
    const confirmPassword = group.value.secondNewPassword;
    return password === confirmPassword ? null : { notSame: true }
   }

  private getAccounts() {
    this.initialAccounts$ = this.accountServiceRepository.getAccounts();
  }

  private filterAccounts() {
    this.filteredAccounts$ = this.filter.valueChanges.pipe(
      startWith(''),
      switchMap(text => this.search(text))
    );
  }

  private search(text: string): Observable<AccountModel[]> {
    return this.initialAccounts$.pipe(map(accounts =>
      accounts.filter(account => {
      const term = text.toLowerCase();
      return account.firstName && account.firstName.toLowerCase().includes(term)
        || account.email && account.lastName.toLowerCase().includes(term)
        || account.cnp && account.cnp.toLowerCase().includes(term)
        || account.email && account.email.toLowerCase().includes(term)
        || account.phone && account.phone.toLowerCase().includes(term)
        || account.activeStudies && this.searchByStudy(account.activeStudies, text).length > 0;
    })));
  }

  private searchByStudy(studies: Array<ActiveStudyModel>, text: string): ActiveStudyModel[] {
    return studies.filter(study => {
      const term = text.toLowerCase();
      return study.abbreviation.toLowerCase().includes(term);
    });
  }

  private convertFormToAccount(formValue): AccountRequest {
    let newAccount = new AccountRequest();
    newAccount.firstName = formValue.firstName;
    newAccount.lastName = formValue.lastName;
    newAccount.cnp = formValue.cnp;
    newAccount.email = formValue.email;
    newAccount.phone = formValue.phone;
    newAccount.activeStudies = new Array<ActiveStudyRequest>();
    newAccount.activeFees = new Array<ActiveFeeRequest>();
    newAccount.paidFees = new Array<PaidFeeRequest>();
    return newAccount;
  }

  private convertToAccountRequest(account: AccountModel): AccountRequest {
    let newAccount = new AccountRequest();
    newAccount.firstName = account.firstName;
    newAccount.lastName = account.lastName;
    newAccount.cnp = account.cnp;
    newAccount.email = account.email;
    newAccount.phone = account.phone;
    newAccount.activeStudies = account.activeStudies;
    newAccount.activeFees = account.activeFees;
    newAccount.paidFees = account.paidFees;
    return newAccount;
  }
}
