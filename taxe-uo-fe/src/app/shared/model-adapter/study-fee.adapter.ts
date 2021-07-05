import {ModelAdapter} from "../modules/model-adapter/interfaces/model-adapter";
import {StudyFeeModel} from "../models/study-fee.model";
import {Injectable} from "@angular/core";
import {StudyAdapter} from "./study.adapter";

@Injectable()
export class StudyFeeAdapter implements ModelAdapter<StudyFeeModel> {

  adapt(data: any): StudyFeeModel {
    const mappedResponse = new StudyFeeModel();
    mappedResponse.id = data.id;
    mappedResponse.name = data.name;
    mappedResponse.type = data.type;
    mappedResponse.value = data.value;
    mappedResponse.study = data.study;

    return mappedResponse;
  }
}
