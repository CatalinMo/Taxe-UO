import {Component, OnInit, PipeTransform} from '@angular/core';
import { Observable } from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import {map, startWith, switchMap} from "rxjs/operators";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudyFeeModel } from "../../../../shared/models/study-fee.model";
import {StudyServiceRepository} from "../../../../shared/services/study.service.repository";
import {StudyModel} from "../../../../shared/models/study.model";
import {StudyFeeServiceRepository} from "../../../../shared/services/study-fee.service.repository";
import {StudyFeeRequest} from "../../../../shared/models/request/study-fee.request";
import {StudyAdapter} from "../../../../shared/model-adapter/study.adapter";
import {StudyRequest} from "../../../../shared/models/request/study.request";

@Component({
  selector: 'app-study-fees',
  templateUrl: './study-fees.component.html',
  styleUrls: ['./study-fees.component.scss']
})
export class StudyFeesComponent implements OnInit {

  initialStudies$: Observable<StudyModel[]>;
  filteredStudiesByCycle$: Observable<StudyModel[]>;
  initialStudyFees$: Observable<StudyFeeModel[]>;
  filteredStudyFees$: Observable<StudyFeeModel[]>;
  filter = new FormControl('');
  cycle = new FormControl('licenta');
  studyFeeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    study: new FormControl('', Validators.required),
    type: new FormControl(''),
    value: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')])
  });
  studies: StudyModel[];
  selectedStudyId: number;
  selectedStudy: StudyRequest;
  selectedStudyFeeId: number;

  constructor(
    private studyServiceRepository: StudyServiceRepository,
    private studyFeeServiceRepository: StudyFeeServiceRepository,
    private studyAdapter: StudyAdapter,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.getStudyFees();
    this.filterStudyFees(pipe);
    this.getStudies();
    this.filterStudiesByCycle();
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true}).result.then(() => {}, () => {
      this.studyFeeForm.reset();
      this.cycle.setValue('licenta');
    });
  }

  setStudy(event: any) {
    this.selectedStudyId = Number(event.target.value);
    this.selectedStudy = this.studies.find(study => study.id == this.selectedStudyId);
  }

  addStudyFee(formValue) {
    const studyFee = this.convertToStudyFee(formValue);
    this.selectedStudy.studyFees.push(studyFee);
    this.studyServiceRepository.updateStudy(this.selectedStudyId, this.selectedStudy).subscribe();
    window.location.reload();
  }

  setId(id: number) {
    this.selectedStudyFeeId = id;
  }

  setForm(study: StudyFeeModel) {
    this.studyFeeForm.patchValue({
      name: study.name,
      type: study.type,
      value: study.value
    });
  }

  updateStudyFee(formValue) {
    const changesStudyFee = this.convertToStudyFee(formValue);
    this.studyFeeServiceRepository.updateStudyFee(this.selectedStudyFeeId, changesStudyFee).subscribe();
    window.location.reload();
  }

  deleteStudyFeeById() {
    this.studyFeeServiceRepository.deleteStudyFee(this.selectedStudyFeeId).subscribe();
    window.location.reload();
  }

  private getStudies() {
    this.initialStudies$ = this.studyServiceRepository.getStudies();
    this.initialStudies$.subscribe(studies => this.studies = studies as StudyModel[]);
  }

  private getStudyFees() {
    this.initialStudyFees$ = this.studyFeeServiceRepository.getStudyFees();
  }

  private filterStudyFees(pipe: any) {
    this.filteredStudyFees$ = this.filter.valueChanges.pipe(
      startWith(''),
      switchMap(text => this.search(text, pipe))
    );
  }

  private filterStudiesByCycle() {
    this.filteredStudiesByCycle$ = this.cycle.valueChanges.pipe(
      startWith('licenta'),
      switchMap(text => this.searchByCycle(text))
    );
  }

  private search(text: string, pipe: PipeTransform): Observable<StudyFeeModel[]> {
    return this.initialStudyFees$.pipe(map(studyFee =>
      studyFee.filter(fee => {
      const term = text.toLowerCase();
      return fee.name && fee.name.toLowerCase().includes(term)
        || fee.study.cycle && fee.study.cycle.toLowerCase().includes(term)
        || fee.study.abbreviation && fee.study.abbreviation.toLowerCase().includes(term)
        || fee.type && fee.type.toLowerCase().includes(term)
        || fee.value && pipe.transform(fee.value).includes(term);
    })));
  }

  private searchByCycle(text: string): Observable<StudyModel[]> {
    this.studyFeeForm.value.study = '';
    return this.initialStudies$.pipe(map(study =>
      study.filter(study => {
        const term = text.toLowerCase();
        return study.cycle && study.cycle.toLowerCase().includes(term);
      })));
  }

  private convertToStudyFee(formValue): StudyFeeRequest {
    let newStudyFee = new StudyFeeRequest();
    newStudyFee.name = formValue.name;
    newStudyFee.type = formValue.type;
    newStudyFee.value = formValue.value;
    return newStudyFee;
  }
}
