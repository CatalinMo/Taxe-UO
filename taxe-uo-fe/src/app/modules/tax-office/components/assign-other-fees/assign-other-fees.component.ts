import {Component, OnInit, PipeTransform} from '@angular/core';
import { Observable } from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import {map, startWith, switchMap} from "rxjs/operators";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OtherFeeModel } from "../../../../shared/models/other-fee.model";
import {OtherFeeServiceRepository} from "../../../../shared/services/other-fee.service.repository";
import {AccountServiceRepository} from "../../../../shared/services/account.service.repository";
import {TaxOfficeService} from "../../service/tax-office.service";
import {ActiveFeeRequest} from "../../../../shared/models/request/active-fee.request";

@Component({
  selector: 'app-assign-other-fees',
  templateUrl: './assign-other-fees.component.html',
  styleUrls: ['./assign-other-fees.component.scss']
})
export class AssignOtherFeesComponent implements OnInit {

  initialOtherFees$: Observable<OtherFeeModel[]>;
  filteredOtherFees$: Observable<OtherFeeModel[]>;
  filter = new FormControl('');
  otherFeeForm = new FormGroup({
    limitDate: new FormControl('', Validators.required),
    comment: new FormControl(''),
    discount: new FormControl('', Validators.pattern('[0-9]+'))
  });
  selectedOtherFee: OtherFeeModel;

  constructor(
    private accountServiceRepository: AccountServiceRepository,
    private otherFeeServiceRepository: OtherFeeServiceRepository,
    private taxOfficeService: TaxOfficeService,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.getOtherFees();
    this.filterOtherFees(pipe);
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true}).result.then(() => {}, () => {this.otherFeeForm.reset()});
  }

  assignOtherFeeToAccount(formValue) {
    if (this.taxOfficeService.getAreMultipleAccounts()) {
      this.assignFeeToMultipleAccounts(formValue);
    }
    else {
      this.assignOtherFee(formValue);
    }
  }

  setSelectedOtherFee(otherFee: OtherFeeModel) {
    this.selectedOtherFee = otherFee;
  }

  private assignFeeToMultipleAccounts(formValue) {
    const selectedIds = this.taxOfficeService.getSelectedIds();
    const activeFee = this.convertToActiveFee(formValue);
    this.accountServiceRepository.assignFeeToAccounts(selectedIds, activeFee).subscribe();
    window.location.reload();
  }

  private assignOtherFee(formValue) {
    const activeFee = this.convertToActiveFee(formValue);
    let selectedAccount = this.taxOfficeService.getAccountRequest();
    selectedAccount.activeFees.push(activeFee);
    this.accountServiceRepository.updateAccount(this.taxOfficeService.getAccountId(), selectedAccount).subscribe();
    window.location.reload();
  }

  private getOtherFees() {
    this.initialOtherFees$ = this.otherFeeServiceRepository.getOtherFees();
  }

  private filterOtherFees(pipe: any) {
    this.filteredOtherFees$ = this.filter.valueChanges.pipe(
      startWith(''),
      switchMap(text => this.search(text, pipe))
    );
  }

  private search(text: string, pipe: PipeTransform): Observable<OtherFeeModel[]> {
    return this.initialOtherFees$.pipe(map(otherFee =>
      otherFee.filter(fee => {
      const term = text.toLowerCase();
      return fee.name.toLowerCase().includes(term)
        || fee.type.toLowerCase().includes(term)
        || pipe.transform(fee.value).includes(term);
    })));
  }

  private convertToActiveFee(formValue): ActiveFeeRequest {
    let newActiveFee = new ActiveFeeRequest();
    newActiveFee.name = this.selectedOtherFee.name;
    newActiveFee.comment = formValue.comment;
    newActiveFee.limitDate = new Date(formValue.limitDate).getTime();
    if (formValue.discount) {
      const discount = Number(formValue.discount);
      const discountValue = discount / 100 * this.selectedOtherFee.value;
      newActiveFee.value = this.selectedOtherFee.value - discountValue;
    }
    else {
      newActiveFee.value = this.selectedOtherFee.value;
    }
    return newActiveFee;
  }
}
