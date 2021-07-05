import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Observable, Subject } from 'rxjs';
import { AuthRequest } from '../../request/auth.request';
import { AuthModel } from '../../models/auth.model';
import { AuthAdapter } from '../../model-adapters/auth.adapter';
import { UserModel } from '../../models/user.model';
import { ConfigurationService } from '../../../configuration/services/configuration.service';
import { TokenModel } from "../../models/token.model";

export const TOKEN_NAME = `token`;
export const USER_NAME = `user`;
export const CURRENT_ENV_NAME = `currentEnv`;

let httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()
export class AuthorizationServiceRepository {

    public currentTokenSubject: Subject<string> = new Subject<string>();
    private configuration: any;
    endpoints = {
        signIn: () => this.configuration.server.host + 'auth/token'
    };

    constructor(
        private http: HttpClient,
        private authAdapter: AuthAdapter,
        private configurationService: ConfigurationService
    ) {
        this.configuration = this.configurationService.getConfig();
    }

    static setCurrentTokenValue(token: string) {
        localStorage.setItem(TOKEN_NAME, token);
    }

    static setCurrentUserValue(user: UserModel) {
        localStorage.setItem(USER_NAME, JSON.stringify(user));
    }

    static getCurrentTokenValue(): string {
        return <string>localStorage.getItem(TOKEN_NAME);
    }

    static setCurrentEnvValue(env: string) {
        localStorage.setItem(CURRENT_ENV_NAME, env);
    }

    static getCurrentEnvValue(): string {
        return <string>localStorage.getItem(CURRENT_ENV_NAME);
    }

    static getCurrentUserValue(): UserModel {
        return JSON.parse(<string>localStorage.getItem(USER_NAME));
    }

    static getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode<TokenModel>(token);
        if (decoded.exp === undefined) {
            return null;
        }

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);

        return date;
    }

    static isTokenExpired(): boolean {
        const token = AuthorizationServiceRepository.getCurrentTokenValue();
        if (!token) {
            return true;
        }

        const date = AuthorizationServiceRepository.getTokenExpirationDate(token);
        if (date === undefined) {
            return false;
        }

        return !(date.valueOf() > new Date().valueOf());
    }

    signIn(email: string, password: string): Observable<AuthModel> {
        const request = new AuthRequest();
        request.username = email;
        request.password = password;

        httpOptions.headers = httpOptions.headers.set(
            'Authorization',
            `Basic ${btoa(request.username + ':' + request.password)}`
        );

        localStorage.removeItem(TOKEN_NAME);
        localStorage.removeItem(USER_NAME);
        localStorage.removeItem(CURRENT_ENV_NAME);

        return this.http.get(this.endpoints.signIn(), httpOptions)
            .pipe(
                map((response: any) => this.authAdapter.adapt(response))
            )
            .pipe(
                map((response: AuthModel) => {
                    AuthorizationServiceRepository.setCurrentTokenValue(response.token);
                    AuthorizationServiceRepository.setCurrentUserValue(response.user);
                    AuthorizationServiceRepository.setCurrentEnvValue(this.configuration.name);
                    this.currentTokenSubject.next(response.token);

                    return response;
                })
            );
    }

    logout() {
        localStorage.removeItem(TOKEN_NAME);
        localStorage.removeItem(USER_NAME);
        localStorage.removeItem(CURRENT_ENV_NAME);
        this.currentTokenSubject.next(null);
    }

}
