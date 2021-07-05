import {Injectable} from "@angular/core";
import {AccountRequest} from "../../../shared/models/request/account.request";
import {AccountModel} from "../../../shared/models/account.model";

@Injectable()
export class AdministratorService {

  accountRequest: AccountRequest;
  account: AccountModel;
  accountId: number;

  constructor() {
  }

  setAccountRequest(account: AccountRequest) {
    this.accountRequest = account;
  }

  getAccountRequest(): AccountRequest {
    return this.accountRequest;
  }

  setAccount(account: AccountModel) {
    this.account = account;
  }

  getAccount(): AccountModel {
    return this.account;
  }

  setAccountId(id: number) {
    this.accountId = id;
  }

  getAccountId(): number {
    return this.accountId;
  }
}
