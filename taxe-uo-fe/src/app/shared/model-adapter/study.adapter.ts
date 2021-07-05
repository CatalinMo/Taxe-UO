import {ModelAdapter} from "../modules/model-adapter/interfaces/model-adapter";
import {StudyModel} from "../models/study.model";
import {Injectable} from "@angular/core";
import {StudyFeeAdapter} from "./study-fee.adapter";

@Injectable()
export class StudyAdapter implements ModelAdapter<StudyModel> {

  constructor(
    private studyFeeAdapter: StudyFeeAdapter,
  ) {}

  adapt(data: any): StudyModel {
    const mappedResponse = new StudyModel();
    mappedResponse.id = data.id;
    mappedResponse.cycle = data.cycle;
    mappedResponse.faculty = data.faculty;
    mappedResponse.department = data.department;
    mappedResponse.studyProgram = data.studyProgram;
    mappedResponse.form = data.form;
    mappedResponse.studyFees = data.studyFees.map(
      (value: any) => this.studyFeeAdapter.adapt(value)
    );
    mappedResponse.year = data.year;
    mappedResponse.abbreviation = data.abbreviation;

    return mappedResponse;
  }
}
