import {Injectable} from "@angular/core";
import {ModelAdapter} from "../modules/model-adapter/interfaces/model-adapter";
import {AccountModel} from "../models/account.model";
import {ActiveStudyAdapter} from "./active-study.adapter";
import {ActiveFeeAdapter} from "./active-fee.adapter";
import {PaidFeeAdapter} from "./paid-fee.adapter";

@Injectable()
export class AccountAdapter implements ModelAdapter<AccountModel>{

  constructor(
    private activeStudyAdapter: ActiveStudyAdapter,
    private activeFeeAdapter: ActiveFeeAdapter,
    private paidFeeAdapter: PaidFeeAdapter
  ) {}

  adapt(data: any): AccountModel {
    const mappedResponse = new AccountModel();
    mappedResponse.id = data.id;
    mappedResponse.firstName = data.firstName;
    mappedResponse.lastName = data.lastName;
    mappedResponse.cnp = data.cnp;
    mappedResponse.email = data.email;
    mappedResponse.phone = data.phone;
    mappedResponse.activeStudies = data.activeStudies
      .map(
        (value: any) => this.activeStudyAdapter.adapt(value)
      );
    mappedResponse.activeFees = data.activeFees
      .map(
        (value: any) => this.activeFeeAdapter.adapt(value)
      );
    mappedResponse.paidFees = data.paidFees
      .map(
        (value: any) => this.paidFeeAdapter.adapt(value)
      );

    return mappedResponse;
  }
}
