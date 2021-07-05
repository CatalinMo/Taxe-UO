import {ActiveStudyRequest} from "./active-study.request";
import {ActiveFeeRequest} from "./active-fee.request";
import {PaidFeeRequest} from "./paid-fee.request";

export class AccountRequest {

  firstName: string;
  lastName: string;
  cnp: string;
  email: string;
  phone: string;
  activeStudies: Array<ActiveStudyRequest>;
  activeFees: Array<ActiveFeeRequest>;
  paidFees: Array<PaidFeeRequest>;
}
