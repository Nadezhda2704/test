import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  readonly waitingTime = 60;

  disabledLoginBtn = false;
  showTimer = false;

  timer = this.waitingTime;

  loginForm = new FormGroup({
    login: new FormControl(''),
  });

  get login() {
    return this.loginForm.get('login');
  }

  constructor(private loginService: LoginService) {
  }

  send() {
    console.log('login', this.login?.value);

    this.deactivateForm();
    this.changeTimer();

    setTimeout( this.activateForm, this.waitingTime*1000 );
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
      if(seconds === 1) {
        clearInterval(timerId);
        this.showTimer = false;
      }
      this.timer = seconds;
      seconds--;
    }, 1000)
  }
}
