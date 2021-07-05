import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ConfigurationService} from "../modules/configuration/services/configuration.service";
import {OtherFeeAdapter} from "../model-adapter/other-fee.adapter";
import {OtherFeeRequest} from "../models/request/other-fee.request";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {OtherFeeModel} from "../models/other-fee.model";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class OtherFeeServiceRepository {

  private configuration: any;
  endpoints = {
    createOtherFee: () => this.configuration.server.host + `uo-taxes/create-other-fee`,
    updateOtherFee: (id: number) => this.configuration.server.host + `uo-taxes/other-fee/${id}`,
    deleteOtherFee: (id: number) => this.configuration.server.host + `uo-taxes/other-fee/${id}`,
    getOtherFees: () => this.configuration.server.host + `uo-taxes/other-fees`
  };

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private otherFeeAdapter: OtherFeeAdapter
  ) {
    this.configuration = this.configurationService.getConfig();
  }

  createOtherFee(otherFeeRequest: OtherFeeRequest) {
    return this.http.post(this.endpoints.createOtherFee(), otherFeeRequest, httpOptions);
  }

  updateOtherFee(id: number, otherFeeRequest: OtherFeeRequest) {
    return this.http.put(this.endpoints.updateOtherFee(id), otherFeeRequest, httpOptions);
  }

  deleteOtherFee(id: number) {
    return this.http.delete(this.endpoints.deleteOtherFee(id), httpOptions);
  }

  getOtherFees(): Observable<Array<OtherFeeModel>> {
    return this.http.get(this.endpoints.getOtherFees(), httpOptions)
      .pipe(
        map((response: Array<any>) =>
          response.map((otherFee: any) => {
            return this.otherFeeAdapter.adapt(otherFee);
          })
        )
      );
  }
}
