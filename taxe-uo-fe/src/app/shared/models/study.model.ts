import {StudyFeeModel} from "./study-fee.model";

export class StudyModel {

  id: number;
  cycle: string;
  faculty: string;
  department: string;
  studyProgram: string;
  form: string;
  studyFees: Array<StudyFeeModel>;
  year: number;
  abbreviation: string;
}
