import {Component, OnInit, PipeTransform} from '@angular/core';
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import {map, startWith, switchMap} from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import html2canvas from 'html2canvas';
import jspdf from "jspdf";
import { PaidFeeModel } from "../../../../shared/models/paid-fee.model";
import {UserViewModel} from "../../../../shared/modules/authorization/models/user.view.model";
import {AccountServiceRepository} from "../../../../shared/services/account.service.repository";
import {AuthorizationServiceRepository} from "../../../../shared/modules/authorization/services/authorization/authorization.service.repository";
import {AccountModel} from "../../../../shared/models/account.model";

@Component({
  selector: 'app-paid-fees',
  templateUrl: './paid-fees.component.html',
  styleUrls: ['./paid-fees.component.scss']
})
export class PaidFeesComponent implements OnInit {

  initialPaidFees$: Observable<PaidFeeModel[]>;
  filteredPaidFees$: Observable<PaidFeeModel[]>;
  filter = new FormControl('');
  user: UserViewModel;
  selectedAccount: AccountModel;
  selectedPaidFee: PaidFeeModel;

  constructor(
    private accountServiceRepository: AccountServiceRepository,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.user = AuthorizationServiceRepository.getCurrentUserValue();
    this.getAccount();
    this.getPaidFees();
    this.filterPaidFees(pipe);
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true, size: "xl"}).result.then(() => {}, () => {});
  }

  setSelectedPaidFee(paidFee: PaidFeeModel) {
    this.selectedPaidFee = paidFee;
  }

  getDate(timestamp: number): string {
    let date =  new Date(timestamp);
    return (date.getMonth() + 1) + '/' + date.getDate() +'/' + date.getFullYear();
  }

  private getAccount() {
    if (this.user.cnp) {
      this.accountServiceRepository.getAccountByCnp(this.user.cnp).subscribe(account => {
        this.selectedAccount = account as AccountModel;
      });
    }
    else {
      this.accountServiceRepository.getAccountByEmail(this.user.email).subscribe(account => {
        this.selectedAccount = account as AccountModel;
      });
    }
  }

  private getPaidFees() {
    if (this.user.cnp) {
      this.initialPaidFees$ = this.accountServiceRepository.getAccountByCnp(this.user.cnp).pipe(
        map(account => account.paidFees)
      );
    }
    else {
      this.initialPaidFees$ = this.accountServiceRepository.getAccountByEmail(this.user.email).pipe(
        map(account => account.paidFees)
      );
    }
  }

  private filterPaidFees(pipe: any) {
    this.filteredPaidFees$ = this.filter.valueChanges.pipe(
      startWith(''),
      switchMap(text => this.search(text, pipe))
    );
  }

  private search(text: string, pipe: PipeTransform): Observable<PaidFeeModel[]> {
    return this.initialPaidFees$.pipe(map(paidFees =>
      paidFees.filter(fee => {
      const term = text.toLowerCase();
      return fee.name && fee.name.toLowerCase().includes(term)
        || fee.details && fee.details.toLowerCase().includes(term)
        || fee.comment && fee.comment.toLowerCase().includes(term)
        || fee.dateOfPayment && this.getDate(fee.dateOfPayment).toLowerCase().includes(term)
        || fee.value && pipe.transform(fee.value).includes(term);
    })));
  }

  public captureScreen()
  {
    let data = document.getElementById('studentBill');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 200;
        const imgHeight = 80;
        const position = 0;
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jspdf('p', 'mm', 'a4');
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('Chitanta.pdf');
      });
    }
  }
}
