import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigurationService} from "../modules/configuration/services/configuration.service";
import {AccountRequest} from "../models/request/account.request";
import {Observable} from "rxjs";
import {AccountModel} from "../models/account.model";
import {AccountAdapter} from "../model-adapter/account.adapter";
import {map} from "rxjs/operators";
import {ActiveFeeRequest} from "../models/request/active-fee.request";
import {ActiveFeeModel} from "../models/active-fee.model";
import {ActiveFeeAdapter} from "../model-adapter/active-fee.adapter";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class AccountServiceRepository {

  private configuration: any;
  endpoints = {
    createAccount: () => this.configuration.server.host + `uo-taxes/create-account`,
    updateAccount: (id: number) => this.configuration.server.host + `uo-taxes/account/${id}`,
    updateActiveFee: (id: number) => this.configuration.server.host + `uo-taxes/account/active-fee/${id}`,
    assignFeeToAccounts: () => this.configuration.server.host + `uo-taxes/accounts`,
    markFeeAsPaid: () => this.configuration.server.host + `uo-taxes/account/mark-fee`,
    changePassword: (id: number) => this.configuration.server.host + `uo-taxes/account/${id}/change-password`,
    deleteAccount: (id: number) => this.configuration.server.host + `uo-taxes/account/${id}`,
    deleteAccountActiveFee: (id: number) => this.configuration.server.host + `uo-taxes/account/active-fee/${id}`,
    getAccounts: () => this.configuration.server.host + `uo-taxes/accounts`,
    getAccountByEmail: (email: string) => this.configuration.server.host + `uo-taxes/account-email/${email}/`,
    getAccountByCnp: (cnp: string) => this.configuration.server.host + `uo-taxes/account-cnp/${cnp}`,
    getActiveFees: () => this.configuration.server.host + `uo-taxes/accounts/active-fees`
  };

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private accountAdapter: AccountAdapter,
    private activeFeeAdapter: ActiveFeeAdapter
  ) {
    this.configuration = this.configurationService.getConfig();
  }

  createAccount(account: AccountRequest) {
    return this.http.post(this.endpoints.createAccount(), account, httpOptions);
  }

  updateAccount(id: number, account: AccountRequest) {
    console.log(account);
    return this.http.put(this.endpoints.updateAccount(id), account, httpOptions);
  }

  updateActiveFee(id: number, activeFee: ActiveFeeRequest) {
    return this.http.put(this.endpoints.updateActiveFee(id), activeFee, httpOptions);
  }

  assignFeeToAccounts(ids: Array<number>, activeFee: ActiveFeeRequest) {
    const requestData = {
      ids: ids,
      activeFee: activeFee
    }
    return this.http.put(this.endpoints.assignFeeToAccounts(), requestData, httpOptions);
  }

  markFeeAsPaid(accountId: number, activeFeeId: number, accountRequest: AccountRequest) {
    const requestData = {
      accountId: accountId,
      activeFeeId: activeFeeId,
      accountRequest: accountRequest
    }
    return this.http.put(this.endpoints.markFeeAsPaid(), requestData, httpOptions);
  }

  changePassword(id: number, newPassword: string) {
    return this.http.put(this.endpoints.changePassword(id), newPassword, httpOptions);
  }

  deleteAccount(id: number) {
    return this.http.delete(this.endpoints.deleteAccount(id), httpOptions);
  }

  deleteAccountActiveFee(id: number) {
    return this.http.delete(this.endpoints.deleteAccountActiveFee(id), httpOptions);
  }

  getAccounts(): Observable<Array<AccountModel>> {
    return this.http.get(this.endpoints.getAccounts(), httpOptions)
      .pipe(
        map((response: Array<any>) =>
        response.map((account: any) => {
          return this.accountAdapter.adapt(account);
        })
        )
      );
  }

  getAccountByEmail(email: string): Observable<AccountModel> {
    return this.http.get(this.endpoints.getAccountByEmail(email), httpOptions).pipe(
      map(account => this.accountAdapter.adapt(account))
    );
  }

  getAccountByCnp(cnp: string): Observable<AccountModel> {
    return this.http.get(this.endpoints.getAccountByCnp(cnp), httpOptions).pipe(
      map(account => this.accountAdapter.adapt(account))
    );
  }

  getActiveFees(): Observable<Array<ActiveFeeModel>> {
    return this.http.get(this.endpoints.getActiveFees(), httpOptions)
      .pipe(
        map((response: Array<any>) =>
          response.map((account: any) => {
            return this.activeFeeAdapter.adapt(account);
          })
        )
      );
  }
}
