import { Component, OnInit, PipeTransform } from '@angular/core';
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import { map, startWith } from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import html2canvas from 'html2canvas';
import jspdf from "jspdf";
import { PaidFeeModel } from "../../../../shared/models/paid-fee.model";
import {TaxOfficeService} from "../../service/tax-office.service";
import {AccountModel} from "../../../../shared/models/account.model";

@Component({
  selector: 'app-paid-fees',
  templateUrl: './student-paid-fees.component.html',
  styleUrls: ['./student-paid-fees.component.scss']
})
export class StudentPaidFeesComponent implements OnInit {

  paidFees$: Observable<PaidFeeModel[]>;
  filter = new FormControl('');
  selectedAccount: AccountModel;
  selectedPaidFee: PaidFeeModel;

  constructor(
    private taxOfficeService: TaxOfficeService,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.filterPaidFees(pipe);
  }

  ngOnInit() {
    this.selectedAccount = this.taxOfficeService.getAccount();
  }

  open(content: any) {
    this.modalService.open(content, {centered: true, size: "xl"}).result.then(() => {}, () => {});
  }

  getDate(timestamp: number): string {
    let date =  new Date(timestamp);
    return (date.getMonth() + 1) + '/' + date.getDate() +'/' + date.getFullYear();
  }

  setSelectedPaidFee(paidFee: PaidFeeModel) {
    this.selectedPaidFee = paidFee;
  }

  private filterPaidFees(pipe: any) {
    this.paidFees$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, pipe))
    );
  }

  private search(text: string, pipe: PipeTransform): PaidFeeModel[] {
    return this.selectedAccount.paidFees.filter(fee => {
      const term = text.toLowerCase();
      return fee.name && fee.name.toLowerCase().includes(term)
        || fee.details && fee.details.toLowerCase().includes(term)
        || fee.comment && fee.comment.toLowerCase().includes(term)
        || fee.dateOfPayment && this.getDate(fee.dateOfPayment).toLowerCase().includes(term)
        || fee.value && pipe.transform(fee.value).includes(term);
    });
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
