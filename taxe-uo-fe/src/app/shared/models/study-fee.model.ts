import {StudyModel} from "./study.model";

export class StudyFeeModel {

  id: number;
  name: string;
  type: string;
  value: number;
  study: StudyModel;
}
