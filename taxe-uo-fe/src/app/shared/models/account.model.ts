import {ActiveStudyModel} from "./active-study.model";
import {ActiveFeeModel} from "./active-fee.model";
import {PaidFeeModel} from "./paid-fee.model";

export class AccountModel {

  id: number;
  firstName: string;
  lastName: string;
  cnp: string;
  email: string;
  phone: string;
  activeStudies: Array<ActiveStudyModel>;
  activeFees: Array<ActiveFeeModel>;
  paidFees: Array<PaidFeeModel>;
}
