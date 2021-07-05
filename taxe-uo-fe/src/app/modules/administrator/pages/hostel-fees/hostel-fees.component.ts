import {Component, OnInit, PipeTransform} from '@angular/core';
import { Observable } from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import {map, startWith, switchMap} from "rxjs/operators";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HostelFeeModel } from "../../../../shared/models/hostel-fee.model";
import {HostelFeeServiceRepository} from "../../../../shared/services/hostel-fee.service.repository";
import {HostelFeeRequest} from "../../../../shared/models/request/hostel-fee.request";

@Component({
  selector: 'app-hostel-fees',
  templateUrl: './hostel-fees.component.html',
  styleUrls: ['./hostel-fees.component.scss']
})
export class HostelFeesComponent implements OnInit {

  initialHostelFees$: Observable<HostelFeeModel[]>;
  filteredHostelFees$: Observable<HostelFeeModel[]>;
  filter = new FormControl('');
  hostelFeeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    hostel: new FormControl('', Validators.required),
    budget: new FormControl(''),
    type: new FormControl(''),
    value: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')])
  });
  selectedHostelFeeId: number;

  constructor(
    private hostelFeeServiceRepository: HostelFeeServiceRepository,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.getHostelFees();
    this.filterHostelFees(pipe);
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true}).result.then(() => {}, () => {this.hostelFeeForm.reset()});
  }

  addHostelFee(formValue) {
    const hostelFee = this.convertToHostelFee(formValue);
    this.hostelFeeServiceRepository.createHostelFee(hostelFee).subscribe();
    window.location.reload();
  }

  updateHostelFee(formValue) {
    const hostelFee = this.convertToHostelFee(formValue);
    this.hostelFeeServiceRepository.updateHostelFee(this.selectedHostelFeeId, hostelFee).subscribe();
    window.location.reload();
  }

  deleteHostelFeeById() {
    this.hostelFeeServiceRepository.deleteHostelFee(this.selectedHostelFeeId).subscribe();
    window.location.reload();
  }

  setId(id: number) {
    this.selectedHostelFeeId = id;
  }

  setForm(hostelFee: HostelFeeModel) {
    this.hostelFeeForm.patchValue({
      name: hostelFee.name,
      hostel: hostelFee.hostelName,
      budget: hostelFee.budget,
      type: hostelFee.type,
      value: hostelFee.value,
    });
  }

  private getHostelFees() {
    this.initialHostelFees$ = this.hostelFeeServiceRepository.getHostelFees();
  }

  private filterHostelFees(pipe: any) {
    this.filteredHostelFees$ = this.filter.valueChanges.pipe(
      startWith(''),
      switchMap(text => this.search(text, pipe))
    );
  }

  private search(text: string, pipe: PipeTransform): Observable<HostelFeeModel[]> {
    return this.initialHostelFees$.pipe(map(hostelFee =>
      hostelFee.filter(fee => {
      const term = text.toLowerCase();
      return fee.name && fee.name.toLowerCase().includes(term)
        || fee.hostelName && fee.hostelName.includes(term)
        || fee.type && fee.type.includes(term)
        || fee.value && pipe.transform(fee.value).includes(term);
    })));
  }

  private convertToHostelFee(formValue): HostelFeeRequest {
    let newHostelFee = new HostelFeeRequest();
    newHostelFee.name = formValue.name;
    newHostelFee.hostelName = formValue.hostel;
    newHostelFee.budget = formValue.budget;
    newHostelFee.type = formValue.type;
    newHostelFee.value = formValue.value;
    return newHostelFee;
  }
}
