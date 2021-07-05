import {ModelAdapter} from "../modules/model-adapter/interfaces/model-adapter";
import {ActiveFeeModel} from "../models/active-fee.model";
import {Injectable} from "@angular/core";

@Injectable()
export class ActiveFeeAdapter implements ModelAdapter<ActiveFeeModel> {

  adapt(data: any): ActiveFeeModel {
    const mappedResponse = new ActiveFeeModel();
    mappedResponse.id = data.id;
    mappedResponse.name = data.name;
    mappedResponse.details = data.details;
    mappedResponse.comment = data.comment;
    mappedResponse.limitDate = data.limitDate;
    mappedResponse.value = data.value;
    mappedResponse.account = data.account;

    return mappedResponse;
  }
}
