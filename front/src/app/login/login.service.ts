import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

export type Status = {
  name: string;
  statusOk: boolean;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private statuses: Status[] = [
    {
      name: 'Ахилес',
      statusOk: true,
      error: ''
    },
    {
      name: '',
      statusOk: false,
      error: 'Произошла ошибка, попробуйте позже'
    }
  ]

  constructor() { }

  sendLogin(login: string): Observable<Status> {
    return login.length % 2 === 0 ? of(this.statuses[0]) : of(this.statuses[1]);
  }
}
