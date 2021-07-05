import {Component, OnInit, PipeTransform} from '@angular/core';
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import { map, startWith } from "rxjs/operators";
import {TaxOfficeService} from "../../service/tax-office.service";
import {StudyServiceRepository} from "../../../../shared/services/study.service.repository";
import {ActiveStudyModel} from "../../../../shared/models/active-study.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-active-study-ss',
  templateUrl: './active-study.component.html',
  styleUrls: ['./active-study.component.scss']
})
export class ActiveStudyComponent implements OnInit {

  activeStudies$: Observable<ActiveStudyModel[]>;
  filter = new FormControl('');

  constructor(
    private studyServiceRepository: StudyServiceRepository,
    private taxOfficeService: TaxOfficeService,
    private modalService: NgbModal,
    private pipe: DecimalPipe
  )
  {
    this.filterActiveStudies(pipe);
  }

  ngOnInit(): void {}

  private filterActiveStudies(pipe: any) {
    this.activeStudies$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, pipe))
    );
  }

  private search(text: string, pipe: PipeTransform): ActiveStudyModel[] {
    return this.taxOfficeService.getAccount().activeStudies.filter(study => {
      const term = text.toLowerCase();
      return study.faculty && study.faculty.toLowerCase().includes(term)
        || study.cycle && study.cycle.toLowerCase().includes(term)
        || study.department && study.department.toLowerCase().includes(term)
        || study.studyProgram && study.studyProgram.toLowerCase().includes(term)
        || study.year && pipe.transform(study.year).includes(term)
        || study.abbreviation && study.abbreviation.toLowerCase().includes(term)
        || study.accommodated && study.accommodated.toLowerCase().includes(term);
    });
  }
}
