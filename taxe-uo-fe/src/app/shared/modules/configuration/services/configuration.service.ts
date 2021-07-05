import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import * as environmentLocal from '../../../../../environments/environment.local';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    private CONFIG_URL = '';
    private appConfig: any;

    constructor(
        private http: HttpClient
    ) {
        this.setConfigUrl();
    }

    loadConfig(): Promise<boolean | any> {
        return new Promise(((resolve, reject) => {
            return this.http.get<HttpResponse<Object>>(this.CONFIG_URL, {observe: 'response'})
                .subscribe((conf: any) => {
                    this.appConfig = conf.body;
                    resolve(true);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                })
        }));
    }

    getConfig() {
        return this.appConfig;
    }

    private setConfigUrl() {
        let hostname = window && window.location && window.location.hostname;

        if (hostname === 'localhost') {
            this.CONFIG_URL = environmentLocal.environment.configFile;
        }
    }

}
