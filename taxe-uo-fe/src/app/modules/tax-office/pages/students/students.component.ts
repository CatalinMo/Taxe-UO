import {Component, OnInit} from '@angular/core';
import { Observable } from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {combineLatest, map, startWith, switchMap} from "rxjs/operators";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountModel } from "../../../../shared/models/account.model";
import {ActiveStudyModel} from "../../../../shared/models/active-study.model";
import {AccountServiceRepository} from "../../../../shared/services/account.service.repository";
import {StudyServiceRepository} from "../../../../shared/services/study.service.repository";
import {StudyModel} from "../../../../shared/models/study.model";
import {TaxOfficeService} from "../../service/tax-office.service";
import {AccountRequest} from "../../../../shared/models/request/account.request";
import {ActiveFeeRequest} from "../../../../shared/models/request/active-fee.request";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  initialStudies$: Observable<StudyModel[]>;
  filteredStudies$: Observable<StudyModel[]>;
  accountsFilteredByCycle$: Observable<AccountModel[]>;
  accountsFilteredByStudy$: Observable<AccountModel[]>;
  initialAccounts$: Observable<AccountModel[]>;
  filteredAccounts$: Observable<AccountModel[]>;
  filter = new FormControl('');
  cycle = new FormControl('');
  study = new FormControl('');
  disciplineRecoveryFeesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    discipline: new FormControl('', Validators.required),
    annualFee: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    disciplineCredits: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    limitDate: new FormControl('', Validators.required),
    comment: new FormControl('')
  });
  newFeesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    value: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    limitDate: new FormControl('', Validators.required),
    comment: new FormControl('')
  });
  ids: Array<number> = [];

  constructor(
    private accountServiceRepository: AccountServiceRepository,
    private studyServiceRepository: StudyServiceRepository,
    private taxOfficeService: TaxOfficeService,
    private modalService: NgbModal
  )
  {
    this.getStudies();
    this.getAccounts();
    this.filterByCycle();
    this.filterByStudy();
    this.filterAccounts();
  }

  ngOnInit(): void {}

  open(content: any, isLarge: boolean) {
    if (isLarge) {
      this.modalService.open(content, {centered: true, size: "xl"}).result.then(() => {}, () => {this.disciplineRecoveryFeesForm.reset(); this.newFeesForm.reset()});
    }
    else {
      this.modalService.open(content, {centered: true}).result.then(() => {}, () => {this.disciplineRecoveryFeesForm.reset(); this.newFeesForm.reset()});
    }
  }

  assignDisciplineRecoveryFeeToAccount(formValue) {
    if (this.taxOfficeService.getAreMultipleAccounts()) {
      this.assignDisciplineRecoveryFeeToMultipleAccounts(formValue);
    }
    else {
      this.assignDisciplineRecoveryFee(formValue);
    }
  }

  assignNewFeeToAccount(formValue) {
    if (this.taxOfficeService.getAreMultipleAccounts()) {
      this.assignNewFeeToMultipleAccounts(formValue);
    }
    else {
      this.assignNewFee(formValue);
    }
  }

  setAreMultipleAccounts(areMultiple: boolean) {
    this.taxOfficeService.setAreMultipleAccounts(areMultiple);
  }

  setAccount(account: AccountModel) {
    this.taxOfficeService.setAccount(account);
  }

  setAccountId(id: number) {
    this.taxOfficeService.setAccountId(id)
  }

  setAccountRequest(account: AccountModel) {
    const newAccount = this.convertToAccountRequest(account);
    this.taxOfficeService.setAccountRequest(newAccount);
  }

  onCheckboxChange(event: any) {
    if (event.target.checked) {
      this.ids.push(Number(event.target.value));
      this.taxOfficeService.setSelectedIds(this.ids);
    } else {
      let i = 0;
      this.ids.forEach(item => {
        if (item == event.target.value) {
          this.ids.splice(i, 1);
          return;
        }
        i++;
      });
      this.taxOfficeService.setSelectedIds(this.ids);
    }
  }

  allSelectionsChanges() {
    if (this.ids.length) {
      this.uncheckAllBoxes();
    } else {
      this.checkAllBoxes();
    }
  }

  private assignDisciplineRecoveryFeeToMultipleAccounts(formValue) {
    const selectedIds = this.taxOfficeService.getSelectedIds();
    const activeFee = this.convertToActiveFee(formValue);
    this.accountServiceRepository.assignFeeToAccounts(selectedIds, activeFee).subscribe();
    window.location.reload();
  }

  private assignDisciplineRecoveryFee(formValue) {
    const activeFee = this.convertToActiveFee(formValue);
    let selectedAccount = this.taxOfficeService.getAccountRequest();
    selectedAccount.activeFees.push(activeFee);
    this.accountServiceRepository.updateAccount(this.taxOfficeService.getAccountId(), selectedAccount).subscribe();
    window.location.reload();
  }

  private assignNewFeeToMultipleAccounts(formValue) {
    const selectedIds = this.taxOfficeService.getSelectedIds();
    const activeFee = this.convertNewFeeToActiveFee(formValue);
    this.accountServiceRepository.assignFeeToAccounts(selectedIds, activeFee).subscribe();
    window.location.reload();
  }

  private assignNewFee(formValue) {
    const activeFee = this.convertNewFeeToActiveFee(formValue);
    let selectedAccount = this.taxOfficeService.getAccountRequest();
    selectedAccount.activeFees.push(activeFee);
    this.accountServiceRepository.updateAccount(this.taxOfficeService.getAccountId(), selectedAccount).subscribe();
    window.location.reload();
  }

  private uncheckAllBoxes() {
    this.ids = [];
    this.taxOfficeService.setSelectedIds(this.ids);
    const checkedArray = document.getElementsByTagName('input');
    for (let i = 0; i < checkedArray.length; i++) {
      if (checkedArray[i].getAttribute('type') == 'checkbox') {
        checkedArray[i].checked = false;
      }
    }
  }

  private checkAllBoxes() {
    const checkedArray = document.getElementsByTagName('input');
    for (let i = 0; i < checkedArray.length; i++) {
      if (checkedArray[i].getAttribute('type') == 'checkbox') {
        checkedArray[i].checked = true;
        if(Number(checkedArray[i].value)) {
          this.ids.push(Number(checkedArray[i].value));
        }
      }
    }
    this.taxOfficeService.setSelectedIds(this.ids);
  }

  private getAccounts() {
    this.initialAccounts$ = this.accountServiceRepository.getAccounts();
  }

  private getStudies() {
    this.initialStudies$ = this.studyServiceRepository.getStudies();
  }

  private filterByCycle() {
    this.accountsFilteredByCycle$ = this.cycle.valueChanges.pipe(
      startWith(''),
      switchMap(text => this.searchByCycle(text))
    );

    this.filteredStudies$ =  this.cycle.valueChanges.pipe(
      startWith(''),
      switchMap(text => this.studySearch(text))
    );
  }

  private filterByStudy() {
    this.accountsFilteredByStudy$ = this.study.valueChanges.pipe(
      startWith(''),
      combineLatest(this.accountsFilteredByCycle$, (filterValue, items) => {
        return this.searchByStudy(filterValue, items);
      })
    );
  }

  private filterAccounts() {
    this.filteredAccounts$ = this.filter.valueChanges.pipe(
      startWith(''),
      combineLatest(this.accountsFilteredByStudy$, (filterValue, items) => {
        return this.search(filterValue, items);
      })
    );
  }

  private searchByCycle(text: string): Observable<AccountModel[]> {
    return this.initialAccounts$.pipe(map(account =>
      account.filter(account => {
      return this.activeStudySearch(account.activeStudies, text).length > 0;
    })));
  }

  private searchByStudy(text: string, list: Array<AccountModel>): AccountModel[] {
    return list.filter(account => {
      return this.activeStudySearch(account.activeStudies, text).length > 0;
    });
  }

  private search(text: string, list: Array<AccountModel>): AccountModel[] {
    return list.filter(account => {
      const term = text.toLowerCase();
      return account.firstName && account.firstName.toLowerCase().includes(term)
        || account.lastName && account.lastName.toLowerCase().includes(term)
        || account.cnp.toLowerCase().includes(term)
        || account.cnp && account.email.toLowerCase().includes(term)
        || account.phone &&account.phone.toLowerCase().includes(term)
        || this.activeStudySearch(account.activeStudies, text).length > 0;
    });
  }

  private activeStudySearch(studies: Array<ActiveStudyModel>, text: string): ActiveStudyModel[] {
    return studies.filter(study => {
      const term = text.toLowerCase();
      return study.cycle && study.cycle.toLowerCase().includes(term)
        || study.abbreviation && study.abbreviation.toLowerCase().includes(term);
    });
  }

  private studySearch(text: string): Observable<StudyModel[]> {
    this.study.setValue('');
    return this.initialStudies$.pipe(map(study =>
      study.filter(study => {
      const term = text.toLowerCase();
      return study.cycle && study.cycle.toLowerCase().includes(term);
    })));
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

  private convertToActiveFee(formValue): ActiveFeeRequest {
    let newActiveFee = new ActiveFeeRequest();
    newActiveFee.name = formValue.name;
    newActiveFee.details = formValue.discipline;
    newActiveFee.comment = formValue.comment;
    newActiveFee.limitDate = new Date(formValue.limitDate).getTime();
    newActiveFee.value = Number(formValue.annualFee) / 60 * Number(formValue.disciplineCredits);
    return newActiveFee;
  }

  private convertNewFeeToActiveFee(formValue): ActiveFeeRequest {
    let newActiveFee = new ActiveFeeRequest();
    newActiveFee.name = formValue.name;
    newActiveFee.comment = formValue.comment;
    newActiveFee.limitDate = new Date(formValue.limitDate).getTime();
    newActiveFee.value = Number(formValue.value);
    return newActiveFee;
  }
}
