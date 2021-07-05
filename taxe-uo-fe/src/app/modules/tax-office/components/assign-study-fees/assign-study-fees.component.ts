import {Component, OnInit, PipeTransform} from '@angular/core';
import {Observable} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DecimalPipe} from "@angular/common";
import {combineLatest, map, startWith, switchMap} from "rxjs/operators";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StudyFeeModel} from "../../../../shared/models/study-fee.model";
import {StudyFeeServiceRepository} from "../../../../shared/services/study-fee.service.repository";
import {TaxOfficeService} from "../../service/tax-office.service";
import {ActiveFeeRequest} from "../../../../shared/models/request/active-fee.request";
import {AccountServiceRepository} from "../../../../shared/services/account.service.repository";

@Component({
  selector: 'app-assign-study-fees',
  templateUrl: './assign-study-fees.component.html',
  styleUrls: ['./assign-study-fees.component.scss']
})
export class AssignStudyFeesComponent implements OnInit {

  initialStudyFees$: Observable<StudyFeeModel[]>;
  studyFeesFilteredByCycle$: Observable<StudyFeeModel[]>;
  filteredStudyFees$: Observable<StudyFeeModel[]>;
  filter = new FormControl('');
  cycle = new FormControl('licenta');
  studyFeeForm = new FormGroup({
    limitDate: new FormControl('', Validators.required),
    comment: new FormControl(''),
    discount: new FormControl('', Validators.pattern('[0-9]+'))
  });
  selectedStudyFee: StudyFeeModel;

  constructor(
    private accountServiceRepository: AccountServiceRepository,
    private studyFeeServiceRepository: StudyFeeServiceRepository,
    private taxOfficeService: TaxOfficeService,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.getStudyFees();
    this.filterByCycle();
    this.filterStudyFees(pipe);
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true}).result.then(() => {}, () => {this.studyFeeForm.reset()});
  }

 assignStudyFeeToAccount(formValue) {
    if (this.taxOfficeService.getAreMultipleAccounts()) {
      this.assignFeeToMultipleAccounts(formValue);
    }
    else {
      this.assignStudyFee(formValue);
    }
  }

  setSelectedStudyFee(studyFee: StudyFeeModel) {
    this.selectedStudyFee = studyFee;
  }

  private assignFeeToMultipleAccounts(formValue) {
    const selectedIds = this.taxOfficeService.getSelectedIds();
    const activeFee = this.convertToActiveFee(formValue);
    this.accountServiceRepository.assignFeeToAccounts(selectedIds, activeFee).subscribe();
    window.location.reload();
  }

  private assignStudyFee(formValue) {
    const activeFee = this.convertToActiveFee(formValue);
    let selectedAccount = this.taxOfficeService.getAccountRequest();
    selectedAccount.activeFees.push(activeFee);
    this.accountServiceRepository.updateAccount(this.taxOfficeService.getAccountId(), selectedAccount).subscribe();
    window.location.reload();
  }

  private getStudyFees() {
    this.initialStudyFees$ = this.studyFeeServiceRepository.getStudyFees();
  }

  private filterByCycle() {
    this.studyFeesFilteredByCycle$ = this.cycle.valueChanges.pipe(
      startWith('licenta'),
      switchMap(text => this.searchByCycle(text))
    );
  }

  private filterStudyFees(pipe: any) {
    this.filteredStudyFees$ = this.filter.valueChanges.pipe(
      startWith(''),
      combineLatest(this.studyFeesFilteredByCycle$, (filterValue, items) => {
        return this.search(filterValue, items, pipe);
      })
    );
  }

  private search(text: string, list: Array<StudyFeeModel>, pipe: PipeTransform): StudyFeeModel[] {
    return list.filter(fee => {
      const term = text.toLowerCase();
      return fee.name && fee.name.toLowerCase().includes(term)
        || fee.study.cycle && fee.study.cycle.toLowerCase().includes(term)
        || fee.study.abbreviation && fee.study.abbreviation.toLowerCase().includes(term)
        || fee.type && fee.type.toLowerCase().includes(term)
        || fee.value && pipe.transform(fee.value).includes(term);
    });
  }

  private searchByCycle(text: string): Observable<StudyFeeModel[]> {
    return this.initialStudyFees$.pipe(map(studyFee =>
      studyFee.filter(fee => {
      const term = text.toLowerCase();
      return fee.study.cycle && fee.study.cycle.toLowerCase().includes(term);
    })));
  }

  private convertToActiveFee(formValue): ActiveFeeRequest {
    let newActiveFee = new ActiveFeeRequest();
    newActiveFee.name = this.selectedStudyFee.name;
    newActiveFee.details = this.selectedStudyFee.study.abbreviation;
    newActiveFee.comment = formValue.comment;
    newActiveFee.limitDate = new Date(formValue.limitDate).getTime();
    if (formValue.discount) {
      const discount = Number(formValue.discount);
      const discountValue = discount / 100 * this.selectedStudyFee.value;
      newActiveFee.value = this.selectedStudyFee.value - discountValue;
    }
    else {
      newActiveFee.value = this.selectedStudyFee.value;
    }
    return newActiveFee;
  }
}
