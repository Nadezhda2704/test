import {Component, OnDestroy} from '@angular/core';
import {LoginService, Status} from '../login.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ReplaySubject, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnDestroy {
  private destroy$ = new ReplaySubject(1);
  readonly waitingTime = 60;

  disabledLoginBtn = false;
  showTimer = false;
  showError = false;

  timer = this.waitingTime;
  status: Status | null = null;

  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
  });

  get login() {
    return this.loginForm.get('login');
  }

  constructor (private loginService: LoginService) {
  }

  send() {
    const login = this.login?.value;

    if (login && login.length > 0) {
      this.loginService.sendLogin(login)
        .pipe(
          takeUntil(this.destroy$),
          tap( (status: Status) => {
            this.status = status;
            if(!status.statusOk) {
              this.showError = true;
              setTimeout(() => { this.showError = false}, 5*1000);
            }
          })
        )
        .subscribe()

      this.deactivateForm();
      this.changeTimer();

      setTimeout( () => {this.activateForm()}, this.waitingTime*1000 );
    }
  }

  deactivateForm() {
    this.login?.disable();
    this.disabledLoginBtn = true;
  }

  activateForm() {
    this.login?.enable()
    this.disabledLoginBtn = false;
  }

  changeTimer() {
    let seconds = this.waitingTime;
    this.showTimer = true;

    const timerId = setInterval( ()=> {
      if (seconds === 1) {
        this.showTimer = false;
        clearInterval(timerId);
        this.timer = this.waitingTime;
      } else {
        seconds--;
        this.timer = seconds;
      }
    }, 1000)
  }

  ngOnDestroy() {
    this.destroy$.next('');
    this.destroy$.complete();
  }
}
