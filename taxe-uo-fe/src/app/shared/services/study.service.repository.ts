import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigurationService} from "../modules/configuration/services/configuration.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {StudyRequest} from "../models/request/study.request";
import {StudyModel} from "../models/study.model";
import {StudyAdapter} from "../model-adapter/study.adapter";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class StudyServiceRepository {

  private configuration: any;
  endpoints = {
    createStudy: () => this.configuration.server.host + `uo-taxes/create-study`,
    updateStudy: (id: number) => this.configuration.server.host + `uo-taxes/study/${id}`,
    deleteStudy: (id: number) => this.configuration.server.host + `uo-taxes/study/${id}`,
    deleteActiveStudy: (id: number) => this.configuration.server.host + `uo-taxes/active-study/${id}`,
    getStudies: () => this.configuration.server.host + `uo-taxes/studies`
  };

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private studyAdapter: StudyAdapter
  ) {
    this.configuration = this.configurationService.getConfig();
  }

  createStudy(study: StudyRequest) {
    return this.http.post(this.endpoints.createStudy(), study, httpOptions);
  }

  updateStudy(id: number, study: StudyRequest) {
    return this.http.put(this.endpoints.updateStudy(id), study, httpOptions);
  }

  deleteStudy(id: number) {
    return this.http.delete(this.endpoints.deleteStudy(id), httpOptions);
  }

  deleteActiveStudy(id: number) {
    return this.http.delete(this.endpoints.deleteActiveStudy(id), httpOptions);
  }

  getStudies(): Observable<Array<StudyModel>> {
    return this.http.get(this.endpoints.getStudies(), httpOptions)
      .pipe(
        map((response: Array<any>) =>
          response.map((study: any) => {
            return this.studyAdapter.adapt(study);
          })
        )
      );
  }
}
