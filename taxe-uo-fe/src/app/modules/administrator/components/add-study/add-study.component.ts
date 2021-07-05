import { Component, OnInit, PipeTransform } from '@angular/core';
import { Observable } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import {combineLatest, map, startWith, switchMap} from "rxjs/operators";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudyModel } from "../../../../shared/models/study.model";
import {StudyServiceRepository} from "../../../../shared/services/study.service.repository";
import {AdministratorService} from "../../service/administrator.service";
import {ActiveStudyRequest} from "../../../../shared/models/request/active-study.request";
import {AccountServiceRepository} from "../../../../shared/services/account.service.repository";

@Component({
  selector: 'app-add-study',
  templateUrl: './add-study.component.html',
  styleUrls: ['./add-study.component.scss']
})
export class AddStudyComponent implements OnInit {
  initialStudies$: Observable<StudyModel[]>;
  filteredStudiesByCycle$: Observable<StudyModel[]>;
  filteredStudies$: Observable<StudyModel[]>;
  filter = new FormControl('');
  cycle = new FormControl('licenta');
  studyForm = new FormGroup({
    hostel: new FormControl(''),
    budget: new FormControl('')
  });
  selectedStudy: StudyModel;

  constructor(
    private accountServiceRepository: AccountServiceRepository,
    private studyServiceRepository: StudyServiceRepository,
    private administratorService: AdministratorService,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.getStudies();
    this.filterStudiesByCycle();
    this.filterStudies(pipe);
  }

  ngOnInit(): void {}

  open(content: any) {
    this.modalService.open(content, {centered: true}).result.then(() => {}, () => {this.studyForm.reset()});
  }

  setSelectedStudy(study: StudyModel) {
    this.selectedStudy = study;
  }

  addStudyToAccount(formValue) {
    const study = this.convertToActiveStudy(formValue);
    let selectedAccount = this.administratorService.getAccountRequest();
    selectedAccount.activeStudies.push(study);
    this.accountServiceRepository.updateAccount(this.administratorService.getAccountId(), selectedAccount).subscribe();
    window.location.reload();
  }

  private getStudies() {
    this.initialStudies$ = this.studyServiceRepository.getStudies();
  }

  private filterStudiesByCycle() {
    this.filteredStudiesByCycle$ = this.cycle.valueChanges.pipe(
      startWith('licenta'),
      switchMap(text => this.searchByCycle(text))
    );
  }

  private filterStudies(pipe: any) {
    this.filteredStudies$ = this.filter.valueChanges.pipe(
      startWith(''),
      combineLatest(this.filteredStudiesByCycle$, (filterValue, items) => {
        return this.search(filterValue, items, pipe);
      })
    );
  }

  private search(text: string, list: Array<StudyModel>, pipe: PipeTransform): StudyModel[] {
    return list.filter(study => {
      const term = text.toLowerCase();
      return study.faculty && study.faculty.toLowerCase().includes(term)
        || study.department && study.department.toLowerCase().includes(term)
        || study.studyProgram && study.studyProgram.toLowerCase().includes(term)
        || study.form && study.form.toLowerCase().includes(term)
        || study.year && pipe.transform(study.year).includes(term)
        || study.abbreviation && study.abbreviation.toLowerCase().includes(term);
    });
  }

  private searchByCycle(text: string): Observable<StudyModel[]> {
    return this.initialStudies$.pipe(map(study =>
      study.filter(study => {
      const term = text.toLowerCase();
      return study.cycle && study.cycle.toLowerCase().includes(term);
    })));
  }

  private convertToActiveStudy(formValue): ActiveStudyRequest {
    let newActiveStudy = new ActiveStudyRequest();
    newActiveStudy.faculty = this.selectedStudy.faculty;
    newActiveStudy.cycle = this.selectedStudy.cycle;
    newActiveStudy.department = this.selectedStudy.department;
    newActiveStudy.studyProgram = this.selectedStudy.studyProgram;
    newActiveStudy.form = this.selectedStudy.form;
    newActiveStudy.year = this.selectedStudy.year;
    newActiveStudy.abbreviation = this.selectedStudy.abbreviation;
    newActiveStudy.budget = formValue.budget;
    newActiveStudy.accommodated = formValue.hostel;
    return newActiveStudy;
  }
}
