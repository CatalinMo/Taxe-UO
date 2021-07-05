import { Component, OnInit, PipeTransform } from '@angular/core';
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import {map, startWith, switchMap} from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {AccountServiceRepository} from "../../../../shared/services/account.service.repository";
import {ActiveFeeModel} from "../../../../shared/models/active-fee.model";
import {ActiveFeeRequest} from "../../../../shared/models/request/active-fee.request";

@Component({
  selector: 'app-backlog-fees',
  templateUrl: './backlog-fees.component.html',
  styleUrls: ['./backlog-fees.component.scss']
})
export class BacklogFeesComponent implements OnInit {

  initialLimitFees$: Observable<ActiveFeeModel[]>;
  filteredLimitFees$: Observable<ActiveFeeModel[]>;
  filter = new FormControl('');
  comment = new FormControl('');
  selectedActiveFee: ActiveFeeModel;

  constructor(
    private accountServiceRepository: AccountServiceRepository,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.getLimitFees();
    this.filterLimitFees(pipe);
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true}).result.then(() => {}, () => {this.comment.reset()});
  }

  setSelectedActiveFee(activeFee: ActiveFeeModel) {
    this.selectedActiveFee = activeFee;
  }

  setForm(activeFee: ActiveFeeModel) {
    this.comment.patchValue(activeFee.comment);
  }

  updateActiveFee(formValue) {
    const activeFeeRequest = this.convertToActiveFeeRequest(formValue);
    this.accountServiceRepository.updateActiveFee(this.selectedActiveFee.id, activeFeeRequest).subscribe();
    window.location.reload();
  }

  getDate(timestamp: number): string {
    let date =  new Date(timestamp);
    return (date.getMonth() + 1) + '/' + date.getDate() +'/' + date.getFullYear();
  }

  calculateRemainingDays(limitDate: number): number {
    return (limitDate - new Date().getTime()) / (1000 * 3600 * 24);
  }

  private getLimitFees() {
    this.initialLimitFees$ = this.accountServiceRepository.getActiveFees().pipe(
      map(accounts =>
        accounts.filter(account => {
        return this.calculateRemainingDays(account.limitDate) < -1;
      }))
    )
  }

  private filterLimitFees(pipe: any) {
    this.filteredLimitFees$ = this.filter.valueChanges.pipe(
      startWith(''),
      switchMap(text => this.search(text, pipe))
    );
  }

  private search(text: string, pipe: PipeTransform): Observable<ActiveFeeModel[]> {
    return this.initialLimitFees$.pipe(map(activeFees =>
      activeFees.filter(fee => {
      const term = text.toLowerCase();
      return fee.name && fee.name.toLowerCase().includes(term)
        || fee.account.lastName && fee.account.lastName.toLowerCase().includes(term)
        || fee.account.cnp && fee.account.cnp.toLowerCase().includes(term)
        || fee.details && fee.details.toLowerCase().includes(term)
        || fee.comment && fee.comment.toLowerCase().includes(term)
        || fee.limitDate && this.getDate(fee.limitDate).toLowerCase().includes(term)
        || fee.value && pipe.transform(fee.value).includes(term);
    })));
  }

  private convertToActiveFeeRequest(formValue): ActiveFeeRequest {
    let newActiveFee = new ActiveFeeRequest();
    newActiveFee.name = this.selectedActiveFee.name;
    newActiveFee.details = this.selectedActiveFee.details;
    newActiveFee.comment = formValue;
    newActiveFee.limitDate = this.selectedActiveFee.limitDate;
    newActiveFee.value = this.selectedActiveFee.value;
    return newActiveFee;
  }
}
