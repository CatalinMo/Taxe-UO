import {Component, OnInit, PipeTransform} from '@angular/core';
import { Observable } from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import {map, startWith, switchMap} from "rxjs/operators";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OtherFeeModel } from "../../../../shared/models/other-fee.model";
import {OtherFeeServiceRepository} from "../../../../shared/services/other-fee.service.repository";
import {OtherFeeRequest} from "../../../../shared/models/request/other-fee.request";

@Component({
  selector: 'app-other-fees',
  templateUrl: './other-fees.component.html',
  styleUrls: ['./other-fees.component.scss']
})
export class OtherFeesComponent implements OnInit {

  initialOtherFees$: Observable<OtherFeeModel[]>;
  filteredOtherFees$: Observable<OtherFeeModel[]>;
  filter = new FormControl('');
  otherFeesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl(''),
    value: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')])
  });
  selectedOtherFeeId: number;

  constructor(
    private otherFeeServiceRepository: OtherFeeServiceRepository,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.getOtherFees();
    this.filterOtherFees(pipe);
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true}).result.then(() => {}, () => {this.otherFeesForm.reset()});
  }

  addOtherFee(formValue) {
    const otherFee = this.convertToOtherFee(formValue);
    this.otherFeeServiceRepository.createOtherFee(otherFee).subscribe();
    window.location.reload();
  }

  updateOtherFee(formValue) {
    const otherFee = this.convertToOtherFee(formValue);
    this.otherFeeServiceRepository.updateOtherFee(this.selectedOtherFeeId, otherFee).subscribe();
    window.location.reload();
  }

  deleteOtherFeeById() {
    this.otherFeeServiceRepository.deleteOtherFee(this.selectedOtherFeeId).subscribe();
    window.location.reload();
  }

  setId(id: number) {
    this.selectedOtherFeeId = id;
  }

  setForm(otherFee: OtherFeeModel) {
    this.otherFeesForm.patchValue({
      name: otherFee.name,
      type: otherFee.type,
      value: otherFee.value,
    });
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
      return fee.name && fee.name.toLowerCase().includes(term)
        || fee.type && fee.type.toLowerCase().includes(term)
        || fee.value && pipe.transform(fee.value).includes(term);
    })));
  }

  private convertToOtherFee(formValue): OtherFeeRequest {
    let newOtherFee = new OtherFeeRequest();
    newOtherFee.name = formValue.name;
    newOtherFee.type = formValue.type;
    newOtherFee.value = formValue.value;
    return newOtherFee;
  }
}
