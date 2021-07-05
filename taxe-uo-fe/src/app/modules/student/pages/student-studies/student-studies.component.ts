import { Component, OnInit, PipeTransform } from '@angular/core';
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import {map, startWith, switchMap} from "rxjs/operators";
import { ActiveStudyModel } from "../../../../shared/models/active-study.model";
import {UserViewModel} from "../../../../shared/modules/authorization/models/user.view.model";
import {AccountServiceRepository} from "../../../../shared/services/account.service.repository";
import {AuthorizationServiceRepository} from "../../../../shared/modules/authorization/services/authorization/authorization.service.repository";

@Component({
  selector: 'app-student-studies',
  templateUrl: './student-studies.component.html',
  styleUrls: ['./student-studies.component.scss']
})
export class StudentStudiesComponent implements OnInit {

  initialActiveStudies$: Observable<ActiveStudyModel[]>;
  filteredActiveStudies$: Observable<ActiveStudyModel[]>;
  filter = new FormControl('');
  user: UserViewModel;

  constructor(
    private accountServiceRepository: AccountServiceRepository,
    private pipe: DecimalPipe
  )
  {
    this.user = AuthorizationServiceRepository.getCurrentUserValue();
    this.getActiveStudies();
    this.filterActiveStudies(pipe);
  }

  ngOnInit(): void {}

  private getActiveStudies() {
    if (this.user.cnp) {
      this.initialActiveStudies$ = this.accountServiceRepository.getAccountByCnp(this.user.cnp).pipe(
        map(account => account.activeStudies)
      );
    }
    else {
      this.initialActiveStudies$ = this.accountServiceRepository.getAccountByEmail(this.user.email).pipe(
        map(account => account.activeStudies)
      );
    }
  }

  private filterActiveStudies(pipe: any) {
    this.filteredActiveStudies$ = this.filter.valueChanges.pipe(
      startWith(''),
      switchMap(text => this.search(text, pipe))
    );
  }

  private search(text: string, pipe: PipeTransform): Observable<ActiveStudyModel[]> {
    return this.initialActiveStudies$.pipe(map(activeStudies =>
      activeStudies.filter(study => {
      const term = text.toLowerCase();
      return study.faculty && study.faculty.toLowerCase().includes(term)
        || study.cycle && study.cycle.toLowerCase().includes(term)
        || study.department && study.department.toLowerCase().includes(term)
        || study.studyProgram && study.studyProgram.toLowerCase().includes(term)
        || study.year && pipe.transform(study.year).includes(term)
        || study.abbreviation && study.abbreviation.toLowerCase().includes(term)
        || study.accommodated && study.accommodated.toLowerCase().includes(term);
    })));
  }
}
