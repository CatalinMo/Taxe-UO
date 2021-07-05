import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ConfigurationService} from "../modules/configuration/services/configuration.service";
import {HostelFeeAdapter} from "../model-adapter/hostel-fee.adapter";
import {HostelFeeRequest} from "../models/request/hostel-fee.request";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {HostelFeeModel} from "../models/hostel-fee.model";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class HostelFeeServiceRepository {

  private configuration: any;
  endpoints = {
    createHostelFee: () => this.configuration.server.host + `uo-taxes/create-hostel-fee`,
    updateHostelFee: (id: number) => this.configuration.server.host + `uo-taxes/hostel-fee/${id}`,
    deleteHostelFee: (id: number) => this.configuration.server.host + `uo-taxes/hostel-fee/${id}`,
    getHostelFees: () => this.configuration.server.host + `uo-taxes/hostel-fees`
  };

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private hostelFeeAdapter: HostelFeeAdapter
  ) {
    this.configuration = this.configurationService.getConfig();
  }

  createHostelFee(hostelFeeRequest: HostelFeeRequest) {
    return this.http.post(this.endpoints.createHostelFee(), hostelFeeRequest, httpOptions);
  }

  updateHostelFee(id: number, hostelFeeRequest: HostelFeeRequest) {
    return this.http.put(this.endpoints.updateHostelFee(id), hostelFeeRequest, httpOptions);
  }

  deleteHostelFee(id: number) {
    return this.http.delete(this.endpoints.deleteHostelFee(id), httpOptions);
  }

  getHostelFees(): Observable<Array<HostelFeeModel>> {
    return this.http.get(this.endpoints.getHostelFees(), httpOptions)
      .pipe(
        map((response: Array<any>) =>
          response.map((hostelFee: any) => {
            return this.hostelFeeAdapter.adapt(hostelFee);
          })
        )
      );
  }
}
