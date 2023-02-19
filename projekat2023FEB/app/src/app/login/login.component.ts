import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) {
  }
  username: String = "";
  password: String = "";
  errorMessage: String = "";

  ngOnInit(): void {

  }

  //  LOG IN  ////////////////////////////////////////////////////////////////////////////////////
  logIn(): void {

    let error: Boolean = this.LogInChecks();

    if (!error) {
      this.errorMessage = "";
      this.loginService.login(this.username, this.password).subscribe((user) => {
        console.log(user)
        if (user['resp'] && user['resp'] == "expired") {
          this.errorMessage = "This password has expired."
          return
        }
        else
          if (user['user']) {
            if ((user['user']).status == "pending") {
              this.errorMessage = "User with this username is still pending aproval.";
            }
            else if ((user['user']).status == "denied") {
              this.errorMessage = "User with this username has been DENIED.";
            }
            else {
              localStorage.setItem("currentUser", JSON.stringify(user['user']));
              this.router.navigate(["/"]);
            }
          }
          else {
            this.errorMessage = "User with this username and password doesn't exist."
          }

      })
    }

  }

  LogInChecks(): Boolean {
    if (this.username.length == 0) {
      this.errorMessage = "Error: Please enter a username to log in."
      return true;
    }
    if (this.password.length == 0) {
      this.errorMessage = "Error: Please enter a password to log in."
      return true;
    }
    return false;

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////




}
