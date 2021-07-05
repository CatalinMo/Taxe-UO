import {ModelAdapter} from "../modules/model-adapter/interfaces/model-adapter";
import {LimitFeeModel} from "../models/limit-fee.model";
import {Injectable} from "@angular/core";

@Injectable()
export class LimitFeeAdapter implements ModelAdapter<LimitFeeModel> {

  adapt(data: any): LimitFeeModel {
    const mappedResponse = new LimitFeeModel();
    mappedResponse.id = data.id;
    mappedResponse.firstName = data.firstName;
    mappedResponse.lastName = data.lastName;
    mappedResponse.cnp = data.cnp;
    mappedResponse.email = data.email;
    mappedResponse.phone = data.phone;
    mappedResponse.name = data.name;
    mappedResponse.details = data.details;
    mappedResponse.comment = data.comment;
    mappedResponse.limitDate = data.limitDate;
    mappedResponse.value = data.value;

    return mappedResponse;
  }
}
