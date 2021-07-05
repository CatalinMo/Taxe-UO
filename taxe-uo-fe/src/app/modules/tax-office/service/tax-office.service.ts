import {Injectable} from "@angular/core";
import {AccountModel} from "../../../shared/models/account.model";
import {AccountRequest} from "../../../shared/models/request/account.request";

@Injectable()
export class TaxOfficeService {

  accountRequest: AccountRequest;
  account: AccountModel;
  accountId: number;
  areMultiple: boolean;
  ids: Array<number> = [];

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

  setAreMultipleAccounts(areMultiple: boolean) {
    this.areMultiple = areMultiple;
  }

  getAreMultipleAccounts(): boolean {
    return this.areMultiple;
  }

  setSelectedIds(ids: Array<number>) {
    this.ids = ids;
  }

  getSelectedIds(): Array<number> {
    return this.ids;
  }
}
