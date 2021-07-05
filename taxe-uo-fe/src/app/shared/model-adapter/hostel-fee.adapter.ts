import {ModelAdapter} from "../modules/model-adapter/interfaces/model-adapter";
import {HostelFeeModel} from "../models/hostel-fee.model";
import {Injectable} from "@angular/core";

@Injectable()
export class HostelFeeAdapter implements ModelAdapter<HostelFeeModel> {

  adapt(data: any): HostelFeeModel {
    const mappedResponse = new HostelFeeModel();
    mappedResponse.id = data.id;
    mappedResponse.name = data.name;
    mappedResponse.hostelName = data.hostelName;
    mappedResponse.budget = data.budget;
    mappedResponse.type = data.type;
    mappedResponse.value = data.value;

    return mappedResponse;
  }
}
