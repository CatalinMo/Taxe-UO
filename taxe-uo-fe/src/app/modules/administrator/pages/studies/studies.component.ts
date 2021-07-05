import { Component, OnInit, PipeTransform } from '@angular/core';
import { Observable } from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import {map, startWith, switchMap} from "rxjs/operators";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudyModel } from "../../../../shared/models/study.model";
import {StudyRequest} from "../../../../shared/models/request/study.request";
import {StudyServiceRepository} from "../../../../shared/services/study.service.repository";
import {StudyFeeRequest} from "../../../../shared/models/request/study-fee.request";

@Component({
  selector: 'app-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit {

  initialStudies$: Observable<Array<StudyModel>>;
  filteredStudies$: Observable<Array<StudyModel>>;
  filter = new FormControl('');
  studyForm = new FormGroup({
    cycle: new FormControl('', Validators.required),
    faculty: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    studyProgram: new FormControl('', Validators.required),
    form: new FormControl('', Validators.required),
    year: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    abbreviation: new FormControl('', Validators.required)
  });
  id: number;

  constructor(
    private studyServiceRepository: StudyServiceRepository,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.getStudies();
    this.filterStudies(pipe);
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true}).result.then(() => {}, () => {this.studyForm.reset()});
  }

  createStudy(formValue) {
    const newStudy = this.convertToStudy(formValue);
    newStudy.studyFees = new Array<StudyFeeRequest>();
    this.studyServiceRepository.createStudy(newStudy).subscribe();
    window.location.reload();
  }

  updateStudy(formValue) {
    const changedStudy = this.convertToStudy(formValue);
    this.studyServiceRepository.updateStudy(this.id, changedStudy).subscribe();
    window.location.reload();
  }

  deleteStudyById() {
    this.studyServiceRepository.deleteStudy(this.id).subscribe();
    window.location.reload();
  }

  setId(id: number) {
    this.id = id;
  }

  setForm(study: StudyModel) {
    this.studyForm.patchValue({
      cycle: study.cycle,
      faculty: study.faculty,
      department: study.department,
      studyProgram: study.studyProgram,
      form: study.form,
      year: study.year,
      abbreviation: study.abbreviation
    });
  }

  private getStudies() {
    this.initialStudies$ = this.studyServiceRepository.getStudies();
  }

  private filterStudies(pipe: any) {
    this.filteredStudies$ = this.filter.valueChanges.pipe(
      startWith(''),
      switchMap(text => this.search(text, pipe))
    );
  }

  private search(text: string, pipe: PipeTransform): Observable<StudyModel[]> {
    return this.initialStudies$.pipe(map(study =>
      study.filter(study => {
      const term = text.toLowerCase();
      return study.cycle && study.cycle.toLowerCase().includes(term)
        || study.faculty && study.faculty.toLowerCase().includes(term)
        || study.department && study.department.toLowerCase().includes(term)
        || study.studyProgram && study.studyProgram.toLowerCase().includes(term)
        || study.form && study.form.toLowerCase().includes(term)
        || study.year && pipe.transform(study.year).includes(term)
        || study.abbreviation && study.abbreviation.toLowerCase().includes(term);
    })));
  }

  private convertToStudy(formValue): StudyRequest {
    let newStudy = new StudyRequest();
    newStudy.cycle = formValue.cycle;
    newStudy.faculty = formValue.faculty;
    newStudy.department = formValue.department;
    newStudy.studyProgram = formValue.studyProgram;
    newStudy.form = formValue.form;
    newStudy.year = formValue.year;
    newStudy.abbreviation = formValue.abbreviation;
    return newStudy;
  }
}
