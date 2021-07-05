import {Component, OnInit, PipeTransform} from '@angular/core';
import { Observable } from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import {combineLatest, map, startWith, switchMap} from "rxjs/operators";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HostelFeeModel } from "../../../../shared/models/hostel-fee.model";
import {HostelFeeServiceRepository} from "../../../../shared/services/hostel-fee.service.repository";
import {ActiveFeeRequest} from "../../../../shared/models/request/active-fee.request";
import {TaxOfficeService} from "../../service/tax-office.service";
import {AccountServiceRepository} from "../../../../shared/services/account.service.repository";

@Component({
  selector: 'app-assign-hostel-fees',
  templateUrl: './assign-hostel-fees.component.html',
  styleUrls: ['./assign-hostel-fees.component.scss']
})
export class AssignHostelFeesComponent implements OnInit {

  initialHostelFees$: Observable<HostelFeeModel[]>;
  hostelFeesFilteredByHostel$: Observable<HostelFeeModel[]>;
  filteredHostelFees$: Observable<HostelFeeModel[]>;
  filter = new FormControl('');
  hostel = new FormControl('C1');
  hostelFeeForm = new FormGroup({
    limitDate: new FormControl('', Validators.required),
    comment: new FormControl(''),
    discount: new FormControl('', Validators.pattern('[0-9]+'))
  });
  selectedHostelFee: HostelFeeModel;

  constructor(
    private accountServiceRepository: AccountServiceRepository,
    private hostelFeeServiceRepository: HostelFeeServiceRepository,
    private taxOfficeService: TaxOfficeService,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.getHostelFees();
    this.filterByHostel();
    this.filterHostelFees(pipe);
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true}).result.then(() => {}, () => {this.hostelFeeForm.reset()});
  }

  assignHostelFeeToAccount(formValue) {
    if (this.taxOfficeService.getAreMultipleAccounts()) {
      this.assignFeeToMultipleAccounts(formValue);
    }
    else {
      this.assignHostelFee(formValue);
    }
  }

  setSelectedHostelFee(hostelFee: HostelFeeModel) {
    this.selectedHostelFee = hostelFee;
  }

  private assignFeeToMultipleAccounts(formValue) {
    const selectedIds = this.taxOfficeService.getSelectedIds();
    const activeFee = this.convertToActiveFee(formValue);
    this.accountServiceRepository.assignFeeToAccounts(selectedIds, activeFee).subscribe();
    window.location.reload();
  }

  private assignHostelFee(formValue) {
    const activeFee = this.convertToActiveFee(formValue);
    let selectedAccount = this.taxOfficeService.getAccountRequest();
    selectedAccount.activeFees.push(activeFee);
    this.accountServiceRepository.updateAccount(this.taxOfficeService.getAccountId(), selectedAccount).subscribe();
    window.location.reload();
  }

  private getHostelFees() {
    this.initialHostelFees$ = this.hostelFeeServiceRepository.getHostelFees();
  }

  private filterByHostel() {
    this.hostelFeesFilteredByHostel$ = this.hostel.valueChanges.pipe(
      startWith('C1'),
      switchMap(text => this.searchByHostel(text))
    );
  }

  private filterHostelFees(pipe: any) {
    this.filteredHostelFees$ = this.filter.valueChanges.pipe(
      startWith(''),
      combineLatest(this.hostelFeesFilteredByHostel$, (filterValue, items) => {
        return this.search(filterValue, items, pipe);
      })
    );
  }

  private search(text: string, list: Array<HostelFeeModel>, pipe: PipeTransform): HostelFeeModel[] {
    return list.filter(fee => {
      const term = text.toLowerCase();
      return fee.name && fee.name.toLowerCase().includes(term)
        || fee.hostelName && fee.hostelName.toLowerCase().includes(term)
        || fee.type && fee.type.toLowerCase().includes(term)
        || fee.value && pipe.transform(fee.value).includes(term);
    });
  }

  private searchByHostel(text: string): Observable<HostelFeeModel[]> {
    return this.initialHostelFees$.pipe(map(hostelFee =>
      hostelFee.filter(fee => {
      const term = text.toLowerCase();
      return fee.hostelName && fee.hostelName.toLowerCase().includes(term);
    })));
  }

  private convertToActiveFee(formValue): ActiveFeeRequest {
    let newActiveFee = new ActiveFeeRequest();
    newActiveFee.name = this.selectedHostelFee.name;
    newActiveFee.details = this.selectedHostelFee.hostelName;
    newActiveFee.comment = formValue.comment;
    newActiveFee.limitDate = new Date(formValue.limitDate).getTime();
    if (formValue.discount) {
      const discount = Number(formValue.discount);
      const discountValue = discount / 100 * this.selectedHostelFee.value;
      newActiveFee.value = this.selectedHostelFee.value - discountValue;
    }
    else {
      newActiveFee.value = this.selectedHostelFee.value;
    }
    return newActiveFee;
  }
}
