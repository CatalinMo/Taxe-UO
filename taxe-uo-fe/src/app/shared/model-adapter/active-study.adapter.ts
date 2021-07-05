import {ModelAdapter} from "../modules/model-adapter/interfaces/model-adapter";
import {ActiveStudyModel} from "../models/active-study.model";
import {Injectable} from "@angular/core";

@Injectable()
export class ActiveStudyAdapter implements ModelAdapter<ActiveStudyModel>{

  adapt(data: any): ActiveStudyModel {
    const mappedResponse = new ActiveStudyModel();
    mappedResponse.id = data.id;
    mappedResponse.cycle = data.cycle;
    mappedResponse.faculty = data.faculty;
    mappedResponse.department = data.department;
    mappedResponse.studyProgram = data.studyProgram;
    mappedResponse.form = data.form;
    mappedResponse.year = data.year;
    mappedResponse.abbreviation = data.abbreviation;
    mappedResponse.budget = data.budget;
    mappedResponse.accommodated = data.accommodated;

    return mappedResponse;
  }
}
