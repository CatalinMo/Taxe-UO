import {AccountModel} from "./account.model";

export class ActiveFeeModel {

  id: number;
  name: string;
  details: string;
  comment: string;
  limitDate: number;
  value: number;
  account: AccountModel;
}
