import {StudyFeeRequest} from "./study-fee.request";

export class StudyRequest {

  faculty: string;
  cycle: string;
  department: string;
  studyProgram: string;
  form: string;
  studyFees: Array<StudyFeeRequest>;
  year: number;
  abbreviation: string;
}
