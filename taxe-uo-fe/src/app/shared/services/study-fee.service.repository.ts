import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ConfigurationService} from "../modules/configuration/services/configuration.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {StudyFeeAdapter} from "../model-adapter/study-fee.adapter";
import {StudyFeeModel} from "../models/study-fee.model";
import {StudyFeeRequest} from "../models/request/study-fee.request";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class StudyFeeServiceRepository {

  private configuration: any;
  endpoints = {
    updateStudyFee: (id: number) => this.configuration.server.host + `uo-taxes/study-fee/${id}`,
    deleteStudyFee: (id: number) => this.configuration.server.host + `uo-taxes/study-fee/${id}`,
    getStudyFees: () => this.configuration.server.host + `uo-taxes/study-fees`
  };

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private studyFeeAdapter: StudyFeeAdapter
  ) {
    this.configuration = this.configurationService.getConfig();
  }

  updateStudyFee(id: number, study: StudyFeeRequest) {
    return this.http.put(this.endpoints.updateStudyFee(id), study, httpOptions);
  }

  deleteStudyFee(id: number) {
    return this.http.delete(this.endpoints.deleteStudyFee(id), httpOptions);
  }

  getStudyFees(): Observable<Array<StudyFeeModel>> {
    return this.http.get(this.endpoints.getStudyFees(), httpOptions)
      .pipe(
        map((response: Array<any>) =>
          response.map((study: any) => {
            return this.studyFeeAdapter.adapt(study);
          })
        )
      );
  }
}
