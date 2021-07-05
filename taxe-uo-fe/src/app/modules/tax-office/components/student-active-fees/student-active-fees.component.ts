import {Component, OnInit, PipeTransform} from '@angular/core';
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {DecimalPipe} from "@angular/common";
import {map, startWith} from "rxjs/operators";
import {ActiveFeeModel} from "../../../../shared/models/active-fee.model";
import {TaxOfficeService} from "../../service/tax-office.service";
import {AccountServiceRepository} from "../../../../shared/services/account.service.repository";
import {PaidFeeRequest} from "../../../../shared/models/request/paid-fee.request";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-active-fees',
  templateUrl: './student-active-fees.component.html',
  styleUrls: ['./student-active-fees.component.scss']
})
export class StudentActiveFeesComponent implements OnInit {

  activeFees$: Observable<ActiveFeeModel[]>;
  filter = new FormControl('');
  id: number;
  selectedActiveFee: ActiveFeeModel;

  constructor(
    private accountServiceRepository: AccountServiceRepository,
    private taxOfficeService: TaxOfficeService,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.filterActiveFees(pipe);
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true}).result.then(() => {}, () => {});
  }

  getDate(timestamp: number): string {
    let date =  new Date(timestamp);
    return (date.getMonth() + 1) + '/' + date.getDate() +'/' + date.getFullYear();
  }

  markFeeAsPaid() {
    const paidFee = this.convertToPaidFee();
    let selectedAccount = this.taxOfficeService.getAccountRequest();
    const indexOfPaidActiveFee = selectedAccount.activeFees.indexOf(this.selectedActiveFee);
    selectedAccount.activeFees.splice(indexOfPaidActiveFee, 1);
    selectedAccount.paidFees.push(paidFee);
    this.accountServiceRepository.markFeeAsPaid(this.taxOfficeService.getAccountId(), this.selectedActiveFee.id, selectedAccount).subscribe();
    window.location.reload();
  }

  deleteAccountActiveFee() {
    this.accountServiceRepository.deleteAccountActiveFee(this.id).subscribe();
    window.location.reload();
  }

  setId(id: number) {
    this.id = id;
  }

  setSelectedActiveFee(activeFee: ActiveFeeModel) {
    this.selectedActiveFee = activeFee;
  }

  private filterActiveFees(pipe: any) {
    this.activeFees$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, pipe))
    );
  }

  private search(text: string, pipe: PipeTransform): ActiveFeeModel[] {
    return this.taxOfficeService.account.activeFees.filter(fee => {
      const term = text.toLowerCase();
      return fee.name && fee.name.toLowerCase().includes(term)
        || fee.details && fee.details.toLowerCase().includes(term)
        || fee.comment && fee.comment.toLowerCase().includes(term)
        || fee.limitDate && this.getDate(fee.limitDate).toLowerCase().includes(term)
        || fee.value && pipe.transform(fee.value).includes(term);
    });
  }

  private convertToPaidFee(): PaidFeeRequest {
    let newPaidFee = new PaidFeeRequest();
    newPaidFee.name = this.selectedActiveFee.name;
    newPaidFee.details = this.selectedActiveFee.details;
    newPaidFee.comment = this.selectedActiveFee.comment;
    newPaidFee.dateOfPayment = new Date().getTime();
    newPaidFee.value = this.selectedActiveFee.value;
    return newPaidFee;
  }
}
